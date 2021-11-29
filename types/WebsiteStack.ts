export interface WebsiteTechnology {
  name: string;
  category: string;
}

export interface WebsiteStack {
  [key: string]: WebsiteTechnology[];
}

export interface WappalyzerTechnology {
  slug: string;
  name: string;
  versions: string[];
  categories: WappalyzerCategory[];
  trafficRank: number;
  confirmedAt: number;
}

export interface WappalyzerCategory {
  id: number;
  slug: string;
  name: string;
}

export type WappalyzerResponse = Array<{
  url: string;
  technologies: WappalyzerTechnology[];
}>;
