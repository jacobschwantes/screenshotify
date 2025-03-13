import { launchChromium } from "playwright-aws-lambda";
import { PlaywrightBlocker } from "@cliqz/adblocker-playwright";
import fetch from "cross-fetch";
//import fetch from "cross-fetch"; // required 'fetch'
import { promises as fs } from "fs";
import sharp from "sharp";
import convertToWebp from "../processing/convertToWebp";
import { RequestOptions } from "utils/types/options";

function isValidUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    console.log("invalid url");
    return false;
  }
  return true;
}

const takeScreenshot = async ({
  url,
  height,
  width,
  format,
  quality,
  color_scheme,
  full_page,
}: RequestOptions) => {
  const startRequest = Date.now();
  let browser = null;

  try {
    const startBrowser = Date.now();
    browser = await launchChromium({ headless: true });

    console.log(Date.now() - startBrowser, " ms to start browser");
    const startContext = Date.now();
    const context = await browser.newContext({ colorScheme: color_scheme, deviceScaleFactor: 3 });
    console.log(Date.now() - startContext, " ms to start context");
    const createPage = Date.now();
    const page = await context.newPage({
      viewport: {
        height,
        width,
      },
    });

    //let device = query.device
    // ? devices.find((x) => x.name === query.device)
    // : null;
    console.log(Date.now() - createPage, " ms to create page");

    const startblocker = Date.now();
    await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch, {
      path: "engine.bin",
      read: fs.readFile,
      write: fs.writeFile,
    }).then((blocker) => {
      blocker.enableBlockingInPage(page);
    });
    // const blocker = await PlaywrightBlocker.fromLists(fetch, [
    //   "https://easylist.to/easylist/easylist.txt",
    // ]);
    // blocker.enableBlockingInPage(page);

    console.log(Date.now() - startblocker, " ms to start the ad blocker");
    const startNavigation = Date.now();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
    console.log(Date.now() - startNavigation, " ms to navigate to page");
    const startScreenshot = Date.now();
    const screenshotOptions =
      format === "jpeg"
        ? { type: "jpeg", quality, fullPage: full_page }
        : { fullPage: full_page };
    const screenshot = await page.screenshot(screenshotOptions);
    console.log(Date.now() - startScreenshot, " ms to take screenshot");

    if (format === "webp") {
      const startSharp = Date.now();
      const convertedToWebp = await convertToWebp(screenshot, quality);
      console.log(Date.now() - startSharp, " ms to make image into webp");
      return convertedToWebp;
    }

    //const sharpImage = await sharp(screenshot)
    //.webp({ effort: 6, quality: 80 })
    // .toBuffer();
    //const mockup = await createMockup(screenshot);
    console.log(Date.now() - startRequest, " ms to complete screenshot route");
    return screenshot;
  } catch (error) {
    console.log("error message ->", error, error.message);
    return error.message;
  } finally {
    console.log("closing the browser");
    await browser.close();
  }
};

export default takeScreenshot;
