import { describe, expect, it } from "vitest";
import { lookup } from "./lookup";

describe("Am I safe lookup", () => {
  it("resolves Jasper by name in demo mode", async () => {
    const hit = await lookup("Jasper", "demo", "en", 20);
    expect(hit.match).toBe("community");
    expect(hit.community?.id).toBe("jasper");
    expect(hit.risk?.score).toBeGreaterThan(50);
    expect(hit.briefing?.happening.length).toBeGreaterThan(10);
  });

  it("resolves Jasper's FSA T0E 1E0", async () => {
    const hit = await lookup("T0E 1E0", "demo", "en", 20);
    expect(hit.match).toBe("postal");
    expect(hit.community?.id).toBe("jasper");
  });

  it("returns none for an empty query", async () => {
    const hit = await lookup("   ", "demo", "en", 0);
    expect(hit.match).toBe("none");
    expect(hit.community).toBeNull();
  });

  it("builds a French briefing for Fox Lake", async () => {
    const hit = await lookup("Fox Lake", "demo", "fr", 12);
    expect(hit.community?.id).toBe("fox-lake");
    expect(hit.briefing?.doNow).toMatch(/Aucune|alerte|sacs|Surveillez/i);
  });
});
