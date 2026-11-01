import { rescoreAtHour, buildSituation } from "@/lib/situation";
import type { Mode } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode: Mode = url.searchParams.get("mode") === "demo" ? "demo" : "live";
  const hour = Number(url.searchParams.get("hour") ?? "0");
  const situation = await buildSituation(mode);
  const risks = rescoreAtHour(
    situation,
    Number.isFinite(hour) ? hour : 0,
  );
  return NextResponse.json({ ...situation, risks });
}
