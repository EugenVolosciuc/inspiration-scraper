import { getRepository } from "typeorm";
import fs from "fs-extra";

import { Website } from "../db/entities/Website";
import connect from "../db/connect";
import writeToConsole from "../utils/writeToConsole";

require("dotenv").config();

const main = async () => {
  const connection = await connect();
  const websiteRepository = getRepository(Website);

  // Remove assets from assets folder
  await fs.emptyDir("assets");
  writeToConsole("Removed all files from assets folder");

  // Delete websites from DB
  await websiteRepository.clear();
  writeToConsole("Removed all entries from Websites table");

  await connection.close();
};

main();
