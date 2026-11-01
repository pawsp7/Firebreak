import { region } from "@/config/region";
import { communities, communityById, findCommunity } from "@/data/communities";
import { buildBriefing } from "./briefing";
import { fetchWithTimeout } from "./fetchers";
import { haversineKm } from "./geo";
import { scoreCommunity } from "./risk";
import { buildSituation } from "./situation";
import type { Lang, LookupResult, Mode } from "./types";

export async function lookup(query: string, mode: Mode, lang: Lang, hour = 24): Promise<LookupResult> {
  const q = query.trim();
  const empty: LookupResult = {
    query: q,
    match: "none",
    community: null,
    point: null,
    risk: null,
    briefing: null,
    label: q,
  };
  if (!q) return empty;

  const situation = await buildSituation(mode);
  const weather = situation.weather[Math.min(hour, situation.weather.length - 1)];
  const known = findCommunity(q);
  if (known) {
    const risk = scoreCommunity(known, situation.clusters, weather, hour);
    return {
      query: q,
      match: /^[Tt]\d[A-Za-z]/.test(q.replace(/\s+/g, "")) ? "postal" : "community",
      community: known,
      point: { lat: known.lat, lon: known.lon },
      risk,
      briefing: buildBriefing(lang, known, risk, weather, situation.clusters.length),
      label: known.name,
    };
  }

  try {
    const url =
      `${region.routing.nominatim}/search?format=json&limit=1&countrycodes=ca` +
      `&q=${encodeURIComponent(`${q}, Alberta, Canada`)}`;
    const res = await fetchWithTimeout(url, 5000, {
      headers: { "user-agent": region.routing.userAgent, accept: "application/json" },
    });
    if (!res.ok) return empty;
    const json = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
    const hit = json[0];
    if (!hit) return empty;
    const point = { lat: Number(hit.lat), lon: Number(hit.lon) };
    const nearest = communities
      .map((c) => ({ c, km: haversineKm(point, c) }))
      .sort((a, b) => a.km - b.km)[0];
    // Score the actual pin. Fall back to the nearest listed community for briefing copy.
    const community = nearest?.c ?? communityById.get("jasper") ?? null;
    const risk = community
      ? scoreCommunity(
          {
            ...community,
            lat: point.lat,
            lon: point.lon,
            id: community.id,
            name: community.name,
          },
          situation.clusters,
          weather,
          hour,
        )
      : null;
    return {
      query: q,
      match: "geocode",
      community,
      point,
      risk,
      briefing: buildBriefing(lang, community, risk, weather, situation.clusters.length),
      label: hit.display_name.split(",").slice(0, 2).join(","),
    };
  } catch {
    return empty;
  }
}
