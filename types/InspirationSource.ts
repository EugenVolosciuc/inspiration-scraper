import { Page } from "puppeteer";

import { Color } from "./Color";

interface WebsiteInfoBase {
  title: string;
  url: string;
}

export enum InspirationSourceName {
  Awwwards = "Awwwards",
  Lapa = "Lapa",
  BestWebsiteGallery = "BestWebsiteGallery",
  WebDesignInspiration = "WebDesignInspiration",
  TheFWA = "TheFWA",
  SiteInspire = "SiteInspire",
  OnePageLove = "OnePageLove",
}

export const inspirationSourceNames: InspirationSourceName[] = Object.values(
  InspirationSourceName
);

export interface ScrapedWebsiteInfo extends WebsiteInfoBase {
  source: InspirationSourceName;
}

export interface WebsiteInfo extends ScrapedWebsiteInfo {
  colors: Color[];
}

export type ScrapingHandler = (
  page: Page,
  numberOfEntries?: number,
  websiteIndexes?: Array<number> | null
) => Promise<WebsiteInfo[]>;

export interface InspirationSource extends WebsiteInfoBase {
  handler: ScrapingHandler;
  numberOfEntries?: number;
}
