# Inspiration Scraper

Scripts that _(kind of)_ automate the writing process for Web Design Inspiration articles.

## Before using:

- Make sure you have the following keys in your .env file:
  - DB_URL - database to persist scraped website, to check if a website was already used
  - WAPPALYZER_API_KEY - Wappalyzer API key

## How to use:

- To generate an article, run `npm run generate-article`, which will create an article in the `/assets/articles` folder based on the options in `/inspiration-sources/options.ts`;
- If a screenshot is not good, you have to take one manually from the website;
- To regenerate a color palette based on a manually-taken screenshot - use the `generate-palette:image` and `generate-palette:hex` scripts. Usage examples can be found in their respective files;
- Article upload: currenly no automation is done in this regard. The plan is to upload articles as private gists on Github, to be then imported into Medium, as Medium doesn't accept direct markdown support. For now, the article can be pasted manually section by section in Medium's editor.

## Scripts:

- Generate article: `npm run generate-article`
- Generate color palette by image title: `npm run generate-palette:image -- --title=Gemini --numberOfColors=3`
- Generate color palette by hex codes: `npm run generate-palette:hex -- --title=Gemini --codes "#4EABD1" "#25272C"`
- Remove articles: `npm run remove-articles`
- Remove website assets and clear website DB table: `npm run remove-websites`
- Remove everything: `npm run remove-all`
