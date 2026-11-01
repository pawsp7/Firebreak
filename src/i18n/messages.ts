import type { Lang, RiskLevel } from "@/lib/types";

export const LANGS: { id: Lang; label: string; native: string; dir: "ltr" | "rtl" }[] = [
  { id: "en", label: "English", native: "English", dir: "ltr" },
  { id: "fr", label: "French", native: "Français", dir: "ltr" },
  { id: "cr", label: "Plains Cree", native: "nêhiyawêwin", dir: "ltr" },
  { id: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", dir: "ltr" },
  { id: "tl", label: "Tagalog", native: "Tagalog", dir: "ltr" },
  { id: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

type LevelCopy = Record<RiskLevel, string>;

export type Messages = {
  tagline: string;
  amISafe: string;
  searchPlaceholder: string;
  enterMap: string;
  replayJasper: string;
  live: string;
  demo: string;
  communities: string;
  briefing: string;
  routes: string;
  hour: string;
  play: string;
  pause: string;
  why: string;
  pack: string;
  happening: string;
  doNow: string;
  official: string;
  officialCta: string;
  disclaimer: string;
  notOfficial: string;
  usingFallback: string;
  demoBanner: string;
  ruralFirst: string;
  about: string;
  close: string;
  eta: string;
  risk: string;
  reception: string;
  noMatch: string;
  safeAnswer: LevelCopy;
  doNowByLevel: LevelCopy;
  happeningByLevel: LevelCopy;
  packList: string[];
  factors: Record<string, string>;
  levels: LevelCopy;
  skip: string;
  wind: string;
  humidity: string;
  languageNote: string;
  lookupCta: string;
  sources: string;
};

export const messages: Record<Lang, Messages> = {
  en: {
    tagline: "See the fire line before it finds you.",
    amISafe: "Am I safe?",
    searchPlaceholder: "Town, First Nation, or postal code (T0E 1E0)",
    enterMap: "Open the live map",
    replayJasper: "Replay Jasper 2024",
    live: "Live",
    demo: "Replay",
    communities: "Communities",
    briefing: "Briefing",
    routes: "Escape routes",
    hour: "Hour",
    play: "Play forecast",
    pause: "Pause",
    why: "Why this score",
    pack: "What to pack",
    happening: "What's happening",
    doNow: "What to do now",
    official: "Official source",
    officialCta: "Open Alberta Emergency Alert",
    disclaimer:
      "Firebreak is not an official warning system. Always follow Alberta Emergency Alert and local authorities.",
    notOfficial: "Not an official warning",
    usingFallback: "Live feeds unavailable — showing cached fallback data.",
    demoBanner: "Demo tape: Jasper Wildfire Complex, 22–24 July 2024. Not live.",
    ruralFirst: "Rural & Indigenous first",
    about: "How the model works",
    close: "Close",
    eta: "ETA",
    risk: "Route risk",
    reception: "Reception centres",
    noMatch: "No Alberta match. Try a town name or a T postal code.",
    safeAnswer: {
      safe: "You are not in the projected fire line.",
      watch: "Watch — fire is in your region.",
      prepare: "Prepare now. Pack and pick a road.",
      leave: "Leave if officials order it. Follow Alberta Emergency Alert.",
    },
    doNowByLevel: {
      safe: "No action from this forecast. Keep Alberta Emergency Alert on, and know two ways out of town.",
      watch: "Monitor this page and official alerts. Fill the car, stage documents, and tell family your plan.",
      prepare: "Pack now. Load pets and medicines. Choose a route below and a reception centre. Be ready to leave in minutes.",
      leave: "If an alert says go, go. Take the lowest-risk route. Do not wait to see the flames. Check in at a reception centre.",
    },
    happeningByLevel: {
      safe: "No mapped fire is pushing toward this community in the next hours. Weather: {wind} km/h wind, {rh}% humidity.",
      watch: "{fires} fire cluster(s) in range. Nearest {km} km away. Wind {wind} km/h from {dir}°. Humidity {rh}%.",
      prepare: "The projected cone is closing in — {km} km at this hour. Wind {wind} km/h from {dir}°, humidity {rh}%.",
      leave: "This community sits inside or on the edge of the projected fire line. Wind {wind} km/h from {dir}°.",
    },
    packList: [
      "IDs, status cards, insurance, and paper maps",
      "Medications, glasses, and prescriptions",
      "Water, snacks, and food for pets",
      "Clothes, chargers, cash, and keys",
      "Children, elders, and neighbours who need a ride",
    ],
    factors: {
      proximityNow: "Distance to fire now",
      proximityForecast: "Distance to 24 h cone",
      windAlignment: "Wind aimed at town",
      dryness: "Dry, hot air",
      evacuation: "Roads out",
    },
    levels: { safe: "Low", watch: "Watch", prepare: "Prepare", leave: "Leave" },
    skip: "Skip to map",
    wind: "Wind",
    humidity: "Humidity",
    languageNote: "",
    lookupCta: "Check my community",
    sources: "Sources",
  },
  fr: {
    tagline: "Voir la ligne de feu avant qu’elle n’arrive.",
    amISafe: "Suis-je en sécurité ?",
    searchPlaceholder: "Ville, communauté ou code postal (T0E 1E0)",
    enterMap: "Ouvrir la carte en direct",
    replayJasper: "Rejouer Jasper 2024",
    live: "En direct",
    demo: "Rejeu",
    communities: "Collectivités",
    briefing: "Briefing",
    routes: "Voies d’évacuation",
    hour: "Heure",
    play: "Lire la prévision",
    pause: "Pause",
    why: "Pourquoi ce score",
    pack: "Quoi emporter",
    happening: "Ce qui se passe",
    doNow: "Quoi faire maintenant",
    official: "Source officielle",
    officialCta: "Ouvrir Alberta Emergency Alert",
    disclaimer:
      "Firebreak n’est pas un système d’alerte officiel. Suivez toujours Alberta Emergency Alert et les autorités locales.",
    notOfficial: "Pas une alerte officielle",
    usingFallback: "Flux en direct indisponibles — données de secours affichées.",
    demoBanner: "Bande démo : complexe de Jasper, 22–24 juillet 2024. Pas en direct.",
    ruralFirst: "Rural et autochtone d’abord",
    about: "Comment fonctionne le modèle",
    close: "Fermer",
    eta: "Durée",
    risk: "Risque de la route",
    reception: "Centres d’accueil",
    noMatch: "Aucune correspondance. Essayez une ville ou un code postal en T.",
    safeAnswer: {
      safe: "Vous n’êtes pas dans la ligne de feu prévue.",
      watch: "Vigilance — un feu est dans votre région.",
      prepare: "Préparez-vous. Faites vos sacs et choisissez une route.",
      leave: "Partez si les autorités l’ordonnent. Suivez Alberta Emergency Alert.",
    },
    doNowByLevel: {
      safe: "Aucune action selon cette prévision. Gardez Alberta Emergency Alert et connaissez deux sorties.",
      watch: "Surveillez les alertes. Faites le plein, préparez les documents, prévenez votre famille.",
      prepare: "Faites vos sacs. Chargez médicaments et animaux. Choisissez une route et un centre d’accueil.",
      leave: "Si l’alerte dit de partir, partez. Prenez la route la moins exposée. Inscrivez-vous au centre d’accueil.",
    },
    happeningByLevel: {
      safe: "Aucun feu cartographié ne se dirige ici. Vent {wind} km/h, humidité {rh} %.",
      watch: "{fires} foyer(s) à portée. Le plus proche à {km} km. Vent {wind} km/h de {dir}°. Humidité {rh} %.",
      prepare: "Le cône prévu se rapproche — {km} km à cette heure. Vent {wind} km/h de {dir}°, humidité {rh} %.",
      leave: "La collectivité est dans ou au bord de la ligne prévue. Vent {wind} km/h de {dir}°.",
    },
    packList: [
      "Pièces d’identité, cartes de statut, assurances, cartes papier",
      "Médicaments, lunettes, ordonnances",
      "Eau, collations, nourriture pour animaux",
      "Vêtements, chargeurs, argent comptant, clés",
      "Enfants, aînés, et voisins qui ont besoin d’un transport",
    ],
    factors: {
      proximityNow: "Distance au feu maintenant",
      proximityForecast: "Distance au cône 24 h",
      windAlignment: "Vent vers la ville",
      dryness: "Air sec et chaud",
      evacuation: "Routes de sortie",
    },
    levels: { safe: "Faible", watch: "Vigilance", prepare: "Préparez-vous", leave: "Partez" },
    skip: "Aller à la carte",
    wind: "Vent",
    humidity: "Humidité",
    languageNote: "",
    lookupCta: "Vérifier ma collectivité",
    sources: "Sources",
  },
  cr: {
    tagline: "wâpahta iskotêw pâmwayês kikiskamâkoyêk.",
    amISafe: "namôya nânitaw cî?",
    searchPlaceholder: "ôtênaw, askiy, postal code",
    enterMap: "masinipayihcikan",
    replayJasper: "Jasper 2024",
    live: "mêkwâc",
    demo: "Jasper",
    communities: "ôtênawa",
    briefing: "âcimowin",
    routes: "mêskanawa",
    hour: "tâpahikan",
    play: "sîtoskaw",
    pause: "pêyâhtik",
    why: "tânêhki ôma",
    pack: "kîkway nayahtamôhk",
    happening: "kîkway ê-ispayik",
    doNow: "kîkway ta-tôtamihk",
    official: "kistêyihtâkwan masinahikan",
    officialCta: "Alberta Emergency Alert",
    disclaimer:
      "Firebreak êkâ official alert. nanâtaw Alberta Emergency Alert nîkân. English is always shown with nêhiyawêwin so meaning cannot get lost. Draft SRO for this hackathon — a language keeper should review before any operational use.",
    notOfficial: "êkâ official",
    usingFallback: "mêkwâc data namôya — cached data.",
    demoBanner: "Jasper iskotêw 22–24 July 2024. namôya mêkwâc.",
    ruralFirst: "nôhcimihk êkwa iyiniwak nîkân",
    about: "tânisi ê-atoskêhk",
    close: "kipaha",
    eta: "tânitahto",
    risk: "mêskanaw risk",
    reception: "nâtawihowikamikwa",
    noMatch: "namôya miskâw. town êkwa T postal code.",
    safeAnswer: {
      safe: "namôya kiyawâw êkotê iskotêw. You are not in the projected fire line.",
      watch: "kanawâpahta. Fire is in your region — watch official alerts.",
      prepare: "nayahta kîkwaya. Pack and pick a road now.",
      leave: "sipwêhtê if officials say go. Follow Alberta Emergency Alert.",
    },
    doNowByLevel: {
      safe: "Keep Alberta Emergency Alert on. Know two roads out.",
      watch: "Watch alerts. Stage documents, fuel, and family plans.",
      prepare: "Pack now. Medicines, pets, elders. Choose a route below.",
      leave: "If the alert says go, sipwêhtê. Take the safest road. Check in at a reception centre.",
    },
    happeningByLevel: {
      safe: "namôya iskotêw ôta. Wind {wind} km/h, humidity {rh}%.",
      watch: "{fires} iskotêw nearby. {km} km. Wind {wind} km/h from {dir}°.",
      prepare: "iskotêw closing in — {km} km. Wind {wind} km/h from {dir}°.",
      leave: "ôtênaw is on the fire line. Wind {wind} km/h from {dir}°.",
    },
    packList: [
      "IDs, status cards, insurance, paper maps",
      "Medicines and glasses",
      "nipiy (water), food, pet food",
      "Clothes, chargers, cash, keys",
      "Children, elders, neighbours who need a ride",
    ],
    factors: {
      proximityNow: "iskotêw now",
      proximityForecast: "24 h cone",
      windAlignment: "yôtin toward town",
      dryness: "pâhkêyâw",
      evacuation: "mêskanawa",
    },
    levels: { safe: "namôya", watch: "kanawâpahta", prepare: "nayahta", leave: "sipwêhtê" },
    skip: "Skip to map",
    wind: "yôtin",
    humidity: "humidity",
    languageNote:
      "nêhiyawêwin (Plains Cree, Standard Roman Orthography). Drafted from public dictionaries for this hackathon; language keepers should review before operational use. English remains on screen so a safety instruction cannot be lost in translation.",
    lookupCta: "nitôtêna",
    sources: "masinahikana",
  },
  pa: {
    tagline: "ਅੱਗ ਦੀ ਲਕੀਰ ਉਸ ਤੋਂ ਪਹਿਲਾਂ ਵੇਖੋ ਜਦੋਂ ਤੱਕ ਉਹ ਤੁਹਾਡੇ ਕੋਲ ਆਵੇ।",
    amISafe: "ਕੀ ਮੈਂ ਸੁਰੱਖਿਅਤ ਹਾਂ?",
    searchPlaceholder: "ਕਸਬਾ, ਭਾਈਚਾਰਾ, ਜਾਂ ਪੋਸਟਲ ਕੋਡ (T0E 1E0)",
    enterMap: "ਲਾਈਵ ਨਕਸ਼ਾ ਖੋਲ੍ਹੋ",
    replayJasper: "ਜੈਸਪਰ 2024 ਮੁੜ ਚਲਾਓ",
    live: "ਲਾਈਵ",
    demo: "ਜੈਸਪਰ",
    communities: "ਭਾਈਚਾਰੇ",
    briefing: "ਬ੍ਰੀਫਿੰਗ",
    routes: "ਨਿਕਲਣ ਦੇ ਰਸਤੇ",
    hour: "ਘੰਟਾ",
    play: "ਪੂਰਵ-ਅਨੁਮਾਨ ਚਲਾਓ",
    pause: "ਰੋਕੋ",
    why: "ਇਹ ਸਕੋਰ ਕਿਉਂ",
    pack: "ਕੀ ਲੈ ਕੇ ਜਾਣਾ ਹੈ",
    happening: "ਕੀ ਹੋ ਰਿਹਾ ਹੈ",
    doNow: "ਹੁਣ ਕੀ ਕਰੀਏ",
    official: "ਅਧਿਕਾਰਤ ਸਰੋਤ",
    officialCta: "Alberta Emergency Alert ਖੋਲ੍ਹੋ",
    disclaimer:
      "Firebreak ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀ ਪ੍ਰਣਾਲੀ ਨਹੀਂ ਹੈ। ਹਮੇਸ਼ਾ Alberta Emergency Alert ਅਤੇ ਸਥਾਨਕ ਅਧਿਕਾਰੀਆਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।",
    notOfficial: "ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀ ਨਹੀਂ",
    usingFallback: "ਲਾਈਵ ਡਾਟਾ ਉਪਲਬਧ ਨਹੀਂ — ਕੈਸ਼ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ।",
    demoBanner: "ਡੈਮੋ: ਜੈਸਪਰ ਅੱਗ, 22–24 ਜੁਲਾਈ 2024। ਲਾਈਵ ਨਹੀਂ।",
    ruralFirst: "ਪੇਂਡੂ ਅਤੇ ਇੰਡੀਜਨਸ ਪਹਿਲਾਂ",
    about: "ਮਾਡਲ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    close: "ਬੰਦ ਕਰੋ",
    eta: "ਸਮਾਂ",
    risk: "ਰਸਤੇ ਦਾ ਖਤਰਾ",
    reception: "ਰਿਸੈਪਸ਼ਨ ਸੈਂਟਰ",
    noMatch: "ਕੋਈ ਮੇਲ ਨਹੀਂ। ਕਸਬਾ ਜਾਂ T ਪੋਸਟਲ ਕੋਡ ਲਿਖੋ।",
    safeAnswer: {
      safe: "ਤੁਸੀਂ ਅਨੁਮਾਨਿਤ ਅੱਗ ਦੀ ਲਕੀਰ ਵਿੱਚ ਨਹੀਂ ਹੋ।",
      watch: "ਨਿਗਰਾਨੀ — ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਅੱਗ ਹੈ।",
      prepare: "ਹੁਣ ਤਿਆਰ ਹੋਵੋ। ਸਾਮਾਨ ਬੰਨ੍ਹੋ ਅਤੇ ਰਸਤਾ ਚੁਣੋ।",
      leave: "ਜੇ ਅਧਿਕਾਰੀ ਕਹਿਣ ਤਾਂ ਨਿਕਲੋ। Alberta Emergency Alert ਵੇਖੋ।",
    },
    doNowByLevel: {
      safe: "ਇਸ ਪੂਰਵ-ਅਨੁਮਾਨ ਤੋਂ ਕੋਈ ਕਾਰਵਾਈ ਨਹੀਂ। Alert ਚਾਲੂ ਰੱਖੋ, ਦੋ ਰਸਤੇ ਯਾਦ ਰੱਖੋ।",
      watch: "ਚੇਤਾਵਨੀਆਂ ਵੇਖੋ। ਪੈਟਰੋਲ ਭਰੋ, ਕਾਗਜ਼ ਤਿਆਰ ਰੱਖੋ, ਪਰਿਵਾਰ ਨੂੰ ਯੋਜਨਾ ਦੱਸੋ।",
      prepare: "ਹੁਣ ਸਾਮਾਨ ਬੰਨ੍ਹੋ। ਦਵਾਈਆਂ ਅਤੇ ਪਾਲਤੂ ਜਾਨਵਰ ਲਓ। ਹੇਠਾਂ ਰਸਤਾ ਚੁਣੋ।",
      leave: "ਜੇ ਚੇਤਾਵਨੀ ਜਾਣ ਲਈ ਕਹੇ, ਤੁਰ ਪਓ। ਸਭ ਤੋਂ ਘੱਟ ਖ਼ਤਰੇ ਵਾਲਾ ਰਸਤਾ ਲਓ।",
    },
    happeningByLevel: {
      safe: "ਇੱਥੇ ਕੋਈ ਅੱਗ ਇਸ ਵੱਲ ਨਹੀਂ ਆ ਰਹੀ। ਹਵਾ {wind} km/h, ਨਮੀ {rh}%.",
      watch: "{fires} ਅੱਗ ਨੇੜੇ। {km} km. ਹਵਾ {wind} km/h, ਦਿਸ਼ਾ {dir}°. ਨਮੀ {rh}%.",
      prepare: "ਅਨੁਮਾਨਿਤ ਅੱਗ ਨੇੜੇ ਆ ਰਹੀ ਹੈ — {km} km. ਹਵਾ {wind} km/h, {dir}°.",
      leave: "ਇਹ ਭਾਈਚਾਰਾ ਅੱਗ ਦੀ ਲਕੀਰ ਵਿੱਚ ਜਾਂ ਕਿਨਾਰੇ ਤੇ ਹੈ. ਹਵਾ {wind} km/h, {dir}°.",
    },
    packList: [
      "ਪਛਾਣ ਪੱਤਰ, ਸਟੇਟਸ ਕਾਰਡ, ਬੀਮਾ, ਕਾਗਜ਼ੀ ਨਕਸ਼ੇ",
      "ਦਵਾਈਆਂ ਅਤੇ ਐਨਕਾਂ",
      "ਪਾਣੀ, ਖਾਣਾ, ਪਾਲਤੂ ਜਾਨਵਰਾਂ ਦਾ ਖਾਣਾ",
      "ਕੱਪੜੇ, ਚਾਰਜਰ, ਨਕਦ, ਚਾਬੀਆਂ",
      "ਬੱਚੇ, ਬਜ਼ੁਰਗ, ਅਤੇ ਗੁਆਂਢੀ ਜਿਨ੍ਹਾਂ ਨੂੰ ਸਵਾਰੀ ਚਾਹੀਦੀ ਹੈ",
    ],
    factors: {
      proximityNow: "ਹੁਣ ਅੱਗ ਤੋਂ ਦੂਰੀ",
      proximityForecast: "24 ਘੰਟੇ ਦੀ ਲਕੀਰ ਤੋਂ ਦੂਰੀ",
      windAlignment: "ਹਵਾ ਕਸਬੇ ਵੱਲ",
      dryness: "ਸੁੱਕੀ ਗਰਮ ਹਵਾ",
      evacuation: "ਨਿਕਲਣ ਦੇ ਰਸਤੇ",
    },
    levels: { safe: "ਘੱਟ", watch: "ਨਿਗਰਾਨੀ", prepare: "ਤਿਆਰੀ", leave: "ਨਿਕਲੋ" },
    skip: "ਨਕਸ਼ੇ ਤੇ ਜਾਓ",
    wind: "ਹਵਾ",
    humidity: "ਨਮੀ",
    languageNote: "",
    lookupCta: "ਮੇਰਾ ਭਾਈਚਾਰਾ ਵੇਖੋ",
    sources: "ਸਰੋਤ",
  },
  tl: {
    tagline: "Makita ang linya ng sunog bago kayo abutan.",
    amISafe: "Ligtas ba ako?",
    searchPlaceholder: "Bayan, komunidad, o postal code (T0E 1E0)",
    enterMap: "Buksan ang live na mapa",
    replayJasper: "I-replay ang Jasper 2024",
    live: "Live",
    demo: "Jasper",
    communities: "Mga komunidad",
    briefing: "Briefing",
    routes: "Mga ruta ng paglikas",
    hour: "Oras",
    play: "Patakbuhin ang forecast",
    pause: "I-pause",
    why: "Bakit ang iskor na ito",
    pack: "Ano ang dalhin",
    happening: "Ano ang nangyayari",
    doNow: "Ano ang gagawin ngayon",
    official: "Opisyal na source",
    officialCta: "Buksan ang Alberta Emergency Alert",
    disclaimer:
      "Hindi opisyal na warning system ang Firebreak. Sundin palagi ang Alberta Emergency Alert at local authorities.",
    notOfficial: "Hindi opisyal na alerto",
    usingFallback: "Walang live na data — cached fallback ang ipinapakita.",
    demoBanner: "Demo: Jasper wildfire, 22–24 Hulyo 2024. Hindi live.",
    ruralFirst: "Rural at Indigenous muna",
    about: "Paano gumagana ang modelo",
    close: "Isara",
    eta: "ETA",
    risk: "Panganib ng ruta",
    reception: "Mga reception centre",
    noMatch: "Walang tugma. Subukan ang pangalan ng bayan o T postal code.",
    safeAnswer: {
      safe: "Wala kayo sa projected na linya ng sunog.",
      watch: "Magbantay — may sunog sa inyong rehiyon.",
      prepare: "Maghanda ngayon. Mag-impake at pumili ng kalsada.",
      leave: "Umalis kung inuutusan ng opisyal. Sundin ang Alberta Emergency Alert.",
    },
    doNowByLevel: {
      safe: "Walang aksyon mula sa forecast na ito. Bukas ang Alert, at alamin ang dalawang daan palabas.",
      watch: "Bantayan ang mga alerto. Mag-gasolina, ihanda ang dokumento, sabihin sa pamilya ang plano.",
      prepare: "Mag-impake ngayon. Dalhin ang gamot at alaga. Pumili ng ruta sa ibaba.",
      leave: "Kung nagsasabing umalis ang alerto, umalis. Piliin ang pinakaligtas na ruta.",
    },
    happeningByLevel: {
      safe: "Walang nakamapang sunog na papalapit. Hangin {wind} km/h, humidity {rh}%.",
      watch: "{fires} sunog sa malapit. {km} km. Hangin {wind} km/h mula {dir}°. Humidity {rh}%.",
      prepare: "Lumalapit ang projected cone — {km} km. Hangin {wind} km/h mula {dir}°.",
      leave: "Nasa loob o gilid ng fire line ang komunidad. Hangin {wind} km/h mula {dir}°.",
    },
    packList: [
      "ID, status cards, insurance, paper maps",
      "Mga gamot at salamin",
      "Tubig, meryenda, pagkain ng alaga",
      "Damit, charger, cash, susi",
      "Mga bata, nakatatanda, at kapitbahay na kailangan ng sagwan",
    ],
    factors: {
      proximityNow: "Layo sa sunog ngayon",
      proximityForecast: "Layo sa 24 oras na cone",
      windAlignment: "Hangin paliko sa bayan",
      dryness: "Tuyot at mainit",
      evacuation: "Mga daan palabas",
    },
    levels: { safe: "Mababa", watch: "Bantayan", prepare: "Maghanda", leave: "Umalis" },
    skip: "Laktawan papunta sa mapa",
    wind: "Hangin",
    humidity: "Humidity",
    languageNote: "",
    lookupCta: "Tingnan ang komunidad ko",
    sources: "Mga source",
  },
  ar: {
    tagline: "شاهد خط النار قبل أن يصل إليك.",
    amISafe: "هل أنا في أمان؟",
    searchPlaceholder: "بلدة أو مجتمع أو رمز بريدي (T0E 1E0)",
    enterMap: "افتح الخريطة المباشرة",
    replayJasper: "إعادة جاسبر 2024",
    live: "مباشر",
    demo: "جاسبر",
    communities: "المجتمعات",
    briefing: "الإحاطة",
    routes: "طرق الإخلاء",
    hour: "ساعة",
    play: "تشغيل التوقع",
    pause: "إيقاف",
    why: "لماذا هذه الدرجة",
    pack: "ماذا تحزم",
    happening: "ماذا يحدث",
    doNow: "ماذا تفعل الآن",
    official: "المصدر الرسمي",
    officialCta: "افتح تنبيه ألبرتا للطوارئ",
    disclaimer:
      "فايربريك ليس نظام تحذير رسمي. اتبع دائمًا تنبيه ألبرتا للطوارئ والسلطات المحلية.",
    notOfficial: "ليس تحذيرًا رسميًا",
    usingFallback: "التغذية المباشرة غير متاحة — نعرض بيانات محفوظة.",
    demoBanner: "عرض تجريبي: حريق جاسبر، 22–24 تموز/يوليو 2024. ليس مباشرًا.",
    ruralFirst: "الريف والمجتمعات الأصلية أولًا",
    about: "كيف يعمل النموذج",
    close: "إغلاق",
    eta: "الوقت",
    risk: "خطر الطريق",
    reception: "مراكز الاستقبال",
    noMatch: "لا توجد نتيجة. جرّب اسم بلدة أو رمزًا بريديًا يبدأ بـ T.",
    safeAnswer: {
      safe: "لست ضمن خط النار المتوقع.",
      watch: "راقب — هناك حريق في منطقتك.",
      prepare: "استعد الآن. احزم أغراضك واختر طريقًا.",
      leave: "غادر إذا أمرت السلطات. اتبع تنبيه ألبرتا للطوارئ.",
    },
    doNowByLevel: {
      safe: "لا إجراء من هذا التوقع. أبقِ التنبيه مفتوحًا واعرف طريقين للخروج.",
      watch: "راقب التنبيهات. عبئ الوقود وجهّز الوثائق وأخبر العائلة بالخطة.",
      prepare: "احزم الآن. خذ الأدوية والحيوانات. اختر طريقًا أدناه.",
      leave: "إذا قال التنبيه اخرج، فاخرج. خذ الطريق الأقل خطرًا وسجّل في مركز الاستقبال.",
    },
    happeningByLevel: {
      safe: "لا حريق مرسوم يتجه إلى هنا. الرياح {wind} كم/س، الرطوبة {rh}%.",
      watch: "{fires} بؤرة حريق قريبة. {km} كم. الرياح {wind} كم/س من {dir}°. الرطوبة {rh}%.",
      prepare: "يقترب المخروط المتوقع — {km} كم. الرياح {wind} كم/س من {dir}°.",
      leave: "المجتمع داخل خط النار أو على حافته. الرياح {wind} كم/س من {dir}°.",
    },
    packList: [
      "الهويات وبطاقات الوضع والتأمين وخرائط ورقية",
      "الأدوية والنظارات",
      "ماء وطعام وطعام الحيوانات",
      "ملابس وشواحن ونقد ومفاتيح",
      "الأطفال وكبار السن والجيران الذين يحتاجون توصيلة",
    ],
    factors: {
      proximityNow: "المسافة إلى الحريق الآن",
      proximityForecast: "المسافة إلى مخروط 24 ساعة",
      windAlignment: "الرياح نحو البلدة",
      dryness: "هواء جاف وحار",
      evacuation: "طرق الخروج",
    },
    levels: { safe: "منخفض", watch: "مراقبة", prepare: "استعد", leave: "غادر" },
    skip: "انتقل إلى الخريطة",
    wind: "الرياح",
    humidity: "الرطوبة",
    languageNote: "",
    lookupCta: "تحقق من مجتمعي",
    sources: "المصادر",
  },
};

export function t(lang: Lang): Messages {
  return messages[lang] ?? messages.en;
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
