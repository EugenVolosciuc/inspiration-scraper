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

require("dotenv").config();

const inspirationSources: {
  [key in InspirationSourceName]: InspirationSource;
} = {
  Awwwards: {
    title: "Awwwards",
    url: "https://www.awwwards.com/",
    handler: awwwards,
    numberOfEntries: parseInt(
      process.env.AWWWARDS_NUM_OF_ENTRIES as string,
      10
    ),
  },
  Lapa: {
    title: "Lapa",
    url: "https://www.lapa.ninja/",
    handler: lapa,
    numberOfEntries: parseInt(process.env.LAPA_NUM_OF_ENTRIES as string, 10),
  },
  BestWebsiteGallery: {
    title: "Best Website Gallery",
    url: "https://bestwebsite.gallery/",
    handler: bestwebsitegallery,
    numberOfEntries: parseInt(
      process.env.BESTWEBSITEGALLERY_NUM_OF_ENTRIES as string,
      10
    ),
  },
  WebDesignInspiration: {
    title: "Web Design Inspiration",
    url: "https://www.webdesign-inspiration.com/",
    handler: webdesigninspiration,
    numberOfEntries: parseInt(
      process.env.WEBDESIGNINSPIRATION_NUM_OF_ENTRIES as string,
      10
    ),
  },
  TheFWA: {
    title: "The FWA",
    url: "https://thefwa.com/",
    handler: thefwa,
    numberOfEntries: parseInt(process.env.THEFWA_NUM_OF_ENTRIES as string, 10),
  },
  SiteInspire: {
    title: "Site Inspire",
    url: "https://www.siteinspire.com/",
    handler: siteinspire,
    numberOfEntries: parseInt(
      process.env.SITEINSPIRE_NUM_OF_ENTRIES as string,
      10
    ),
  },
  OnePageLove: {
    title: "OnePageLove",
    url: "https://onepagelove.com/",
    handler: onepagelove,
    numberOfEntries: parseInt(
      process.env.ONEPAGELOVE_NUM_OF_ENTRIES as string,
      10
    ),
  },
};

export default inspirationSources;
