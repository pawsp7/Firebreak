/**
 * One function builds the whole picture: fires + weather + cones + scores.
 * API routes and the lookup endpoint all call this so Live and Demo cannot
 * drift apart.
 */

import { region } from "@/config/region";
import { communities, fuelForPoint } from "@/data/communities";
import {
  JASPER_DEMO,
  jasperHotspots,
  jasperPerimeters,
  jasperWeather,
} from "@/data/demo-jasper";
import type {
  DataSourceStatus,
  FirePerimeter,
  GeoJsonPolygon,
  Mode,
  Situation,
} from "./types";
import { clusterHotspots } from "./spread";
import { scoreCommunity } from "./risk";
import { fetchFirmsHotspots, fetchPerimeters, fetchWeather, fetchWindGrid } from "./fetchers";

type CacheEntry = { at: number; value: Situation };
const cache: Partial<Record<Mode, CacheEntry>> = {};

function wrapPerimeters(perimeters: FirePerimeter[]): GeoJsonPolygon[] {
  return perimeters.map((p) => ({ type: "Polygon" as const, coordinates: p.coordinates }));
}

export async function buildSituation(mode: Mode): Promise<Situation> {
  const ttl = mode === "demo" ? 60 * 60 * 1000 : region.liveCacheMs;
  const hit = cache[mode];
  if (hit && Date.now() - hit.at < ttl) return hit.value;

  if (mode === "demo") {
    const weather = jasperWeather();
    const hotspots = jasperHotspots();
    const perimeters = jasperPerimeters();
    const clusters = clusterHotspots(
      hotspots,
      () => "C-2",
      weather,
      JASPER_DEMO.hours,
      wrapPerimeters(perimeters),
    );
    const hour0 = weather[0];
    const risks = communities.map((c) => scoreCommunity(c, clusters, hour0, 24));
    const sources: DataSourceStatus[] = [
      {
        id: "demo",
        label: "Jasper 2024 demo tape",
        url: "https://parks.canada.ca/pn-np/ab/jasper/visit/feu-alert-fire/feudeforet-jasper-wildfire",
        ok: true,
        fallback: false,
        detail: "Reconstructed ignitions, diurnal weather, Hwy 16 corridors",
      },
    ];
    const value: Situation = {
      mode,
      generatedAt: new Date().toISOString(),
      timelineStart: JASPER_DEMO.startIso,
      timelineHours: JASPER_DEMO.hours,
      hotspots,
      perimeters,
      clusters,
      weather,
      windGrid: [
        {
          lat: JASPER_DEMO.center.lat,
          lon: JASPER_DEMO.center.lon,
          windKmh: hour0.windKmh,
          windFromDeg: hour0.windFromDeg,
        },
        {
          lat: JASPER_DEMO.southIgnition.lat,
          lon: JASPER_DEMO.southIgnition.lon,
          windKmh: hour0.windKmh,
          windFromDeg: hour0.windFromDeg,
        },
      ],
      risks,
      sources,
      disclaimer:
        "Firebreak is not an official warning system. Always follow Alberta Emergency Alert.",
    };
    cache[mode] = { at: Date.now(), value };
    return value;
  }

  const [firms, perims, wx, grid] = await Promise.all([
    fetchFirmsHotspots(),
    fetchPerimeters(),
    fetchWeather(region.center.lat, region.center.lon, 24),
    fetchWindGrid(),
  ]);

  const clusters = clusterHotspots(
    firms.hotspots,
    fuelForPoint,
    wx.weather,
    24,
    wrapPerimeters(perims.perimeters),
  );
  const hour0 = wx.weather[0];
  const risks = communities.map((c) =>
    scoreCommunity(c, clusters, hour0 ?? wx.weather[0], 24),
  );

  const value: Situation = {
    mode,
    generatedAt: new Date().toISOString(),
    timelineStart: wx.weather[0]?.time ?? new Date().toISOString(),
    timelineHours: 24,
    hotspots: firms.hotspots,
    perimeters: perims.perimeters,
    clusters,
    weather: wx.weather,
    windGrid: grid,
    risks,
    sources: [firms.source, perims.source, wx.source],
    disclaimer:
      "Firebreak is not an official warning system. Always follow Alberta Emergency Alert.",
  };
  cache[mode] = { at: Date.now(), value };
  return value;
}

export function rescoreAtHour(situation: Situation, hour: number) {
  const weather = situation.weather[Math.min(hour, situation.weather.length - 1)];
  return communities.map((c) =>
    scoreCommunity(c, situation.clusters, weather, hour),
  );
}
