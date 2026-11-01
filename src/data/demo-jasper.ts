/**
 * Recorded Jasper Wildfire Complex, 22–24 July 2024.
 *
 * Sources for the *facts* (not the pixels):
 *   Parks Canada, "Jasper Wildfire 2024"
 *     https://parks.canada.ca/pn-np/ab/jasper/visit/feu-alert-fire/feudeforet-jasper-wildfire
 *   Parks Canada, 2024 Annual Report / Recovery Framework
 *     lightning starts evening of 22 July; >20,000 evacuated; fire reached
 *     town 24 July; 358 of 1,113 structures destroyed; contained 32,700 ha.
 *
 * The hotspot pixels and hourly weather below are a *reconstructed demo
 * tape*, not the original VIIRS granules. Wind is SSW (200°) to stand in
 * for Athabasca-valley channelling, which a 10 m open-wind grid would miss.
 * Diurnal RH recovery is baked in so the cone pauses at night — the same
 * behaviour the live model will show with Open-Meteo.
 *
 * Timeline origin: 2024-07-22 18:00 America/Edmonton (first reports).
 */

import type { FirePerimeter, Hotspot, WeatherHour } from "@/lib/types";
import { destination } from "@/lib/geo";

export const JASPER_DEMO = {
  id: "jasper-2024",
  title: "Jasper Wildfire Complex, 22–24 July 2024",
  startIso: "2024-07-22T18:00:00-06:00",
  hours: 48,
  center: { lat: 52.8736, lon: -118.0814 },
  southIgnition: { lat: 52.695, lon: -117.845 },
  northIgnition: { lat: 52.915, lon: -118.035 },
};

function isoAtHour(hour: number): string {
  const start = Date.parse(JASPER_DEMO.startIso);
  return new Date(start + hour * 3600_000).toISOString();
}

function edmontonHour(hour: number): number {
  // 18:00 MDT at hour 0
  return (18 + hour) % 24;
}

/**
 * Diurnal weather that matches contemporary reporting: daytime 30–45 km/h
 * SSW winds, RH in the teens, overnight lulls. A bump on 24 July afternoon
 * (hours 38–44) is when the fire reached the townsite.
 */
export function jasperWeather(): WeatherHour[] {
  const hours = JASPER_DEMO.hours;
  const out: WeatherHour[] = [];
  for (let h = 0; h <= hours; h++) {
    const tod = edmontonHour(h);
    const isDay = tod >= 8 && tod <= 21;
    const dayWave = Math.sin(((tod - 8) / 13) * Math.PI);
    const july24Push = h >= 38 && h <= 44 ? 8 : 0;
    const windKmh = isDay ? 22 + 16 * Math.max(0, dayWave) + july24Push : 9 + (tod === 22 || tod === 7 ? 4 : 0);
    const rh = isDay ? 22 - 7 * Math.max(0, dayWave) : 40 + (tod > 2 && tod < 7 ? 8 : 0);
    const tempC = isDay ? 24 + 8 * Math.max(0, dayWave) : 14 + (tod >= 21 ? 2 : 0);
    out.push({
      time: isoAtHour(h),
      windKmh: Math.round(windKmh * 10) / 10,
      // SSE so the head fire travels NNW up the Athabasca valley toward town.
      windFromDeg: 158 + 8 * Math.sin(h / 5),
      rh: Math.round(rh * 10) / 10,
      tempC: Math.round(tempC * 10) / 10,
    });
  }
  return out;
}

function ringAround(
  lat: number,
  lon: number,
  radiusKm: number,
  bearing: number,
  stretch: number,
): number[][] {
  const ring: number[][] = [];
  for (let i = 0; i <= 28; i++) {
    const ang = (i / 28) * 2 * Math.PI;
    const r = radiusKm * (1 + stretch * Math.cos(ang));
    const p = destination({ lat, lon }, bearing + (ang * 180) / Math.PI, r);
    ring.push([p.lon, p.lat]);
  }
  return ring;
}

export function jasperPerimeters(): FirePerimeter[] {
  return [
    {
      id: "south-seed",
      areaHa: 3200,
      coordinates: [ringAround(52.695, -117.845, 3.2, 15, 0.45)],
    },
    {
      id: "north-seed",
      areaHa: 180,
      coordinates: [ringAround(52.915, -118.035, 0.8, 40, 0.2)],
    },
  ];
}

export function jasperHotspots(): Hotspot[] {
  const pts: Hotspot[] = [];
  const south = JASPER_DEMO.southIgnition;
  const north = JASPER_DEMO.northIgnition;
  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    pts.push({
      lat: south.lat + t * 0.09 + (i % 3) * 0.01,
      lon: south.lon - t * 0.05 + ((i % 4) - 1.5) * 0.012,
      frp: 40 + i * 6,
      brightness: 340 + i,
      confidence: "high",
      satellite: "VIIRS (demo tape)",
      acquired: "2024-07-22",
    });
  }
  for (let i = 0; i < 6; i++) {
    pts.push({
      lat: north.lat + (i - 2) * 0.008,
      lon: north.lon + (i % 3) * 0.01,
      frp: 18 + i * 3,
      brightness: 330,
      confidence: "nominal",
      satellite: "VIIRS (demo tape)",
      acquired: "2024-07-22",
    });
  }
  return pts;
}

/** Hand-traced Hwy 16 / Hwy 93 corridors used when OSRM is unreachable. */
export const jasperCachedRoutes = {
  eastHinton: {
    id: "east-hinton",
    label: "Highway 16 east — Hinton",
    destination: "Hinton Recreation Centre",
    coordinates: [
      [-118.0814, 52.8736],
      [-117.98, 52.93],
      [-117.86, 53.02],
      [-117.74, 53.14],
      [-117.64, 53.28],
      [-117.586, 53.4],
    ],
  },
  westValemount: {
    id: "west-valemount",
    label: "Highway 16 west — Valemount, B.C.",
    destination: "Valemount Community Hall",
    coordinates: [
      [-118.0814, 52.8736],
      [-118.22, 52.876],
      [-118.45, 52.88],
      [-118.72, 52.9],
      [-119.0, 52.88],
      [-119.266, 52.831],
    ],
  },
  southIcefields: {
    id: "south-icefields",
    label: "Highway 93 south — Icefields Parkway",
    destination: "Saskatchewan Crossing",
    coordinates: [
      [-118.0814, 52.8736],
      [-118.05, 52.82],
      [-117.96, 52.75],
      [-117.87, 52.67],
      [-117.52, 52.4],
      [-117.23, 52.22],
    ],
  },
};
