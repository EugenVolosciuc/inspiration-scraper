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

const maxNumberOfEntries = 4;

/** This function fetches the information of "latest winners" websites from the bestwebsite.gallery homepage */
const handler: ScrapingHandler = async (
  page,
  numberOfEntries = 1,
  websiteIndexes
) => {
  const usingManualSelection = !!websiteIndexes?.length;
  const tooManyEntriesRequested = usingManualSelection
    ? websiteIndexes.length > maxNumberOfEntries
    : numberOfEntries > maxNumberOfEntries;

  const { url } = inspirationSources.BestWebsiteGallery;

  const getWebsiteTileSelector = (num: number) =>
    `.c-section:not(.c-section--sotd) .c-sites .c-sites__item:nth-of-type(${num}) .c-sites__itemInner`;

  try {
    if (tooManyEntriesRequested) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.BestWebsiteGallery}`
      );
    }

    writeToConsole(
      `Scraping from ${InspirationSourceName.BestWebsiteGallery}${
        usingManualSelection ? " using manual indexes" : ""
      }`
    );

    const websites: WebsiteInfo[] = [];

    const scrapeWebsite = async (websiteIndex: number) => {
      // Go to BestWebsiteGallery home page after every entry
      await page.goto(url);

      const websiteTileSelector = getWebsiteTileSelector(websiteIndex);

      // Hover over the image to get the website link
      await page.hover(websiteTileSelector + " .c-sites__figureWrapper");

      const websiteTileInfo = await page.$eval(
        websiteTileSelector,
        (element) => ({
          title: element.querySelector(".c-sites__title a")
            ?.textContent as string,
          url: element
            .querySelector(".c-quickLinks > a:nth-of-type(2)")
            ?.getAttribute("href") as string,
        })
      );

      const scrapedWebsiteInfo: ScrapedWebsiteInfo = {
        title: normalizeWebsiteTitle(websiteTileInfo.title) as string,
        url: getWebsiteDomain(websiteTileInfo.url),
        source: InspirationSourceName.BestWebsiteGallery,
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

    writeToConsole(
      `Finished scraping from ${InspirationSourceName.BestWebsiteGallery}`,
      1
    );

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.BestWebsiteGallery);

    return [];
  }
};

export default handler;
