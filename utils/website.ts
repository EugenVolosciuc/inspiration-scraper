import { Page } from "puppeteer";
import { getRepository } from "typeorm";
import path from "path";
import fs from "fs-extra";

import { Website } from "../db/entities/Website";
import { ScrapedWebsiteInfo, WebsiteInfo } from "../types/InspirationSource";
import writeToConsole from "./writeToConsole";
import {
  createBlankArticle,
  articlesFolderPath,
  generateContentTitle,
  articleExtension,
  generateBlogIntro,
  generateContentSummary,
  generatePeriodDescription,
  generateWebsiteEntries,
  generateEndingContent,
  getColorSchemeFromImage,
} from "./article";
import { titleToFileName } from "./string-manipulations";

export const takeHeroAreaScreenshot = async (page: Page, fileTitle: string) => {
  // TODO: create folder for article image
  const screenshot = await page.screenshot({
    path: `./assets/screenshots/${titleToFileName(fileTitle)}.png`,
  });
  writeToConsole(`Took screenshot of ${fileTitle}`, 1);

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

  writeToConsole(`Added ${website.title} website to DB`, 1);

  return website;
};

export const processScrapedWebsiteInfo = async (
  page: Page,
  scrapedWebsiteInfo: ScrapedWebsiteInfo
): Promise<WebsiteInfo> => {
  await saveWebsiteToDB(scrapedWebsiteInfo);
  await page.goto(scrapedWebsiteInfo.url, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(8000); // Page might have animations, wait for a little bit
  const screenshot = await takeHeroAreaScreenshot(
    page,
    scrapedWebsiteInfo.title
  );
  const colors = await getColorSchemeFromImage(screenshot);

  return {
    ...scrapedWebsiteInfo,
    colors,
  };
};

export const generateArticle = async (websites: WebsiteInfo[]) => {
  try {
    writeToConsole("Generating article");
    const fileTitle = await createBlankArticle();
    const filePath = path.join(
      articlesFolderPath,
      `${fileTitle}${articleExtension}`
    );

    // Append article title
    await fs.appendFile(filePath, generateContentTitle(fileTitle));

    // Append article intro
    await fs.appendFile(filePath, generateBlogIntro());

    // Append article summary
    await fs.appendFile(filePath, generateContentSummary(websites));

    // Append period description
    await fs.appendFile(filePath, generatePeriodDescription());

    // Append websites
    await fs.appendFile(filePath, generateWebsiteEntries(websites));

    // Append ending content
    await fs.appendFile(filePath, generateEndingContent());
  } catch (error) {
    writeToConsole("Failed to generate article");
    console.log(error);
  }
};
