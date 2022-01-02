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
import options from "./options";

require("dotenv").config();

const inspirationSources: {
  [key in InspirationSourceName]: InspirationSource;
} = {
  Awwwards: {
    title: "Awwwards",
    url: "https://www.awwwards.com/",
    handler: awwwards,
    numberOfEntries: options.Awwwards.numOfEntries,
  },
  Lapa: {
    title: "Lapa",
    url: "https://www.lapa.ninja/",
    handler: lapa,
    numberOfEntries: options.Lapa.numOfEntries,
  },
  BestWebsiteGallery: {
    title: "Best Website Gallery",
    url: "https://bestwebsite.gallery/",
    handler: bestwebsitegallery,
    numberOfEntries: options.BestWebsiteGallery.numOfEntries,
  },
  WebDesignInspiration: {
    title: "Web Design Inspiration",
    url: "https://www.webdesign-inspiration.com/",
    handler: webdesigninspiration,
    numberOfEntries: options.WebDesignInspiration.numOfEntries,
  },
  TheFWA: {
    title: "The FWA",
    url: "https://thefwa.com/",
    handler: thefwa,
    numberOfEntries: options.TheFWA.numOfEntries,
  },
  SiteInspire: {
    title: "Site Inspire",
    url: "https://www.siteinspire.com/",
    handler: siteinspire,
    numberOfEntries: options.SiteInspire.numOfEntries,
  },
  OnePageLove: {
    title: "OnePageLove",
    url: "https://onepagelove.com/",
    handler: onepagelove,
    numberOfEntries: options.OnePageLove.numOfEntries,
  },
};

export default inspirationSources;
