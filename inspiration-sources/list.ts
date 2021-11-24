import {
  InspirationSource,
  InspirationSourceName,
} from "../types/InspirationSource";
import {
  awwwards,
  bestwebsitegallery,
  lapa,
  webdesigninspiration,
} from "./scraping-handlers";

const inspirationSources: {
  [key in InspirationSourceName]: InspirationSource;
} = {
  Awwwards: {
    title: "Awwwards",
    url: "https://www.awwwards.com/",
    handler: awwwards,
    numberOfEntries: 1,
  },
  Lapa: {
    title: "Lapa",
    url: "https://www.lapa.ninja/",
    handler: lapa,
    numberOfEntries: 1,
  },
  BestWebsiteGallery: {
    title: "Best Website Gallery",
    url: "https://bestwebsite.gallery/",
    handler: bestwebsitegallery,
    numberOfEntries: 0,
  },
  WebDesignInspiration: {
    title: "Web Design Inspiration",
    url: "https://www.webdesign-inspiration.com/",
    handler: webdesigninspiration,
    numberOfEntries: 0,
  },
};

export default inspirationSources;
