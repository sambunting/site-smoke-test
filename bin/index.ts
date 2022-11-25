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

  // The sitemapURL is required if the config doesn't exist - or the value isn't in the config
  const sitemapPositional = config?.sitemapURL ? '[sitemapURL]' : '<sitemapURL>';

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  yargs(hideBin(process.argv))
    .command(`$0 ${sitemapPositional}`, 'Run the application', (builder) => {
      builder
        .positional('sitemapURL', {
          description: 'The url to the sitemap of the website',
          demandOption: !config,
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
