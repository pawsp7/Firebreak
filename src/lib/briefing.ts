import { region } from "@/config/region";
import { interpolate, t } from "@/i18n/messages";
import type { Briefing, Community, CommunityRisk, Lang, WeatherHour } from "./types";
import { wrapDeg } from "./geo";

function compass(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(wrapDeg(deg) / 45) % 8];
}

export function buildBriefing(
  lang: Lang,
  community: Community | null,
  risk: CommunityRisk | null,
  weather: WeatherHour | undefined,
  fireCount: number,
): Briefing {
  const copy = t(lang);
  const level = risk?.level ?? "safe";
  const wind = Math.round(weather?.windKmh ?? 0);
  const rh = Math.round(weather?.rh ?? 0);
  const dir = weather ? compass(weather.windFromDeg) : "—";
  const km =
    risk && risk.forecastKm < 900
      ? risk.forecastKm < 10
        ? risk.forecastKm.toFixed(1)
        : String(Math.round(risk.forecastKm))
      : "—";

  const happening = interpolate(copy.happeningByLevel[level], {
    fires: fireCount,
    km,
    wind,
    dir,
    rh,
    place: community?.name ?? "",
  });

  return {
    happening,
    doNow: copy.doNowByLevel[level],
    pack: copy.packList,
    officialName: region.emergencyAlert.name,
    officialUrl: region.emergencyAlert.url,
  };
}
