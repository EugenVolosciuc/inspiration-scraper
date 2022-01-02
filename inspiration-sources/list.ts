import {
  InspirationSource,
  InspirationSourceName,
} from "../types/InspirationSource";
import {
  awwwards,
  bestwebsitegallery,
  lapa,
  webdesigninspiration,
  thefwa,
  siteinspire,
  onepagelove,
} from "./scraping-handlers";
import { sourceOptions } from "./options";

require("dotenv").config();

const inspirationSources: {
  [key in InspirationSourceName]: InspirationSource;
} = {
  Awwwards: {
    title: "Awwwards",
    url: "https://www.awwwards.com/",
    handler: awwwards,
    numberOfEntries: sourceOptions.Awwwards.numOfEntries,
  },
  Lapa: {
    title: "Lapa",
    url: "https://www.lapa.ninja/",
    handler: lapa,
    numberOfEntries: sourceOptions.Lapa.numOfEntries,
  },
  BestWebsiteGallery: {
    title: "Best Website Gallery",
    url: "https://bestwebsite.gallery/",
    handler: bestwebsitegallery,
    numberOfEntries: sourceOptions.BestWebsiteGallery.numOfEntries,
  },
  WebDesignInspiration: {
    title: "Web Design Inspiration",
    url: "https://www.webdesign-inspiration.com/",
    handler: webdesigninspiration,
    numberOfEntries: sourceOptions.WebDesignInspiration.numOfEntries,
  },
  TheFWA: {
    title: "The FWA",
    url: "https://thefwa.com/",
    handler: thefwa,
    numberOfEntries: sourceOptions.TheFWA.numOfEntries,
  },
  SiteInspire: {
    title: "Site Inspire",
    url: "https://www.siteinspire.com/",
    handler: siteinspire,
    numberOfEntries: sourceOptions.SiteInspire.numOfEntries,
  },
  OnePageLove: {
    title: "OnePageLove",
    url: "https://onepagelove.com/",
    handler: onepagelove,
    numberOfEntries: sourceOptions.OnePageLove.numOfEntries,
  },
};

export default inspirationSources;
