import fs from "fs-extra";

import writeToConsole from "../utils/writeToConsole";

const main = async () => {
  // Remove screenshots from assets folder
  await fs.emptyDir("assets/articles");
  writeToConsole("Removed all articles from assets/articles folder");
};

main();
