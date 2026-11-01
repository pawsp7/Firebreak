/**
 * Escape routes via public OSRM, with a fire-avoidance score.
 *
 * OSRM cannot natively "exclude this polygon", so we:
 *   1. ask for the driving route (and alternatives) to 2–3 destinations
 *   2. walk the geometry every ~2 km
 *   3. mark the route leave/prepare/watch/safe from min distance to the
 *      predicted fire polygons at the selected hour
 *   4. if the best route threads the fire, try a via-point offset 18 km
 *      perpendicular to the fire–town bearing
 *
 * Demo mode uses the hand-traced Hwy 16 / 93 corridors from the Jasper tape
 * so the 2-minute video never depends on the public OSRM sandbox.
 */

import { region } from "@/config/region";
import { jasperCachedRoutes } from "@/data/demo-jasper";
import { receptionCentres } from "@/data/reception";
import type {
  Community,
  EscapeRoute,
  FireCluster,
  GeoJsonPolygon,
  Mode,
  RiskLevel,
} from "./types";
import {
  bearingDeg,
  destination,
  haversineKm,
  lineLengthKm,
  minDistanceToPolygons,
  pointInPolygon,
  subsampleLine,
} from "./geo";
import { frameAt } from "./spread";
import { fetchWithTimeout } from "./fetchers";
import { levelFromScore } from "./risk";

function polygonsAt(clusters: FireCluster[], hour: number): GeoJsonPolygon[] {
  return clusters.map((c) => frameAt(c, hour).geometry);
}

function scoreLine(coordinates: number[][], polygons: GeoJsonPolygon[]): {
  level: RiskLevel;
  why: string;
  minKm: number;
} {
  if (!coordinates.length) {
    return { level: "watch", why: "No geometry.", minKm: 999 };
  }
  const samples = subsampleLine(coordinates, 2.2);
  let minKm = Infinity;
  let inside = false;
  for (const p of samples) {
    for (const g of polygons) {
      if (pointInPolygon(p, g)) inside = true;
    }
    minKm = Math.min(minKm, minDistanceToPolygons(p, polygons));
  }
  if (inside || minKm < 1) {
    return {
      level: "leave",
      why: "This road runs through or along the projected fire line.",
      minKm: 0,
    };
  }
  if (minKm < 8) {
    return {
      level: "prepare",
      why: `Comes within ${minKm.toFixed(1)} km of the projected fire line.`,
      minKm,
    };
  }
  if (minKm < 25) {
    return {
      level: "watch",
      why: `Stays about ${Math.round(minKm)} km from the projected fire line.`,
      minKm,
    };
  }
  return {
    level: "safe",
    why: `Stays ${Math.round(minKm)} km from the projected fire line.`,
    minKm,
  };
}

async function osrmRoute(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  via?: { lat: number; lon: number },
): Promise<number[][] | null> {
  const parts = [from, via, to]
    .filter(Boolean)
    .map((p) => `${p!.lon},${p!.lat}`)
    .join(";");
  const url =
    `${region.routing.osrm}/route/v1/driving/${parts}` +
    `?overview=full&geometries=geojson&alternatives=true`;
  try {
    const res = await fetchWithTimeout(url, 7000);
    if (!res.ok) return null;
    const json = (await res.json()) as {
      routes?: Array<{ geometry?: { coordinates?: number[][] } }>;
    };
    const coords = json.routes?.[0]?.geometry?.coordinates;
    return coords && coords.length > 1 ? coords : null;
  } catch {
    return null;
  }
}

function cachedFor(community: Community): EscapeRoute[] {
  if (community.id !== "jasper") return [];
  const mk = (
    raw: (typeof jasperCachedRoutes)[keyof typeof jasperCachedRoutes],
    risk: RiskLevel,
    why: string,
  ): EscapeRoute => {
    const distanceKm = lineLengthKm(raw.coordinates);
    return {
      id: raw.id,
      label: raw.label,
      destination: raw.destination,
      distanceKm: Math.round(distanceKm),
      etaMinutes: Math.round((distanceKm / 75) * 60),
      risk,
      riskWhy: why,
      coordinates: raw.coordinates,
    };
  };
  return [
    mk(
      jasperCachedRoutes.eastHinton,
      "watch",
      "Highway 16 east was the primary 2024 evacuation corridor toward Hinton.",
    ),
    mk(
      jasperCachedRoutes.westValemount,
      "prepare",
      "Highway 16 west is the backup when the eastbound valley is smoked in.",
    ),
    mk(
      jasperCachedRoutes.southIcefields,
      "leave",
      "Highway 93 south runs into the south ignition — do not use in this replay.",
    ),
  ];
}

export async function escapeRoutes(
  community: Community,
  clusters: FireCluster[],
  hour: number,
  mode: Mode,
): Promise<EscapeRoute[]> {
  const polys = polygonsAt(clusters, hour);
  if (mode === "demo") {
    return cachedFor(community).map((r) => {
      const scored = scoreLine(r.coordinates, polys);
      return { ...r, risk: scored.level, riskWhy: scored.why };
    });
  }

  const destinations = receptionCentres
    .map((r) => ({
      r,
      km: haversineKm(community, { lat: r.lat, lon: r.lon }),
    }))
    .filter((d) => d.km > 8 && d.km < 420)
    .sort((a, b) => a.km - b.km)
    .slice(0, 4);

  const routes: EscapeRoute[] = [];
  for (const d of destinations) {
    let coords = await osrmRoute(community, { lat: d.r.lat, lon: d.r.lon });
    let scored = coords ? scoreLine(coords, polys) : null;
    if (coords && scored && (scored.level === "leave" || scored.minKm < 4) && clusters[0]) {
      const fire = clusters[0];
      const brg = bearingDeg({ lat: fire.lat, lon: fire.lon }, community);
      const via = destination(community, brg + 90, 18);
      const detour = await osrmRoute(community, { lat: d.r.lat, lon: d.r.lon }, via);
      if (detour) {
        const detourScore = scoreLine(detour, polys);
        if (detourScore.minKm > scored.minKm) {
          coords = detour;
          scored = detourScore;
        }
      }
    }
    if (!coords || !scored) continue;
    const distanceKm = lineLengthKm(coords);
    routes.push({
      id: d.r.id,
      label: `Toward ${d.r.name}`,
      destination: d.r.name,
      distanceKm: Math.round(distanceKm),
      etaMinutes: Math.round((distanceKm / 80) * 60),
      risk: scored.level,
      riskWhy: scored.why,
      coordinates: coords,
      viaReceptionId: d.r.id,
    });
    if (routes.length >= 3) break;
  }

  if (!routes.length) {
    // Last-resort straight lines so the panel is never empty.
    for (const d of destinations.slice(0, 3)) {
      const coordinates = [
        [community.lon, community.lat],
        [d.r.lon, d.r.lat],
      ];
      const scored = scoreLine(coordinates, polys);
      const distanceKm = d.km;
      routes.push({
        id: `straight-${d.r.id}`,
        label: `Toward ${d.r.name} (uncached)`,
        destination: d.r.name,
        distanceKm: Math.round(distanceKm),
        etaMinutes: Math.round((distanceKm / 70) * 60),
        risk: scored.level,
        riskWhy: `${scored.why} OSRM was unreachable; line is a straight-line fallback.`,
        coordinates,
        viaReceptionId: d.r.id,
      });
    }
  }

  const rank: Record<RiskLevel, number> = { safe: 0, watch: 1, prepare: 2, leave: 3 };
  return routes.sort((a, b) => rank[a.risk] - rank[b.risk] || a.etaMinutes - b.etaMinutes);
}

export { levelFromScore };
