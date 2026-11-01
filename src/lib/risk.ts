/**
 * Community risk score, 0–100, with a "why" breakdown.
 *
 * The score is a sum of five capped factors. Nothing is hidden in a neural
 * net: if Jasper is 86, you can read that 32 of those points are "the 24 h
 * cone reaches town", 18 are "the wind is aimed at you", and so on.
 *
 * Equity note: being rural or Indigenous does **not** raise the fire score.
 * Isolation shows up as the evacuation factor (road access) and in the
 * briefing (language, reception centres). Mixing those into the 0–100 as
 * "more dangerous" would confuse a physical forecast with a social one.
 *
 *     proximityNow       0–32   distance to current fire / hotspots
 *     proximityForecast  0–28   distance to the 24 h (or current-hour) cone
 *     windAlignment      0–18   is the head fire pointed at the community?
 *     dryness            0–12   RH + temperature at this hour
 *     evacuation         0–10   road-access / isolation
 */

import type {
  Community,
  CommunityRisk,
  FireCluster,
  RiskFactor,
  RiskLevel,
  WeatherHour,
} from "./types";
import {
  bearingDeg,
  bearingDelta,
  clamp,
  haversineKm,
  minDistanceToPolygons,
  pointInPolygon,
} from "./geo";
import { downwindDeg, frameAt } from "./spread";

export const RISK_WEIGHTS = {
  proximityNow: 32,
  proximityForecast: 28,
  windAlignment: 18,
  dryness: 12,
  evacuation: 10,
} as const;

export function levelFromScore(score: number): RiskLevel {
  if (score >= 75) return "leave";
  if (score >= 50) return "prepare";
  if (score >= 25) return "watch";
  return "safe";
}

function proximityPoints(km: number, maxPoints: number, inner = 4, outer = 80): number {
  if (!Number.isFinite(km)) return 0;
  if (km <= 0) return maxPoints;
  if (km >= outer) return 0;
  if (km <= inner) {
    return maxPoints * (0.85 + 0.15 * (1 - km / inner));
  }
  const t = (km - inner) / (outer - inner);
  return maxPoints * (1 - t) * 0.85;
}

function drynessPoints(weather: WeatherHour): number {
  const dry = clamp((45 - weather.rh) / 45, 0, 1);
  const hot = clamp((weather.tempC - 12) / 22, 0, 1);
  return RISK_WEIGHTS.dryness * (0.7 * dry + 0.3 * hot);
}

function windAlignmentPoints(
  community: { lat: number; lon: number },
  clusters: FireCluster[],
  weather: WeatherHour,
  nearestKm: number,
): { points: number; downwind: boolean } {
  if (!clusters.length || nearestKm > 90) return { points: 0, downwind: false };
  const headTo = downwindDeg(weather.windFromDeg);
  let best = 0;
  let downwind = false;
  for (const c of clusters) {
    const toward = bearingDeg({ lat: c.lat, lon: c.lon }, community);
    const delta = Math.abs(bearingDelta(toward, headTo));
    // 0° = fire is headed straight at the community
    const align = clamp(1 - delta / 90, 0, 1);
    const dist = haversineKm({ lat: c.lat, lon: c.lon }, community);
    const close = clamp(1 - dist / 90, 0, 1);
    const pts = align * close;
    if (pts > best) {
      best = pts;
      downwind = delta < 40;
    }
  }
  return { points: RISK_WEIGHTS.windAlignment * best, downwind };
}

export function scoreCommunity(
  community: Community,
  clusters: FireCluster[],
  weather: WeatherHour,
  hour: number,
): CommunityRisk {
  const nowPolys = clusters
    .map((c) => frameAt(c, 0).geometry)
    .filter(Boolean);
  const forecastPolys = clusters
    .map((c) => frameAt(c, hour).geometry)
    .filter(Boolean);
  const here = { lat: community.lat, lon: community.lon };

  const insideNow = nowPolys.some((g) => pointInPolygon(here, g));
  const insideForecast = forecastPolys.some((g) => pointInPolygon(here, g));
  const nearestKm = insideNow
    ? 0
    : Math.min(
        minDistanceToPolygons(here, nowPolys),
        ...clusters.map((c) => haversineKm(here, { lat: c.lat, lon: c.lon })),
      );
  const forecastKm = insideForecast ? 0 : minDistanceToPolygons(here, forecastPolys);

  const proxNow = insideNow
    ? RISK_WEIGHTS.proximityNow
    : proximityPoints(nearestKm, RISK_WEIGHTS.proximityNow, 3, 70);
  const proxFc = insideForecast
    ? RISK_WEIGHTS.proximityForecast
    : proximityPoints(forecastKm, RISK_WEIGHTS.proximityForecast, 2, 55);

  const wind = windAlignmentPoints(here, clusters, weather, nearestKm);
  const dry = drynessPoints(weather);
  const evac = RISK_WEIGHTS.evacuation * ((5 - community.roadAccess) / 4);

  const factors: RiskFactor[] = [
    {
      key: "proximityNow",
      points: proxNow,
      max: RISK_WEIGHTS.proximityNow,
      why: insideNow
        ? "Inside the current fire perimeter / hotspot cluster."
        : Number.isFinite(nearestKm)
          ? `Nearest fire is ${nearestKm < 10 ? nearestKm.toFixed(1) : Math.round(nearestKm)} km away.`
          : "No active fire mapped in the region.",
    },
    {
      key: "proximityForecast",
      points: proxFc,
      max: RISK_WEIGHTS.proximityForecast,
      why: insideForecast
        ? "The projected spread cone reaches this community at this hour."
        : Number.isFinite(forecastKm)
          ? `Projected fire line is ${forecastKm < 10 ? forecastKm.toFixed(1) : Math.round(forecastKm)} km away at this hour.`
          : "No spread cone in range.",
    },
    {
      key: "windAlignment",
      points: wind.points,
      max: RISK_WEIGHTS.windAlignment,
      why: wind.downwind
        ? `Wind from ${Math.round(weather.windFromDeg)}° pushes the head fire toward town.`
        : `Wind from ${Math.round(weather.windFromDeg)}° is not aimed at this community.`,
    },
    {
      key: "dryness",
      points: dry,
      max: RISK_WEIGHTS.dryness,
      why: `Relative humidity ${Math.round(weather.rh)}% and ${Math.round(weather.tempC)}°C.`,
    },
    {
      key: "evacuation",
      points: evac,
      max: RISK_WEIGHTS.evacuation,
      why:
        community.roadAccess <= 2
          ? "Few roads out — a closure can trap residents."
          : community.roadAccess === 3
            ? "Limited highway options; one closure is a problem."
            : "Multiple paved routes out of town.",
    },
  ];

  const score = clamp(
    Math.round(factors.reduce((s, f) => s + f.points, 0)),
    0,
    100,
  );

  return {
    communityId: community.id,
    score,
    level: levelFromScore(score),
    factors: factors.map((f) => ({ ...f, points: Math.round(f.points * 10) / 10 })),
    nearestKm: Number.isFinite(nearestKm) ? nearestKm : 999,
    forecastKm: Number.isFinite(forecastKm) ? forecastKm : 999,
    downwind: wind.downwind,
  };
}

export function scoreAll(
  communities: Community[],
  clusters: FireCluster[],
  weather: WeatherHour,
  hour: number,
): CommunityRisk[] {
  return communities
    .map((c) => scoreCommunity(c, clusters, weather, hour))
    .sort((a, b) => b.score - a.score);
}
