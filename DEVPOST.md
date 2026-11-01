# Firebreak — Devpost

STEMergent Hacks 2026 · solo · SAIT Software Development, Calgary  
Deadline: 15 November 2026, 8:30 PM MST

## Inspiration

On 1 May 2016 a two-hectare fire seven kilometres from Fort McMurray became, in two days, the most expensive natural disaster in Canadian history. In 2023 Alberta burned 2.2 million hectares and moved 38,000 people. On 22 July 2024 lightning started fires north and south of Jasper; forty-eight hours later a third of the town was gone.

I grew up in a province that already has excellent fire maps — Alberta Wildfire, CWFIS, NASA FIRMS. What they do not give a resident at 11 p.m. is one sentence: **are we in the next 24 hours of this fire, and which road is still a road?** That sentence is sharper if you live on a single highway, if English is not the language in the house, or if the official alert has not caught up with the wind yet.

Firebreak is that sentence, drawn on a map, with the math in the open.

## What it does

- **Live map (MapLibre GL)** of Alberta: NASA FIRMS hotspots, CWFIS Fire M3 perimeters, animated wind particles from Open-Meteo.
- **24-hour spread forecast**: a wind-driven ellipse (simplified Rothermel × FBP length-to-breadth) that you can scrub hour by hour. Overnight humidity recovery actually pauses the cone.
- **Community risk scores 0–100** for ~100 Alberta places, including First Nations and Métis settlements, with a **why** bar for each factor.
- **Escape routes** via OSRM that are scored against the predicted fire line, plus nearby reception centres.
- **Plain-language briefing** — what's happening, what to do now, what to pack — in English, French, Plains Cree, Punjabi, Tagalog, and Arabic, always linking [Alberta Emergency Alert](https://www.alberta.ca/alberta-emergency-alert).
- **Am I safe?** lookup by town or postal code.
- **Jasper 2024 demo tape** so the two-minute video never depends on a live API, plus cached fallbacks if FIRMS/CWFIS/Open-Meteo fail.

It is **not** an official warning system.

## How we built it

Next.js 15 (App Router) + TypeScript + MapLibre GL + a tiny in-repo model.

- `src/config/region.ts` — bbox, endpoints, timezone. Another province is this file plus the community list.
- `src/lib/spread.ts` — ROS and ellipse. Unit-tested against a Jasper-paced C-2 day run (~1 km/h).
- `src/lib/risk.ts` — five capped factors that sum to 100.
- `src/app/api/*` — situation, lookup, routes. Timeouts on every fetch.
- `src/data/demo-jasper.ts` — reconstructed 48-hour tape from Parks Canada timelines, not a stolen granule.

Free, keyless APIs where they exist. `FIRMS_MAP_KEY` is optional.

## Challenges we ran into

- **Official perimeters vs. pixels.** CWFIS WFS and FIRMS CSVs do not share IDs. Clustering on an 8 km grid, then attaching a perimeter if its centroid is close, is a hack — and it is documented as a hack.
- **OSRM cannot "avoid this polygon."** We subsample the route every 2 km, score distance to the cone, and retry with a perpendicular via-point when the first line threads the fire.
- **Cree without harming anyone.** I am not a speaker. Shipping Cree-only instructions would be reckless. The UI is bilingual and labelled as a draft for language keepers.
- **A model that looks like Jasper without cheating.** Open-wind at 10 m does not know the Athabasca valley. The demo tape uses SSE wind as a stand-in for valley channelling, and the about panel says so.

## Accomplishments that we're proud of

- One screen that a judge can read: landing cites 2016 / 2023 / 2024, then the map, then a Jasper replay that does not break.
- A risk number you can audit. If Jasper is 86, you can see that 28 of those points are "the cone reaches town."
- Rural and Indigenous communities are first-class rows, not an afterthought filter.
- The demo still works on a plane.

## What we learned

Fire behaviour is a profession. A hackathon ellipse is a communication tool, not a replacement for Prometheus or a Type 1 team. The useful product is the **fusion and the sentence**, not a new physical constant. Also: accessibility and RTL are cheaper if you start with logical CSS properties instead of `left`/`right`.

## What's next

- A real FBP fuel raster and a coarse DEM so slope and valley winds are not a footnote.
- Review of nêhiyawêwin copy with language keepers, and audio briefings.
- Offline-first PWA with the last good situation cached on the device.
- A province pack for B.C. and the NWT — still a data swap.
- Talk to AEMA / community emergency officers about what must never be implied by a student project.

## Built with

Next.js, TypeScript, MapLibre GL JS, Open-Meteo, NASA FIRMS, CWFIS, OSRM, OpenStreetMap, Vitest.

## AI-assisted development (required disclosure)

Cursor Grok 4.6 helped scaffold the Next.js app, draft translations, write tests, and iterate on the cinematic UI. Every fire-behaviour number, API URL, and risk weight was chosen to be explainable by the entrant. No vendor fire-model API was called.
