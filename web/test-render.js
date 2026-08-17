import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
  
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML DUMP:');
  console.log(bodyHTML);
  
  await browser.close();
})();
