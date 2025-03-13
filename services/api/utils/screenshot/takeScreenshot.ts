import { launchChromium } from "playwright-aws-lambda";
import { PlaywrightBlocker } from "@cliqz/adblocker-playwright";
import fetch from "cross-fetch";
import { promises as fs } from "fs";
import convertToWebp from "../processing/convertToWebp";
import { RequestOptions } from "utils/types/options";

const takeScreenshot = async ({
	url,
	height,
	width,
	format,
	quality,
	color_scheme,
	full_page,
}: RequestOptions) => {
	let browser = null;

	try {
		// launch chromium browser
		browser = await launchChromium({ headless: true });
		// create a new context, we can use this to create multiple pages
		const context = await browser.newContext({
			colorScheme: color_scheme,
			deviceScaleFactor: 3,
		});
		// create a new page within the context
		const page = await context.newPage({
			viewport: {
				height,
				width,
			},
		});

		// block ads and tracking
		await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch, {
			path: "engine.bin",
			read: fs.readFile,
			write: fs.writeFile,
		}).then((blocker) => {
			blocker.enableBlockingInPage(page);
		});

		// navigate to the url and wait until the network is idle, ie. no more requests for 500ms
		await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

		// set the screenshot options
		const screenshotOptions =
			format === "jpeg"
				? { type: "jpeg", quality, fullPage: full_page }
				: { fullPage: full_page };

		// take the screenshot
		const screenshot = await page.screenshot(screenshotOptions);

		if (format === "webp") {
			return await convertToWebp(screenshot, quality);
		}

		return screenshot;
	} catch (error) {
		return error.message;
	} finally {
		await browser.close();
	}
};

export default takeScreenshot;
