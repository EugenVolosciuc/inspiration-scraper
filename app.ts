import dayjs from "dayjs";
import puppeteer from "puppeteer";
import connect from "./db/connect";

import inspirationSources from "./inspiration-sources/list";
import {
  InspirationSourceName,
  ScrapedWebsiteInfo,
} from "./types/InspirationSource";
import { generateArticle } from "./utils/website";
import writeToConsole from "./utils/writeToConsole";

require("dotenv").config();

const initiateApp = async () => {
  const startTime = dayjs();
  const connection = await connect();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });

  let websites: ScrapedWebsiteInfo[] = [];

  // Fire each inspiration websites's handler
  for (let inspirationSourceTitle in inspirationSources) {
    const inspirationSource =
      inspirationSources[inspirationSourceTitle as InspirationSourceName];

    const scrapedEntries = await inspirationSource.handler(
      page,
      inspirationSource.numberOfEntries
    );

    websites = websites.concat(scrapedEntries);
  }

  await generateArticle(websites);

  const secondsPassed = dayjs().diff(startTime, "seconds");
  writeToConsole(`Generated article in ${secondsPassed}s`);
  await connection.close();
  process.exit(0);
};

initiateApp();
