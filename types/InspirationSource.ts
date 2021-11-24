import { Page } from "puppeteer";

interface WebsiteInfoBase {
  title: string;
  url: string;
}

export enum InspirationSourceName {
  Awwwards = "Awwwards",
  Lapa = "Lapa",
  BestWebsiteGallery = "BestWebsiteGallery",
  WebDesignInspiration = "WebDesignInspiration",
}

export const inspirationSourceNames: InspirationSourceName[] = Object.values(
  InspirationSourceName
);

export interface ScrapedWebsiteInfo extends WebsiteInfoBase {
  source: InspirationSourceName;
}

export interface InspirationSource extends WebsiteInfoBase {
  handler: (
    page: Page,
    numberOfEntries?: number
  ) => Promise<ScrapedWebsiteInfo[]>;
  numberOfEntries?: number;
}
