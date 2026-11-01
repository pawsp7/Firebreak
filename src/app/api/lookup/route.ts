import { lookup } from "@/lib/lookup";
import type { Lang, Mode } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const LANGS: Lang[] = ["en", "fr", "cr", "pa", "tl", "ar"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const mode: Mode = url.searchParams.get("mode") === "demo" ? "demo" : "live";
  const langRaw = (url.searchParams.get("lang") ?? "en") as Lang;
  const lang = LANGS.includes(langRaw) ? langRaw : "en";
  const hour = Number(url.searchParams.get("hour") ?? "24");
  const result = await lookup(q, mode, lang, Number.isFinite(hour) ? hour : 24);
  return NextResponse.json(result);
}
