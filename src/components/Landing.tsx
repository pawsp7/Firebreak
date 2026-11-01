"use client";

import { LANGS, t } from "@/i18n/messages";
import type { Lang } from "@/lib/types";
import { FormEvent } from "react";

type Props = {
  lang: Lang;
  onLang: (lang: Lang) => void;
  onLookup: (q: string) => void;
  onLive: () => void;
  onDemo: () => void;
};

export function Landing({ lang, onLang, onLookup, onLive, onDemo }: Props) {
  const copy = t(lang);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "");
    onLookup(q);
  };

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand">
          <BrandMark />
          Firebreak
        </div>
        <label>
          <span className="sr-only">{copy.amISafe}</span>
          <select
            className="lang"
            value={lang}
            onChange={(e) => onLang(e.target.value as Lang)}
            aria-label="Language"
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.native}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="hero">
        <p className="kicker">Alberta · 24-hour fire line</p>
        <h1>{copy.tagline}</h1>
        <p className="lede">
          Official maps show where a wildfire <em>was</em>. Firebreak fuses live
          satellite hotspots, wind, and roads to show where it is <em>going</em> —
          and how a community gets out. Built for residents, including rural,
          Indigenous, and non-English-speaking Albertans. Not an official warning
          system.
        </p>
        <form className="search-row" onSubmit={submit} role="search">
          <label className="sr-only" htmlFor="landing-q">
            {copy.amISafe}
          </label>
          <input
            id="landing-q"
            name="q"
            autoComplete="off"
            placeholder={copy.searchPlaceholder}
          />
          <button className="btn btn-ember" type="submit">
            {copy.lookupCta}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onLive}>
            {copy.enterMap}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onDemo}>
            {copy.replayJasper}
          </button>
        </form>
      </section>

      <section className="timeline" aria-label="Why this exists">
        <article className="card">
          <div className="stat">2016 · Horse River</div>
          <h2>Fort McMurray</h2>
          <p>
            The Horse River wildfire was spotted at about two hectares on 1 May
            2016, seven kilometres from town. By 3 May it was in the streets.
            About 88,000 people left the Regional Municipality of Wood Buffalo.
            Alberta&apos;s review put final size at 589,552 hectares; the KPMG
            post-incident assessment counted 1,958 structures lost or damaged.
          </p>
          <p className="cite">
            Sources:{" "}
            <a href="https://open.alberta.ca/publications/a-review-of-the-2016-horse-river-wildfire">
              Alberta, <em>A Review of the 2016 Horse River Wildfire</em>
            </a>
            ;{" "}
            <a href="https://open.alberta.ca/publications/may-2016-wood-buffalo-wildfire-post-incident-assessment-report">
              KPMG / AEMA PIA
            </a>
            .
          </p>
        </article>
        <article className="card">
          <div className="stat">2023 · Record season</div>
          <h2>2.2 million hectares</h2>
          <p>
            Alberta&apos;s 2023 legislated season burned 2,214,957 hectares —
            more than ten times the previous five-year average of about 190,000
            — and evacuated more than 38,000 people from 48 communities. Canada
            as a whole had its worst recorded season, over 15 million hectares.
          </p>
          <p className="cite">
            Sources:{" "}
            <a href="https://www.cbc.ca/news/canada/calgary/as-alberta-s-record-fire-season-ends-planning-begins-for-next-year-s-fight-1.7018764">
              CBC / Government of Alberta
            </a>
            ;{" "}
            <a href="https://www.publicsafety.gc.ca/cnt/trnsprnc/brfng-mtrls/prlmntry-bndrs/20250130/04-en.aspx">
              Public Safety Canada
            </a>
            .
          </p>
        </article>
        <article className="card">
          <div className="stat">2024 · Jasper</div>
          <h2>Forty-eight hours</h2>
          <p>
            Lightning on the evening of 22 July started fires north and south of
            the Jasper townsite. More than 20,000 people evacuated. The fire
            reached town on 24 July and destroyed 358 of 1,113 structures —
            about 30% — before being contained at 32,700 hectares. Alberta still
            burned more than 705,000 hectares that season.
          </p>
          <p className="cite">
            Sources:{" "}
            <a href="https://parks.canada.ca/pn-np/ab/jasper/visit/feu-alert-fire/feudeforet-jasper-wildfire">
              Parks Canada, Jasper Wildfire 2024
            </a>
            ;{" "}
            <a href="https://parks.canada.ca/pn-np/ab/jasper/gestion-management/serviceimmobilier-realty/retablissement-recovery/cadre-framework">
              Jasper Recovery Framework
            </a>
            ;{" "}
            <a href="https://www.cbc.ca/news/canada/edmonton/alberta-wildfire-2024-season-over-1.7369601">
              CBC / Alberta Wildfire
            </a>
            .
          </p>
        </article>
      </section>

      <p className="landing-foot">
        {copy.disclaimer} Official alerts:{" "}
        <a href="https://www.alberta.ca/alberta-emergency-alert">
          Alberta Emergency Alert
        </a>
        . Wildfire status:{" "}
        <a href="https://www.alberta.ca/wildfire-status">alberta.ca/wildfire-status</a>.
        STEMergent Hacks 2026 · SAIT Software Development · Calgary.
      </p>
    </div>
  );
}

export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 8c6 10-6 12-2 22 8-6 16 2 16 12 0 11-9 18-18 18s-18-7-18-18c0-14 14-22 22-34z"
        fill="#ff5a1f"
      />
      <path
        d="M30 28c2 6-4 8-1 14 5-3 10 1 10 7 0 6-5 10-10 10s-10-4-10-10c0-8 8-13 11-21z"
        fill="#e4c07a"
      />
    </svg>
  );
}
