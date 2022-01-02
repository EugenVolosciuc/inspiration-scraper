import fs from "fs-extra";
import path from "path";
import dayjs from "dayjs";
import { loremIpsum } from "lorem-ipsum";
import { createCanvas } from "canvas";
import colorName from "color-namer";
// @ts-ignore
import palette from "image-palette";
// @ts-ignore
import pixels from "image-pixels";

import { ScrapedWebsiteInfo, WebsiteInfo } from "../types/InspirationSource";
import { titleToFileName } from "./string-manipulations";
import { Color } from "../types/Color";
import { getWebsiteStack, stringifyStack } from "./website";
import { articlesPerMonth } from "../inspiration-sources/options";

const articleTitleBase = "Web Design Inspiration for";

export const articleExtension = ".md";

export const articlesFolderPath = path.join(
  __dirname,
  "..",
  "assets",
  "articles"
);

export const getPartOfMonth = () => {
  const now = dayjs();
  const daysInMonth = now.daysInMonth();
  const currentDate = now.date();

  return Math.ceil(currentDate / Math.floor(daysInMonth / articlesPerMonth));
};

export const createBlankArticle = async () => {
  const partOfMonth = getPartOfMonth();
  const partContent = articlesPerMonth > 1 ? ` - Part ${partOfMonth}` : "";
  const fileTitle = `${articleTitleBase} ${dayjs().format(
    "MMMM YYYY"
  )}${partContent}`;

  const articlePath = path.join(
    articlesFolderPath,
    `${fileTitle}${articleExtension}`
  );

  await fs.writeFile(articlePath, "", {
    flag: "w+",
  });

  return fileTitle;
};

export const generateContentTitle = (title: string) => {
  return `# ${title}\n`;
};

export const generateBlogIntro = () => {
  return "You’re a web designer, web developer, or a little bit of both. You do what you love and you’re even pretty good at it. Still, there are times when the creative juices are running low and a spark of inspiration is just the thing you need. Cue to the below list of selected design examples that might bring something new to your ideas.\n\n***\n\n";
};

export const generateContentSummary = (websites: ScrapedWebsiteInfo[]) => {
  let summary = "## Summary\n\n";

  for (let website of websites) {
    summary += `- [${website.title}](${website.url})\n`;
  }

  summary += "\n\n";

  return summary;
};

export const generatePeriodDescription = () => {
  return (
    loremIpsum({
      count: 6, // Number of "words", "sentences", or "paragraphs"
      format: "plain", // "plain" or "html"
      paragraphLowerBound: 3, // Min. number of sentences per paragraph.
      paragraphUpperBound: 7, // Max. number of sentences per paragarph.
      sentenceLowerBound: 5, // Min. number of words per sentence.
      sentenceUpperBound: 15, // Max. number of words per sentence.
      units: "sentences", // paragraph(s), "sentence(s)", or "word(s)"
    }) + "\n\n"
  );
};

export const generateWebsiteEntry = async (website: WebsiteInfo) => {
  await generateColorSchemeImage(website.colors, website.title);

  const title = `## [${website.title}](${website.url})\n\n\n`;
  const screenshot = `![${website.title}](/assets/screenshots/${titleToFileName(
    website.title
  )}.png)\n\n`;
  const colorPaletteImage = `![${
    website.title
  } color palette](/assets/color-palettes/${titleToFileName(
    website.title
  )}.png)\n`;
  const entryDescription = loremIpsum({
    count: 5, // Number of "words", "sentences", or "paragraphs"
    format: "plain", // "plain" or "html"
    paragraphLowerBound: 3, // Min. number of sentences per paragraph.
    paragraphUpperBound: 6, // Max. number of sentences per paragarph.
    sentenceLowerBound: 5, // Min. number of words per sentence.
    sentenceUpperBound: 13, // Max. number of words per sentence.
    units: "sentences", // paragraph(s), "sentence(s)", or "word(s)"
  });

  let stringifiedStack = "";
  if (process.env.USE_PAYED_SERVICES === "true") {
    const stack = await getWebsiteStack(website.url);
    if (!!stack) stringifiedStack = stringifyStack(stack);
  }

  return `${title}${screenshot}${colorPaletteImage}${stringifiedStack}\n\n${entryDescription}\n\n`;
};

export const generateWebsiteEntries = async (websites: WebsiteInfo[]) => {
  let content = "";

  for (let website of websites) {
    content += await generateWebsiteEntry(website);
  }

  return content;
};

export const generateEndingContent = () => {
  return "Finding inspiration in a sea of information might feel daunting at first, but we hope we made this task a little easier. If you used any of the ideas mentioned above in your designs, please share in the comment section below, I would love to see your creations!";
};

export const getColorSchemeFromImage = async (
  image: string | Buffer,
  numberOfColors: number
): Promise<Color[]> => {
  const colors: Color[] = [];
  const { colors: generatedColors } = palette(
    await pixels(image),
    numberOfColors
  );

  for (let [r, g, b, a] of generatedColors) {
    const { name, hex } = colorName(`rgba(${r},${g},${b},${a / 255})`).ntc[0];

    colors.push({ hex, name });
  }

  return colors;
};

export const generateColorSchemeImage = async (
  colors: Color[],
  websiteTitle: string
) => {
  // Canvas setup
  const canvasSize = {
    width: 1980,
    height: 500,
  };
  const canvasBgColor = "#FFF9EF";
  const canvas = createCanvas(canvasSize.width, canvasSize.height);
  const ctx = canvas.getContext("2d");
  const fontSize = 32;
  ctx.font = `${fontSize}px "Work Sans"`;
  ctx.textAlign = "center";

  // Fill background
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  // Position a rectangle of each color
  const rectSize = 200;
  const rectBorderWidth = 4;
  const rectBorderColor = "#000000";
  const halfOfRectSize = rectSize / 2;
  const yRectOffset = 40;
  const xRectPortionOfCanvas = Math.round(canvasSize.width / colors.length);
  const yRect =
    Math.round(canvasSize.height / 2 - halfOfRectSize) - yRectOffset;

  for (let i = 0; i < colors.length; i++) {
    const xDistanceMultiplier = i * xRectPortionOfCanvas;

    const xRect =
      Math.round(xRectPortionOfCanvas / 2 - halfOfRectSize) +
      xDistanceMultiplier;

    // Draw rect border
    const rectBorderSize = rectSize + rectBorderWidth * 2;
    ctx.fillStyle = rectBorderColor;
    ctx.fillRect(
      xRect - rectBorderWidth,
      yRect - rectBorderWidth,
      rectBorderSize,
      rectBorderSize
    );

    // Draw rect
    ctx.fillStyle = `#${colors[i].hex}`;
    ctx.fillRect(xRect, yRect, rectSize, rectSize);

    // Write color hex and name
    ctx.fillStyle = rectBorderColor;
    ctx.fillText(
      `#${colors[i].hex}`,
      xRect + rectSize / 2,
      yRect + rectSize + yRectOffset + 12
    );
    ctx.fillText(
      colors[i].name,
      xRect + rectSize / 2,
      yRect + rectSize + yRectOffset + fontSize + 20
    );
  }

  // Save color scheme image
  const buffer = canvas.toBuffer("image/png");
  const imagePath = path.join(
    __dirname,
    "..",
    "assets",
    "color-palettes",
    `${titleToFileName(websiteTitle)}.png`
  );

  await fs.writeFile(imagePath, buffer);

  return imagePath;
};
