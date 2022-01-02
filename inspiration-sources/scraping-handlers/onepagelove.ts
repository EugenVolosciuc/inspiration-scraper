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

const maxNumberOfEntries = 6;

/** This function fetches the information of "LATEST WEBSITE INSPIRATIONs" websites from the onepagelove.com homepage */
const handler: ScrapingHandler = async (
  page,
  numberOfEntries = 1,
  websiteIndexes
) => {
  const usingManualSelection = !!websiteIndexes?.length;
  const tooManyEntriesRequested = usingManualSelection
    ? websiteIndexes.length > maxNumberOfEntries
    : numberOfEntries > maxNumberOfEntries;

  const { url } = inspirationSources.OnePageLove;

  const getWebsiteTileSelector = (num: number) =>
    `#container .archive-container.grid .grid-col .thumb-inspiration:nth-of-type(${num})`;

  try {
    if (tooManyEntriesRequested) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.BestWebsiteGallery}`
      );
    }

    writeToConsole(
      `Scraping from ${InspirationSourceName.OnePageLove}${
        usingManualSelection ? " using manual indexes" : ""
      }`
    );

    const websites: WebsiteInfo[] = [];

    const scrapeWebsite = async (websiteIndex: number) => {
      // Go to BestWebsiteGallery home page after every entry
      await page.goto(url);

      const websiteTileSelector = getWebsiteTileSelector(websiteIndex);

      const websiteTileInfo = await page.$eval(
        websiteTileSelector,
        (element) => ({
          title: element.querySelector(".thumb-info .thumb-name a")
            ?.textContent as string,
          url: element
            .querySelector(".thumb-info .thumb-title .thumb-link a")
            ?.getAttribute("href") as string,
        })
      );

      const scrapedWebsiteInfo: ScrapedWebsiteInfo = {
        title: normalizeWebsiteTitle(websiteTileInfo.title) as string,
        url: getWebsiteDomain(websiteTileInfo.url),
        source: InspirationSourceName.OnePageLove,
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

    writeToConsole(
      `Finished scraping from ${InspirationSourceName.BestWebsiteGallery}`,
      1
    );

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.OnePageLove);

    return [];
  }
};

export default handler;
