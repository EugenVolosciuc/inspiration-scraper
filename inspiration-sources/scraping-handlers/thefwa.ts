import { Page } from "puppeteer";

import inspirationSources from "../list";
import errorHandler from "../../utils/errorHandler";
import loopTimes from "../../utils/loopTimes";
import writeToConsole from "../../utils/writeToConsole";
import {
  getWebsiteDomain,
  normalizeWebsiteTitle,
} from "../../utils/string-manipulations";
import {
  checkWebsiteInDB,
  processScrapedWebsiteInfo,
  scrollToBottomOfPage,
} from "../../utils/website";
import {
  InspirationSource,
  InspirationSourceName,
  ScrapedWebsiteInfo,
  WebsiteInfo,
} from "../../types/InspirationSource";

const maxNumberOfEntries = 15;

const handler: InspirationSource["handler"] = async (
  page: Page,
  numberOfEntries: number = 1
) => {
  const { url } = inspirationSources.TheFWA;

  const websiteTileSelector =
    ".timeline .timeline__element:not(.same) .timeline-case .timeline-case__details__title a";

  try {
    if (numberOfEntries > maxNumberOfEntries) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.TheFWA}`
      );
    }

    writeToConsole(`Scraping from ${InspirationSourceName.TheFWA}`);

    const websites: WebsiteInfo[] = [];

    await page.goto(url);

    await scrollToBottomOfPage(page);
    await page.waitForSelector(websiteTileSelector);

    const websitesTileInfo = await page.$$eval(
      websiteTileSelector,
      (elements) => {
        const tilesInfo = [];

        for (let element of elements) {
          tilesInfo.push({
            title: element.textContent as string,
            innerURL: element.getAttribute("href") as string,
          });
        }

        return tilesInfo;
      }
    );

    // Go through each website `numberOfEntries` times
    await loopTimes(numberOfEntries, async (currentNumber) => {
      await page.goto(url);
      const websiteTileInfo = websitesTileInfo[currentNumber];

      // Go to the selected website's The FWA page
      await page.goto(`${page.url().slice(0, -1)}${websiteTileInfo.innerURL}`);

      await scrollToBottomOfPage(page);
      await page.waitForSelector(".case-single__description__button");

      const websiteURL = await page.$eval(
        ".case-single__description__button:nth-of-type(2)",
        (element) => element.getAttribute("href") as string
      );

      const scrapedWebsiteInfo: ScrapedWebsiteInfo = {
        title: normalizeWebsiteTitle(websiteTileInfo.title) as string,
        url: getWebsiteDomain(websiteURL),
        source: InspirationSourceName.TheFWA,
      };

      const websiteExistsInDB = await checkWebsiteInDB(scrapedWebsiteInfo);
      if (websiteExistsInDB) {
        writeToConsole(
          `"${scrapedWebsiteInfo.title}" website is already in DB`,
          1
        );

        return;
      }

      const websiteInfo = await processScrapedWebsiteInfo(
        page,
        scrapedWebsiteInfo
      );
      websites.push(websiteInfo);
    });

    writeToConsole(`Finished scraping from ${InspirationSourceName.TheFWA}`, 1);

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.TheFWA);

    return [];
  }
};

export default handler;
