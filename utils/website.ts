import { Page } from "puppeteer";
import { getRepository } from "typeorm";
import fs from "fs-extra";
import dayjs from "dayjs";
import path from "path";

import { Website } from "../db/entities/Website";
import { ScrapedWebsiteInfo } from "../types/InspirationSource";
import writeToConsole from "./writeToConsole";

const articleTitleBase = "Web Design Inspiration for";

const getPartOfMonth = () => {
  const articlesPerMonth = parseInt(
    process.env.ARTICLES_PER_MONTH as string,
    10
  );
  const now = dayjs();
  const daysInMonth = now.daysInMonth();
  const currentDate = now.date();

  return Math.ceil(currentDate / Math.floor(daysInMonth / articlesPerMonth));
};

const createBlankArticle = async () => {
  const partOfMonth = getPartOfMonth();
  const fileTitle = `${articleTitleBase} ${dayjs().format(
    "MMMM YYYY"
  )} - Part ${partOfMonth}`;

  const articlePath = path.join(
    __dirname,
    "..",
    "assets",
    "articles",
    `${fileTitle}.md`
  );

  await fs.writeFile(articlePath, "", {
    flag: "w+",
  });
};

export const takeHeroAreaScreenshot = async (page: Page, fileTitle: string) => {
  const screenshot = await page.screenshot({
    path: `./assets/screenshots/${fileTitle}.png`,
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
) => {
  await saveWebsiteToDB(scrapedWebsiteInfo);
  await page.goto(scrapedWebsiteInfo.url, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(8000); // Page might have animations, wait for a little bit
  await takeHeroAreaScreenshot(page, scrapedWebsiteInfo.title);
  // TODO: generate color scheme
};

export const generateArticle = async (websites: ScrapedWebsiteInfo[]) => {
  try {
    writeToConsole("Generating article");
    await createBlankArticle();
  } catch (error) {
    writeToConsole("Failed to generate article");
    console.log(error);
  }
};
