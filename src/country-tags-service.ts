import { CountryTagsService } from "@textactor/actors-explorer";

export class LocaleCountryTagsService implements CountryTagsService {
  getTags(country: string, lang: string): string[] {
    if (LOCALE_COUNTRY_TAGS[country]) {
      return LOCALE_COUNTRY_TAGS[country][lang];
    }
    return [];
  }
}

const LOCALE_COUNTRY_TAGS: { [country: string]: { [lang: string]: string[] } } =
  {
    md: {
      ro: ["republica moldova", "moldova"],
      ru: [
        "Молдавия",
        "Молдова",
        "Молдовы",
        "Молдовой",
        "Молдову",
        "Молдове",
        "Молдавии",
        "Молдавией",
        "Молдавию"
      ]
    },
    ro: {
      ro: ["românia", "româniei"]
    },
    ru: {
      ru: ["Россия", "РФ", "России", "Российской"]
    },
    bg: {
      bg: ["България", "Българите"]
    },
    in: {
      en: ["India", "Indian", "Indians"]
    },
    it: {
      it: ["Italia", "Italiana", "italiano"]
    },
    cz: {
      cs: ["Česko", "ČR", "Česká", "České", "Česku", "České"]
    },
    hu: {
      hu: [
        "Magyarország",
        "Magyarországot",
        "Magyarországon",
        "magyarországi",
        "Magyarországnak",
        "Magyarországra",
        "Magyarországgal"
      ]
    },
    es: {
      es: ["España", "Español", "Española", "Españoles", "Españolas"],
      mx: ["México", "Mexicano", "Mexicana", "Mexicanos", "Mexicanas"],
      ar: ["Argentina", "Argentino", "Argentina", "Argentinos", "Argentinas"],
      co: [
        "Colombia",
        "Colombiano",
        "Colombiana",
        "Colombianos",
        "Colombianas"
      ],
      pe: ["Perú", "Peruano", "Peruana", "Peruanos", "Peruanas"],
      ve: [
        "Venezuela",
        "Venezolano",
        "Venezolana",
        "Venezolanos",
        "Venezolanas"
      ],
      cl: ["Chile", "Chileno", "Chilena", "Chilenos", "Chilenas"],
      ec: [
        "Ecuador",
        "Ecuatoriano",
        "Ecuatoriana",
        "Ecuatorianos",
        "Ecuatorianas"
      ],
      gt: [
        "Guatemala",
        "Guatemalteco",
        "Guatemalteca",
        "Guatemaltecos",
        "Guatemaltecas"
      ],
      cu: ["Cuba", "Cubano", "Cubana", "Cubanos", "Cubanas"],
      bo: ["Bolivia", "Boliviano", "Boliviana", "Bolivianos", "Bolivianas"],
      do: [
        "República Dominicana",
        "Dominicano",
        "Dominicana",
        "Dominicanos",
        "Dominicanas"
      ],
      hn: ["Honduras", "Hondureño", "Hondureña", "Hondureños", "Hondureñas"],
      py: ["Paraguay", "Paraguayo", "Paraguaya", "Paraguayos", "Paraguayas"],
      sv: [
        "El Salvador",
        "Salvadoreño",
        "Salvadoreña",
        "Salvadoreños",
        "Salvadoreñas"
      ],
      ni: ["Nicaragua", "Nicaragüense", "Nicaragüenses"],
      pr: [
        "Puerto Rico",
        "Puertorriqueño",
        "Puertorriqueña",
        "Puertorriqueños",
        "Puertorriqueñas"
      ],
      uy: ["Uruguay", "Uruguayo", "Uruguaya", "Uruguayos", "Uruguayas"],
      pa: ["Panamá", "Panameño", "Panameña", "Panameños", "Panameñas"],
      cr: ["Costa Rica", "Costarricense", "Costarricenses"],
      gu: [
        "Guinea Ecuatorial",
        "Ecuatoguineano",
        "Ecuatoguineana",
        "Ecuatoguineanos",
        "Ecuatoguineanas"
      ]
    }
  };
