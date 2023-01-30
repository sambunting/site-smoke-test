import { describe, it, expect } from 'vitest';
import App from '../src/index';

import { defaultConfig, totalURLCount } from './utils';

describe('Application', () => {
  it('should not throw any errors', () => {
    expect(() => {
      new App({ ...defaultConfig }).init();
    }).to.not.throw();
  });

  it('should test the correct number of urls', async () => {
    const actual = new App({ ...defaultConfig });
    await actual.init();

    expect(actual.results.length).to.equal(totalURLCount);
  });

  it('should test the correct number of urls when using the urls flag', async () => {
    const config = {
      ...defaultConfig,
      urls: [
        'http://unit.test/success',
        'http://unit.test/console-error',
      ],
    } as any;
    delete config.sitemapURL;

    const actual = new App(config);
    await actual.init();

    expect(actual.results.length).to.equal(2);
  });
});
