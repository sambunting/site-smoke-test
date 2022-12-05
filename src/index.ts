/* eslint-disable no-console */
import getURLs from './Urls';
import Test from './Test';
import Playwright from './Playwright';
import ReportFactory from './report/Factory';
import Config, { AppOptions } from './Config';

class App {
  public results: Test[] = [];

  private playwright: Playwright = new Playwright();

  private tests: Test[] = [];

  private urls: string[] = [];

  public config: Config;

  constructor(options: AppOptions) {
    this.config = new Config(options);
  }

  /**
   * Goes through each of the tests, loads the page in Playwright, and report any errors that appear
   *
   * @param tests Array of empty/new tests
   */
  run = async (tests: Test[]) => {
    let currentTest: Test | null = null;

    if (this.playwright && this.playwright.page) {
      // Handler for if `console.error` is used
      await this.playwright.page.on('console', (msg) => {
        if (msg.type() === 'error') {
          currentTest?.addError({
            text: msg.text(),
          });
        }
      });

      // Handler for if there is an uncaught error
      await this.playwright.page.on('pageerror', (msg) => {
        currentTest?.addError({
          text: msg.message,
        });
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      this.config.beforePage(test);

      if (!this.config.silent) console.log('Testing page', test.url);

      currentTest = test;

      // eslint-disable-next-line no-await-in-loop
      await this.playwright.goToPage(test.url);

      currentTest.complete();

      this.config.afterPage(test);

      this.results.push(currentTest);
    }
  };

  /**
   * Initialise test - take each of the URLs and convert them to the test class
   */
  private initTests = () => {
    this.urls.forEach((url: string) => this.tests.push(new Test({ url })));
  };

  /**
   * Initialise the tool, get the URLs from the sitemap file, launch Playwright, run all of the
   * tests, shutdown playwright and then run the reports
   */
  public init = async () => {
    this.urls = (await getURLs(this.config.sitemapURL));

    if (!this.config.silent) console.log(`Found a total of ${this.urls.length} urls`);
    if (!this.config.silent) console.log('Starting testing environment...');

    // Launch/initialise playwright
    await this.playwright.init();

    // Initialise tests
    this.initTests();

    this.config.beforeAll(this.tests);

    // Run the tests
    await this.run(this.tests);

    this.config.afterAll(this.tests);

    // Once all Tests have been ran - shutdown playwright
    if (!this.config.silent) console.log('Testing complete, beginning teardown...');
    await this.playwright.shutdown();

    this.config.reporters.forEach((reporter) => {
      const report = ReportFactory(reporter, this.results);
      report.execute();
    });

    // If any of the tests have failed, exit the tool with the 1 exit code, this is so it can be
    // caught by CI processes
    if (this.tests.filter((x) => x.result === 'fail').length !== 0) {
      // We don't want the unit tests to exit via code 1, so only do it if we're not in a testing
      // environment
      if (!process.env.TEST) {
        process.exit(1);
      }
    }
  };
}

export default App;
