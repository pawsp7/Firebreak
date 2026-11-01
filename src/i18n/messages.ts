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
  kicker: string;
  lede: string;
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
  loadRoads: string;
};

export const messages: Record<Lang, Messages> = {
  en: {
    tagline: "See what's ahead, and look after each other.",
    kicker: "Alberta · a calm 24-hour outlook",
    lede:
      "Official maps show where a wildfire was. Firebreak brings live satellite hotspots, wind, and roads together so you can see the next hours and plan with neighbours. Made with rural, Indigenous, and non-English-speaking Albertans in mind. A planning companion — not an official warning.",
    amISafe: "Check in",
    searchPlaceholder: "Town, First Nation, or postal code (T0E 1E0)",
    enterMap: "Open the live map",
    replayJasper: "Replay Jasper 2024",
    live: "Live",
    demo: "Replay",
    communities: "Communities",
    briefing: "For you",
    routes: "Safer roads",
    hour: "Hour",
    play: "Play outlook",
    pause: "Pause",
    why: "How we got this score",
    pack: "Helpful to have with you",
    happening: "What's going on",
    doNow: "A few next steps",
    official: "Official source",
    officialCta: "Open Alberta Emergency Alert",
    disclaimer:
      "Firebreak is a student planning tool, not an official warning. Please follow Alberta Emergency Alert and local authorities — they have the last word.",
    notOfficial: "Not an official warning",
    usingFallback: "Live feeds are taking a pause — showing saved data so you can keep planning.",
    demoBanner: "Practice tape: Jasper Wildfire Complex, 22–24 July 2024. Not live weather.",
    ruralFirst: "Rural & Indigenous first",
    about: "How the model works",
    close: "Close",
    eta: "ETA",
    risk: "How this road looks",
    reception: "Places to check in",
    noMatch: "We couldn't find that place yet. Try a town name or a T postal code.",
    safeAnswer: {
      safe: "This outlook looks quiet for you right now. Please keep official alerts on.",
      watch: "There's fire in the wider region. Stay in touch with official alerts and keep a simple plan handy.",
      prepare: "A good time to pack and agree on a road with the people you care for.",
      leave: "Officials may ask people to go. Please follow Alberta Emergency Alert, and take a calmer road below if you need to leave.",
    },
    doNowByLevel: {
      safe: "Nothing extra from this outlook. Keep Alberta Emergency Alert on, and it helps to know two ways out of town.",
      watch: "Please watch official alerts. If you can, fill the car, set documents aside, and share the plan with family.",
      prepare: "When you're able, pack medicines, pets, and what elders might need. Choose a road and a place to check in so you're not deciding in a rush.",
      leave: "If an official alert asks you to go, please go — you don't need to wait for smoke. Take a quieter road below and check in when you can.",
    },
    happeningByLevel: {
      safe: "No mapped fire is moving toward this community in the next hours. Weather: {wind} km/h wind, {rh}% humidity.",
      watch: "{fires} fire area(s) nearby. Closest about {km} km. Wind {wind} km/h from {dir}°. Humidity {rh}%.",
      prepare: "The forecast spread is getting closer — about {km} km at this hour. Wind {wind} km/h from {dir}°, humidity {rh}%.",
      leave: "This outlook puts the community close to the projected spread. Wind {wind} km/h from {dir}°. Please follow official guidance.",
    },
    packList: [
      "IDs, status cards, insurance, and a paper map",
      "Medications, glasses, and prescriptions",
      "Water, snacks, and food for pets",
      "Clothes, chargers, cash, and keys",
      "A ride for children, elders, and neighbours who might need one",
    ],
    factors: {
      proximityNow: "Distance to fire now",
      proximityForecast: "Distance to 24 h outlook",
      windAlignment: "Wind toward town",
      dryness: "Dry air",
      evacuation: "Road options",
    },
    levels: { safe: "Low", watch: "Stay aware", prepare: "Get ready", leave: "Time to go" },
    skip: "Skip to map",
    wind: "Wind",
    humidity: "Humidity",
    languageNote: "",
    lookupCta: "Check my community",
    sources: "Sources",
    loadRoads: "Choose a community and we'll load roads.",
  },
  fr: {
    tagline: "Voir ce qui s’en vient, et prendre soin les uns des autres.",
    kicker: "Alberta · un aperçu calme des 24 heures",
    lede:
      "Les cartes officielles montrent où un feu de forêt était. Firebreak rassemble satellites, vent et routes pour que vous puissiez voir les prochaines heures et vous organiser avec vos voisins. Pensé pour les Albertains ruraux, autochtones, et ceux qui ne parlent pas anglais. Un outil d’aide — pas un avis officiel.",
    amISafe: "Faire le point",
    searchPlaceholder: "Ville, communauté ou code postal (T0E 1E0)",
    enterMap: "Ouvrir la carte en direct",
    replayJasper: "Rejouer Jasper 2024",
    live: "En direct",
    demo: "Rejeu",
    communities: "Collectivités",
    briefing: "Pour vous",
    routes: "Routes plus calmes",
    hour: "Heure",
    play: "Lire l’aperçu",
    pause: "Pause",
    why: "D’où vient ce score",
    pack: "Utile d’avoir avec soi",
    happening: "Ce qui se passe",
    doNow: "Quelques prochaines étapes",
    official: "Source officielle",
    officialCta: "Ouvrir Alberta Emergency Alert",
    disclaimer:
      "Firebreak est un outil étudiant, pas un avis officiel. Suivez s’il vous plaît Alberta Emergency Alert et les autorités locales — ce sont elles qui ont le dernier mot.",
    notOfficial: "Pas un avis officiel",
    usingFallback: "Les flux en direct font une pause — nous montrons des données enregistrées pour continuer à planifier.",
    demoBanner: "Bande d’exercice : complexe de Jasper, 22–24 juillet 2024. Pas la météo en direct.",
    ruralFirst: "Rural et autochtone d’abord",
    about: "Comment fonctionne le modèle",
    close: "Fermer",
    eta: "Durée",
    risk: "Comment cette route se présente",
    reception: "Lieux d’accueil",
    noMatch: "Nous n’avons pas encore trouvé cet endroit. Essayez une ville ou un code postal en T.",
    safeAnswer: {
      safe: "Cet aperçu est calme pour vous en ce moment. Gardez les alertes officielles ouvertes.",
      watch: "Il y a un feu dans la région. Restez à l’écoute des alertes et gardez un plan simple.",
      prepare: "Bon moment pour faire vos sacs et vous entendre sur une route avec vos proches.",
      leave: "Les autorités peuvent demander de partir. Suivez Alberta Emergency Alert, et prenez une route plus calme ci-dessous si vous devez partir.",
    },
    doNowByLevel: {
      safe: "Rien de plus selon cet aperçu. Gardez Alberta Emergency Alert, et il est utile de connaître deux sorties.",
      watch: "Surveillez s’il vous plaît les alertes. Si vous pouvez, faites le plein, préparez les documents, et partagez le plan avec la famille.",
      prepare: "Quand vous le pouvez, préparez médicaments, animaux, et ce dont les aînés auront besoin. Choisissez une route et un lieu d’accueil pour ne pas décider dans la précipitation.",
      leave: "Si une alerte officielle demande de partir, partez s’il vous plaît — pas besoin d’attendre la fumée. Prenez une route plus calme et inscrivez-vous à l’accueil quand vous le pouvez.",
    },
    happeningByLevel: {
      safe: "Aucun feu cartographié ne se dirige ici pour les prochaines heures. Vent {wind} km/h, humidité {rh} %.",
      watch: "{fires} zone(s) de feu à proximité. La plus proche à environ {km} km. Vent {wind} km/h de {dir}°. Humidité {rh} %.",
      prepare: "La propagation prévue se rapproche — environ {km} km à cette heure. Vent {wind} km/h de {dir}°, humidité {rh} %.",
      leave: "Cet aperçu place la collectivité près de la propagation prévue. Vent {wind} km/h de {dir}°. Suivez s’il vous plaît les consignes officielles.",
    },
    packList: [
      "Pièces d’identité, cartes de statut, assurances, une carte papier",
      "Médicaments, lunettes, ordonnances",
      "Eau, collations, nourriture pour animaux",
      "Vêtements, chargeurs, argent comptant, clés",
      "Une place en voiture pour les enfants, les aînés, et les voisins",
    ],
    factors: {
      proximityNow: "Distance au feu maintenant",
      proximityForecast: "Distance à l’aperçu 24 h",
      windAlignment: "Vent vers la ville",
      dryness: "Air sec",
      evacuation: "Choix de routes",
    },
    levels: { safe: "Faible", watch: "Restez attentifs", prepare: "Préparez-vous", leave: "Moment de partir" },
    skip: "Aller à la carte",
    wind: "Vent",
    humidity: "Humidité",
    languageNote: "",
    lookupCta: "Vérifier ma collectivité",
    sources: "Sources",
    loadRoads: "Choisissez une collectivité et nous chargerons les routes.",
  },
  cr: {
    tagline: "wâpahta kîkway ê-pê-takosihk, êkwa kanawêyihtâk kîc-ayisiyiniwak. See what's ahead, and look after each other.",
    kicker: "Alberta · 24-hour outlook",
    lede:
      "Official maps show where a fire was. Firebreak helps you see the next hours and plan with neighbours. Made with rural and Indigenous families in mind. A planning companion — not an official warning.",
    amISafe: "kakwêcihkê. Check in",
    searchPlaceholder: "ôtênaw, askiy, postal code",
    enterMap: "masinipayihcikan",
    replayJasper: "Jasper 2024",
    live: "mêkwâc",
    demo: "Jasper",
    communities: "ôtênawa",
    briefing: "kiyânaw. For you",
    routes: "miyo-mêskanawa. Safer roads",
    hour: "tâpahikan",
    play: "sîtoskaw",
    pause: "pêyâhtik",
    why: "tânêhki ôma",
    pack: "kîkway ta-nayahtamihk",
    happening: "kîkway ê-ispayik",
    doNow: "kîkway ta-tôtamihk",
    official: "kistêyihtâkwan masinahikan",
    officialCta: "Alberta Emergency Alert",
    disclaimer:
      "Firebreak êkâ official alert. Please follow Alberta Emergency Alert first. English stays with nêhiyawêwin so meaning cannot get lost. Draft SRO for this hackathon — a language keeper should review before any operational use.",
    notOfficial: "êkâ official",
    usingFallback: "Live feeds are pausing — cached data so you can keep planning.",
    demoBanner: "Jasper iskotêw 22–24 July 2024. namôya mêkwâc. Practice tape, not live.",
    ruralFirst: "nôhcimihk êkwa iyiniwak nîkân",
    about: "tânisi ê-atoskêhk",
    close: "kipaha",
    eta: "tânitahto",
    risk: "mêskanaw",
    reception: "nâtawihowikamikwa",
    noMatch: "namôya miskâw yet. Try a town name or T postal code.",
    safeAnswer: {
      safe: "namôya nânitaw ôta. This outlook looks quiet. Please keep official alerts on.",
      watch: "kanawâpahta. Fire is in the wider region — stay with official alerts.",
      prepare: "nayahta kîkwaya. A good time to pack and agree on a road.",
      leave: "sipwêhtê if officials ask. Please follow Alberta Emergency Alert.",
    },
    doNowByLevel: {
      safe: "Keep Alberta Emergency Alert on. It helps to know two roads out.",
      watch: "Please watch alerts. Stage documents, fuel, and the family plan when you can.",
      prepare: "Pack medicines, pets, and what elders might need. Choose a road below.",
      leave: "If the alert asks you to go, please sipwêhtê. Take a quieter road. Check in when you can.",
    },
    happeningByLevel: {
      safe: "namôya iskotêw ê-pê-itohtêk ôta. Wind {wind} km/h, humidity {rh}%.",
      watch: "{fires} iskotêw nearby. About {km} km. Wind {wind} km/h from {dir}°.",
      prepare: "iskotêw getting closer — about {km} km. Wind {wind} km/h from {dir}°.",
      leave: "This outlook puts ôtênaw close to the spread. Wind {wind} km/h from {dir}°. Please follow official guidance.",
    },
    packList: [
      "IDs, status cards, insurance, a paper map",
      "Medicines and glasses",
      "nipiy (water), food, pet food",
      "Clothes, chargers, cash, keys",
      "A ride for children, elders, neighbours",
    ],
    factors: {
      proximityNow: "iskotêw now",
      proximityForecast: "24 h outlook",
      windAlignment: "yôtin toward town",
      dryness: "pâhkêyâw",
      evacuation: "mêskanawa",
    },
    levels: { safe: "namôya", watch: "kanawâpahta", prepare: "nayahta", leave: "sipwêhtê" },
    skip: "Skip to map",
    wind: "yôtin",
    humidity: "humidity",
    languageNote:
      "nêhiyawêwin (Plains Cree, Standard Roman Orthography). Drafted from public dictionaries for this hackathon; language keepers should review before operational use. English stays on screen so a safety instruction cannot be lost in translation.",
    lookupCta: "nitôtêna",
    sources: "masinahikana",
    loadRoads: "Choose a community and we'll load roads.",
  },
  pa: {
    tagline: "ਅੱਗੇ ਕੀ ਆ ਰਿਹਾ ਹੈ ਵੇਖੋ, ਅਤੇ ਇੱਕ ਦੂਜੇ ਦੀ ਸੰਭਾਲ ਕਰੋ।",
    kicker: "ਅਲਬਰਟਾ · ਸ਼ਾਂਤ 24 ਘੰਟੇ ਦੀ ਝਲਕ",
    lede:
      "ਅਧਿਕਾਰਤ ਨਕਸ਼ੇ ਦਿਖਾਉਂਦੇ ਹਨ ਕਿ ਜੰਗਲੀ ਅੱਗ ਕਿੱਥੇ ਸੀ। Firebreak ਉੱਪਗ੍ਰਹਿ, ਹਵਾ ਅਤੇ ਸੜਕਾਂ ਇਕੱਠੀਆਂ ਕਰਦਾ ਹੈ ਤਾਂ ਜੋ ਤੁਸੀਂ ਅਗਲੇ ਘੰਟੇ ਵੇਖ ਸਕੋ ਅਤੇ ਗੁਆਂਢੀਆਂ ਨਾਲ ਯੋਜਨਾ ਬਣਾ ਸਕੋ। ਪੇਂਡੂ, ਇੰਡੀਜਨਸ, ਅਤੇ ਗੈਰ-ਅੰਗਰੇਜ਼ੀ ਬੋਲਣ ਵਾਲੇ ਅਲਬਰਟਨਾਂ ਲਈ। ਇਹ ਮਦਦ ਹੈ — ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀ ਨਹੀਂ।",
    amISafe: "ਪਤਾ ਕਰੋ",
    searchPlaceholder: "ਕਸਬਾ, ਭਾਈਚਾਰਾ, ਜਾਂ ਪੋਸਟਲ ਕੋਡ (T0E 1E0)",
    enterMap: "ਲਾਈਵ ਨਕਸ਼ਾ ਖੋਲ੍ਹੋ",
    replayJasper: "ਜੈਸਪਰ 2024 ਮੁੜ ਚਲਾਓ",
    live: "ਲਾਈਵ",
    demo: "ਜੈਸਪਰ",
    communities: "ਭਾਈਚਾਰੇ",
    briefing: "ਤੁਹਾਡੇ ਲਈ",
    routes: "ਵਧੇਰੇ ਸ਼ਾਂਤ ਰਸਤੇ",
    hour: "ਘੰਟਾ",
    play: "ਝਲਕ ਚਲਾਓ",
    pause: "ਰੋਕੋ",
    why: "ਇਹ ਸਕੋਰ ਕਿਵੇਂ ਬਣਿਆ",
    pack: "ਨਾਲ ਰੱਖਣਾ ਚੰਗਾ ਹੈ",
    happening: "ਕੀ ਹੋ ਰਿਹਾ ਹੈ",
    doNow: "ਕੁਝ ਅਗਲੇ ਕਦਮ",
    official: "ਅਧਿਕਾਰਤ ਸਰੋਤ",
    officialCta: "Alberta Emergency Alert ਖੋਲ੍ਹੋ",
    disclaimer:
      "Firebreak ਵਿਦਿਆਰਥੀ ਯੋਜਨਾ ਸਾਧਨ ਹੈ, ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀ ਨਹੀਂ। ਕਿਰਪਾ ਕਰਕੇ Alberta Emergency Alert ਅਤੇ ਸਥਾਨਕ ਅਧਿਕਾਰੀਆਂ ਦੀ ਪਾਲਣਾ ਕਰੋ — ਆਖਰੀ ਫੈਸਲਾ ਉਨ੍ਹਾਂ ਦਾ ਹੈ।",
    notOfficial: "ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀ ਨਹੀਂ",
    usingFallback: "ਲਾਈਵ ਡਾਟਾ ਥੋੜ੍ਹਾ ਰੁਕਿਆ ਹੈ — ਯੋਜਨਾ ਜਾਰੀ ਰੱਖਣ ਲਈ ਸੰਭਾਲਿਆ ਡਾਟਾ ਵਿਖਾ ਰਹੇ ਹਾਂ।",
    demoBanner: "ਅਭਿਆਸ: ਜੈਸਪਰ ਅੱਗ, 22–24 ਜੁਲਾਈ 2024। ਲਾਈਵ ਮੌਸਮ ਨਹੀਂ।",
    ruralFirst: "ਪੇਂਡੂ ਅਤੇ ਇੰਡੀਜਨਸ ਪਹਿਲਾਂ",
    about: "ਮਾਡਲ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    close: "ਬੰਦ ਕਰੋ",
    eta: "ਸਮਾਂ",
    risk: "ਇਹ ਰਸਤਾ ਕਿਵੇਂ ਲੱਗਦਾ ਹੈ",
    reception: "ਚੈੱਕ-ਇਨ ਥਾਵਾਂ",
    noMatch: "ਅਸੀਂ ਉਹ ਥਾਂ ਹਾਲੇ ਨਹੀਂ ਲੱਭੀ। ਕਸਬਾ ਜਾਂ T ਪੋਸਟਲ ਕੋਡ ਅਜ਼ਮਾਓ।",
    safeAnswer: {
      safe: "ਇਸ ਵੇਲੇ ਇਹ ਝਲਕ ਸ਼ਾਂਤ ਲੱਗਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀਆਂ ਚਾਲੂ ਰੱਖੋ।",
      watch: "ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਅੱਗ ਹੈ। ਚੇਤਾਵਨੀਆਂ ਨਾਲ ਜੁੜੇ ਰਹੋ ਅਤੇ ਇੱਕ ਸਧਾਰਨ ਯੋਜਨਾ ਤਿਆਰ ਰੱਖੋ।",
      prepare: "ਸਾਮਾਨ ਬੰਨ੍ਹਣ ਅਤੇ ਪਰਿਵਾਰ ਨਾਲ ਰਸਤਾ ਤੈਅ ਕਰਨ ਦਾ ਚੰਗਾ ਸਮਾਂ ਹੈ।",
      leave: "ਅਧਿਕਾਰੀ ਜਾਣ ਲਈ ਕਹਿ ਸਕਦੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ Alberta Emergency Alert ਵੇਖੋ, ਅਤੇ ਲੋੜ ਪਏ ਤਾਂ ਹੇਠਾਂ ਦਾ ਸ਼ਾਂਤ ਰਸਤਾ ਲਓ।",
    },
    doNowByLevel: {
      safe: "ਇਸ ਝਲਕ ਤੋਂ ਹੋਰ ਕੁਝ ਨਹੀਂ। Alert ਚਾਲੂ ਰੱਖੋ, ਦੋ ਰਸਤੇ ਯਾਦ ਰੱਖਣਾ ਮਦਦਗਾਰ ਹੈ।",
      watch: "ਕਿਰਪਾ ਕਰਕੇ ਚੇਤਾਵਨੀਆਂ ਵੇਖੋ। ਜੇ ਹੋ ਸਕੇ, ਪੈਟਰੋਲ ਭਰੋ, ਕਾਗਜ਼ ਤਿਆਰ ਰੱਖੋ, ਪਰਿਵਾਰ ਨਾਲ ਯੋਜਨਾ ਸਾਂਝੀ ਕਰੋ।",
      prepare: "ਜਦੋਂ ਹੋ ਸਕੇ, ਦਵਾਈਆਂ, ਪਾਲਤੂ ਜਾਨਵਰ, ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਲਈ ਲੋੜੀਂਦੀਆਂ ਚੀਜ਼ਾਂ ਲਓ। ਰਸਤਾ ਅਤੇ ਚੈੱਕ-ਇਨ ਥਾਂ ਪਹਿਲਾਂ ਚੁਣ ਲਓ।",
      leave: "ਜੇ ਅਧਿਕਾਰਤ ਚੇਤਾਵਨੀ ਜਾਣ ਲਈ ਕਹੇ, ਕਿਰਪਾ ਕਰਕੇ ਤੁਰ ਪਓ — ਧੂੰਏਂ ਦੀ ਉਡੀਕ ਲੋੜ ਨਹੀਂ। ਸ਼ਾਂਤ ਰਸਤਾ ਲਓ ਅਤੇ ਜਦੋਂ ਹੋ ਸਕੇ ਚੈੱਕ-ਇਨ ਕਰੋ।",
    },
    happeningByLevel: {
      safe: "ਅਗਲੇ ਘੰਟਿਆਂ ਵਿੱਚ ਇੱਥੇ ਕੋਈ ਨਕਸ਼ੇ ਵਾਲੀ ਅੱਗ ਇਸ ਵੱਲ ਨਹੀਂ ਆ ਰਹੀ। ਹਵਾ {wind} km/h, ਨਮੀ {rh}%.",
      watch: "{fires} ਅੱਗ ਖੇਤਰ ਨੇੜੇ। ਸਭ ਤੋਂ ਨੇੜੇ ਲਗਭਗ {km} km. ਹਵਾ {wind} km/h, ਦਿਸ਼ਾ {dir}°. ਨਮੀ {rh}%.",
      prepare: "ਅਨੁਮਾਨਿਤ ਫੈਲਾਅ ਨੇੜੇ ਆ ਰਿਹਾ ਹੈ — ਲਗਭਗ {km} km. ਹਵਾ {wind} km/h, {dir}°.",
      leave: "ਇਹ ਝਲਕ ਭਾਈਚਾਰੇ ਨੂੰ ਅਨੁਮਾਨਿਤ ਫੈਲਾਅ ਦੇ ਨੇੜੇ ਰੱਖਦੀ ਹੈ. ਹਵਾ {wind} km/h, {dir}°. ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਤ ਸੇਧ ਵੇਖੋ.",
    },
    packList: [
      "ਪਛਾਣ ਪੱਤਰ, ਸਟੇਟਸ ਕਾਰਡ, ਬੀਮਾ, ਕਾਗਜ਼ੀ ਨਕਸ਼ਾ",
      "ਦਵਾਈਆਂ ਅਤੇ ਐਨਕਾਂ",
      "ਪਾਣੀ, ਖਾਣਾ, ਪਾਲਤੂ ਜਾਨਵਰਾਂ ਦਾ ਖਾਣਾ",
      "ਕੱਪੜੇ, ਚਾਰਜਰ, ਨਕਦ, ਚਾਬੀਆਂ",
      "ਬੱਚਿਆਂ, ਬਜ਼ੁਰਗਾਂ, ਅਤੇ ਗੁਆਂਢੀਆਂ ਲਈ ਸਵਾਰੀ",
    ],
    factors: {
      proximityNow: "ਹੁਣ ਅੱਗ ਤੋਂ ਦੂਰੀ",
      proximityForecast: "24 ਘੰਟੇ ਦੀ ਝਲਕ ਤੋਂ ਦੂਰੀ",
      windAlignment: "ਹਵਾ ਕਸਬੇ ਵੱਲ",
      dryness: "ਸੁੱਕੀ ਹਵਾ",
      evacuation: "ਰਸਤਿਆਂ ਦੀ ਚੋਣ",
    },
    levels: { safe: "ਘੱਟ", watch: "ਸਾਵਧਾਨ", prepare: "ਤਿਆਰੀ", leave: "ਜਾਣ ਦਾ ਸਮਾਂ" },
    skip: "ਨਕਸ਼ੇ ਤੇ ਜਾਓ",
    wind: "ਹਵਾ",
    humidity: "ਨਮੀ",
    languageNote: "",
    lookupCta: "ਮੇਰਾ ਭਾਈਚਾਰਾ ਵੇਖੋ",
    sources: "ਸਰੋਤ",
    loadRoads: "ਭਾਈਚਾਰਾ ਚੁਣੋ, ਅਸੀਂ ਰਸਤੇ ਲਿਆਵਾਂਗੇ।",
  },
  tl: {
    tagline: "Tingnan kung ano ang paparating, at alagaan ang isa't isa.",
    kicker: "Alberta · mahinahong 24-oras na outlook",
    lede:
      "Ipinapakita ng opisyal na mapa kung nasaan ang sunog. Pinagsasama ng Firebreak ang satellite, hangin, at mga kalsada para makita ninyo ang susunod na oras at makapagplano kasama ang kapitbahay. Para sa rural, Indigenous, at hindi English na Albertan. Kasama sa pagplano — hindi opisyal na babala.",
    amISafe: "Tumingin muna",
    searchPlaceholder: "Bayan, komunidad, o postal code (T0E 1E0)",
    enterMap: "Buksan ang live na mapa",
    replayJasper: "I-replay ang Jasper 2024",
    live: "Live",
    demo: "Jasper",
    communities: "Mga komunidad",
    briefing: "Para sa inyo",
    routes: "Mas tahimik na daan",
    hour: "Oras",
    play: "Patakbuhin ang outlook",
    pause: "I-pause",
    why: "Paano nakuha ang iskor",
    pack: "Mabuting isama",
    happening: "Ano ang nangyayari",
    doNow: "Ilang susunod na hakbang",
    official: "Opisyal na source",
    officialCta: "Buksan ang Alberta Emergency Alert",
    disclaimer:
      "Kasangkapan sa pagplano ng estudyante ang Firebreak, hindi opisyal na babala. Pakisunod ang Alberta Emergency Alert at local authorities — sila ang may huling salita.",
    notOfficial: "Hindi opisyal na alerto",
    usingFallback: "Nagpapahinga ang live na data — naka-save na data ang ipinapakita para makapagpatuloy kayo sa plano.",
    demoBanner: "Practice tape: Jasper wildfire, 22–24 Hulyo 2024. Hindi live na panahon.",
    ruralFirst: "Rural at Indigenous muna",
    about: "Paano gumagana ang modelo",
    close: "Isara",
    eta: "ETA",
    risk: "Paano ang daang ito",
    reception: "Mga lugar para mag-check in",
    noMatch: "Hindi pa namin nahanap iyon. Subukan ang pangalan ng bayan o T postal code.",
    safeAnswer: {
      safe: "Tahimik ang outlook para sa inyo ngayon. Pakitiyak na naka-on ang opisyal na alerto.",
      watch: "May sunog sa mas malawak na rehiyon. Manatiling konektado sa mga alerto at maghanda ng simpleng plano.",
      prepare: "Magandang oras mag-impake at magkasundo sa daan kasama ang minamahal ninyo.",
      leave: "Maaaring paalisin kayo ng opisyal. Pakisunod ang Alberta Emergency Alert, at kunin ang mas tahimik na daan sa ibaba kung kailangan umalis.",
    },
    doNowByLevel: {
      safe: "Wala nang dagdag mula sa outlook na ito. Bukas ang Alert, at nakakatulong malaman ang dalawang daan palabas.",
      watch: "Pakisubaybayan ang mga alerto. Kung maaari, mag-gasolina, ihanda ang dokumento, at ibahagi ang plano sa pamilya.",
      prepare: "Kapag kaya, ihanda ang gamot, alaga, at kailangan ng mga nakatatanda. Pumili ng daan at check-in para hindi kayo magmadali sa desisyon.",
      leave: "Kung humihingi ang opisyal na alerto na umalis, paki-alis — hindi kailangang hintayin ang usok. Kumuha ng mas tahimik na daan at mag-check in kapag maaari.",
    },
    happeningByLevel: {
      safe: "Walang nakamapang sunog na papalapit sa susunod na oras. Hangin {wind} km/h, humidity {rh}%.",
      watch: "{fires} lugar ng sunog sa malapit. Pinakamalapit mga {km} km. Hangin {wind} km/h mula {dir}°. Humidity {rh}%.",
      prepare: "Lumalapit ang forecast na pagkalat — mga {km} km. Hangin {wind} km/h mula {dir}°.",
      leave: "Inilalagay ng outlook ang komunidad malapit sa projected na pagkalat. Hangin {wind} km/h mula {dir}°. Pakisunod ang opisyal na gabay.",
    },
    packList: [
      "ID, status cards, insurance, paper map",
      "Mga gamot at salamin",
      "Tubig, meryenda, pagkain ng alaga",
      "Damit, charger, cash, susi",
      "Sakay para sa mga bata, nakatatanda, at kapitbahay",
    ],
    factors: {
      proximityNow: "Layo sa sunog ngayon",
      proximityForecast: "Layo sa 24 oras na outlook",
      windAlignment: "Hangin patungo sa bayan",
      dryness: "Tuyot na hangin",
      evacuation: "Mga pwedeng daan",
    },
    levels: { safe: "Mababa", watch: "Maging alerto", prepare: "Maghanda", leave: "Oras na umalis" },
    skip: "Laktawan papunta sa mapa",
    wind: "Hangin",
    humidity: "Humidity",
    languageNote: "",
    lookupCta: "Tingnan ang komunidad ko",
    sources: "Mga source",
    loadRoads: "Pumili ng komunidad at ilo-load namin ang mga daan.",
  },
  ar: {
    tagline: "انظروا ما هو قادم، واعتنوا ببعضكم.",
    kicker: "ألبرتا · نظرة هادئة على 24 ساعة",
    lede:
      "الخرائط الرسمية تُظهر أين كان حريق الغابة. يجمع فايربريك الأقمار والرياح والطرق لتروا الساعات القادمة وتخططوا مع الجيران. صُمم مع العائلات الريفية والأصلية وغير الناطقة بالإنجليزية في ألبرتا. رفيق للتخطيط — وليس تحذيرًا رسميًا.",
    amISafe: "اطمئنّوا",
    searchPlaceholder: "بلدة أو مجتمع أو رمز بريدي (T0E 1E0)",
    enterMap: "افتح الخريطة المباشرة",
    replayJasper: "إعادة جاسبر 2024",
    live: "مباشر",
    demo: "جاسبر",
    communities: "المجتمعات",
    briefing: "لكم",
    routes: "طرق أكثر هدوءًا",
    hour: "ساعة",
    play: "تشغيل النظرة",
    pause: "إيقاف",
    why: "كيف وصلنا إلى هذه الدرجة",
    pack: "من المفيد اصطحابه",
    happening: "ماذا يجري",
    doNow: "خطوات تالية قليلة",
    official: "المصدر الرسمي",
    officialCta: "افتح تنبيه ألبرتا للطوارئ",
    disclaimer:
      "فايربريك أداة تخطيط طلابية، وليس تحذيرًا رسميًا. يُرجى اتباع تنبيه ألبرتا للطوارئ والسلطات المحلية — لهم الكلمة الأخيرة.",
    notOfficial: "ليس تحذيرًا رسميًا",
    usingFallback: "التغذية المباشرة في استراحة — نعرض بيانات محفوظة لتواصلوا التخطيط.",
    demoBanner: "شريط تمرين: حريق جاسبر، 22–24 تموز/يوليو 2024. ليست الطقس المباشر.",
    ruralFirst: "الريف والمجتمعات الأصلية أولًا",
    about: "كيف يعمل النموذج",
    close: "إغلاق",
    eta: "الوقت",
    risk: "كيف يبدو هذا الطريق",
    reception: "أماكن للتسجيل",
    noMatch: "لم نجد هذا المكان بعد. جرّبوا اسم بلدة أو رمزًا بريديًا يبدأ بـ T.",
    safeAnswer: {
      safe: "هذه النظرة هادئة لكم الآن. يُرجى إبقاء التنبيهات الرسمية مفتوحة.",
      watch: "هناك حريق في المنطقة الأوسع. ابقوا على تواصل مع التنبيهات واحتفظوا بخطة بسيطة.",
      prepare: "وقت مناسب لتحزيم الأغراض والاتفاق على طريق مع من تحبون.",
      leave: "قد تطلب السلطات المغادرة. يُرجى اتباع تنبيه ألبرتا للطوارئ، وخذوا طريقًا أكثر هدوءًا أدناه إن احتجتم للمغادرة.",
    },
    doNowByLevel: {
      safe: "لا شيء إضافي من هذه النظرة. أبقوا التنبيه مفتوحًا، ومن المفيد معرفة طريقين للخروج.",
      watch: "يُرجى مراقبة التنبيهات. إن قدرتم، عبّئوا الوقود وجهّزوا الوثائق وشاركوا الخطة مع العائلة.",
      prepare: "عندما تقدرون، جهّزوا الأدوية والحيوانات وما قد يحتاجه كبار السن. اختاروا طريقًا ومكان تسجيل حتى لا تقرروا على عجل.",
      leave: "إذا طلب التنبيه الرسمي المغادرة، يُرجى المغادرة — لا حاجة لانتظار الدخان. خذوا طريقًا أهدأ وسجّلوا عندما تقدرون.",
    },
    happeningByLevel: {
      safe: "لا حريق مرسوم يتجه إلى هنا في الساعات القادمة. الرياح {wind} كم/س، الرطوبة {rh}%.",
      watch: "{fires} منطقة حريق قريبة. الأقرب نحو {km} كم. الرياح {wind} كم/س من {dir}°. الرطوبة {rh}%.",
      prepare: "الانتشار المتوقع يقترب — نحو {km} كم. الرياح {wind} كم/س من {dir}°.",
      leave: "تضع هذه النظرة المجتمع قرب الانتشار المتوقع. الرياح {wind} كم/س من {dir}°. يُرجى اتباع التوجيه الرسمي.",
    },
    packList: [
      "الهويات وبطاقات الوضع والتأمين وخريطة ورقية",
      "الأدوية والنظارات",
      "ماء وطعام وطعام الحيوانات",
      "ملابس وشواحن ونقد ومفاتيح",
      "مقعد في السيارة للأطفال وكبار السن والجيران",
    ],
    factors: {
      proximityNow: "المسافة إلى الحريق الآن",
      proximityForecast: "المسافة إلى نظرة 24 ساعة",
      windAlignment: "الرياح نحو البلدة",
      dryness: "هواء جاف",
      evacuation: "خيارات الطريق",
    },
    levels: { safe: "منخفض", watch: "ابقوا متنبهين", prepare: "استعدوا", leave: "وقت المغادرة" },
    skip: "انتقل إلى الخريطة",
    wind: "الرياح",
    humidity: "الرطوبة",
    languageNote: "",
    lookupCta: "تحقق من مجتمعي",
    sources: "المصادر",
    loadRoads: "اختاروا مجتمعًا وسنحمّل الطرق.",
  },
};

export function t(lang: Lang): Messages {
  return messages[lang] ?? messages.en;
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
