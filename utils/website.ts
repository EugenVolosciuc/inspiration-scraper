import { Page } from "puppeteer";
import { getRepository } from "typeorm";

import { Website } from "../db/entities/Website";
import { ScrapedWebsiteInfo } from "../types/InspirationSource";
import writeToConsole from "./writeToConsole";

export const takeHeroAreaScreenshot = async (page: Page, fileTitle: string) => {
  // NOTE: when image will be saved to remote storage, remove the path key below
  const screenshot = await page.screenshot({
    path: `./assets/${fileTitle}.png`,
  });
  writeToConsole(`Took screenshot of ${fileTitle}`);

  return screenshot;
};

export const checkWebsiteInDB = async ({ title, url }: ScrapedWebsiteInfo) => {
  const websiteRepository = getRepository(Website);

  const website = await websiteRepository.findOne({ url, title });

  return !!website;
};

export const saveWebsiteToDB = async (
  scrapedWebsiteInfo: ScrapedWebsiteInfo
) => {
  const websiteRepository = getRepository(Website);

  const websiteInstance = websiteRepository.create(scrapedWebsiteInfo);
  const website = await websiteRepository.save(websiteInstance);

  writeToConsole(`Added ${website.title} website to DB`);

  return website;
};

export const processScrapedWebsiteInfo = async (
  page: Page,
  scrapedWebsiteInfo: ScrapedWebsiteInfo
) => {
  await saveWebsiteToDB(scrapedWebsiteInfo);
  await page.goto(scrapedWebsiteInfo.url, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(8000); // Page might have animations, wait for a little bit
  const screenshot = await takeHeroAreaScreenshot(
    page,
    scrapedWebsiteInfo.title
  );
  // TODO: generate color scheme
};
