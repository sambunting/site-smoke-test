type URL = {
  loc: string
};

type Urlset = {
  url: URL[]
};

type SitemapIndex = {
  sitemap: {
    loc: string
  }
};

type Sitemap = {
  '?xml': string,
  urlset?: Urlset,
  sitemapindex?: SitemapIndex
};

export default Sitemap;
