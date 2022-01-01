import { Page } from "puppeteer";
import { getRepository } from "typeorm";
import path from "path";
import fs from "fs-extra";
import axios from "axios";

import { Website } from "../db/entities/Website";
import { ScrapedWebsiteInfo, WebsiteInfo } from "../types/InspirationSource";
import writeToConsole from "./writeToConsole";
import {
  createBlankArticle,
  articlesFolderPath,
  generateContentTitle,
  articleExtension,
  generateBlogIntro,
  generateContentSummary,
  generatePeriodDescription,
  generateWebsiteEntries,
  generateEndingContent,
  getColorSchemeFromImage,
} from "./article";
import { titleToFileName } from "./string-manipulations";
import { WappalyzerResponse, WebsiteStack } from "../types/WebsiteStack";

const unnecessaryCategories = [
  "SEO",
  "Tag managers",
  "Font scripts",
  "Retargeting",
  "Programming languages",
  "Databases",
  "Analytics",
  "SSL/TLS certificate authorities",
  "Caching",
  "Webmail",
  "Advertising",
  "Web servers",
  "Security",
  "Email",
  "Operating systems",
  "Marketing automation",
  "Documentation",
  "Payment processors",
  "Geolocation",
];
const unnecessaryTechnologies = [
  "core-js",
  "Choices",
  "web-vitals",
  "HTTP/2",
  "Cart Functionality",
  "webpack",
  "Lodash",
  "parcel",
  "Facebook",
];

export const takeHeroAreaScreenshot = async (page: Page, fileTitle: string) => {
  // TODO: create folder for article image
  const screenshot = await page.screenshot({
    path: `./assets/screenshots/${titleToFileName(fileTitle)}.png`,
  });
  writeToConsole(`Took screenshot of ${fileTitle}`, 1);

  return screenshot;
};

export const checkWebsiteInDB = async ({ title, url }: ScrapedWebsiteInfo) => {
  const websiteRepository = getRepository(Website);

  const website = await websiteRepository.findOne({ url, title });

  return !!website;
};

export const saveWebsiteToDB = async (
  scrapedWebsiteInfo: ScrapedWebsiteInfo
) => {
  const websiteRepository = getRepository(Website);

  const websiteInstance = websiteRepository.create(scrapedWebsiteInfo);
  const website = await websiteRepository.save(websiteInstance);

  writeToConsole(`Added ${website.title} website to DB`, 1);

  return website;
};

export const processScrapedWebsiteInfo = async (
  page: Page,
  scrapedWebsiteInfo: ScrapedWebsiteInfo
): Promise<WebsiteInfo> => {
  await saveWebsiteToDB(scrapedWebsiteInfo);

  await page.goto(scrapedWebsiteInfo.url, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(10000); // Page might have animations, wait for a little bit
  const screenshot = await takeHeroAreaScreenshot(
    page,
    scrapedWebsiteInfo.title
  );
  const colors = await getColorSchemeFromImage(
    screenshot,
    parseInt(process.env.COLORS_IN_PALETTE as string, 10)
  );

  return {
    ...scrapedWebsiteInfo,
    colors,
  };
};

export const generateArticle = async (websites: WebsiteInfo[]) => {
  try {
    writeToConsole("Generating article");
    const fileTitle = await createBlankArticle();
    const filePath = path.join(
      articlesFolderPath,
      `${fileTitle}${articleExtension}`
    );

    // Append article title
    await fs.appendFile(filePath, generateContentTitle(fileTitle));

    // Append article intro
    await fs.appendFile(filePath, generateBlogIntro());

    // Append article summary
    await fs.appendFile(filePath, generateContentSummary(websites));

    // Append period description
    await fs.appendFile(filePath, generatePeriodDescription());

    // Append websites
    const websiteEntries = await generateWebsiteEntries(websites);
    await fs.appendFile(filePath, websiteEntries);

    // Append ending content
    await fs.appendFile(filePath, generateEndingContent());
  } catch (error) {
    writeToConsole("Failed to generate article");
    console.log(error);
  }
};

export const scrollToBottomOfPage = async (page: Page) => {
  await page.evaluate(() => {
    window.scrollBy(0, document.body.scrollHeight);
  });
};

export const getWebsiteStack = async (url: string) => {
  try {
    const { data } = await axios.get<WappalyzerResponse>(
      `https://api.wappalyzer.com/v2/lookup/?urls=${url}`,
      {
        headers: {
          "x-api-key": process.env.WAPPALYZER_API_KEY as string,
        },
      }
    );

    const stack: WebsiteStack = data[0].technologies.reduce(
      (accumulator: WebsiteStack, value) => {
        const categoryName = value.categories[0].name;
        const category = {
          name: value.name,
          category: categoryName,
        };

        // Filter unnecessary categories
        if (unnecessaryCategories.includes(categoryName)) {
          return accumulator;
        }

        // Filter unnecessary technologies
        if (unnecessaryTechnologies.includes(value.name)) return accumulator;

        if (
          !(
            categoryName === "JavaScript frameworks" ||
            categoryName === "JavaScript libraries"
          )
        ) {
          if (!accumulator[categoryName]) accumulator[categoryName] = [];
        }

        // Merge JavaScript libraries and JavaScript frameworks into JS libraries
        if (
          categoryName === "JavaScript frameworks" ||
          categoryName === "JavaScript libraries"
        ) {
          if (!accumulator["Javascript libraries"])
            accumulator["Javascript libraries"] = [];

          accumulator["Javascript libraries"].push(category);
        } else accumulator[categoryName].push(category);

        return accumulator;
      },
      {}
    );

    if (process.env.USE_PAYED_SERVICES === "true")
      writeToConsole(`Fetched website stack data of ${url}`, 1);

    return stack;
  } catch (error) {
    writeToConsole(`Could not fetch the ${url} stack`);
    console.error(error);
  }
};

export const stringifyStack = (stack: WebsiteStack) => {
  const stringifiedStack = Object.entries(stack)
    .map(([category, technologies]) => {
      let catStr = `**${category}**: `;
      const technologyStrings = [];

      for (let technology of technologies) {
        technologyStrings.push(technology.name);
      }

      catStr += technologyStrings.join(", ");

      return catStr;
    })
    .join("\n\n");

  return stringifiedStack;
};
