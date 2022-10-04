import playwright, { devices } from 'playwright';

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
  init = async () => {
    this.browser = await playwright.chromium.launch();
    this.context = await this.browser.newContext(devices['Desktop Chrome']);
    this.page = await this.context.newPage();
  }

  /**
   * Go to a page in the Playwright instance
   *
   * @param url The url to navigate to
   */
  goToPage = async (url: string) => {
    await this.page!.goto(url);
    await this.page!.waitForLoadState('networkidle');
  }

  /**
   * Shutdown Playwright
   */
  shutdown = async () => {
    await this.context!.close();
    await this.browser!.close();
  }
}

export default Playwright;