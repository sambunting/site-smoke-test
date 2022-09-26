import playwright, { devices } from 'playwright';
import getURLs from './urls';
import Test from './test';

interface IOptions {
  sitemapURL: string;
  requestBlacklist?: string[]
}

const options: IOptions = {
  sitemapURL: 'https://dazzling-sherbet-63f829.netlify.app/sitemap.xml',
  requestBlacklist: [
    'googletagmanager.com',
    'google-analytics.com'
  ]
};

(async () => {
  const urls = (await getURLs(options.sitemapURL))
  const results: Test[] = [];

  console.log(`Found a total of ${urls.length} urls`)

  console.log('Starting testing environment...');

  // Setup playwright
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext(devices['Desktop Chrome']);
  const page = await context.newPage();
  
  for (const url of options?.requestBlacklist!) {
    await page.route(`/${url}/g`, route => route.abort());
  }

  // Initialise tests
  const tests: Test[] = [];

  urls.forEach((url) => {
    tests.push(new Test({
      url,
    }))
  })

  let currentTest: Test | null = null;

  // Handler for if `console.error` is used
  await page.on('console', msg => {
    if (msg.type() === 'error') {
      currentTest?.addError({
        text: msg.text(),
      })
    }
  });

  // Handler for if there is an uncaught error
  await page.on('pageerror', msg => {
    currentTest?.addError({
      text: msg.message,
    })
  })

  for (const test of tests) {
    console.log('Testing page', test.url);

    currentTest = test;

    await page.goto(test.url);
    await page.waitForLoadState('networkidle');

    currentTest.complete();

    results.push(currentTest);
  }

  console.log('Testing complete, beginning teardown...');

  await context.close();
  await browser.close();

  const overallPass = results.filter((x) => x.result === 'fail').length > 0 ? false : true;

  console.log(results);

  if (overallPass) {
    console.log('All tests completed successfully!')
  } else {
    console.log('FAIL');
  }
})();