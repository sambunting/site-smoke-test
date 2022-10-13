interface RequiredOptions {
  sitemapURL: string;
}

type Reporters = ('console' | 'junit')[];

class Config {
  /**
   * The URL to the website's sitemap.xml file
   */
  public sitemapURL: string;

  /**
   * Array of report formats
   */
  public reporters: Reporters = ['console'];

  /**
   * Set to true if nothing should be outputted to the console, useful for unit-testing.
   */
  public silent: boolean = false;

  constructor(options: RequiredOptions) {
    this.sitemapURL = options.sitemapURL;
  }
}

export default Config;
