import { describe, expect, it } from "vitest";
import {
  ellipseAxes,
  forecastFrames,
  humidityFactor,
  lengthToBreadth,
  rateOfSpreadKmh,
  windFactor,
} from "./spread";
import { pointInPolygon } from "./geo";

const extreme = { windKmh: 35, rh: 20, tempC: 30, fuel: "C-2" as const };
const night = { windKmh: 12, rh: 45, tempC: 14, fuel: "C-2" as const };

describe("rate of spread", () => {
  it("increases as wind increases", () => {
    const slow = rateOfSpreadKmh({ ...extreme, windKmh: 10 });
    const fast = rateOfSpreadKmh({ ...extreme, windKmh: 40 });
    expect(fast).toBeGreaterThan(slow);
  });

  it("drops when humidity rises", () => {
    const dry = rateOfSpreadKmh({ ...extreme, rh: 18 });
    const damp = rateOfSpreadKmh({ ...extreme, rh: 70 });
    expect(dry).toBeGreaterThan(damp);
  });

  it("lands near 1 km/h for an extreme C-2 day (Jasper calibration)", () => {
    const ros = rateOfSpreadKmh(extreme);
    expect(ros).toBeGreaterThan(0.65);
    expect(ros).toBeLessThan(1.5);
  });

  it("overnight lull is well under the day run", () => {
    expect(rateOfSpreadKmh(night)).toBeLessThan(0.4);
    expect(rateOfSpreadKmh(night)).toBeLessThan(rateOfSpreadKmh(extreme) * 0.45);
  });

  it("wind and humidity factors are 1.0 at the documented base", () => {
    expect(windFactor(10)).toBeCloseTo(1, 5);
    expect(humidityFactor(40)).toBeCloseTo(1, 5);
  });
});

describe("ellipse geometry", () => {
  it("head is the long axis; back is the short one", () => {
    const lb = lengthToBreadth(20);
    const axes = ellipseAxes(20, lb);
    expect(axes.headKm).toBeGreaterThan(axes.flankKm);
    expect(axes.flankKm).toBeGreaterThanOrEqual(axes.backKm);
    expect(axes.headKm).toBeGreaterThan(axes.backKm);
  });

  it("stronger wind makes a skinnier ellipse (higher LB)", () => {
    expect(lengthToBreadth(40)).toBeGreaterThan(lengthToBreadth(10));
  });

  it("the 24 h cone contains the 6 h cone around the origin", () => {
    const series = Array.from({ length: 25 }, (_, h) => ({
      time: `2024-07-22T${String((18 + h) % 24).padStart(2, "0")}:00:00Z`,
      windKmh: 30,
      windFromDeg: 200,
      rh: 22,
      tempC: 28,
    }));
    const frames = forecastFrames({ lat: 52.7, lon: -117.85 }, series, "C-2", 24, 0.5);
    const hour6 = frames[6];
    const hour24 = frames[24];
    expect(hour24.headKm).toBeGreaterThan(hour6.headKm);
    const originInside = pointInPolygon(
      { lat: 52.7, lon: -117.85 },
      hour24.geometry,
    );
    expect(originInside).toBe(true);
  });
});
