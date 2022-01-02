import dayjs from "dayjs";
import puppeteer from "puppeteer";
import { registerFont } from "canvas";

import connect from "./db/connect";
import inspirationSources from "./inspiration-sources/list";
import { InspirationSourceName, WebsiteInfo } from "./types/InspirationSource";
import { generateArticle } from "./utils/website";
import writeToConsole from "./utils/writeToConsole";
import options from "./inspiration-sources/options";

const initiateApp = async () => {
  const startTime = dayjs();

  registerFont("assets/fonts/WorkSans-Regular.ttf", { family: "Work Sans" });

  const connection = await connect();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });

  let websites: WebsiteInfo[] = [];

  // Fire each inspiration websites's handler
  for (let inspirationSourceTitle in inspirationSources) {
    const inspirationSource =
      inspirationSources[inspirationSourceTitle as InspirationSourceName];

    const scrapedEntries = await inspirationSource.handler(
      page,
      inspirationSource.numberOfEntries,
      options[inspirationSourceTitle as InspirationSourceName].websiteIndexes
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
