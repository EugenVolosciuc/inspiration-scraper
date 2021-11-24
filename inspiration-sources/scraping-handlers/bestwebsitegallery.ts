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

const maxNumberOfEntries = 4;

/** This function fetches the information of "latest winners" websites from the bestwebsite.gallery homepage */
const handler: InspirationSource["handler"] = async (
  page: Page,
  numberOfEntries: number = 1
) => {
  const { url } = inspirationSources.BestWebsiteGallery;

  const getWebsiteTileSelector = (num: number) =>
    `.c-section:not(.c-section--sotd) .c-sites .c-sites__item:nth-of-type(${num}) .c-sites__itemInner`;

  try {
    if (numberOfEntries > maxNumberOfEntries) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.BestWebsiteGallery}`
      );
    }

    writeToConsole(`Scraping from ${InspirationSourceName.BestWebsiteGallery}`);

    const websites: ScrapedWebsiteInfo[] = [];

    // Go through each website `numberOfEntries` times
    await loopTimes(numberOfEntries, async (currentNumber) => {
      // Go to BestWebsiteGallery home page after every entry
      await page.goto(url);

      const websiteTileSelector = getWebsiteTileSelector(currentNumber);

      // Hover over the image to get the website link
      await page.hover(
        getWebsiteTileSelector(currentNumber) + " .c-sites__figureWrapper"
      );

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
        url: websiteTileInfo.url,
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

      await processScrapedWebsiteInfo(page, scrapedWebsiteInfo);
      websites.push(scrapedWebsiteInfo);
    });

    writeToConsole(
      `Finished scraping from ${InspirationSourceName.BestWebsiteGallery}`
    );

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.BestWebsiteGallery);

    return [];
  }
};

export default handler;
