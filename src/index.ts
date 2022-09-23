import playwright, { devices } from 'playwright';
import getURLs from './urls';

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
  const results = [];

  console.log(`Found a total of ${urls.length} urls`)

  console.log('Starting testing environment...');
  // Setup playwright
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext(devices['Desktop Chrome']);
  const page = await context.newPage();
  
  for (const url of options?.requestBlacklist!) {
    await page.route(`/${url}/g`, route => route.abort());
  }

  let currentTest: any = { result: 'pass' };

  // Handler for if `console.error` is used
  await page.on('console', msg => {
    if (msg.type() === 'error')
      currentTest.result = 'fail';

      console.log(`Error text: "${msg.text()}"`);
  });

  // Handler for if there is an uncaught error
  await page.on('pageerror', msg => {
    currentTest.result = 'fail'

    console.log('uncaught error', msg.message)
  })

  for (const url of urls) {
    console.log('Testing page', url);

    currentTest.url = url;

    await page.goto(url);
    await page.waitForLoadState('networkidle');

    results.push({ ...currentTest });
    currentTest = Object.assign({ result: 'pass' }, {});
  }

  console.log('Testing complete, beginning teardown...');

  await context.close();
  await browser.close();

  const overallPass = results.filter((x) => x.result === 'fail').length > 0 ? false : true;

  if (overallPass) {
    console.log('All tests completed successfully!')
  } else {
    console.log('FAIL');
  }
})();