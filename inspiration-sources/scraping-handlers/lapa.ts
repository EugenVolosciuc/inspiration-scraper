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
  InspirationSource,
  InspirationSourceName,
  ScrapedWebsiteInfo,
  ScrapingHandler,
  WebsiteInfo,
} from "../../types/InspirationSource";

const maxNumberOfEntries = 2;

/** This function fetches the information of websites from the lapa.ninja homepage */
const handler: ScrapingHandler = async (
  page,
  numberOfEntries = 1,
  websiteIndexes
) => {
  const usingManualSelection = !!websiteIndexes?.length;
  const tooManyEntriesRequested = usingManualSelection
    ? websiteIndexes.length > maxNumberOfEntries
    : numberOfEntries > maxNumberOfEntries;

  const { url } = inspirationSources.Lapa;

  const getWebsiteTileSelector = (num: number) =>
    `.body .container .columns .column:nth-of-type(${num})`;

  try {
    if (tooManyEntriesRequested) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.Lapa}`
      );
    }

    writeToConsole(`Scraping from ${InspirationSourceName.Lapa}`);

    const websites: WebsiteInfo[] = [];

    const scrapeWebsite = async (websiteIndex: number) => {
      // Go to lapa home page after every entry
      await page.goto(url);

      const websiteTileInfo = await page.$eval(
        getWebsiteTileSelector(websiteIndex),
        (element) => ({
          title: element.querySelector(".card-header .card-title a")
            ?.textContent as string,
          url: element
            .querySelector(".card-header > a")
            ?.getAttribute("href") as string,
        })
      );

      const scrapedWebsiteInfo: ScrapedWebsiteInfo = {
        title: normalizeWebsiteTitle(websiteTileInfo.title) as string,
        url: getWebsiteDomain(websiteTileInfo.url),
        source: InspirationSourceName.Lapa,
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
        scrapeWebsite(websiteIndexes[i]);
      }
    } else {
      // Go through each website `numberOfEntries` times
      await loopTimes(numberOfEntries, async (currentNumber) => {
        scrapeWebsite(currentNumber);
      });
    }

    writeToConsole(`Finished scraping from ${InspirationSourceName.Lapa}`, 1);

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.Lapa);

    return [];
  }
};

export default handler;
