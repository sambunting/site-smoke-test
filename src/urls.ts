import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const parseXMLString = (string: string) => {
  const parser = new XMLParser();
  return parser.parse(string);
}

const getSitemapFile = async (url: string) => {
  const data = await axios(url);
  return parseXMLString(data.data);
}

const getURLs = async (sitemapURL: string) => {
  const returnValue: string[] = [];
  let sitemap = await getSitemapFile(sitemapURL);

  // If it's a sitemap index, get the files from the child file instead.
  if (sitemap?.sitemapindex?.sitemap?.loc) {
    sitemap = await getSitemapFile(sitemap.sitemapindex.sitemap.loc);
  }

  sitemap.urlset.url.forEach((url: { loc: string }) => {
    returnValue.push(url.loc);
  });

  return returnValue;
}

export default getURLs;

