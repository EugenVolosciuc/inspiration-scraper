import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs-extra";
import { registerFont } from "canvas";

import {
  getColorSchemeFromImage,
  generateColorSchemeImage,
} from "../utils/article";
import writeToConsole from "../utils/writeToConsole";

require("dotenv").config();

/**
 * Generate a color palette image from an image found in /assets/screenshots (.png only)
 * @example
 * // npm run generate-palette:image -- --title=Gemini --numberOfColors=3
 */
const main = async () => {
  registerFont("assets/fonts/WorkSans-Regular.ttf", { family: "Work Sans" });

  try {
    const { title, numberOfColors } = await yargs(hideBin(process.argv)).argv;
    if (!title) throw new Error("Please provide a title argument");

    const screenshot = await fs.readFile(`./assets/screenshots/${title}.png`);

    const colors = await getColorSchemeFromImage(
      screenshot,
      (numberOfColors as number) ||
        parseInt(process.env.COLORS_IN_PALETTE as string, 10)
    );

    await generateColorSchemeImage(colors, title as string);

    writeToConsole("Palette generated successfully");
  } catch (error) {
    console.error(error);
    writeToConsole("Could not generate color palette");
  }
};

main();
