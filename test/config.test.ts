import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import App from '../src/index';

const testSitemap = 'https://dazzling-sherbet-63f829.netlify.app/sitemap.xml';
const totalURLCount = 2;

const defaultConfig = {
  sitemapURL: testSitemap,
  silent: true,
  reporters: [],
  beforeAll: vi.fn(),
  afterAll: vi.fn(),
  beforePage: vi.fn(),
  afterPage: vi.fn(),
};

describe('Config', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Hooks', () => {
    describe('beforeAll', () => {
      it('should call the beforeAll hook once', async () => {
        const actual = new App({ ...defaultConfig });
        await actual.init();

        expect(defaultConfig.beforeAll).toBeCalledTimes(1);
      });
    });

    describe('afterAll', () => {
      it('should call the afterAll hook once', async () => {
        const actual = new App({ ...defaultConfig });
        await actual.init();

        expect(defaultConfig.afterAll).toBeCalledTimes(1);
      });
    });

    describe('beforePage', () => {
      it('should call beforePage for the number of pages to test', async () => {
        const actual = new App({ ...defaultConfig });
        await actual.init();

        expect(defaultConfig.beforePage).toBeCalledTimes(totalURLCount);
      });
    });

    describe('afterPage', () => {
      it('should call beforePage for the number of pages to test', async () => {
        const actual = new App({ ...defaultConfig });
        await actual.init();

        expect(defaultConfig.afterPage).toBeCalledTimes(totalURLCount);
      });
    });
  });
});
