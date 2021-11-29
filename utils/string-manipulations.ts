export const normalizeWebsiteTitle = (title: string | undefined) => {
  if (title) return title.replace(/\n/g, "").trim();

  return title;
};

export const titleToFileName = (title: string) => title.replace(/ /g, "_");

export const getWebsiteDomain = (websiteURL: string) =>
  websiteURL.split("?")[0];
