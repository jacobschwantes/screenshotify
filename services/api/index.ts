import express, { Request, Response } from "express";
const port = 5000;
import mockup from "./mockup";
const app = express();
import { getFirestore } from "firebase-admin/firestore";
import { queryParser } from "express-query-parser";
import { uploadFromMemory } from "./utils/gc/upload";
import generateHash from "./utils/processing/generateCR32";
import takeScreenshot from "./utils/screenshot/takeScreenshot";
import { isAuthorized } from "./utils/middlewares/auth";
import { FileFormats } from "utils/types/options";
import morgan from "morgan";
import { checkOptions } from "./utils/middlewares/parse";
import { checkQuota, incrementUsage } from "./utils/middlewares/quota";
import { lookupCache } from "./utils/middlewares/cache";

const router = express.Router();
const db = getFirestore();

const updateLog = (docRef, docId: string, payload) => {
	const collectionRef = docRef.collection("logs");
	return collectionRef.doc(docId).update(payload);
};

const screenshot = async (req: Request, res: Response) => {
	const options = res.locals.options;
	const { format, upload } = options;

	try {
		await incrementUsage(
			res.locals.user,
			res.locals.token,
			res.locals.options
		).then((id) => (res.locals.logId = id));

		const screenshot = await takeScreenshot(options);

		// if the screenshot successfully generated, upload or send the image
		if (Buffer.isBuffer(screenshot)) {
			// if the upload flag is set to false, just return the buffer directly
			if (!upload) {
				res.setHeader("Content-Type", `image/${format}`);
				res.setHeader("Cache-Control", "max-age=86400");
				res.status(200).send(screenshot);
			} else {
				// otherwise upload, and redirect to the uploaded image
				await uploadFromMemory(screenshot, res.locals.file_name, options);
				res
					.status(200)
					.redirect(`https://cloud.screenshotify.app/${res.locals.file_name}`);
			}
			// update the log with the success status
			const userRef = db.collection("users").doc(res.locals.token.userid);
			updateLog(userRef, res.locals.logId, {
				status: "success",
				href: `https://cloud.screenshotify.app/${res.locals.file_name}`,
				latency: Date.now() - res.locals.start,
			});
		} else throw new Error(screenshot);
	} catch (e) {
		const userRef = db.collection("users").doc(res.locals.token.userid);
		updateLog(userRef, res.locals.logId, {
			status: "failed",
			error: e.message,
			latency: Date.now() - res.locals.start,
		});
		res.status(400).send(e.message);
	}
};

app.use(morgan("dev"));
app.use(
	queryParser({
		parseNull: true,
		parseUndefined: true,
		parseBoolean: true,
		parseNumber: true,
	})
);
app.use(
	"/screenshot",
	isAuthorized,
	checkOptions,
	lookupCache,
	checkQuota,
	screenshot
);
app.use("/mockup", mockup);
const index = (req, res) => {
	res.send("Hello from the index route...");
};
router.get("", index);
app.use("/*", router);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

export const api = app;
