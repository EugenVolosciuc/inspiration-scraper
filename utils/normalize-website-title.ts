const normalizeWebsiteTitle = (title: string | undefined) => {
  if (title) return title.replace(/\n/g, "").trim();

  return title;
};

export default normalizeWebsiteTitle;
