import getURLs from './Urls';
import Test from './Test';
import Playwright from './Playwright';
import ReportFactory from './report/Factory';

type Reporters = ('console')[]

interface Options {
  sitemapURL: string;
  requestBlacklist?: string[]
  reporters?: Reporters
}

class App {
  public sitemapURL: string;
  public results: Test[] = [];
  private playright: Playwright = new Playwright();
  private tests: Test[] = [];
  private urls: string[] = [];
  private reporters: Reporters = [];

  constructor(options: Options) {
    this.sitemapURL = options.sitemapURL;

    this.reporters = options.reporters || ['console'];
  }

  run = async (tests: Test[]) => {
    let currentTest: Test | null = null;

    // Handler for if `console.error` is used
    await this.playright.page!.on('console', msg => {
      if (msg.type() === 'error') {
        currentTest?.addError({
          text: msg.text(),
        })
      }
    });

    // Handler for if there is an uncaught error
    await this.playright.page!.on('pageerror', msg => {
      currentTest?.addError({
        text: msg.message,
      })
    })

    for (const test of tests) {
      console.log('Testing page', test.url);

      currentTest = test;

      await this.playright.goToPage(test.url);

      currentTest.complete();

      this.results.push(currentTest);
    }
  }

  private initTests = () => {
    this.urls.forEach((url: string) => this.tests.push(new Test({ url })))
  }

  public init = async () => {
    this.urls = (await getURLs(this.sitemapURL))

    console.log(`Found a total of ${this.urls.length} urls`)
    console.log('Starting testing environment...');

    // Launch/initialise playwright
    await this.playright.init();

    // Initialise tests
    this.initTests();

    // Run the tests
    await this.run(this.tests);

    // Once all Tests have been ran - shutdown playwright
    console.log('Testing complete, beginning teardown...');
    await this.playright.shutdown();

    this.reporters.forEach((reporter) => {
      const report = ReportFactory(reporter, this.results);
      report.execute();
    })
  }
}

export default App;