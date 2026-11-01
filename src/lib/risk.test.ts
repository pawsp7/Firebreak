import { describe, expect, it } from "vitest";
import { communities } from "@/data/communities";
import { scoreCommunity, RISK_WEIGHTS, levelFromScore } from "./risk";
import { forecastFrames } from "./spread";
import type { FireCluster, WeatherHour } from "./types";

const weather: WeatherHour = {
  time: "2024-07-22T18:00:00-06:00",
  windKmh: 35,
  windFromDeg: 158,
  rh: 18,
  tempC: 31,
};

function clusterAt(lat: number, lon: number): FireCluster {
  return {
    id: "t",
    lat,
    lon,
    fuel: "C-2",
    hotspotCount: 8,
    areaHa: 3000,
    seed: null,
    frames: forecastFrames({ lat, lon }, Array.from({ length: 25 }, () => weather), "C-2", 24, 1),
  };
}

const jasper = communities.find((c) => c.id === "jasper")!;
const calgary = communities.find((c) => c.id === "calgary")!;

describe("community risk score", () => {
  it("weights sum to 100", () => {
    const total = Object.values(RISK_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });

  it("clamps to 0–100 and maps levels", () => {
    expect(levelFromScore(0)).toBe("safe");
    expect(levelFromScore(24)).toBe("safe");
    expect(levelFromScore(25)).toBe("watch");
    expect(levelFromScore(50)).toBe("prepare");
    expect(levelFromScore(75)).toBe("leave");
    expect(levelFromScore(100)).toBe("leave");
  });

  it("factors add up to the published score", () => {
    const cluster = clusterAt(52.695, -117.845);
    const risk = scoreCommunity(jasper, [cluster], weather, 24);
    const sum = Math.round(risk.factors.reduce((s, f) => s + f.points, 0));
    expect(Math.abs(sum - risk.score)).toBeLessThanOrEqual(1);
    expect(risk.score).toBeGreaterThanOrEqual(0);
    expect(risk.score).toBeLessThanOrEqual(100);
  });

  it("Jasper is high risk when the south fire is 22 km upwind at hour 24", () => {
    const cluster = clusterAt(52.695, -117.845);
    const risk = scoreCommunity(jasper, [cluster], weather, 24);
    expect(risk.score).toBeGreaterThan(50);
    expect(risk.downwind).toBe(true);
    expect(["prepare", "leave"]).toContain(risk.level);
  });

  it("Calgary stays low when the only fire is the Jasper south ignition", () => {
    const cluster = clusterAt(52.695, -117.845);
    const risk = scoreCommunity(calgary, [cluster], weather, 24);
    expect(risk.score).toBeLessThan(25);
    expect(risk.level).toBe("safe");
  });

  it("isolation adds evacuation points without changing proximity", () => {
    const cluster = clusterAt(52.695, -117.845);
    const isolated = { ...jasper, roadAccess: 1 as const };
    const connected = { ...jasper, roadAccess: 5 as const };
    const a = scoreCommunity(isolated, [cluster], weather, 6);
    const b = scoreCommunity(connected, [cluster], weather, 6);
    const evacA = a.factors.find((f) => f.key === "evacuation")!.points;
    const evacB = b.factors.find((f) => f.key === "evacuation")!.points;
    expect(evacA).toBeGreaterThan(evacB);
  });
});
