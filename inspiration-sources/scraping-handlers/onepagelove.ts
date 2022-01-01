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
} from "../../utils/website";
import {
  InspirationSource,
  InspirationSourceName,
  ScrapedWebsiteInfo,
  WebsiteInfo,
} from "../../types/InspirationSource";

const maxNumberOfEntries = 6;

/** This function fetches the information of "LATEST WEBSITE INSPIRATIONs" websites from the onepagelove.com homepage */
const handler: InspirationSource["handler"] = async (
  page: Page,
  numberOfEntries: number = 1
) => {
  const { url } = inspirationSources.OnePageLove;

  const getWebsiteTileSelector = (num: number) =>
    `#container .archive-container.grid .grid-col .thumb-inspiration:nth-of-type(${num})`;

  try {
    if (numberOfEntries > maxNumberOfEntries) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.BestWebsiteGallery}`
      );
    }

    writeToConsole(`Scraping from ${InspirationSourceName.OnePageLove}`);

    const websites: WebsiteInfo[] = [];

    // Go through each website `numberOfEntries` times
    await loopTimes(numberOfEntries, async (currentNumber) => {
      // Go to BestWebsiteGallery home page after every entry
      await page.goto(url);

      const websiteTileSelector = getWebsiteTileSelector(currentNumber);

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
    });

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
