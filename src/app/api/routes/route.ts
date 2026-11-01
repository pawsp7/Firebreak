import { communityById } from "@/data/communities";
import { receptionCentres } from "@/data/reception";
import { escapeRoutes } from "@/lib/routing";
import { buildSituation } from "@/lib/situation";
import type { Mode } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("communityId") ?? "";
  const mode: Mode = url.searchParams.get("mode") === "demo" ? "demo" : "live";
  const hour = Number(url.searchParams.get("hour") ?? "12");
  const community = communityById.get(id);
  if (!community) {
    return NextResponse.json({ error: "unknown community" }, { status: 404 });
  }
  const situation = await buildSituation(mode);
  const routes = await escapeRoutes(
    community,
    situation.clusters,
    Number.isFinite(hour) ? hour : 12,
    mode,
  );
  const nearby = receptionCentres
    .slice()
    .sort((a, b) => {
      const da = (a.lat - community.lat) ** 2 + (a.lon - community.lon) ** 2;
      const db = (b.lat - community.lat) ** 2 + (b.lon - community.lon) ** 2;
      return da - db;
    })
    .slice(0, 4);
  return NextResponse.json({ routes, reception: nearby });
}
