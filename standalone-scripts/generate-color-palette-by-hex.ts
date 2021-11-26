import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs-extra";
import { registerFont } from "canvas";
import colorName from "color-namer";

import {
  getColorSchemeFromImage,
  generateColorSchemeImage,
} from "../utils/article";
import writeToConsole from "../utils/writeToConsole";
import { Color } from "../types/Color";

require("dotenv").config();

// file title, hexCodes[]
/**
 * @example
 * // npm run generate-palette:hex -- --codes "#4EABD1" "#25272C" --title=Gemini
 */
const main = async () => {
  registerFont("assets/fonts/WorkSans-Regular.ttf", { family: "Work Sans" });

  const { title, codes, ...rest } = await yargs(hideBin(process.argv)).array(
    "codes"
  ).argv;

  if (!title) throw new Error("Please provide a title argument");
  if ((codes as string[])?.length < 1)
    throw new Error("Please provide an array of hex codes");

  const colors: Color[] = [];
  for (let code of codes as string[]) {
    const { hex, name } = colorName(code).ntc[0];

    colors.push({ hex, name });
  }

  await generateColorSchemeImage(colors, title as string);

  writeToConsole("Palette generated successfully");
};

main();
