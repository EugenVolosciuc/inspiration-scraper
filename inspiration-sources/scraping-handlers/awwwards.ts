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

const maxNumberOfEntries = 4;

const getVisitWebsiteBtnHref = async (page: Page) => {
  const visitWebsiteBtnSelectorv1 =
    ".box-site-head .box-content .box-bl.gap > a";
  const visitWebsiteBtnSelectorv2 =
    "#content .box-mobile-details .bts > a:first-of-type";

  try {
    const visitWebsiteBtnHrefv1 = await page.$eval(
      visitWebsiteBtnSelectorv1,
      (element) => element.getAttribute("href") as string
    );

    return visitWebsiteBtnHrefv1;
  } catch (error) {
    try {
      const visitWebsiteBtnHrefv2 = await page.$eval(
        visitWebsiteBtnSelectorv2,
        (element) => element.getAttribute("href") as string
      );

      return visitWebsiteBtnHrefv2;
    } catch (error) {
      writeToConsole(
        `Couldn't get website from ${InspirationSourceName.Awwwards}`
      );

      return Promise.reject();
    }
  }
};

/** This function fetches the information of "Site of the day" websites from awwwards.com */
const handler: InspirationSource["handler"] = async (
  page: Page,
  numberOfEntries: number = 1
) => {
  const { url } = inspirationSources.Awwwards;

  const getWebsiteTileSelector = (num: number) =>
    `#content #block-sotd .list-items > li:nth-of-type(${num}) .box-item .box-info > .content a`;

  try {
    if (numberOfEntries > maxNumberOfEntries) {
      throw new Error(
        `Can't fetch more than ${maxNumberOfEntries} websites from ${InspirationSourceName.Awwwards}`
      );
    }

    writeToConsole(`Scraping from ${InspirationSourceName.Awwwards}`);

    const websites: WebsiteInfo[] = [];

    // Go through each website `numberOfEntries` times
    await loopTimes(numberOfEntries, async (currentNumber) => {
      // Go to awwwards home page after every entry
      await page.goto(url);

      const websiteTileInfo = await page.$eval(
        getWebsiteTileSelector(currentNumber),
        (element) => ({
          title: element.textContent as string,
          innerURL: element.getAttribute("href") as string,
        })
      );

      // Go to the selected website's awwwards page
      await page.goto(`${page.url().slice(0, -1)}${websiteTileInfo.innerURL}`);

      const visitWebsiteBtnHref = await getVisitWebsiteBtnHref(page);

      const scrapedWebsiteInfo: ScrapedWebsiteInfo = {
        title: normalizeWebsiteTitle(websiteTileInfo.title) as string,
        url: getWebsiteDomain(visitWebsiteBtnHref),
        source: InspirationSourceName.Awwwards,
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
      `Finished scraping from ${InspirationSourceName.Awwwards}`,
      1
    );

    return websites;
  } catch (error) {
    errorHandler(error, InspirationSourceName.Awwwards);

    return [];
  }
};

export default handler;
