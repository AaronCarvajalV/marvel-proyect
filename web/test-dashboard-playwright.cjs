const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });
    await page.fill('input#operator_id', 'aaron');
    await page.fill('input#passcode', '1234');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'screenshot_dashboard.png' });
    const html = await page.content();
    fs.writeFileSync('dom_dashboard.html', html);
    console.log("Dashboard screenshot saved");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await browser.close();
  }
})();
