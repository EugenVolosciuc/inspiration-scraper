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
};

export default inspirationSources;
