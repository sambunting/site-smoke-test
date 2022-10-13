#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import App from '../src';
import { ReporterList } from '../src/report/Factory';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .command('$0 <sitemapURL>', 'Run the application', (builder) => {
    builder
      .positional('sitemapURL', {
        description: 'The url to the sitemap of the website',
        demandOption: true,
      })
      .option('reporters', {
        description: 'Array of reporters to generate the results from',
        type: 'array',
        default: ['console'],
        choices: ReporterList,
      });
  }, (args: any) => {
    const app = new App(args);
    app.init();
  })
  .argv;
