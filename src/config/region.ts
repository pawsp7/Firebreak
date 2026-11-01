/**
 * Province-level configuration.
 *
 * To stand this app up for another province, swap this file plus
 * `src/data/communities.ts` and `src/data/reception.ts`. The spread model,
 * risk score, MapLibre UI, and API routes stay as they are.
 *
 * All remote endpoints listed here are free public services. FIRMS_MAP_KEY
 * is optional — without it we read NASA's published Canada CSV extracts.
 */

import type { BBox, LonLat } from "@/lib/types";

export const region = {
  id: "ab",
  name: "Alberta",
  country: "Canada",
  timezone: "America/Edmonton",
  locale: "en-CA",
  bbox: { west: -120.05, south: 48.95, east: -109.9, north: 60.05 } satisfies BBox,
  center: { lon: -115.2, lat: 54.2 } satisfies LonLat,
  defaultZoom: 5.35,
  minZoom: 4.5,
  maxZoom: 14,
  emergencyAlert: {
    name: "Alberta Emergency Alert",
    url: "https://www.alberta.ca/alberta-emergency-alert",
  },
  wildfireStatusUrl: "https://www.alberta.ca/wildfire-status",
  firms: {
    /**
     * Public regional extracts — no MAP_KEY. Filtered to `bbox` after download.
     * https://firms.modaps.eosdis.nasa.gov/active_fire/
     */
    publicCsv: [
      "https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_Canada_24h.csv",
      "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Canada_24h.csv",
    ],
    /**
     * Used only when FIRMS_MAP_KEY is set. Area API, last 1 day, VIIRS SNPP NRT.
     * https://firms.modaps.eosdis.nasa.gov/api/area/
     */
    mapKeySource: "VIIRS_SNPP_NRT",
  },
  /**
   * CWFIS / CWFIF GeoServer WFS (no key). We try the current Fire M3 perimeter
   * estimate, then the active-fires point layer. Docs:
   * https://cwfis.cfs.nrcan.gc.ca/downloads/docs/en/how-tos/how-to-access-cwfis-data-services.pdf
   */
  cwfis: {
    perimeters: [
      "https://cwfis.cfs.nrcan.gc.ca/geoserver/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:m3_polygons_current&outputFormat=application/json&maxFeatures=4000",
      "https://cwfis.cfs.nrcan.gc.ca/geoserver/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:m3polygons&outputFormat=application/json&maxFeatures=4000",
    ],
    activeFires:
      "https://cwfis.cfs.nrcan.gc.ca/geoserver/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:activefires_current&outputFormat=application/json&maxFeatures=4000",
  },
  weather: {
    provider: "open-meteo" as const,
    forecast: "https://api.open-meteo.com/v1/forecast",
    /** Sample points used to draw wind particles across the province. */
    grid: [
      { lon: -119.5, lat: 58.5 },
      { lon: -114.0, lat: 58.5 },
      { lon: -111.4, lat: 56.7 },
      { lon: -118.8, lat: 55.2 },
      { lon: -113.5, lat: 53.5 },
      { lon: -118.1, lat: 52.9 },
      { lon: -114.1, lat: 51.0 },
      { lon: -111.0, lat: 50.0 },
    ] satisfies LonLat[],
  },
  routing: {
    osrm: "https://router.project-osrm.org",
    nominatim: "https://nominatim.openstreetmap.org",
    userAgent: "Firebreak/1.0 (STEMergent Hacks 2026; educational non-operational)",
  },
  /**
   * Esri World Dark Gray Canvas — keyless raster tiles (ArcGIS tile scheme is z/y/x).
   * Carto dark_all currently watermarks without an API key; OpenFreeMap vector is
   * a nice upgrade if you add glyphs later.
   */
  mapStyle: {
    version: 8 as const,
    sources: {
      esri: {
        type: "raster" as const,
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Tiles © Esri",
        maxzoom: 16,
      },
      esriRef: {
        type: "raster" as const,
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 16,
      },
    },
    layers: [
      { id: "bg", type: "background" as const, paint: { "background-color": "#1a1714" } },
      { id: "esri", type: "raster" as const, source: "esri" },
      {
        id: "esri-ref",
        type: "raster" as const,
        source: "esriRef",
        paint: { "raster-opacity": 0.8 },
      },
    ],
  },
  defaultFuel: "C-2" as const,
  liveCacheMs: 10 * 60 * 1000,
};

export type RegionConfig = typeof region;
