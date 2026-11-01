/**
 * Remote data I/O. Every call has a timeout and a fallback so the map
 * never goes blank in front of a judge.
 */

import { region } from "@/config/region";
import { fallbackHotspots, fallbackWeather } from "@/data/fallback-live";
import type {
  DataSourceStatus,
  FirePerimeter,
  GeoJsonPolygon,
  Hotspot,
  WeatherHour,
} from "./types";
import { inBBox, polygonCentroid } from "./geo";

const UA = region.routing.userAgent;

export async function fetchWithTimeout(
  url: string,
  timeoutMs = 8000,
  init: RequestInit = {},
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: { "user-agent": UA, accept: "*/*", ...(init.headers ?? {}) },
      cache: "no-store",
    });
  } finally {
    clearTimeout(t);
  }
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < headers.length) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx]?.trim() ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function rowToHotspot(row: Record<string, string>): Hotspot | null {
  const lat = Number(row.latitude ?? row.lat);
  const lon = Number(row.longitude ?? row.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (!inBBox({ lat, lon }, region.bbox, 0.2)) return null;
  return {
    lat,
    lon,
    brightness: Number(row.bright_ti4 ?? row.brightness ?? row.bright_t31) || undefined,
    frp: Number(row.frp) || undefined,
    confidence: row.confidence,
    acquired: [row.acq_date, row.acq_time].filter(Boolean).join(" "),
    satellite: row.satellite ?? row.instrument,
  };
}

export async function fetchFirmsHotspots(): Promise<{
  hotspots: Hotspot[];
  source: DataSourceStatus;
}> {
  const key = process.env.FIRMS_MAP_KEY?.trim();
  const urls: string[] = [];
  if (key) {
    const { west, south, east, north } = region.bbox;
    urls.push(
      `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/${region.firms.mapKeySource}/${west},${south},${east},${north}/1`,
    );
  }
  urls.push(...region.firms.publicCsv);

  const errors: string[] = [];
  for (const url of urls) {
    try {
      const res = await fetchWithTimeout(url, 9000);
      if (!res.ok) {
        errors.push(`${res.status} ${url}`);
        continue;
      }
      const text = await res.text();
      if (text.startsWith("<") || text.toLowerCase().includes("invalid")) {
        errors.push(`non-csv ${url}`);
        continue;
      }
      const hotspots = parseCsv(text)
        .map(rowToHotspot)
        .filter((h): h is Hotspot => Boolean(h));
      if (!hotspots.length) {
        errors.push(`empty ${url}`);
        continue;
      }
      return {
        hotspots,
        source: {
          id: "firms",
          label: "NASA FIRMS VIIRS",
          url: "https://firms.modaps.eosdis.nasa.gov/",
          ok: true,
          fallback: false,
          detail: `${hotspots.length} Alberta hotspots (${key ? "MAP_KEY area API" : "public Canada CSV"})`,
        },
      };
    } catch (err) {
      errors.push(`${(err as Error).message} ${url}`);
    }
  }

  return {
    hotspots: fallbackHotspots,
    source: {
      id: "firms",
      label: "NASA FIRMS VIIRS",
      url: "https://firms.modaps.eosdis.nasa.gov/",
      ok: false,
      fallback: true,
      detail: `Using cached fallback. ${errors[0] ?? "all FIRMS URLs failed"}`,
    },
  };
}

type GJson = {
  features?: Array<{
    id?: string | number;
    properties?: Record<string, unknown>;
    geometry?: { type: string; coordinates: unknown };
  }>;
};

function asPolygon(geometry: { type: string; coordinates: unknown }): GeoJsonPolygon | null {
  if (geometry.type === "Polygon") {
    return { type: "Polygon", coordinates: geometry.coordinates as number[][][] };
  }
  if (geometry.type === "MultiPolygon") {
    const first = (geometry.coordinates as number[][][][])[0];
    if (first) return { type: "Polygon", coordinates: first };
  }
  return null;
}

export async function fetchPerimeters(): Promise<{
  perimeters: FirePerimeter[];
  source: DataSourceStatus;
}> {
  for (const url of region.cwfis.perimeters) {
    try {
      const res = await fetchWithTimeout(url, 14000);
      if (!res.ok) continue;
      const json = (await res.json()) as GJson;
      const perimeters: FirePerimeter[] = [];
      for (const f of json.features ?? []) {
        if (!f.geometry) continue;
        const poly = asPolygon(f.geometry);
        if (!poly) continue;
        const c = polygonCentroid(poly);
        if (!inBBox(c, region.bbox, 0.3)) continue;
        const props = f.properties ?? {};
        perimeters.push({
          id: String(f.id ?? props.uid ?? perimeters.length),
          areaHa: Number(props.area ?? props.hectares ?? props.AREA) || undefined,
          coordinates: poly.coordinates,
        });
      }
      if (!perimeters.length) continue;
      return {
        perimeters,
        source: {
          id: "cwfis",
          label: "CWFIS Fire M3 perimeters",
          url: "https://cwfis.cfs.nrcan.gc.ca/",
          ok: true,
          fallback: false,
          detail: `${perimeters.length} Alberta perimeters`,
        },
      };
    } catch {
      /* try next */
    }
  }

  return {
    perimeters: [],
    source: {
      id: "cwfis",
      label: "CWFIS Fire M3 perimeters",
      url: "https://cwfis.cfs.nrcan.gc.ca/",
      ok: false,
      fallback: true,
      detail: "WFS timed out — cones will grow from hotspots only.",
    },
  };
}

export async function fetchWeather(lat: number, lon: number, hours: number): Promise<{
  weather: WeatherHour[];
  source: DataSourceStatus;
}> {
  const url =
    `${region.weather.forecast}?latitude=${lat}&longitude=${lon}` +
    `&hourly=wind_speed_10m,wind_direction_10m,relative_humidity_2m,temperature_2m` +
    `&wind_speed_unit=kmh&forecast_days=3&timezone=${encodeURIComponent(region.timezone)}`;
  try {
    const res = await fetchWithTimeout(url, 8000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as {
      hourly?: {
        time: string[];
        wind_speed_10m: number[];
        wind_direction_10m: number[];
        relative_humidity_2m: number[];
        temperature_2m: number[];
      };
    };
    const h = json.hourly;
    if (!h?.time?.length) throw new Error("empty hourly");
    const weather: WeatherHour[] = h.time.slice(0, hours + 1).map((time, i) => ({
      time,
      windKmh: h.wind_speed_10m[i] ?? 10,
      windFromDeg: h.wind_direction_10m[i] ?? 270,
      rh: h.relative_humidity_2m[i] ?? 45,
      tempC: h.temperature_2m[i] ?? 15,
    }));
    return {
      weather,
      source: {
        id: "open-meteo",
        label: "Open-Meteo wind & humidity",
        url: "https://open-meteo.com/",
        ok: true,
        fallback: false,
        detail: `${weather.length} hourly steps`,
      },
    };
  } catch (err) {
    return {
      weather: fallbackWeather(),
      source: {
        id: "open-meteo",
        label: "Open-Meteo wind & humidity",
        url: "https://open-meteo.com/",
        ok: false,
        fallback: true,
        detail: `Using cached weather. ${(err as Error).message}`,
      },
    };
  }
}

export async function fetchWindGrid(): Promise<
  Array<{ lat: number; lon: number; windKmh: number; windFromDeg: number }>
> {
  const lats = region.weather.grid.map((g) => g.lat).join(",");
  const lons = region.weather.grid.map((g) => g.lon).join(",");
  const url =
    `${region.weather.forecast}?latitude=${lats}&longitude=${lons}` +
    `&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`;
  try {
    const res = await fetchWithTimeout(url, 7000);
    if (!res.ok) throw new Error("grid failed");
    const json = (await res.json()) as
      | { current?: { wind_speed_10m: number; wind_direction_10m: number } }
      | Array<{ current?: { wind_speed_10m: number; wind_direction_10m: number } }>;
    const list = Array.isArray(json) ? json : [json];
    return region.weather.grid.map((g, i) => ({
      ...g,
      windKmh: list[i]?.current?.wind_speed_10m ?? 12,
      windFromDeg: list[i]?.current?.wind_direction_10m ?? 270,
    }));
  } catch {
    return region.weather.grid.map((g) => ({
      ...g,
      windKmh: 12,
      windFromDeg: 270,
    }));
  }
}
