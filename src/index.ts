import getURLs from './urls';
import Test from './test';
import Playwright from './playwright';

interface Options {
  sitemapURL: string;
  requestBlacklist?: string[]
}

class App {
  public sitemapURL: string;
  public results: Test[] = [];
  private playright: Playwright = new Playwright();
  private tests: Test[] = [];
  private urls: string[] = [];

  constructor(options: Options) {
    this.sitemapURL = options.sitemapURL;
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

    const overallPass = this.results.filter((x) => x.result === 'fail').length > 0 ? false : true;

    console.log(this.results);

    if (overallPass) {
      console.log('All tests completed successfully!')
    } else {
      console.log('FAIL');
    }
  }
}

export default App;