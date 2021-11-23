import puppeteer from "puppeteer";
import connect from "./db/connect";

import inspirationSources from "./inspiration-sources/list";
import { InspirationSourceName } from "./types/InspirationSource";

require("dotenv").config();

const initiateApp = async () => {
  await connect();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });

  // Fire each inspiration websites's handler
  for (let inspirationSourceTitle in inspirationSources) {
    const inspirationSource =
      inspirationSources[inspirationSourceTitle as InspirationSourceName];

    await inspirationSource.handler(page, inspirationSource.numberOfEntries);
  }
};

initiateApp();
