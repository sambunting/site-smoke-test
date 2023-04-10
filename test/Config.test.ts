import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import App from '../src/index';

import { defaultConfig, totalURLCount } from './utils';

const config = {
  ...defaultConfig,
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
        const actual = new App({ ...config });
        await actual.init();

        expect(config.beforeAll).toBeCalledTimes(1);
      });
    });

    describe('afterAll', () => {
      it('should call the afterAll hook once', async () => {
        const actual = new App({ ...config });
        await actual.init();

        expect(config.afterAll).toBeCalledTimes(1);
      });
    });

    describe('beforePage', () => {
      it('should call beforePage for the number of pages to test', async () => {
        const actual = new App({ ...config });
        await actual.init();

        expect(config.beforePage).toBeCalledTimes(totalURLCount);
      });
    });

    describe('afterPage', () => {
      it('should call beforePage for the number of pages to test', async () => {
        const actual = new App({ ...config });
        await actual.init();

        expect(config.afterPage).toBeCalledTimes(totalURLCount);
      });

      it('should be able to set a test to pass', async () => {
        const actual = new App({
          ...config,
          afterPage: (test) => {
            test.pass();
          },
        });
        await actual.init();

        expect(actual.results.filter((x) => x.result)).not.toContain('fail');
      });

      it('should be able to set a test to fail', async () => {
        const actual = new App({
          ...config,
          afterPage: (test) => {
            test.fail();
          },
        });
        await actual.init();

        expect(actual.results.filter((x) => x.result)).not.toContain('pass');
      });
    });
  });
});
