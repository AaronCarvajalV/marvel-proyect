const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });
    // wait an extra second for particles/animation
    await page.waitForTimeout(1000);
    
    // Take a screenshot
    await page.screenshot({ path: 'screenshot.png' });
    
    // Get the HTML content
    const html = await page.content();
    fs.writeFileSync('dom.html', html);
    console.log("Screenshot saved to screenshot.png, DOM saved to dom.html");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await browser.close();
  }
})();
