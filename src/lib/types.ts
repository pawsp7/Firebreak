/**
 * Shared types for Firebreak.
 *
 * Keep this file boring on purpose: every other module (the spread model,
 * the risk score, the APIs, the map) should speak the same language so a
 * new province is a data swap, not a rewrite.
 */

export type FuelType = "C-2" | "C-3" | "C-7" | "D-1" | "M-1" | "O-1";

export type CommunityKind =
  | "city"
  | "town"
  | "village"
  | "hamlet"
  | "first-nation"
  | "metis-settlement";

export type RiskLevel = "safe" | "watch" | "prepare" | "leave";

export type Lang = "en" | "fr" | "cr" | "pa" | "tl" | "ar";

export type Mode = "live" | "demo";

export type LonLat = { lon: number; lat: number };

export type BBox = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export type Community = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  kind: CommunityKind;
  indigenous: boolean;
  rural: boolean;
  population: number;
  /** Forward Sortation Areas (first 3 characters of a Canadian postal code). */
  fsa: string[];
  fuel: FuelType;
  /**
   * How many independent ways out of town, 1 = isolated / seasonal road,
   * 5 = multiple paved highways. Used in the risk "why" and in routing.
   */
  roadAccess: 1 | 2 | 3 | 4 | 5;
  region: "south" | "central" | "north" | "peace" | "rockies" | "oil-sands";
};

export type ReceptionCentre = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  communityId: string;
  notes: string;
};

export type WeatherHour = {
  /** ISO 8601 timestamp in the region's timezone when possible. */
  time: string;
  windKmh: number;
  /** Meteorological wind direction: degrees the wind is coming FROM. */
  windFromDeg: number;
  rh: number;
  tempC: number;
};

export type Hotspot = {
  lat: number;
  lon: number;
  brightness?: number;
  frp?: number;
  confidence?: string | number;
  acquired?: string;
  satellite?: string;
};

export type FirePerimeter = {
  id: string;
  areaHa?: number;
  coordinates: number[][][];
};

export type GeoJsonPolygon = {
  type: "Polygon";
  coordinates: number[][][];
};

export type SpreadFrame = {
  hour: number;
  rosKmh: number;
  headKm: number;
  backKm: number;
  flankKm: number;
  geometry: GeoJsonPolygon;
};

export type FireCluster = {
  id: string;
  lat: number;
  lon: number;
  fuel: FuelType;
  hotspotCount: number;
  areaHa: number;
  seed: GeoJsonPolygon | null;
  frames: SpreadFrame[];
};

export type RiskFactor = {
  key: "proximityNow" | "proximityForecast" | "windAlignment" | "dryness" | "evacuation";
  points: number;
  max: number;
  why: string;
};

export type CommunityRisk = {
  communityId: string;
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  nearestKm: number;
  forecastKm: number;
  downwind: boolean;
};

export type Briefing = {
  happening: string;
  doNow: string;
  pack: string[];
  officialName: string;
  officialUrl: string;
};

export type EscapeRoute = {
  id: string;
  label: string;
  destination: string;
  distanceKm: number;
  etaMinutes: number;
  risk: RiskLevel;
  riskWhy: string;
  coordinates: number[][];
  viaReceptionId?: string;
};

export type DataSourceStatus = {
  id: string;
  label: string;
  url: string;
  ok: boolean;
  fallback: boolean;
  detail: string;
};

export type Situation = {
  mode: Mode;
  generatedAt: string;
  timelineStart: string;
  timelineHours: number;
  hotspots: Hotspot[];
  perimeters: FirePerimeter[];
  clusters: FireCluster[];
  weather: WeatherHour[];
  windGrid: Array<LonLat & { windKmh: number; windFromDeg: number }>;
  risks: CommunityRisk[];
  sources: DataSourceStatus[];
  disclaimer: string;
};

export type LookupResult = {
  query: string;
  match: "community" | "postal" | "geocode" | "none";
  community: Community | null;
  point: LonLat | null;
  risk: CommunityRisk | null;
  briefing: Briefing | null;
  label: string;
};
