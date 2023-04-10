import {
  describe, it, expect, vi, beforeEach, Mocked,
} from 'vitest';
import axios from 'axios';

import URLs from '../../src/utils/Urls';

vi.mock('axios');

const mockedAxios = axios as Mocked<typeof axios>;

const defaultSitemap = `
<urlset>
  <url>
    <loc>http://unit.test/path/1</loc>
  </url>
  <url>
    <loc>http://unit.test/path/2</loc>
  </url>
  <url>
    <loc>http://unit.test/path/3</loc>
  </url>
</urlset/>
`;

describe('Urls', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  describe('default', () => {
    it('should return a list of URLs', async () => {
      mockedAxios.get.mockResolvedValue({
        data: defaultSitemap,
      });

      const actual = await URLs('http://unit.test');
      expect(actual.length).to.equal(3);
    });

    it('should make get requests multiple times for different possible sitemap files', async () => {
      mockedAxios.get.mockImplementation(async (path: string) => {
        if (path === 'http://unit.test') {
          return { data: '' };
        }

        return {
          data: defaultSitemap,
        };
      });

      await URLs('http://unit.test');

      expect(mockedAxios.get).toBeCalledTimes(2);
    });

    it('should throw an error if it cant get a sitemap', async () => {
      mockedAxios.get.mockResolvedValue({ data: '' });

      await expect(async () => URLs('http://unit.test')).rejects.toThrow('Unable to retrieve sitemap');
    });

    it('should throw an error if the url is invalid', async () => {
      await expect(async () => URLs('invalid url')).rejects.toThrow();
    });

    it('should handle an error if the sitemap request is a 404 error', async () => {
      mockedAxios.get.mockRejectedValue(Error('Request failed with status code 404'));

      await expect(async () => URLs('http://unit.test')).rejects.toThrow('Unable to retrieve sitemap');

      expect(mockedAxios.get).toBeCalledTimes(6);
    });

    it('should be able to parse a sitemap with only one url in it', async () => {
      mockedAxios.get.mockResolvedValue({
        data: `
          <urlset>
            <url>
              <loc>http://unit.test/path/1</loc>
            </url>
          </urlset/>
        `,
      });

      const actual = await URLs('http://unit.test');

      expect(actual.length).to.equal(1);
    });

    it('should be able to parse a sitemap-index file', async () => {
      mockedAxios.get.mockImplementation(async (path: string) => {
        if (path === 'http://unit.test') {
          return {
            data: `
              <sitemapindex>
                <sitemap>
                  <loc>http://unit.test/actual-sitemap</loc>
                </sitemap>
              </sitemapindex>
            `,
          };
        }

        return {
          data: defaultSitemap,
        };
      });

      const actual = await URLs('http://unit.test');

      expect(mockedAxios.get).toBeCalledTimes(2);
      expect(actual.length).to.equal(3);
    });
  });
});
