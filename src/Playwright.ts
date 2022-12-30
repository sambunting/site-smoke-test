import playwright, { devices } from 'playwright';

type PlaywrightBrowsers = 'chromium' | 'firefox' | 'webkit';

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
    // Check to see if the browser exists
    if (!Object.keys(playwright).includes(browser as string)) {
      throw new Error(`Browser '${browser}' is not a valid browser. Define a browser such as 'chromium', 'firefox' or 'webkit'`);
    }

    // Check to see if the device exists
    if (!Object.keys(devices).includes(device as string)) {
      throw new Error(`Device '${device}' is not a valid device. For a full list of devices - see https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json`);
    }

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
