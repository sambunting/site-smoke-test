import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import type Sitemap from '../types/Sitemap';

/**
 * Parse an XML string to return a Javascript object
 *
 * @param string XML string
 * @returns A parsed Javascript Object
 */
const parseXMLString = (string: string) => {
  const parser = new XMLParser();
  return parser.parse(string);
};

/**
 * Get the contents of a website's sitemap
 *
 * @param url Sitemap URL
 * @returns
 */
const getSitemapFile = async (url: string, index = 0): Promise<Sitemap> => {
  const paths = [
    // Try the URL the user entered first.
    url,
    // Add on additional enpoints which might be the sitemap
    `${url}/sitemap`,
    `${url}/sitemap.xml`,
    `${url}/sitemap-index.xml`,
    `${url}/sitemap/sitemap-index.xml`,
    `${url}/sitemap/sitemap-0.xml`,
  ];

  // If we have ran out of URLs, throw an error
  if (paths.length <= index) {
    throw new Error('Unable to retrieve sitemap.');
  }

  try {
    const data = await axios.get(paths[index]);
    const parsed = parseXMLString(data.data);

    // Check that it has a urlset, if it doesn't move onto the next url by throwing an error
    if (!parsed.urlset && !parsed.sitemapindex) {
      throw new Error(`URL ${paths[index]} is not a valid sitemap.`);
    }

    // If the sitemap only has one URL, it will appear as an object in the parsed value - set it to
    // an array
    if (parsed.urlset && !Array.isArray(parsed.urlset.url)) {
      parsed.urlset.url = [parsed.urlset.url];
    }

    return parsed;
  } catch (error) {
    // If the error contains any of these messages, handle them by effectively ignoring them and
    // getting the next potential sitemap file.
    if ([
      `URL ${paths[index]} is not a valid sitemap.`,
      'Request failed with status code 404',
    ].includes((error as Error).message)) {
      return getSitemapFile(url, index + 1);
    }

    throw error;
  }
};

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

  sitemap.urlset?.url.forEach((url: { loc: string }) => {
    returnValue.push(url.loc);
  });

  return returnValue;
};

export default getURLs;
