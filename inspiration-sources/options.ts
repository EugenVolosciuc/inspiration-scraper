import { InspirationSourceName } from "../types/InspirationSource";

type SourceOptions = {
  numOfEntries: number;
  websiteIndexes: Array<number> | null;
};

export const colorsInPalette = 5;

export const articlesPerMonth = 2;

export const sourceOptions: Record<InspirationSourceName, SourceOptions> = {
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
