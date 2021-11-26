import { getRepository } from "typeorm";
import fs from "fs-extra";

import { Website } from "../db/entities/Website";
import connect from "../db/connect";
import writeToConsole from "../utils/writeToConsole";

require("dotenv").config();

const main = async () => {
  const connection = await connect();
  const websiteRepository = getRepository(Website);

  // Remove screenshots from assets folder
  await fs.emptyDir("assets/screenshots");
  writeToConsole("Removed all screenshots from assets/screenshots folder");

  // Remove screenshots from assets folder
  await fs.emptyDir("assets/color-palettes");
  writeToConsole(
    "Removed all color palettes from assets/color-palettes folder"
  );

  // Delete websites from DB
  await websiteRepository.clear();
  writeToConsole("Removed all entries from Websites table");

  await connection.close();
};

main();
