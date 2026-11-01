/**
 * Tiny geography helpers.
 *
 * We do not pull Turf.js — the operations we need (haversine distance,
 * destination along a bearing, point-in-polygon, min distance to a ring)
 * are short, testable, and easy to explain in a demo.
 */

import type { BBox, GeoJsonPolygon, LonLat } from "./types";

const EARTH_KM = 6371;

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function wrapDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Shortest signed difference between two bearings, −180..180. */
export function bearingDelta(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}

export function haversineKm(a: LonLat, b: LonLat): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing from A to B, degrees clockwise from north. */
export function bearingDeg(a: LonLat, b: LonLat): number {
  const φ1 = toRad(a.lat);
  const φ2 = toRad(b.lat);
  const Δλ = toRad(b.lon - a.lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return wrapDeg(toDeg(Math.atan2(y, x)));
}

/** Walk `distanceKm` from a point along a bearing. */
export function destination(start: LonLat, bearing: number, distanceKm: number): LonLat {
  const δ = distanceKm / EARTH_KM;
  const θ = toRad(bearing);
  const φ1 = toRad(start.lat);
  const λ1 = toRad(start.lon);
  const sinφ2 =
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(Math.min(1, Math.max(-1, sinφ2)));
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2),
    );
  return { lat: toDeg(φ2), lon: ((toDeg(λ2) + 540) % 360) - 180 };
}

export function inBBox(point: LonLat, bbox: BBox, pad = 0): boolean {
  return (
    point.lon >= bbox.west - pad &&
    point.lon <= bbox.east + pad &&
    point.lat >= bbox.south - pad &&
    point.lat <= bbox.north + pad
  );
}

/** Ray-casting, even-odd fill. Ring is GeoJSON [lon, lat][]. */
export function pointInRing(point: LonLat, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lon < ((xj - xi) * (point.lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function pointInPolygon(point: LonLat, polygon: GeoJsonPolygon): boolean {
  const rings = polygon.coordinates;
  if (!rings.length) return false;
  if (!pointInRing(point, rings[0])) return false;
  for (let i = 1; i < rings.length; i++) {
    if (pointInRing(point, rings[i])) return false;
  }
  return true;
}

function distToSegmentKm(p: LonLat, a: number[], b: number[]): number {
  const A = { lon: a[0], lat: a[1] };
  const B = { lon: b[0], lat: b[1] };
  // Local equirectangular projection around P, good enough at Alberta scales.
  const cos = Math.cos(toRad(p.lat));
  const ax = (A.lon - p.lon) * cos;
  const ay = A.lat - p.lat;
  const bx = (B.lon - p.lon) * cos;
  const by = B.lat - p.lat;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, (-ax * dx - ay * dy) / len2));
  const x = ax + t * dx;
  const y = ay + t * dy;
  const deg = Math.hypot(x / cos, y);
  return deg * 111.32;
}

export function distanceToPolygonKm(point: LonLat, polygon: GeoJsonPolygon): number {
  if (pointInPolygon(point, polygon)) return 0;
  let min = Infinity;
  for (const ring of polygon.coordinates) {
    for (let i = 1; i < ring.length; i++) {
      min = Math.min(min, distToSegmentKm(point, ring[i - 1], ring[i]));
    }
  }
  return min;
}

export function minDistanceToPolygons(point: LonLat, polygons: GeoJsonPolygon[]): number {
  if (!polygons.length) return Infinity;
  let min = Infinity;
  for (const g of polygons) min = Math.min(min, distanceToPolygonKm(point, g));
  return min;
}

export function subsampleLine(coordinates: number[][], spacingKm: number): LonLat[] {
  if (coordinates.length === 0) return [];
  const out: LonLat[] = [{ lon: coordinates[0][0], lat: coordinates[0][1] }];
  let leftover = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const a = { lon: coordinates[i - 1][0], lat: coordinates[i - 1][1] };
    const b = { lon: coordinates[i][0], lat: coordinates[i][1] };
    const d = haversineKm(a, b);
    let travelled = spacingKm - leftover;
    while (travelled <= d) {
      const t = travelled / d;
      out.push({
        lon: a.lon + (b.lon - a.lon) * t,
        lat: a.lat + (b.lat - a.lat) * t,
      });
      travelled += spacingKm;
    }
    leftover = d - (travelled - spacingKm);
  }
  out.push({
    lon: coordinates[coordinates.length - 1][0],
    lat: coordinates[coordinates.length - 1][1],
  });
  return out;
}

export function lineLengthKm(coordinates: number[][]): number {
  let n = 0;
  for (let i = 1; i < coordinates.length; i++) {
    n += haversineKm(
      { lon: coordinates[i - 1][0], lat: coordinates[i - 1][1] },
      { lon: coordinates[i][0], lat: coordinates[i][1] },
    );
  }
  return n;
}

export function polygonCentroid(polygon: GeoJsonPolygon): LonLat {
  const ring = polygon.coordinates[0] ?? [];
  let x = 0;
  let y = 0;
  let n = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
    n++;
  }
  if (!n) return { lon: 0, lat: 0 };
  return { lon: x / n, lat: y / n };
}

export function approxAreaHa(polygon: GeoJsonPolygon): number {
  const ring = polygon.coordinates[0];
  if (!ring || ring.length < 4) return 0;
  const lat0 = ring[0][1];
  const cos = Math.cos(toRad(lat0));
  let sum = 0;
  for (let i = 1; i < ring.length; i++) {
    const x1 = ring[i - 1][0] * cos * 111.32;
    const y1 = ring[i - 1][1] * 111.32;
    const x2 = ring[i][0] * cos * 111.32;
    const y2 = ring[i][1] * 111.32;
    sum += x1 * y2 - x2 * y1;
  }
  const km2 = Math.abs(sum) / 2;
  return km2 * 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function round(n: number, digits = 1): number {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}
