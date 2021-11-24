import { Page } from "puppeteer";

import inspirationSources from "../list";
import errorHandler from "../../utils/errorHandler";
import loopTimes from "../../utils/loopTimes";
import writeToConsole from "../../utils/writeToConsole";
import normalizeWebsiteTitle from "../../utils/normalize-website-title";
import {
  checkWebsiteInDB,
  processScrapedWebsiteInfo,
} from "../../utils/website";
import {
  InspirationSource,
  InspirationSourceName,
  ScrapedWebsiteInfo,
} from "../../types/InspirationSource";

const maxNumberOfEntries = 2;

/** This function fetches the information of websites from the lapa.ninja homepage */
const handler: InspirationSource["handler"] = async (
  page: Page,
  numberOfEntries: number = 1
) => {
  const { url } = inspirationSources.Lapa;

  const getWebsiteTileSelector = (num: number) =>
    `.body .container .columns .column:nth-of-type(${num})`;

  try {
    if (numberOfEntries > maxNumberOfEntries) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.Lapa}`
      );
    }

    writeToConsole(`Scraping from ${InspirationSourceName.Lapa}`);

    const websites: ScrapedWebsiteInfo[] = [];

    // Go through each website `numberOfEntries` times
    await loopTimes(numberOfEntries, async (currentNumber) => {
      // Go to lapa home page after every entry
      await page.goto(url);

      const websiteTileInfo = await page.$eval(
        getWebsiteTileSelector(currentNumber),
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
        url: websiteTileInfo.url,
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

      await processScrapedWebsiteInfo(page, scrapedWebsiteInfo);
      websites.push(scrapedWebsiteInfo);
    });

    writeToConsole(`Finished scraping from ${InspirationSourceName.Lapa}`);

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.Lapa);

    return [];
  }
};

export default handler;
