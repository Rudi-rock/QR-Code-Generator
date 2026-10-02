import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Launching browser with Edge executable...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  // 1. Home Light (Empty state)
  console.log('Capturing 01-home-light.png...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#input-url');
  // Set explicit light mode and clear history
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('qr_studio_theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '01-home-light.png') });

  // 2. URL QR (Live generation)
  console.log('Capturing 02-url-qr.png...');
  await page.type('#input-url', 'https://github.com/developer-club');
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(screenshotsDir, '02-url-qr.png') });

  // 3. Customization (Appearance accordion expanded)
  console.log('Capturing 03-customization.png...');
  const accordionBtn = await page.$('button[aria-controls="customization-controls"]');
  if (accordionBtn) {
    await accordionBtn.click();
    await new Promise(r => setTimeout(r, 500));
    // Click Level H error correction
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Level H')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 500));
  }
  await page.screenshot({ path: path.join(screenshotsDir, '03-customization.png') });

  // 4. Wi-Fi (Wi-Fi tab selected with SSID & password)
  console.log('Capturing 04-wifi.png...');
  await page.click('#tab-wifi');
  await new Promise(r => setTimeout(r, 500));
  await page.type('#input-wifi-ssid', 'SRM_Campus_HighSpeed');
  await page.type('#input-wifi-password', 'CampusPass2026');
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(screenshotsDir, '04-wifi.png') });

  // 5. History (Showing recent items clearly)
  console.log('Capturing 05-history.png...');
  // Collapse customization panel so history is prominent
  const collapseBtn = await page.$('button[aria-controls="customization-controls"]');
  if (collapseBtn) {
    await collapseBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }
  // Type a text code to add another history item
  await page.click('#tab-text');
  await new Promise(r => setTimeout(r, 400));
  await page.type('#input-text', 'Welcome to GDG on Campus SRM Recruitment 2026-27!');
  await new Promise(r => setTimeout(r, 1600)); // wait for history debounce
  await page.screenshot({ path: path.join(screenshotsDir, '05-history.png') });

  // 6. Dark Mode
  console.log('Capturing 06-dark-mode.png...');
  await page.evaluate(() => {
    localStorage.setItem('qr_studio_theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, '06-dark-mode.png') });

  // 7. Mobile Viewport (iPhone 14 standard: 390x844)
  console.log('Capturing 07-mobile.png...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotsDir, '07-mobile.png') });

  console.log('All 7 screenshots captured successfully!');
  await browser.close();
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
