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
} from "../../utils/website";
import {
  InspirationSourceName,
  ScrapedWebsiteInfo,
  ScrapingHandler,
  WebsiteInfo,
} from "../../types/InspirationSource";

const maxNumberOfEntries = 12;

/** This function fetches the information of "latest web design" websites from the webdesign-inspiration.com homepage */
const handler: ScrapingHandler = async (
  page,
  numberOfEntries = 1,
  websiteIndexes
) => {
  const usingManualSelection = !!websiteIndexes?.length;
  const tooManyEntriesRequested = usingManualSelection
    ? websiteIndexes.length > maxNumberOfEntries
    : numberOfEntries > maxNumberOfEntries;

  const { url } = inspirationSources.WebDesignInspiration;

  const getWebsiteTileSelector = (num: number) =>
    `.c-gallery .container .row.items .item:nth-of-type(${num})`;

  try {
    if (tooManyEntriesRequested) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.WebDesignInspiration}`
      );
    }

    writeToConsole(
      `Scraping from ${InspirationSourceName.WebDesignInspiration}${
        usingManualSelection ? " using manual indexes" : ""
      }`
    );

    const websites: WebsiteInfo[] = [];

    const scrapeWebsite = async (websiteIndex: number) => {
      // Go to WebDesignInspiration home page after every entry
      await page.goto(url);

      const websiteTileInfo = await page.$eval(
        getWebsiteTileSelector(websiteIndex),
        (element) => ({
          title: element.querySelector(".topinfo .left button")
            ?.textContent as string,
          url: element
            .querySelector(".divimg a.imglink")
            ?.getAttribute("href") as string,
        })
      );

      const scrapedWebsiteInfo: ScrapedWebsiteInfo = {
        title: normalizeWebsiteTitle(websiteTileInfo.title) as string,
        url: getWebsiteDomain(websiteTileInfo.url),
        source: InspirationSourceName.WebDesignInspiration,
      };

      const websiteExistsInDB = await checkWebsiteInDB(scrapedWebsiteInfo);
      if (websiteExistsInDB) {
        writeToConsole(
          `"${scrapedWebsiteInfo.title}" website is already in DB`,
          1
        );
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

    writeToConsole(
      `Finished scraping from ${InspirationSourceName.WebDesignInspiration}`,
      1
    );

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.WebDesignInspiration);

    return [];
  }
};

export default handler;
