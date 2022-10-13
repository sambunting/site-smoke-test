/* eslint-disable no-console */
import getURLs from './Urls';
import Test from './Test';
import Playwright from './Playwright';
import ReportFactory from './report/Factory';

type Reporters = ('console')[];

interface Options {
  /**
   * The URL to the website's sitemap.xml file
   */
  sitemapURL: string;
  /**
   * Array of urls that would be aborted/blocked when the webpage makes a request to them
   */
  requestBlacklist?: string[]
  /**
   * Array of report formats
   */
  reporters?: Reporters,
  /**
   * Set to true if nothing should be outputted to the console, useful for unit-testing.
   */
  silent: boolean,
}

class App {
  public sitemapURL: string;

  public results: Test[] = [];

  private playright: Playwright = new Playwright();

  private tests: Test[] = [];

  private urls: string[] = [];

  private reporters: Reporters = [];

  private silent: boolean = false;

  constructor(options: Options) {
    this.sitemapURL = options.sitemapURL;
    this.silent = options.silent;

    this.reporters = options.reporters || ['console'];
  }

  /**
   * Goes through each of the tests, loads the page in Playwright, and report any errors that appear
   *
   * @param tests Array of empty/new tests
   */
  run = async (tests: Test[]) => {
    let currentTest: Test | null = null;

    // Handler for if `console.error` is used
    await this.playright.page!.on('console', (msg) => {
      if (msg.type() === 'error') {
        currentTest?.addError({
          text: msg.text(),
        });
      }
    });

    // Handler for if there is an uncaught error
    await this.playright.page!.on('pageerror', (msg) => {
      currentTest?.addError({
        text: msg.message,
      });
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      if (!this.silent) console.log('Testing page', test.url);

      currentTest = test;

      // eslint-disable-next-line no-await-in-loop
      await this.playright.goToPage(test.url);

      currentTest.complete();

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
    this.urls = (await getURLs(this.sitemapURL));

    if (!this.silent) console.log(`Found a total of ${this.urls.length} urls`);
    if (!this.silent) console.log('Starting testing environment...');

    // Launch/initialise playwright
    await this.playright.init();

    // Initialise tests
    this.initTests();

    // Run the tests
    await this.run(this.tests);

    // Once all Tests have been ran - shutdown playwright
    if (!this.silent) console.log('Testing complete, beginning teardown...');
    await this.playright.shutdown();

    this.reporters.forEach((reporter) => {
      const report = ReportFactory(reporter, this.results);
      report.execute();
    });
  };
}

export default App;
