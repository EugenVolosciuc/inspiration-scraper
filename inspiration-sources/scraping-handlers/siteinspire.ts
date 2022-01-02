import inspirationSources from "../list";
import errorHandler from "../../utils/errorHandler";
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

/** This function fetches the information of websites from the siteinspire.com homepage */
const handler: ScrapingHandler = async (
  page,
  numberOfEntries = 1,
  websiteIndexes
) => {
  const usingManualSelection = !!websiteIndexes?.length;
  const tooManyEntriesRequested = usingManualSelection
    ? websiteIndexes.length > maxNumberOfEntries
    : numberOfEntries > maxNumberOfEntries;

  const { url } = inspirationSources.SiteInspire;
  await page.goto(url);

  const websiteTileSelector = "#main #grid .thumbnail";

  try {
    if (tooManyEntriesRequested) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.Awwwards}`
      );
    }

    writeToConsole(
      `Scraping from ${InspirationSourceName.SiteInspire}${
        usingManualSelection ? " using manual indexes" : ""
      }`
    );

    const websitesInfo = await page.$$eval(websiteTileSelector, (elements) => {
      const websitesInfo = [];

      for (let i = 0; i < elements.length; i++) {
        const isSponsoredTile = !!elements[i].querySelector(".caption + img");

        if (isSponsoredTile) continue;

        const hrefElement = elements[i].querySelector(".caption .title a");

        websitesInfo.push({
          title: hrefElement?.textContent as string,
          innerURL: hrefElement?.getAttribute("href") as string,
        });
      }

      return websitesInfo;
    });

    const websites: WebsiteInfo[] = [];

    const scrapeWebsite = async (websiteIndex: number) => {
      await page.goto(
        `${url.slice(0, -1)}${websitesInfo[websiteIndex].innerURL}`
      );

      const websiteURL = await page.$eval(
        "#website .visit",
        (element) => element.getAttribute("href") as string
      );

      const scrapedWebsiteInfo: ScrapedWebsiteInfo = {
        title: normalizeWebsiteTitle(
          websitesInfo[websiteIndex].title
        ) as string,
        url: getWebsiteDomain(websiteURL),
        source: InspirationSourceName.SiteInspire,
      };

      const websiteExistsInDB = await checkWebsiteInDB(scrapedWebsiteInfo);
      if (websiteExistsInDB) {
        writeToConsole(
          `"${scrapedWebsiteInfo.title}" website is already in DB`,
          1
        );
      } else {
        const websiteInfo = await processScrapedWebsiteInfo(
          page,
          scrapedWebsiteInfo
        );
        websites.push(websiteInfo);
      }
    };

    if (usingManualSelection) {
      for (let i = 0; i < websiteIndexes?.length; i++) {
        await scrapeWebsite(websiteIndexes[i] - 1);
      }
    } else {
      for (let i = 0; i < numberOfEntries; i++) {
        await scrapeWebsite(i);
      }
    }

    writeToConsole(
      `Finished scraping from ${InspirationSourceName.SiteInspire}`,
      1
    );

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.SiteInspire);

    return [];
  }
};

export default handler;
