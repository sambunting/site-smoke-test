type Reporters = ('console' | 'junit')[];

interface RequiredOptions {
  sitemapURL: string;
}

interface Options {
  reporters: Reporters;
}

type AllOptions = RequiredOptions & Partial<Options>;

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

  constructor(options: AllOptions) {
    this.sitemapURL = options.sitemapURL;
    this.reporters = options.reporters || ['console'];
  }
}

export default Config;
