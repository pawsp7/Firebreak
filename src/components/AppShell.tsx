"use client";

import { communities, communityById } from "@/data/communities";
import { receptionCentres } from "@/data/reception";
import { LANGS, t } from "@/i18n/messages";
import { buildBriefing } from "@/lib/briefing";
import { formatEta, formatKm, formatStamp } from "@/lib/format";
import { scoreCommunity } from "@/lib/risk";
import type {
  CommunityRisk,
  EscapeRoute,
  Lang,
  LookupResult,
  Mode,
  ReceptionCentre,
  Situation,
} from "@/lib/types";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BrandMark, Landing } from "./Landing";

const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => <div className="map-el" aria-hidden="true" />,
});

export function AppShell() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("live");
  const [showLanding, setShowLanding] = useState(true);
  const [situation, setSituation] = useState<Situation | null>(null);
  const [hour, setHour] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [routes, setRoutes] = useState<EscapeRoute[]>([]);
  const [reception, setReception] = useState<ReceptionCentre[]>([]);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [query, setQuery] = useState("");
  const [about, setAbout] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [ruralFirst, setRuralFirst] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const copy = t(lang);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang") as Lang | null;
    if (langParam && LANGS.some((l) => l.id === langParam)) setLang(langParam);
    if (params.get("mode") === "demo") {
      setMode("demo");
      setShowLanding(false);
    }
    if (params.get("view") === "map") setShowLanding(false);
    if (params.get("view") === "about") {
      setShowLanding(false);
      setAbout(true);
    }
    const hourParam = Number(params.get("hour"));
    if (Number.isFinite(hourParam) && hourParam >= 0) setHour(hourParam);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      setShowLanding(false);
      void runLookup(
        q,
        params.get("mode") === "demo" ? "demo" : "live",
        langParam ?? "en",
        Number.isFinite(hourParam) ? hourParam : params.get("mode") === "demo" ? 24 : 24,
      );
    }
    return () => mq.removeEventListener("change", onMq);
    // Deep-link parse runs once; runLookup is the latest closure on this first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "cr" ? "cr" : lang;
    document.documentElement.dataset.lang = lang;
    document.documentElement.dir = LANGS.find((l) => l.id === lang)?.dir ?? "ltr";
  }, [lang]);

  const loadSituation = useCallback(async (nextMode: Mode) => {
    setError(null);
    try {
      const res = await fetch(`/api/situation?mode=${nextMode}&hour=0`);
      if (!res.ok) throw new Error("situation failed");
      const json = (await res.json()) as Situation;
      setSituation(json);
      setHour((h) => (h > 0 ? h : nextMode === "demo" ? 24 : 0));
    } catch {
      setError("Could not load fire data.");
    }
  }, []);

  useEffect(() => {
    if (showLanding) return;
    void loadSituation(mode);
  }, [mode, showLanding, loadSituation]);

  useEffect(() => {
    if (!lookupResult) return;
    const id = window.setTimeout(() => setLookupResult(null), 8000);
    return () => window.clearTimeout(id);
  }, [lookupResult]);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const id = window.setInterval(() => {
      setHour((h) => {
        const max = situation?.timelineHours ?? 24;
        return h >= max ? 0 : h + 1;
      });
    }, 380);
    return () => window.clearInterval(id);
  }, [playing, reducedMotion, situation?.timelineHours]);

  const risks = useMemo(() => {
    if (!situation) return [];
    const wx = situation.weather[Math.min(hour, situation.weather.length - 1)];
    return communities.map((c) => scoreCommunity(c, situation.clusters, wx, hour));
  }, [situation, hour]);

  const riskMap = useMemo(() => new Map(risks.map((r) => [r.communityId, r])), [risks]);

  const ranked = useMemo(() => {
    const list = [...risks];
    if (ruralFirst) {
      list.sort((a, b) => {
        const ca = communityById.get(a.communityId);
        const cb = communityById.get(b.communityId);
        const ia = ca && (ca.indigenous || ca.rural) ? 1 : 0;
        const ib = cb && (cb.indigenous || cb.rural) ? 1 : 0;
        if (ib !== ia) return ib - ia;
        return b.score - a.score;
      });
    } else {
      list.sort((a, b) => b.score - a.score);
    }
    const top = list.slice(0, 24);
    if (selectedId) {
      const mine = risks.find((r) => r.communityId === selectedId);
      if (mine && !top.some((r) => r.communityId === selectedId)) {
        return [mine, ...top.slice(0, 23)];
      }
    }
    return top;
  }, [risks, ruralFirst, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setRoutes([]);
      return;
    }
    const ctrl = new AbortController();
    void fetch(`/api/routes?communityId=${selectedId}&mode=${mode}&hour=${hour}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((json: { routes?: EscapeRoute[]; reception?: ReceptionCentre[] }) => {
        setRoutes(json.routes ?? []);
        setReception(json.reception ?? []);
      })
      .catch(() => {
        /* keep last routes */
      });
    return () => ctrl.abort();
  }, [selectedId, mode, hour]);

  async function runLookup(q: string, nextMode: Mode, nextLang: Lang, atHour = hour) {
    const res = await fetch(
      `/api/lookup?q=${encodeURIComponent(q)}&mode=${nextMode}&lang=${nextLang}&hour=${atHour}`,
    );
    const json = (await res.json()) as LookupResult;
    setLookupResult(json);
    if (json.community) setSelectedId(json.community.id);
  }

  const enter = (nextMode: Mode, q?: string) => {
    setMode(nextMode);
    setShowLanding(false);
    if (nextMode === "demo") setHour(24);
    if (q) {
      setQuery(q);
      void runLookup(q, nextMode, lang, nextMode === "demo" ? 24 : hour);
    }
  };

  const selected = selectedId ? communityById.get(selectedId) : undefined;
  const selectedRisk = selectedId ? riskMap.get(selectedId) : undefined;
  const weather = situation?.weather[Math.min(hour, (situation?.weather.length ?? 1) - 1)];
  const briefing = selected
    ? buildBriefing(lang, selected, selectedRisk ?? null, weather, situation?.clusters.length ?? 0)
    : null;
  const fallback = situation?.sources.find((s) => s.id === "firms")?.fallback ?? false;

  if (showLanding) {
    return (
      <>
        <a className="skip" href="#landing-q">
          {copy.skip}
        </a>
        <Landing
          lang={lang}
          onLang={setLang}
          onLookup={(q) => enter("live", q)}
          onLive={() => enter("live")}
          onDemo={() => enter("demo", "Jasper")}
        />
      </>
    );
  }

  return (
    <div className="shell">
      <a className="skip" href="#map">
        {copy.skip}
      </a>
      <header className="hud">
        <button className="brand" type="button" onClick={() => setShowLanding(true)}>
          <BrandMark />
          Firebreak
        </button>
        <form
          className="hud-search"
          onSubmit={(e) => {
            e.preventDefault();
            void runLookup(query, mode, lang);
          }}
          role="search"
        >
          <label className="sr-only" htmlFor="q">
            {copy.amISafe}
          </label>
          <input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            autoComplete="off"
          />
          <button className="btn btn-ember" type="submit" style={{ minHeight: 44 }}>
            {copy.amISafe}
          </button>
        </form>
        <div className="seg" role="group" aria-label="Data mode">
          <button
            type="button"
            aria-pressed={mode === "live"}
            onClick={() => {
              setMode("live");
              setHour(0);
            }}
          >
            {copy.live}
          </button>
          <button
            type="button"
            aria-pressed={mode === "demo"}
            onClick={() => {
              setMode("demo");
              setHour(24);
            }}
          >
            {copy.demo}
          </button>
        </div>
        <select
          className="lang"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          aria-label="Language"
        >
          {LANGS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.native}
            </option>
          ))}
        </select>
        <button
          className="btn btn-ghost about-btn"
          type="button"
          onClick={() => setAbout(true)}
          style={{ minHeight: 44 }}
          aria-label={copy.about}
        >
          <span className="about-label">{copy.about}</span>
          <span className="about-icon" aria-hidden="true">
            ?
          </span>
        </button>
      </header>

      <div className="map-root" id="map">
        <button
          className="icon-btn mobile-toggle"
          type="button"
          onClick={() => setListOpen((v) => !v)}
          aria-label={copy.communities}
          aria-expanded={listOpen}
        >
          <span aria-hidden="true">☰</span>
        </button>
        {mode === "demo" ? <div className="banner">{copy.demoBanner}</div> : null}
        {fallback && mode === "live" ? <div className="banner">{copy.usingFallback}</div> : null}
        {error ? <div className="banner">{error}</div> : null}

        <MapCanvas
          situation={situation}
          hour={hour}
          risks={risks}
          selectedId={selectedId}
          routes={routes}
          reducedMotion={reducedMotion}
          onSelect={setSelectedId}
        />
        <div className="legend" aria-hidden="true">
          <span><i style={{ background: "#ff4d3a" }} />Hotspots</span>
          <span><i style={{ background: "#ff5a1f" }} />24h cone</span>
          <span><i style={{ background: "#5ee9b4" }} />Community</span>
          <span><i style={{ background: "#93c5fd" }} />Reception</span>
        </div>

        <aside className={`side side-left card ${listOpen ? "open" : ""}`} aria-label={copy.communities}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{copy.communities}</strong>
            <label className="small">
              <input
                type="checkbox"
                checked={ruralFirst}
                onChange={(e) => setRuralFirst(e.target.checked)}
              />{" "}
              {copy.ruralFirst}
            </label>
          </div>
          {ranked.map((r) => {
            const c = communityById.get(r.communityId);
            if (!c) return null;
            return (
              <button
                key={c.id}
                className="list-item"
                type="button"
                aria-current={c.id === selectedId}
                onClick={() => {
                  setSelectedId(c.id);
                  setListOpen(false);
                }}
              >
                <span className={`dot ${r.level}`} />
                <span>
                  {c.name}
                  {c.indigenous ? " · " : ""}
                  {c.indigenous ? <span className="muted small">Indigenous</span> : null}
                </span>
                <span className="score">{r.score}</span>
              </button>
            );
          })}
        </aside>

        {lookupResult && lookupResult.match !== "none" ? (
          <div className="answer card" role="status">
            <div className="kicker">{copy.amISafe}</div>
            <div>{lookupResult.label}</div>
            <p className="answer-score">{lookupResult.risk?.score ?? "—"}</p>
            <span className={`pill ${lookupResult.risk?.level ?? "safe"}`}>
              {copy.levels[lookupResult.risk?.level ?? "safe"]}
            </span>
            <p className="small" style={{ marginTop: "0.6rem" }}>
              {copy.safeAnswer[lookupResult.risk?.level ?? "safe"]}
            </p>
            <button className="btn btn-ghost" type="button" onClick={() => setLookupResult(null)} style={{ marginTop: 8, minHeight: 40 }}>
              {copy.close}
            </button>
          </div>
        ) : null}

        {selected && briefing && selectedRisk ? (
          <aside className="side side-right card" aria-label={copy.briefing}>
            <BriefingBody
              copy={copy}
              name={selected.name}
              risk={selectedRisk}
              briefing={briefing}
              routes={routes}
              reception={reception}
              languageNote={copy.languageNote}
            />
          </aside>
        ) : null}
      </div>

      <div>
        <div className="slider-wrap">
          <button
            className="icon-btn"
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
          >
            {playing ? copy.pause : copy.play}
          </button>
          <label className="sr-only" htmlFor="hour">
            {copy.hour}
          </label>
          <input
            id="hour"
            type="range"
            min={0}
            max={situation?.timelineHours ?? 24}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            aria-valuetext={`${copy.hour} +${hour}, ${situation ? formatStamp(situation.timelineStart, hour) : ""}`}
          />
          <div className="clock">
            +{hour}h
            <div className="muted small">
              {situation ? formatStamp(situation.timelineStart, hour) : "—"}
            </div>
          </div>
        </div>
        <p className="disclaimer">
          {copy.disclaimer}{" "}
          <a href="https://www.alberta.ca/alberta-emergency-alert">{copy.officialCta}</a>
          {weather ? (
            <>
              {" "}
              · {copy.wind} {Math.round(weather.windKmh)} km/h · {copy.humidity}{" "}
              {Math.round(weather.rh)}%
            </>
          ) : null}
        </p>
      </div>

      {about ? <AboutModal copy={copy} onClose={() => setAbout(false)} sources={situation?.sources ?? []} /> : null}
      <div className="grain" aria-hidden="true" />
    </div>
  );
}

function BriefingBody({
  copy,
  name,
  risk,
  briefing,
  routes,
  reception,
  languageNote,
}: {
  copy: ReturnType<typeof t>;
  name: string;
  risk: CommunityRisk;
  briefing: ReturnType<typeof buildBriefing>;
  routes: EscapeRoute[];
  reception: ReceptionCentre[];
  languageNote: string;
}) {
  return (
    <div>
      <div className="kicker">{copy.briefing}</div>
      <h2 style={{ fontFamily: "var(--display)", margin: "0.2rem 0 0.4rem", letterSpacing: "-0.03em" }}>
        {name}
      </h2>
      <div className="row">
        <span className={`pill ${risk.level}`}>{copy.levels[risk.level]}</span>
        <span className="score">{risk.score}/100</span>
        <span className="muted small">
          {formatKm(risk.nearestKm)} now · {formatKm(risk.forecastKm)} cone
        </span>
      </div>
      <h3 className="small" style={{ marginTop: "1rem" }}>{copy.happening}</h3>
      <p className="small">{briefing.happening}</p>
      <h3 className="small">{copy.doNow}</h3>
      <p className="small">{briefing.doNow}</p>
      {languageNote ? <p className="cite">{languageNote}</p> : null}
      <h3 className="small">{copy.why}</h3>
      {risk.factors.map((f) => (
        <div className="factor" key={f.key}>
          <span>{copy.factors[f.key] ?? f.key}</span>
          <span className="score">
            {Math.round(f.points)}/{f.max}
          </span>
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${Math.min(100, (f.points / f.max) * 100)}%` }} />
          </div>
          <span className="cite" style={{ gridColumn: "1 / -1" }}>{f.why}</span>
        </div>
      ))}
      <h3 className="small">{copy.pack}</h3>
      <ul className="small" style={{ paddingInlineStart: "1.1rem" }}>
        {briefing.pack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3 className="small">{copy.routes}</h3>
      {routes.length === 0 ? (
        <p className="muted small">{copy.loadRoads}</p>
      ) : (
        routes.map((r) => (
          <div className="route" key={r.id}>
            <h3>{r.label}</h3>
            <div className="row small">
              <span className={`pill ${r.risk}`}>{copy.levels[r.risk]}</span>
              <span>
                {copy.eta} {formatEta(r.etaMinutes)}
              </span>
              <span>{r.distanceKm} km</span>
            </div>
            <p className="cite">{r.riskWhy}</p>
          </div>
        ))
      )}
      <h3 className="small">{copy.reception}</h3>
      <ul className="small" style={{ paddingInlineStart: "1.1rem" }}>
        {(reception.length ? reception : receptionCentres.slice(0, 3)).map((r) => (
          <li key={r.id}>
            {r.name} — {r.notes}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "0.8rem" }}>
        <a className="btn btn-ember" href={briefing.officialUrl} style={{ display: "inline-flex" }}>
          {copy.officialCta}
        </a>
      </p>
    </div>
  );
}

function AboutModal({
  copy,
  onClose,
  sources,
}: {
  copy: ReturnType<typeof t>;
  onClose: () => void;
  sources: Situation["sources"];
}) {
  return (
    <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="about-title">
      <div className="modal">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 id="about-title">{copy.about}</h2>
          <button className="icon-btn" type="button" onClick={onClose}>
            {copy.close}
          </button>
        </div>
        <p className="small">
          Firebreak grows a wind-driven ellipse from each hotspot cluster so
          neighbours can see the next hours without a black box. The math is
          small enough to read aloud, and honest about what it is not: no DEM,
          no spotting, no suppression.
        </p>
        <pre>{`ROS = R0(fuel) × (U/10)^1.15 × ((100−RH)/60) × Ft
LB  = 1 + 8.729 × (1 − e^(−0.0302 U))^2.155
head = ROS × t     back = head / (2 LB − 1)`}</pre>
        <ol>
          <li>NASA FIRMS VIIRS hotspots (public Canada CSV, or MAP_KEY if set).</li>
          <li>CWFIS Fire M3 perimeters over WFS.</li>
          <li>Open-Meteo 10 m wind, RH, temperature.</li>
          <li>OSRM / OpenStreetMap driving routes, scored against the cone.</li>
        </ol>
        <h3 className="small">{copy.sources}</h3>
        <ul className="small">
          {sources.map((s) => (
            <li key={s.id}>
              {s.label}: {s.detail} {s.fallback ? "(fallback)" : ""}
            </li>
          ))}
        </ul>
        <p className="cite">
          Another province is a data swap: replace <code>src/config/region.ts</code> and
          the community list. The model stays.
        </p>
      </div>
    </div>
  );
}
