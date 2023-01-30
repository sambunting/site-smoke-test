#!/usr/bin/env node

import yargs from 'yargs';
import { cosmiconfig } from 'cosmiconfig';
import { hideBin } from 'yargs/helpers';

import App from '../src';
import { ReporterList } from '../src/report/Factory';

(async () => {
  // Find and get the config file if it exists.
  // Using 'cosmiconfig' due to issues loading Javascript files on Windows.
  const { config } = await cosmiconfig('site-smoke-test').search(process.cwd()) || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  yargs(hideBin(process.argv))
    .command('$0 [sitemapURL]', 'Run the application', (builder) => {
      builder
        .positional('sitemapURL', {
          description: 'The url to the sitemap of the website',
        })
        .option('urls', {
          description: 'List of urls to test',
          type: 'array',
        })
        .option('browser', {
          description: 'The browser to view the site in',
          default: 'chromium',
          choices: ['chromium', 'firefox', 'webkit'],
        })
        .option('device', {
          description: 'The device to emulate when running the tool',
          default: 'Desktop Chrome',
        })
        .option('reporters', {
          description: 'Array of reporters to generate the results from',
          type: 'array',
          default: ['console'],
          choices: ReporterList,
        });
    }, (args: any) => {
      // Merge together configurations so the CLI arguments would overwrite the config.
      const finalConfig = { ...config, ...args };

      const app = new App(finalConfig);
      app.init();
    })
    .argv;
})();
