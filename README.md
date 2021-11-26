# Inspiration Scraper

Scripts that _(kind of)_ automate the writing process for Web Design Inspiration articles.

## Before using:

- Make sure you have the following keys in your .env file:
  - DB_URL - database to persist scraped website, to check if a website was already used
  - ARTICLES_PER_MONTH - changes the title of the article
  - COLORS_IN_PALETTE - number of colors in color palettes
  - AWWWARDS_NUM_OF_ENTRIES
  - LAPA_NUM_OF_ENTRIES
  - BESTWEBSITEGALLERY_NUM_OF_ENTRIES
  - WEBDESIGNINSPIRATION_NUM_OF_ENTRIES
  - THEFWA_NUM_OF_ENTRIES

## How to use:

- To generate an article, run `npm run generate-article`, which will create an article in the `/assets/articles` folder;
- If a screenshot is not good, you have to take one manually from the website;
- To regenerate a color palette based on a manually-taken screenshot - use the `generate-palette:image` and `generate-palette:hex` scripts. Usage examples can be found in their respective files;
- Article upload: currenly no automation is done in this regard. The plan is to upload articles as private gists on Github, to be then imported into Medium, as Medium doesn't accept direct markdown support. For now, the article can be pasted manually section by section in Medium's editor.
