/* eslint-disable import/prefer-default-export */
import { beforeAll } from 'vitest';
import nock from 'nock';
import { Page } from 'playwright';

const testSitemap = 'http://unit.test/sitemap.xml';
export const totalURLCount = 2;

export const defaultConfig = {
  sitemapURL: testSitemap,
  silent: true,
  reporters: [],
  pageConfig: ((page: Page) => {
    page.route('**/*', (route) => {
      // Based off the url, decide what should be returned/mocked.

      switch (route.request().url()) {
        case 'http://unit.test/success':
          route.fulfill({ status: 200 });
          break;
        case 'http://unit.test/console-error':
          route.fulfill({ status: 200, path: './test/mock-pages/console-error.html' });
          break;
        default:
          // Unsure about the path, so pass it for now.
          route.fulfill({ status: 200 });
      }
    });
  }),
};

// Run before all of the tests
beforeAll(() => {
  // Mock a response from a sitemap file, which we will use for unit testing.
  nock('http://unit.test/').persist().get('/sitemap.xml').reply(200, `
    <urlset>
      <url>
        <loc>http://unit.test/success</loc>
      </url>
      <url>
        <loc>http://unit.test/console-error</loc>
      </url>
    </urlset/>
  `);
});
