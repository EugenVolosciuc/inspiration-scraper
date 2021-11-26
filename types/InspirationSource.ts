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

export interface InspirationSource extends WebsiteInfoBase {
  handler: (page: Page, numberOfEntries?: number) => Promise<WebsiteInfo[]>;
  numberOfEntries?: number;
}
