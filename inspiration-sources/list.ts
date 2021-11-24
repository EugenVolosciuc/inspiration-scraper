import {
  InspirationSource,
  InspirationSourceName,
} from "../types/InspirationSource";
import { awwwards, bestwebsitegallery, lapa } from "./scraping-handlers";

const inspirationSources: {
  [key in InspirationSourceName]: InspirationSource;
} = {
  Awwwards: {
    title: "Awwwards",
    url: "https://www.awwwards.com/",
    handler: awwwards,
    numberOfEntries: 2,
  },
  Lapa: {
    title: "Lapa",
    url: "https://www.lapa.ninja/",
    handler: lapa,
    numberOfEntries: 2,
  },
  BestWebsiteGallery: {
    title: "Best Website Gallery",
    url: "https://bestwebsite.gallery/",
    handler: bestwebsitegallery,
    numberOfEntries: 3,
  },
};

export default inspirationSources;
