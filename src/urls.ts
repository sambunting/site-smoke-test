import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

/**
 * Parse an XML string to return a Javascript object
 *
 * @param string XML string
 * @returns A parsed Javascript Object
 */
const parseXMLString = (string: string) => {
  const parser = new XMLParser();
  return parser.parse(string);
}

/**
 * Get the contents of a website's sitemap
 *
 * @param url Sitemap URL
 * @returns 
 */
const getSitemapFile = async (url: string) => {
  const data = await axios(url);
  return parseXMLString(data.data);
}

/**
 * Get a list of URLS retrieved from a sitemap
 *
 * @param sitemapURL Sitemap URL
 * @returns {string[]} An array of URLs from a sitemap
 */
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

