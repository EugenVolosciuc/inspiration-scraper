import {
  InspirationSource,
  InspirationSourceName,
} from "../types/InspirationSource";
import { awwwards, lapa } from "./scraping-handlers";

const inspirationSources: {
  [key in InspirationSourceName]: InspirationSource;
} = {
  Awwwards: {
    title: "Awwwards",
    url: "https://www.awwwards.com/",
    handler: awwwards,
    numberOfEntries: 4,
  },
  Lapa: {
    title: "Lapa",
    url: "https://www.lapa.ninja/",
    handler: lapa,
    numberOfEntries: 2,
  },
};

export default inspirationSources;
