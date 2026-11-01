/**
 * Firebreak 24-hour spread model
 * --------------------------------
 * A simplified, *explainable* wind-driven ellipse. It is inspired by:
 *
 *   • Rothermel (1972) — rate of spread as a product of fuel, wind, moisture
 *   • Canadian FBP System length-to-breadth (Alexander, 1985 / Forestry Canada)
 *
 * It is NOT Prometheus, NOT the full FBP, and NOT an official forecast.
 * The point of shipping a small model instead of a black box is so a resident
 * (and a hackathon judge) can see *why* the cone points where it does.
 *
 * Rate of spread (km/h):
 *
 *     ROS = R0(fuel) × Fw(wind) × Fh(humidity) × Ft(temperature)
 *
 *     Fw = (wind_kmh / 10) ^ 1.15          // 1.0 at 10 km/h
 *     Fh = clamp((100 - RH) / 60, 0.35, 1.45)
 *     Ft = 0.85  (T < 15°C), 1.0 (15–28°C), 1.12 (T > 28°C)
 *
 * R0 is the base ROS at 10 km/h wind and 40% RH. It is deliberately modest so
 * that an extreme C-2 day run lands near ~1 km/h — the pace that took the
 * 2024 Jasper south fire ~22 km in ~42 hours once overnight lulls are included.
 *
 * Ellipse at hour t (FBP-style):
 *
 *     LB   = 1 + 8.729 × (1 − exp(−0.0302 U))^2.155     // length-to-breadth
 *     head = ROS × t
 *     back = head / (2 × LB − 1)
 *     flank = (head + back) / (2 × LB)
 *
 * Wind direction is meteorological (FROM). The head of the fire travels
 * *downwind* (FROM + 180°).
 *
 * Limits you should be able to recite:
 *   • No DEM, so slope and valley channelling are not modelled.
 *   • No spotting / ember transport (Jasper's fire jumped on embers).
 *   • No suppression, barriers, or water.
 *   • Fuel is a community/region proxy, not a 30 m FBP grid.
 *   • Overnight RH recovery *is* modelled if the weather series includes it.
 */

import type {
  FireCluster,
  FuelType,
  GeoJsonPolygon,
  Hotspot,
  SpreadFrame,
  WeatherHour,
} from "./types";
import {
  approxAreaHa,
  clamp,
  destination,
  haversineKm,
  polygonCentroid,
  wrapDeg,
} from "./geo";

export const FUEL_R0_KMH: Record<FuelType, number> = {
  "C-2": 0.18, // boreal spruce — Alberta's default north of the parkland
  "C-3": 0.14, // mature jack/lodgepole pine
  "C-7": 0.08, // ponderosa / dry-belt fir, slower surface
  "M-1": 0.12, // mixedwood (leafless)
  "D-1": 0.05, // leafless aspen, typically a damper
  "O-1": 0.28, // grass — fast when cured, south/prairie
};

export const FUEL_LABEL: Record<FuelType, string> = {
  "C-2": "Boreal spruce (C-2)",
  "C-3": "Mature pine (C-3)",
  "C-7": "Dry-belt fir / pine (C-7)",
  "M-1": "Mixedwood (M-1)",
  "D-1": "Leafless aspen (D-1)",
  "O-1": "Grass (O-1)",
};

export type SpreadInputs = {
  windKmh: number;
  rh: number;
  tempC: number;
  fuel: FuelType;
};

export function windFactor(windKmh: number): number {
  const u = Math.max(0, windKmh);
  return Math.pow(u / 10, 1.15);
}

export function humidityFactor(rh: number): number {
  return clamp((100 - rh) / 60, 0.35, 1.45);
}

export function temperatureFactor(tempC: number): number {
  if (tempC >= 28) return 1.12;
  if (tempC <= 15) return 0.85;
  return 1;
}

/** Rate of spread in km/h. Capped so a 24 h cone cannot outrun physics. */
export function rateOfSpreadKmh(input: SpreadInputs): number {
  const r0 = FUEL_R0_KMH[input.fuel];
  const ros =
    r0 *
    windFactor(input.windKmh) *
    humidityFactor(input.rh) *
    temperatureFactor(input.tempC);
  return clamp(ros, 0.02, 3.2);
}

/**
 * FBP length-to-breadth ratio (Alexander 1985 form used in Forestry Canada FBP).
 * U is 10 m wind speed in km/h.
 */
export function lengthToBreadth(windKmh: number): number {
  const u = Math.max(0, windKmh);
  const lb = 1 + 8.729 * Math.pow(1 - Math.exp(-0.0302 * u), 2.155);
  return clamp(lb, 1.05, 4.8);
}

export function ellipseAxes(headKm: number, lb: number): {
  headKm: number;
  backKm: number;
  flankKm: number;
} {
  const backKm = headKm / (2 * lb - 1);
  const flankKm = (headKm + backKm) / (2 * lb);
  return { headKm, backKm, flankKm };
}

/** Meteorological FROM → direction the head fire travels TO. */
export function downwindDeg(windFromDeg: number): number {
  return wrapDeg(windFromDeg + 180);
}

export function ellipsePolygon(
  origin: { lat: number; lon: number },
  headKm: number,
  backKm: number,
  flankKm: number,
  headBearing: number,
  steps = 36,
): GeoJsonPolygon {
  const major = (headKm + backKm) / 2;
  const minor = Math.max(flankKm, 0.05);
  const centerOffset = (headKm - backKm) / 2;
  const center = destination(origin, headBearing, centerOffset);
  const ring: number[][] = [];
  for (let i = 0; i <= steps; i++) {
    const ang = (i / steps) * 2 * Math.PI;
    const dx = major * Math.cos(ang);
    const dy = minor * Math.sin(ang);
    const dist = Math.hypot(dx, dy);
    const bearing = wrapDeg(headBearing + (Math.atan2(dy, dx) * 180) / Math.PI);
    const p = destination(center, bearing, dist);
    ring.push([p.lon, p.lat]);
  }
  return { type: "Polygon", coordinates: [ring] };
}

export function spreadAtHour(
  origin: { lat: number; lon: number },
  weather: WeatherHour,
  hour: number,
  fuel: FuelType,
  initialRadiusKm = 0.4,
): SpreadFrame {
  const ros = rateOfSpreadKmh({
    windKmh: weather.windKmh,
    rh: weather.rh,
    tempC: weather.tempC,
    fuel,
  });
  const lb = lengthToBreadth(weather.windKmh);
  const headKm = initialRadiusKm + ros * hour;
  const axes = ellipseAxes(headKm, lb);
  const geometry = ellipsePolygon(
    origin,
    axes.headKm,
    axes.backKm,
    axes.flankKm,
    downwindDeg(weather.windFromDeg),
  );
  return { hour, rosKmh: ros, ...axes, geometry };
}

/**
 * Integrate hour-by-hour using the actual weather series so overnight RH
 * recovery shows up as a pause in the cone. `weather[0]` is hour 0.
 */
export function forecastFrames(
  origin: { lat: number; lon: number },
  series: WeatherHour[],
  fuel: FuelType,
  hours: number,
  initialRadiusKm = 0.4,
): SpreadFrame[] {
  const frames: SpreadFrame[] = [];
  let headKm = initialRadiusKm;
  const first = series[0];
  if (!first) return frames;

  for (let h = 0; h <= hours; h++) {
    const weather = series[Math.min(h, series.length - 1)];
    const ros = rateOfSpreadKmh({
      windKmh: weather.windKmh,
      rh: weather.rh,
      tempC: weather.tempC,
      fuel,
    });
    if (h > 0) headKm += ros;
    const lb = lengthToBreadth(weather.windKmh);
    const axes = ellipseAxes(headKm, lb);
    frames.push({
      hour: h,
      rosKmh: ros,
      ...axes,
      geometry: ellipsePolygon(
        origin,
        axes.headKm,
        axes.backKm,
        axes.flankKm,
        downwindDeg(weather.windFromDeg),
      ),
    });
  }
  return frames;
}

const CELL = 0.08; // ~8 km grid used to cluster VIIRS pixels into fire events

export function clusterHotspots(
  hotspots: Hotspot[],
  fuelFor: (lat: number, lon: number) => FuelType,
  series: WeatherHour[],
  hours: number,
  seedPolygons: GeoJsonPolygon[] = [],
): FireCluster[] {
  const buckets = new Map<string, Hotspot[]>();
  for (const h of hotspots) {
    const key = `${Math.round(h.lon / CELL)}_${Math.round(h.lat / CELL)}`;
    const list = buckets.get(key);
    if (list) list.push(h);
    else buckets.set(key, [h]);
  }

  const clusters: FireCluster[] = [];
  let i = 0;
  for (const group of buckets.values()) {
    if (group.length === 0) continue;
    const lat = group.reduce((s, g) => s + g.lat, 0) / group.length;
    const lon = group.reduce((s, g) => s + g.lon, 0) / group.length;
    const seed =
      seedPolygons.find((p) => {
        const c = polygonCentroid(p);
        return haversineKm(c, { lat, lon }) < 18;
      }) ?? null;
    const origin = seed ? polygonCentroid(seed) : { lat, lon };
    const areaHa = seed ? approxAreaHa(seed) : group.length * 25;
    const initialRadiusKm = seed
      ? Math.max(0.6, Math.sqrt(areaHa / Math.PI) / 100)
      : Math.max(0.4, Math.min(3, Math.sqrt(group.length) * 0.35));
    const fuel = fuelFor(origin.lat, origin.lon);
    clusters.push({
      id: `c${i++}`,
      lat: origin.lat,
      lon: origin.lon,
      fuel,
      hotspotCount: group.length,
      areaHa,
      seed,
      frames: forecastFrames(origin, series, fuel, hours, initialRadiusKm),
    });
  }

  // Perimeters with no nearby hotspots still get a cone — they are real fires.
  for (const seed of seedPolygons) {
    const origin = polygonCentroid(seed);
    const already = clusters.some(
      (c) => haversineKm({ lat: c.lat, lon: c.lon }, origin) < 18,
    );
    if (already) continue;
    const areaHa = approxAreaHa(seed);
    const fuel = fuelFor(origin.lat, origin.lon);
    clusters.push({
      id: `c${i++}`,
      lat: origin.lat,
      lon: origin.lon,
      fuel,
      hotspotCount: 0,
      areaHa,
      seed,
      frames: forecastFrames(
        origin,
        series,
        fuel,
        hours,
        Math.max(0.8, Math.sqrt(areaHa / Math.PI) / 100),
      ),
    });
  }

  return clusters.sort((a, b) => b.hotspotCount - a.hotspotCount).slice(0, 24);
}

export function frameAt(cluster: FireCluster, hour: number): SpreadFrame {
  const h = clamp(Math.round(hour), 0, cluster.frames.length - 1);
  return cluster.frames[h] ?? cluster.frames[cluster.frames.length - 1];
}
