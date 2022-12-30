import playwright, { devices } from 'playwright';

type PlaywrightBrowsers = 'chromium' | 'firefox';

type PlaywrightDevices = keyof typeof devices;

/**
 * Class to manage the Playwright instance
 */
class Playwright {
  private browser: playwright.Browser | null = null;

  private context: playwright.BrowserContext | null = null;

  public page: playwright.Page | null = null;

  /**
   * Initialise Playwright launch Chrome, apply desktop context and launch a new page
   */
  init = async (
    { browser, device } : { browser: PlaywrightBrowsers, device: PlaywrightDevices },
  ) => {
    this.browser = await playwright[browser].launch();
    this.context = await this.browser.newContext(devices[device]);
    this.page = await this.context.newPage();
  };

  /**
   * Go to a page in the Playwright instance
   *
   * @param url The url to navigate to
   */
  goToPage = async (url: string) => {
    if (this.page) {
      await this.page.goto(url);
      await this.page.waitForLoadState('load');
    } else {
      throw new Error('Playwright has not been initialised by site-smoke-test.');
    }
  };

  /**
   * Shutdown Playwright
   */
  shutdown = async () => {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  };
}

export default Playwright;
