import Test from './Test';

type Reporters = ('console' | 'junit')[];

interface RequiredOptions {
  sitemapURL: string;
}

interface Options {
  /**
   * Array of reporters to generate reports
   */
  reporters: Reporters;
  /**
   * Method called before all tests are run.
   */
  beforeAll: (tests: Test[]) => void;
  /**
   * Method called after all tests have ran.
   */
  afterAll: (tests: Test[]) => void;
  /**
   * Method called before a test for a page.
   */
  beforePage: (test: Test) => void;
  /**
   * Method called when a test for a page has been completed
   */
  afterPage: (test: Test) => void;
}

type AllOptions = RequiredOptions & Partial<Options>;

export type AppOptions = AllOptions;

class Config {
  /**
   * The URL to the website's sitemap.xml file
   */
  public sitemapURL: string;

  /**
   * Array of report formats
   */
  public reporters: Reporters;

  /**
   * Set to true if nothing should be outputted to the console, useful for unit-testing.
   */
  public silent = false;

  /**
   * The raw option configuration
   */
  private raw: AllOptions;

  constructor(options: AllOptions) {
    this.raw = options;

    this.sitemapURL = options.sitemapURL;
    this.reporters = options.reporters || ['console'];
  }

  beforeAll(tests: Test[]) {
    if (this.raw.beforeAll) {
      this.raw.beforeAll(tests);
    }
  }

  afterAll(tests: Test[]) {
    if (this.raw.afterAll) {
      this.raw.afterAll(tests);
    }
  }

  beforePage(test: Test) {
    if (this.raw.beforePage) {
      this.raw.beforePage(test);
    }
  }

  afterPage(test: Test) {
    if (this.raw.afterPage) {
      this.raw.afterPage(test);
    }
  }
}

export default Config;
