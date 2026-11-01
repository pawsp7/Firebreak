import type { Community } from "@/lib/types";

/**
 * Alberta communities Firebreak knows by name, postal FSA, and coordinates.
 *
 * Populations are round figures (Statistics Canada / community profiles) used
 * only for sorting and copy, not for the risk math. Indigenous communities
 * are flagged so the UI can surface them without treating identity as a hazard.
 *
 * Swap this file to take Firebreak to another province.
 */
export const communities: Community[] = [
  { id: "calgary", name: "Calgary", lat: 51.0447, lon: -114.0719, kind: "city", indigenous: false, rural: false, population: 1300000, fsa: ["T1Y", "T2A", "T2B", "T2C", "T2E", "T2G", "T2H", "T2J", "T2K", "T2L", "T2M", "T2N", "T2P", "T2R", "T2S", "T2T", "T2V", "T2W", "T2X", "T2Y", "T2Z", "T3A", "T3B", "T3C", "T3E", "T3G", "T3H", "T3J", "T3K", "T3L", "T3M", "T3N", "T3P"], fuel: "D-1", roadAccess: 5, region: "south" },
  { id: "edmonton", name: "Edmonton", lat: 53.5461, lon: -113.4938, kind: "city", indigenous: false, rural: false, population: 1010000, fsa: ["T5A", "T5B", "T5C", "T5E", "T5G", "T5H", "T5J", "T5K", "T5L", "T5M", "T5N", "T5P", "T5R", "T5S", "T5T", "T5V", "T5W", "T5X", "T5Y", "T5Z", "T6A", "T6B", "T6C", "T6E", "T6G", "T6H", "T6J", "T6K", "T6L", "T6M", "T6N", "T6P", "T6R", "T6S", "T6T", "T6V", "T6W", "T6X"], fuel: "D-1", roadAccess: 5, region: "central" },
  { id: "red-deer", name: "Red Deer", lat: 52.2681, lon: -113.8112, kind: "city", indigenous: false, rural: false, population: 104000, fsa: ["T4N", "T4P", "T4R"], fuel: "D-1", roadAccess: 5, region: "central" },
  { id: "lethbridge", name: "Lethbridge", lat: 49.6935, lon: -112.8418, kind: "city", indigenous: false, rural: false, population: 105000, fsa: ["T1H", "T1J", "T1K"], fuel: "O-1", roadAccess: 5, region: "south" },
  { id: "medicine-hat", name: "Medicine Hat", lat: 50.0405, lon: -110.6766, kind: "city", indigenous: false, rural: false, population: 63000, fsa: ["T1A", "T1B", "T1C"], fuel: "O-1", roadAccess: 5, region: "south" },
  { id: "grande-prairie", name: "Grande Prairie", lat: 55.1707, lon: -118.7947, kind: "city", indigenous: false, rural: false, population: 64000, fsa: ["T8V", "T8W", "T8X"], fuel: "C-3", roadAccess: 5, region: "peace" },
  { id: "airdrie", name: "Airdrie", lat: 51.2917, lon: -114.0144, kind: "city", indigenous: false, rural: false, population: 81000, fsa: ["T4A", "T4B"], fuel: "D-1", roadAccess: 5, region: "south" },
  { id: "fort-mcmurray", name: "Fort McMurray", lat: 56.7267, lon: -111.379, kind: "city", indigenous: false, rural: false, population: 68000, fsa: ["T9H", "T9J", "T9K"], fuel: "C-2", roadAccess: 3, region: "oil-sands" },
  { id: "spruce-grove", name: "Spruce Grove", lat: 53.545, lon: -113.901, kind: "city", indigenous: false, rural: false, population: 40000, fsa: ["T7X"], fuel: "D-1", roadAccess: 5, region: "central" },
  { id: "st-albert", name: "St. Albert", lat: 53.6305, lon: -113.6256, kind: "city", indigenous: false, rural: false, population: 68000, fsa: ["T8N"], fuel: "D-1", roadAccess: 5, region: "central" },
  { id: "lacombe", name: "Lacombe", lat: 52.463, lon: -113.734, kind: "city", indigenous: false, rural: false, population: 14000, fsa: ["T4L"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "camrose", name: "Camrose", lat: 53.022, lon: -112.828, kind: "city", indigenous: false, rural: false, population: 19000, fsa: ["T4V"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "lloydminster", name: "Lloydminster", lat: 53.278, lon: -110.005, kind: "city", indigenous: false, rural: false, population: 20000, fsa: ["T9V"], fuel: "O-1", roadAccess: 4, region: "central" },
  { id: "cold-lake", name: "Cold Lake", lat: 54.464, lon: -110.182, kind: "city", indigenous: false, rural: false, population: 16000, fsa: ["T9M"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "brooks", name: "Brooks", lat: 50.564, lon: -111.899, kind: "city", indigenous: false, rural: false, population: 15000, fsa: ["T1R"], fuel: "O-1", roadAccess: 4, region: "south" },
  { id: "wetaskiwin", name: "Wetaskiwin", lat: 52.969, lon: -113.377, kind: "city", indigenous: false, rural: false, population: 13000, fsa: ["T9A"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "okotoks", name: "Okotoks", lat: 50.725, lon: -113.975, kind: "town", indigenous: false, rural: false, population: 30000, fsa: ["T1S"], fuel: "D-1", roadAccess: 5, region: "south" },
  { id: "cochrane", name: "Cochrane", lat: 51.192, lon: -114.468, kind: "town", indigenous: false, rural: false, population: 34000, fsa: ["T4C"], fuel: "C-3", roadAccess: 4, region: "rockies" },
  { id: "canmore", name: "Canmore", lat: 51.089, lon: -115.359, kind: "town", indigenous: false, rural: false, population: 16000, fsa: ["T1W"], fuel: "C-3", roadAccess: 3, region: "rockies" },
  { id: "banff", name: "Banff", lat: 51.1784, lon: -115.5708, kind: "town", indigenous: false, rural: false, population: 8300, fsa: ["T1L"], fuel: "C-3", roadAccess: 3, region: "rockies" },
  { id: "jasper", name: "Jasper", lat: 52.8736, lon: -118.0814, kind: "town", indigenous: false, rural: true, population: 4580, fsa: ["T0E"], fuel: "C-2", roadAccess: 2, region: "rockies" },
  { id: "hinton", name: "Hinton", lat: 53.4, lon: -117.586, kind: "town", indigenous: false, rural: false, population: 9800, fsa: ["T7V"], fuel: "C-2", roadAccess: 3, region: "rockies" },
  { id: "edson", name: "Edson", lat: 53.581, lon: -116.435, kind: "town", indigenous: false, rural: false, population: 8400, fsa: ["T7E"], fuel: "C-2", roadAccess: 3, region: "central" },
  { id: "whitecourt", name: "Whitecourt", lat: 54.142, lon: -115.684, kind: "town", indigenous: false, rural: true, population: 9900, fsa: ["T7S"], fuel: "C-2", roadAccess: 3, region: "central" },
  { id: "slave-lake", name: "Slave Lake", lat: 55.283, lon: -114.769, kind: "town", indigenous: false, rural: true, population: 6800, fsa: ["T0G"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "high-level", name: "High Level", lat: 58.5169, lon: -117.136, kind: "town", indigenous: false, rural: true, population: 3200, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "peace-river", name: "Peace River", lat: 56.235, lon: -117.291, kind: "town", indigenous: false, rural: true, population: 6600, fsa: ["T8S"], fuel: "C-3", roadAccess: 3, region: "peace" },
  { id: "fairview", name: "Fairview", lat: 56.066, lon: -118.393, kind: "town", indigenous: false, rural: true, population: 3000, fsa: ["T0H"], fuel: "C-3", roadAccess: 3, region: "peace" },
  { id: "valleyview", name: "Valleyview", lat: 55.068, lon: -117.269, kind: "town", indigenous: false, rural: true, population: 1900, fsa: ["T0H"], fuel: "C-2", roadAccess: 3, region: "peace" },
  { id: "fox-creek", name: "Fox Creek", lat: 54.395, lon: -116.803, kind: "town", indigenous: false, rural: true, population: 2100, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "peace" },
  { id: "grande-cache", name: "Grande Cache", lat: 53.889, lon: -119.14, kind: "hamlet", indigenous: false, rural: true, population: 3200, fsa: ["T0E"], fuel: "C-2", roadAccess: 2, region: "rockies" },
  { id: "high-prairie", name: "High Prairie", lat: 55.433, lon: -116.486, kind: "town", indigenous: false, rural: true, population: 2600, fsa: ["T0G"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "athabasca", name: "Athabasca", lat: 54.721, lon: -113.285, kind: "town", indigenous: false, rural: true, population: 3000, fsa: ["T9S"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "lac-la-biche", name: "Lac La Biche", lat: 54.77, lon: -111.973, kind: "hamlet", indigenous: false, rural: true, population: 2300, fsa: ["T0A"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "bonnyville", name: "Bonnyville", lat: 54.267, lon: -110.735, kind: "town", indigenous: false, rural: true, population: 6400, fsa: ["T9N"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "st-paul", name: "St. Paul", lat: 53.993, lon: -111.297, kind: "town", indigenous: false, rural: true, population: 5800, fsa: ["T0A"], fuel: "D-1", roadAccess: 3, region: "north" },
  { id: "wainwright", name: "Wainwright", lat: 52.835, lon: -110.857, kind: "town", indigenous: false, rural: true, population: 6400, fsa: ["T9W"], fuel: "O-1", roadAccess: 3, region: "central" },
  { id: "drumheller", name: "Drumheller", lat: 51.463, lon: -112.71, kind: "town", indigenous: false, rural: true, population: 7900, fsa: ["T0J"], fuel: "O-1", roadAccess: 3, region: "south" },
  { id: "hanna", name: "Hanna", lat: 51.644, lon: -111.927, kind: "town", indigenous: false, rural: true, population: 2500, fsa: ["T0J"], fuel: "O-1", roadAccess: 3, region: "south" },
  { id: "high-river", name: "High River", lat: 50.58, lon: -113.874, kind: "town", indigenous: false, rural: false, population: 14300, fsa: ["T1V"], fuel: "O-1", roadAccess: 4, region: "south" },
  { id: "pincher-creek", name: "Pincher Creek", lat: 49.485, lon: -113.95, kind: "town", indigenous: false, rural: true, population: 3600, fsa: ["T0K"], fuel: "C-7", roadAccess: 3, region: "south" },
  { id: "crowsnest", name: "Crowsnest Pass", lat: 49.605, lon: -114.438, kind: "town", indigenous: false, rural: true, population: 5600, fsa: ["T0K"], fuel: "C-3", roadAccess: 3, region: "rockies" },
  { id: "rocky-mountain-house", name: "Rocky Mountain House", lat: 52.375, lon: -114.921, kind: "town", indigenous: false, rural: true, population: 6700, fsa: ["T4T"], fuel: "C-3", roadAccess: 3, region: "central" },
  { id: "drayton-valley", name: "Drayton Valley", lat: 53.221, lon: -114.976, kind: "town", indigenous: false, rural: true, population: 7200, fsa: ["T7A"], fuel: "C-3", roadAccess: 3, region: "central" },
  { id: "swan-hills", name: "Swan Hills", lat: 54.718, lon: -115.401, kind: "town", indigenous: false, rural: true, population: 1300, fsa: ["T0G"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "westlock", name: "Westlock", lat: 54.154, lon: -113.851, kind: "town", indigenous: false, rural: true, population: 5100, fsa: ["T7P"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "barrhead", name: "Barrhead", lat: 54.123, lon: -114.402, kind: "town", indigenous: false, rural: true, population: 4600, fsa: ["T7N"], fuel: "C-2", roadAccess: 3, region: "central" },
  { id: "vegreville", name: "Vegreville", lat: 53.5, lon: -112.052, kind: "town", indigenous: false, rural: true, population: 5700, fsa: ["T9C"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "manning", name: "Manning", lat: 56.923, lon: -117.627, kind: "town", indigenous: false, rural: true, population: 1200, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "peace" },
  { id: "rainbow-lake", name: "Rainbow Lake", lat: 58.505, lon: -119.394, kind: "town", indigenous: false, rural: true, population: 500, fsa: ["T0H"], fuel: "C-2", roadAccess: 1, region: "north" },
  { id: "fort-vermilion", name: "Fort Vermilion", lat: 58.39, lon: -116.017, kind: "hamlet", indigenous: false, rural: true, population: 800, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "la-crete", name: "La Crete", lat: 58.191, lon: -116.389, kind: "hamlet", indigenous: false, rural: true, population: 3900, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "fort-chipewyan", name: "Fort Chipewyan", lat: 58.711, lon: -111.158, kind: "hamlet", indigenous: true, rural: true, population: 850, fsa: ["T0P"], fuel: "C-2", roadAccess: 1, region: "oil-sands" },
  { id: "anzac", name: "Anzac", lat: 56.449, lon: -111.037, kind: "hamlet", indigenous: false, rural: true, population: 600, fsa: ["T0P"], fuel: "C-2", roadAccess: 2, region: "oil-sands" },
  { id: "conklin", name: "Conklin", lat: 55.631, lon: -111.079, kind: "hamlet", indigenous: true, rural: true, population: 200, fsa: ["T0P"], fuel: "C-2", roadAccess: 2, region: "oil-sands" },
  { id: "fort-mckay", name: "Fort McKay", lat: 57.184, lon: -111.626, kind: "hamlet", indigenous: true, rural: true, population: 750, fsa: ["T0P"], fuel: "C-2", roadAccess: 2, region: "oil-sands" },
  { id: "wabasca", name: "Wabasca", lat: 55.969, lon: -113.856, kind: "hamlet", indigenous: true, rural: true, population: 1600, fsa: ["T0G"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "calling-lake", name: "Calling Lake", lat: 55.21, lon: -113.19, kind: "hamlet", indigenous: true, rural: true, population: 450, fsa: ["T0G"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "red-earth", name: "Red Earth Creek", lat: 56.54, lon: -115.29, kind: "hamlet", indigenous: false, rural: true, population: 350, fsa: ["T0G"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "peerless-lake", name: "Peerless Lake", lat: 56.67, lon: -114.58, kind: "hamlet", indigenous: true, rural: true, population: 350, fsa: ["T0G"], fuel: "C-2", roadAccess: 1, region: "north" },
  { id: "siksika", name: "Siksika Nation", lat: 50.939, lon: -113.052, kind: "first-nation", indigenous: true, rural: true, population: 4000, fsa: ["T0J"], fuel: "O-1", roadAccess: 3, region: "south" },
  { id: "kainai", name: "Kainai Nation (Blood Tribe)", lat: 49.462, lon: -113.182, kind: "first-nation", indigenous: true, rural: true, population: 4700, fsa: ["T0K"], fuel: "O-1", roadAccess: 3, region: "south" },
  { id: "piikani", name: "Piikani Nation", lat: 49.548, lon: -113.824, kind: "first-nation", indigenous: true, rural: true, population: 1600, fsa: ["T0K"], fuel: "C-7", roadAccess: 3, region: "south" },
  { id: "tsuutina", name: "Tsuut'ina Nation", lat: 50.966, lon: -114.231, kind: "first-nation", indigenous: true, rural: false, population: 2500, fsa: ["T3T"], fuel: "D-1", roadAccess: 4, region: "south" },
  { id: "stoney", name: "Stoney Nakoda (Morley)", lat: 51.168, lon: -114.854, kind: "first-nation", indigenous: true, rural: true, population: 5500, fsa: ["T0L"], fuel: "C-3", roadAccess: 3, region: "rockies" },
  { id: "maskwacis", name: "Maskwacis", lat: 52.808, lon: -113.453, kind: "first-nation", indigenous: true, rural: true, population: 7900, fsa: ["T0C"], fuel: "D-1", roadAccess: 3, region: "central" },
  { id: "enoch", name: "Enoch Cree Nation", lat: 53.502, lon: -113.76, kind: "first-nation", indigenous: true, rural: false, population: 1800, fsa: ["T7X"], fuel: "D-1", roadAccess: 5, region: "central" },
  { id: "alexander", name: "Alexander First Nation", lat: 53.76, lon: -114.15, kind: "first-nation", indigenous: true, rural: true, population: 1100, fsa: ["T0E"], fuel: "C-2", roadAccess: 3, region: "central" },
  { id: "saddle-lake", name: "Saddle Lake Cree Nation", lat: 53.969, lon: -111.733, kind: "first-nation", indigenous: true, rural: true, population: 2200, fsa: ["T0A"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "frog-lake", name: "Frog Lake First Nation", lat: 53.931, lon: -110.25, kind: "first-nation", indigenous: true, rural: true, population: 500, fsa: ["T0A"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "kehewin", name: "Kehewin Cree Nation", lat: 54.16, lon: -110.86, kind: "first-nation", indigenous: true, rural: true, population: 800, fsa: ["T0A"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "cold-lake-fn", name: "Cold Lake First Nations", lat: 54.55, lon: -110.07, kind: "first-nation", indigenous: true, rural: true, population: 1300, fsa: ["T9M"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "heart-lake", name: "Heart Lake First Nation", lat: 55.03, lon: -111.21, kind: "first-nation", indigenous: true, rural: true, population: 200, fsa: ["T0A"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "beaver-lake", name: "Beaver Lake Cree Nation", lat: 54.77, lon: -111.92, kind: "first-nation", indigenous: true, rural: true, population: 450, fsa: ["T0A"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "driftpile", name: "Driftpile Cree Nation", lat: 55.39, lon: -115.63, kind: "first-nation", indigenous: true, rural: true, population: 850, fsa: ["T0G"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "sucker-creek", name: "Sucker Creek First Nation", lat: 55.42, lon: -116.15, kind: "first-nation", indigenous: true, rural: true, population: 700, fsa: ["T0G"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "sturgeon-lake", name: "Sturgeon Lake Cree Nation", lat: 55.12, lon: -117.58, kind: "first-nation", indigenous: true, rural: true, population: 1400, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "peace" },
  { id: "horse-lake", name: "Horse Lake First Nation", lat: 55.33, lon: -119.42, kind: "first-nation", indigenous: true, rural: true, population: 500, fsa: ["T0H"], fuel: "C-3", roadAccess: 3, region: "peace" },
  { id: "dene-tha", name: "Dene Tha' (Chateh)", lat: 58.64, lon: -118.68, kind: "first-nation", indigenous: true, rural: true, population: 1700, fsa: ["T0H"], fuel: "C-2", roadAccess: 1, region: "north" },
  { id: "fox-lake", name: "Fox Lake (Little Red River Cree)", lat: 58.447, lon: -114.528, kind: "first-nation", indigenous: true, rural: true, population: 2500, fsa: ["T0H"], fuel: "C-2", roadAccess: 1, region: "north" },
  { id: "john-dor", name: "John D'Or Prairie", lat: 58.492, lon: -115.154, kind: "first-nation", indigenous: true, rural: true, population: 1200, fsa: ["T0H"], fuel: "C-2", roadAccess: 1, region: "north" },
  { id: "garden-river", name: "Garden River", lat: 58.7, lon: -113.9, kind: "first-nation", indigenous: true, rural: true, population: 600, fsa: ["T0H"], fuel: "C-2", roadAccess: 1, region: "north" },
  { id: "tallcree", name: "Tallcree First Nation", lat: 58.48, lon: -117.05, kind: "first-nation", indigenous: true, rural: true, population: 500, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "mikisew", name: "Mikisew Cree (Fort Chipewyan)", lat: 58.715, lon: -111.15, kind: "first-nation", indigenous: true, rural: true, population: 3000, fsa: ["T0P"], fuel: "C-2", roadAccess: 1, region: "oil-sands" },
  { id: "acfn", name: "Athabasca Chipewyan First Nation", lat: 58.7, lon: -110.85, kind: "first-nation", indigenous: true, rural: true, population: 1200, fsa: ["T0P"], fuel: "C-2", roadAccess: 1, region: "oil-sands" },
  { id: "fmfn", name: "Fort McMurray First Nation", lat: 56.63, lon: -111.18, kind: "first-nation", indigenous: true, rural: true, population: 800, fsa: ["T9H"], fuel: "C-2", roadAccess: 3, region: "oil-sands" },
  { id: "paddle-prairie", name: "Paddle Prairie Métis Settlement", lat: 57.953, lon: -117.334, kind: "metis-settlement", indigenous: true, rural: true, population: 550, fsa: ["T0H"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "gift-lake", name: "Gift Lake Métis Settlement", lat: 55.887, lon: -115.801, kind: "metis-settlement", indigenous: true, rural: true, population: 650, fsa: ["T0G"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "peavine", name: "Peavine Métis Settlement", lat: 55.533, lon: -116.45, kind: "metis-settlement", indigenous: true, rural: true, population: 500, fsa: ["T0G"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "kikino", name: "Kikino Métis Settlement", lat: 54.454, lon: -111.996, kind: "metis-settlement", indigenous: true, rural: true, population: 900, fsa: ["T0A"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "buffalo-lake", name: "Buffalo Lake Métis Settlement", lat: 52.47, lon: -112.87, kind: "metis-settlement", indigenous: true, rural: true, population: 1200, fsa: ["T0C"], fuel: "D-1", roadAccess: 3, region: "central" },
  { id: "elizabeth", name: "Elizabeth Métis Settlement", lat: 54.427, lon: -110.32, kind: "metis-settlement", indigenous: true, rural: true, population: 650, fsa: ["T0A"], fuel: "C-2", roadAccess: 3, region: "north" },
  { id: "fishing-lake", name: "Fishing Lake Métis Settlement", lat: 54.316, lon: -110.4, kind: "metis-settlement", indigenous: true, rural: true, population: 400, fsa: ["T0A"], fuel: "C-2", roadAccess: 2, region: "north" },
  { id: "olds", name: "Olds", lat: 51.792, lon: -114.107, kind: "town", indigenous: false, rural: true, population: 9200, fsa: ["T4H"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "innisfail", name: "Innisfail", lat: 52.028, lon: -113.95, kind: "town", indigenous: false, rural: true, population: 8000, fsa: ["T4G"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "ponoka", name: "Ponoka", lat: 52.677, lon: -113.581, kind: "town", indigenous: false, rural: true, population: 7500, fsa: ["T4J"], fuel: "D-1", roadAccess: 4, region: "central" },
  { id: "taber", name: "Taber", lat: 49.785, lon: -112.146, kind: "town", indigenous: false, rural: true, population: 8800, fsa: ["T1G"], fuel: "O-1", roadAccess: 4, region: "south" },
  { id: "cardston", name: "Cardston", lat: 49.202, lon: -113.302, kind: "town", indigenous: false, rural: true, population: 3700, fsa: ["T0K"], fuel: "O-1", roadAccess: 3, region: "south" },
];

export const communityById = new Map(communities.map((c) => [c.id, c]));

export function fuelForPoint(lat: number, lon: number): Community["fuel"] {
  // Crude ecoregion proxy so a new hotspot inherits a fuel type without a raster.
  if (lat >= 56.5) return "C-2";
  if (lon <= -116.5 && lat >= 51.8 && lat <= 54.5) return "C-2";
  if (lat <= 50.8 && lon >= -113.5) return "O-1";
  if (lon <= -114.8 && lat <= 52.2) return "C-3";
  if (lat <= 51.3) return "O-1";
  if (lat >= 54.2) return "C-2";
  return "M-1";
}

export function findCommunity(query: string): Community | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const compact = q.replace(/[^a-z0-9]/g, "");
  const fsa = q.toUpperCase().replace(/\s+/g, "").slice(0, 3);
  return (
    communities.find((c) => c.id === compact || c.name.toLowerCase() === q) ||
    communities.find((c) => c.name.toLowerCase().includes(q)) ||
    (fsa.length === 3 ? communities.find((c) => c.fsa.includes(fsa)) : undefined)
  );
}
