import { describe, it, expect } from 'vitest';
import App from '../src/index';

const testSitemap: string = 'https://dazzling-sherbet-63f829.netlify.app/sitemap.xml';
const totalURLCount: number = 2;

const defaultConfig = {
  sitemapURL: testSitemap,
  silent: true,
  reporters: [],
}

describe('Application', () => {
  it('should not throw any errors', () => {
    expect(() => {
      new App({ ...defaultConfig }).init();
    }).to.not.throw();
  })

  it('should test the correct number of urls', async () => {
    const actual = new App({ ...defaultConfig });
    await actual.init();

    expect(actual.results.length).to.equal(totalURLCount);
  })
});