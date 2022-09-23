import playwright, { devices } from 'playwright';
import getURLs from './urls';

interface IOptions {
  sitemapURL: string;
  requestBlacklist?: string[]
}

const options: IOptions = {
  sitemapURL: 'https://sam.bunting.dev/sitemap/sitemap-index.xml',
  requestBlacklist: [
    'googletagmanager.com',
    'google-analytics.com'
  ]
};

(async () => {
  const urls = (await getURLs(options.sitemapURL))

  console.log(`Found a total of ${urls.length} urls`)

  console.log('Starting testing environment...');
  // Setup playwright
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext(devices['Desktop Chrome']);
  const page = await context.newPage();
  
  for (const url of options?.requestBlacklist!) {
    await page.route(`/${url}/g`, route => route.abort());
  }

  page.on('console', msg => {
    if (msg.type() === 'error')
      console.log(`Error text: "${msg.text()}"`);
  });

  for (const url of urls) {
    console.log('Testing page', url);

    await page.goto(url);
    await page.waitForLoadState('networkidle');
  }

  console.log('Testing complete, beginning teardown...')

  await context.close();
  await browser.close();
})();