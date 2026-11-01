import type { ReceptionCentre } from "@/lib/types";

/**
 * Typical Alberta reception / evacuation gathering places.
 * These are not a live AEMA list — they are well-known public facilities
 * used in past events (Jasper 2024 used Hinton, Edmonton, and others) so
 * the map has somewhere honest to send a resident. Always confirm against
 * Alberta Emergency Alert.
 */
export const receptionCentres: ReceptionCentre[] = [
  { id: "hinton-rec", name: "Hinton Recreation Centre", lat: 53.402, lon: -117.561, communityId: "hinton", notes: "Primary Hwy 16 east reception for Jasper National Park evacuations." },
  { id: "edson-rec", name: "Edson & District Recreation Complex", lat: 53.582, lon: -116.434, communityId: "edson", notes: "Secondary Hwy 16 east reception." },
  { id: "edmonton-expo", name: "Edmonton EXPO Centre", lat: 53.57, lon: -113.458, communityId: "edmonton", notes: "Used as a major reception site in the 2024 Jasper evacuation." },
  { id: "valemount", name: "Valemount Community Hall (B.C.)", lat: 52.831, lon: -119.266, communityId: "jasper", notes: "Hwy 16 west option when the eastbound fire line is closed." },
  { id: "gp-revolution", name: "Revolution Place, Grande Prairie", lat: 55.172, lon: -118.795, communityId: "grande-prairie", notes: "Peace Country reception for northern evacuations." },
  { id: "high-level-rec", name: "High Level Sports Complex", lat: 58.515, lon: -117.14, communityId: "high-level", notes: "Northwest Alberta gathering point." },
  { id: "slave-lake-mrac", name: "Multi-Rec Centre, Slave Lake", lat: 55.283, lon: -114.77, communityId: "slave-lake", notes: "Used in 2011 and later northern evacuations." },
  { id: "red-deer-westerner", name: "Westerner Park, Red Deer", lat: 52.26, lon: -113.811, communityId: "red-deer", notes: "Central Alberta reception." },
  { id: "calgary-stampede", name: "Stampede Park / BMO Centre area, Calgary", lat: 51.037, lon: -114.052, communityId: "calgary", notes: "Southern Alberta mass-care site in large events." },
  { id: "lethbridge-enic", name: "ENMAX Centre, Lethbridge", lat: 49.7, lon: -112.821, communityId: "lethbridge", notes: "South-west reception." },
  { id: "ftmac-macdonald", name: "MacDonald Island Park, Fort McMurray", lat: 56.727, lon: -111.38, communityId: "fort-mcmurray", notes: "Local gathering point when Hwy 63 is open." },
  { id: "lac-la-biche-bold", name: "Bold Center, Lac La Biche", lat: 54.768, lon: -111.98, communityId: "lac-la-biche", notes: "Northeast reception." },
  { id: "peace-river-baytex", name: "Baytex Energy Centre, Peace River", lat: 56.233, lon: -117.289, communityId: "peace-river", notes: "Peace River reception." },
  { id: "wetaskiwin-rec", name: "Wetaskiwin Civic Centre", lat: 52.969, lon: -113.378, communityId: "wetaskiwin", notes: "Near Maskwacis; used when central bands evacuate." },
];
