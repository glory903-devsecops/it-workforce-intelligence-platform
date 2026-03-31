import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../video");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
await page.waitForTimeout(5000);
const screenshotPath = path.join(outDir, "demo_capture.png");
await page.screenshot({ path: screenshotPath, fullPage: true });
await page.close();
const videoPath = await page.video().path();
console.log(`Saved video to ${videoPath}`);
await browser.close();
