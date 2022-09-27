import playwright, { devices } from 'playwright';

class Playwright {
  private browser: playwright.Browser | null = null;
  private context: playwright.BrowserContext | null = null;
  public page: playwright.Page | null = null;

  init = async () => {
    this.browser = await playwright.chromium.launch();
    this.context = await this.browser.newContext(devices['Desktop Chrome']);
    this.page = await this.context.newPage();
  }

  goToPage = async (url: string) => {
    await this.page!.goto(url);
    await this.page!.waitForLoadState('networkidle');
  }

  shutdown = async () => {
    await this.context!.close();
    await this.browser!.close();
  }
}

export default Playwright;