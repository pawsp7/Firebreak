/**
 * Cached live fallback. Used when FIRMS / CWFIS / Open-Meteo cannot be
 * reached so the demo never shows an empty map. Clearly labelled in the UI.
 *
 * The pixels are a quiet late-season pattern in northern Alberta — not a
 * real-time feed.
 */

import type { Hotspot, WeatherHour } from "@/lib/types";

export const fallbackHotspots: Hotspot[] = [
  { lat: 58.62, lon: -117.21, frp: 22, brightness: 335, confidence: "nominal", satellite: "cached fallback", acquired: "cached" },
  { lat: 58.58, lon: -117.14, frp: 18, brightness: 332, confidence: "nominal", satellite: "cached fallback", acquired: "cached" },
  { lat: 56.91, lon: -111.55, frp: 11, brightness: 328, confidence: "low", satellite: "cached fallback", acquired: "cached" },
  { lat: 55.41, lon: -114.9, frp: 9, brightness: 326, confidence: "nominal", satellite: "cached fallback", acquired: "cached" },
  { lat: 54.21, lon: -115.82, frp: 7, brightness: 324, confidence: "low", satellite: "cached fallback", acquired: "cached" },
];

export function fallbackWeather(): WeatherHour[] {
  const start = Date.now();
  const out: WeatherHour[] = [];
  for (let h = 0; h <= 24; h++) {
    const tod = new Date(start + h * 3600_000).getUTCHours();
    const isDay = tod >= 14 && tod <= 2; // rough UTC for MDT day
    out.push({
      time: new Date(start + h * 3600_000).toISOString(),
      windKmh: isDay ? 18 : 10,
      windFromDeg: 240,
      rh: isDay ? 38 : 55,
      tempC: isDay ? 16 : 8,
    });
  }
  return out;
}
