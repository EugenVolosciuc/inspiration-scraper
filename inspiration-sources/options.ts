import { InspirationSourceName } from "../types/InspirationSource";

type SourceOptions = {
  numOfEntries: number;
  websiteIndexes: Array<number> | null;
};

const options: Record<InspirationSourceName, SourceOptions> = {
  Awwwards: {
    numOfEntries: 1,
    websiteIndexes: null,
  },
  BestWebsiteGallery: {
    numOfEntries: 1,
    websiteIndexes: null,
  },
  Lapa: {
    numOfEntries: 1,
    websiteIndexes: null,
  },
  OnePageLove: {
    numOfEntries: 1,
    websiteIndexes: null,
  },
  SiteInspire: {
    numOfEntries: 1,
    websiteIndexes: null,
  },
  TheFWA: {
    numOfEntries: 1,
    websiteIndexes: null,
  },
  WebDesignInspiration: {
    numOfEntries: 1,
    websiteIndexes: null,
  },
};

export default options;
