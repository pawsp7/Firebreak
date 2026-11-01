import { describe, expect, it } from "vitest";
import {
  bearingDeg,
  destination,
  haversineKm,
  pointInPolygon,
  wrapDeg,
} from "./geo";
import { downwindDeg } from "./spread";

describe("geo helpers", () => {
  it("measures Jasper to Hinton as about 70 km", () => {
    const km = haversineKm(
      { lat: 52.8736, lon: -118.0814 },
      { lat: 53.4, lon: -117.586 },
    );
    expect(km).toBeGreaterThan(60);
    expect(km).toBeLessThan(85);
  });

  it("destination + bearing round-trips a short walk", () => {
    const start = { lat: 52.87, lon: -118.08 };
    const end = destination(start, 15, 10);
    expect(haversineKm(start, end)).toBeCloseTo(10, 1);
    expect(bearingDeg(start, end)).toBeGreaterThan(10);
    expect(bearingDeg(start, end)).toBeLessThan(20);
  });

  it("point-in-polygon knows the origin of a tiny box", () => {
    const poly = {
      type: "Polygon" as const,
      coordinates: [[
        [-118.1, 52.86],
        [-118.06, 52.86],
        [-118.06, 52.89],
        [-118.1, 52.89],
        [-118.1, 52.86],
      ]],
    };
    expect(pointInPolygon({ lat: 52.8736, lon: -118.0814 }, poly)).toBe(true);
    expect(pointInPolygon({ lat: 51.04, lon: -114.07 }, poly)).toBe(false);
  });

  it("downwind is 180° from meteorological FROM", () => {
    expect(wrapDeg(downwindDeg(200))).toBe(20);
  });
});
