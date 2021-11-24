import fs from "fs-extra";
import path from "path";
import dayjs from "dayjs";
import { loremIpsum } from "lorem-ipsum";
import colorName from "color-namer";
// @ts-ignore
import palette from "image-palette";
// @ts-ignore
import pixels from "image-pixels";

import { ScrapedWebsiteInfo, WebsiteInfo } from "../types/InspirationSource";
import { titleToFileName } from "./string-manipulations";
import { Color } from "../types/Color";

const articleTitleBase = "Web Design Inspiration for";

export const articleExtension = ".md";

export const articlesFolderPath = path.join(
  __dirname,
  "..",
  "assets",
  "articles"
);

export const getPartOfMonth = () => {
  const articlesPerMonth = parseInt(
    process.env.ARTICLES_PER_MONTH as string,
    10
  );
  const now = dayjs();
  const daysInMonth = now.daysInMonth();
  const currentDate = now.date();

  return Math.ceil(currentDate / Math.floor(daysInMonth / articlesPerMonth));
};

export const createBlankArticle = async () => {
  const partOfMonth = getPartOfMonth();
  const fileTitle = `${articleTitleBase} ${dayjs().format(
    "MMMM YYYY"
  )} - Part ${partOfMonth}`;

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
  return (
    loremIpsum({
      count: 6, // Number of "words", "sentences", or "paragraphs"
      format: "plain", // "plain" or "html"
      paragraphLowerBound: 3, // Min. number of sentences per paragraph.
      paragraphUpperBound: 7, // Max. number of sentences per paragarph.
      sentenceLowerBound: 5, // Min. number of words per sentence.
      sentenceUpperBound: 15, // Max. number of words per sentence.
      suffix: "\n", // Line ending, defaults to "\n" or "\r\n" (win32)
      units: "sentences", // paragraph(s), "sentence(s)", or "word(s)"
    }) + "\n\n"
  );
};

export const generateContentSummary = (websites: ScrapedWebsiteInfo[]) => {
  let summary = "";
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
      suffix: "\n", // Line ending, defaults to "\n" or "\r\n" (win32)
      units: "sentences", // paragraph(s), "sentence(s)", or "word(s)"
    }) + "\n\n"
  );
};

export const generateWebsiteEntry = (website: WebsiteInfo) => {
  const title = `## ${website.title}\n`;
  const image = `![${website.title}](/assets/screenshots/${titleToFileName(
    website.title
  )}.png)\n`;

  let colorPalette = "";

  for (let color of website.colors) {
    colorPalette += `**Color name:** ${color.name}\n **HEX:** ${color.hex}\n\n`;
  }

  // TODO: add color pallete image
  return `${title}${image}\n${colorPalette}`;
};

export const generateWebsiteEntries = (websites: WebsiteInfo[]) => {
  let content = "";

  for (let website of websites) {
    content += generateWebsiteEntry(website);
  }

  return content;
};

export const generateEndingContent = () => {
  return (
    "***\n\n" + // horizontal rule
    loremIpsum({
      count: 6, // Number of "words", "sentences", or "paragraphs"
      format: "plain", // "plain" or "html"
      paragraphLowerBound: 3, // Min. number of sentences per paragraph.
      paragraphUpperBound: 7, // Max. number of sentences per paragarph.
      sentenceLowerBound: 5, // Min. number of words per sentence.
      sentenceUpperBound: 15, // Max. number of words per sentence.
      suffix: "\n", // Line ending, defaults to "\n" or "\r\n" (win32)
      units: "sentences", // paragraph(s), "sentence(s)", or "word(s)"
    }) +
    "\n\n"
  );
};

export const getColorSchemeFromImage = async (
  image: string | Buffer
): Promise<Color[]> => {
  const colors: Color[] = [];
  const { colors: generatedColors } = palette(await pixels(image), 4);

  for (let [r, g, b, a] of generatedColors) {
    const { name, hex } = colorName(`rgba(${r},${g},${b},${a / 255})`).ntc[0];

    colors.push({ hex, name });
  }

  return colors;
};
