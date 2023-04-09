/* eslint-disable no-console */
import getURLs from './Urls';
import Test from './Test';
import Playwright from './Playwright';
import ReportFactory from './report/Factory';
import Config, { AppOptions } from './Config';
import Logger, { consoleTransport } from './Logger';

class App {
  public results: Test[] = [];

  private playwright: Playwright = new Playwright();

  private tests: Test[] = [];

  private urls: string[] = [];

  public config: Config;

  constructor(options: AppOptions) {
    this.config = new Config(options);

    // If the `silent` property isn't true in the config, enable console logging by adding the
    // console transport to the logger.
    if (!this.config.silent) {
      Logger.add(consoleTransport);
    }
  }

  /**
   * Goes through each of the tests, loads the page in Playwright, and report any errors that appear
   *
   * @param tests Array of empty/new tests
   */
  run = async (tests: Test[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      this.config.beforePage(test);

      Logger.log('info', `Testing page ${test.url}`);

      // await this.playwright.goToPage(test.url);

      // eslint-disable-next-line no-await-in-loop
      await this.playwright.loadTest(test, (page) => {
        this.config.pageConfig(page);
      });

      test.complete();

      this.config.afterPage(test);

      this.results.push(test);
    }
  };

  /**
   * Initialise test - take each of the URLs and convert them to the test class
   */
  private initTests = () => {
    this.urls.forEach((url: string) => this.tests.push(new Test({ url })));
  };

  /**
   * Set the `urls` property
   */
  private setUrls = async () => {
    if (this.config.sitemapURL.length !== 0) {
      this.urls = await getURLs(this.config.sitemapURL);
    } else {
      this.urls = this.config.urls;
    }
  };

  /**
   * Generate reports from the application running.
   */
  private generateReports = () => {
    this.config.reporters.forEach((reporter) => {
      const report = ReportFactory(reporter, this.results);
      report.execute();
    });
  };

  /**
   * Initialise the tool, get the URLs from the sitemap file, launch Playwright, run all of the
   * tests, shutdown playwright and then run the reports
   */
  public init = async () => {
    await this.setUrls();

    Logger.info(`Found a total of ${this.urls.length} urls`);
    Logger.info('Starting testing environment...');

    // Launch/initialise playwright
    Logger.info(`Launching ${this.config.browser} on ${this.config.device}`);
    await this.playwright.init({
      browser: this.config.browser!,
      device: this.config.device!,
    });

    // Initialise tests
    this.initTests();

    this.config.beforeAll(this.tests);

    // Run the tests
    await this.run(this.tests);

    this.config.afterAll(this.tests);

    // Once all Tests have been ran - shutdown playwright
    Logger.info('Testing complete, beginning teardown...');
    await this.playwright.shutdown();

    this.generateReports();

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
