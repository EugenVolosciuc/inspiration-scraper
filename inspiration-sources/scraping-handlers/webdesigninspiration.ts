import { Page } from "puppeteer";

import inspirationSources from "../list";
import errorHandler from "../../utils/errorHandler";
import loopTimes from "../../utils/loopTimes";
import writeToConsole from "../../utils/writeToConsole";
import { normalizeWebsiteTitle } from "../../utils/string-manipulations";
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

const maxNumberOfEntries = 12;

/** This function fetches the information of "latest web design" websites from the webdesign-inspiration.com homepage */
const handler: InspirationSource["handler"] = async (
  page: Page,
  numberOfEntries: number = 1
) => {
  const { url } = inspirationSources.WebDesignInspiration;

  const getWebsiteTileSelector = (num: number) =>
    `.c-gallery .container .row.items .item:nth-of-type(${num})`;

  try {
    if (numberOfEntries > maxNumberOfEntries) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.WebDesignInspiration}`
      );
    }

    writeToConsole(
      `Scraping from ${InspirationSourceName.WebDesignInspiration}`
    );

    const websites: WebsiteInfo[] = [];

    // Go through each website `numberOfEntries` times
    await loopTimes(numberOfEntries, async (currentNumber) => {
      // Go to WebDesignInspiration home page after every entry
      await page.goto(url);

      const websiteTileInfo = await page.$eval(
        getWebsiteTileSelector(currentNumber),
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
        url: websiteTileInfo.url,
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
    });

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
