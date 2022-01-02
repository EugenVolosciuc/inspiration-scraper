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
  InspirationSourceName,
  ScrapedWebsiteInfo,
  ScrapingHandler,
  WebsiteInfo,
} from "../../types/InspirationSource";

const maxNumberOfEntries = 15;

const handler: ScrapingHandler = async (
  page,
  numberOfEntries = 1,
  websiteIndexes
) => {
  const usingManualSelection = !!websiteIndexes?.length;
  const tooManyEntriesRequested = usingManualSelection
    ? websiteIndexes.length > maxNumberOfEntries
    : numberOfEntries > maxNumberOfEntries;

  const { url } = inspirationSources.TheFWA;

  const websiteTileSelector =
    ".timeline .timeline__element:not(.same) .timeline-case .timeline-case__details__title a";

  try {
    if (tooManyEntriesRequested) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.TheFWA}`
      );
    }

    writeToConsole(
      `Scraping from ${InspirationSourceName.TheFWA}${
        usingManualSelection ? " using manual indexes" : ""
      }`
    );

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

    const scrapeWebsite = async (websiteIndex: number) => {
      await page.goto(url);
      const websiteTileInfo = websitesTileInfo[websiteIndex];

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
    };

    if (usingManualSelection) {
      for (let i = 0; i < websiteIndexes?.length; i++) {
        await scrapeWebsite(websiteIndexes[i]);
      }
    } else {
      // Go through each website `numberOfEntries` times
      await loopTimes(numberOfEntries, async (currentNumber) => {
        await scrapeWebsite(currentNumber);
      });
    }

    writeToConsole(`Finished scraping from ${InspirationSourceName.TheFWA}`, 1);

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.TheFWA);

    return [];
  }
};

export default handler;
