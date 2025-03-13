import express, { Request, Response, NextFunction } from "express";
const port = 5000;
import mockup from "./mockup";
const app = express();
import { getFirestore } from "firebase-admin/firestore";
import { queryParser } from "express-query-parser";
import { launchChromium } from "playwright-aws-lambda";
import { listFilesByPrefix } from "./utils/gc/find";
import { uploadFromMemory } from "./utils/gc/upload";
import generateHash from "./utils/processing/generateCR32";
import takeScreenshot from "./utils/screenshot/takeScreenshot";
import { isAuthorized } from "./utils/middlewares/auth";
import {
  FileFormats,
  RequestOptions,
  ScreenshotOptions,
} from "utils/types/options";
import morgan from "morgan";
import { checkOptions } from "./utils/middlewares/parse";
import { checkQuota, incrementUsage } from "./utils/middlewares/quota";
import { lookupCache } from "./utils/middlewares/cache";
const router = express.Router();
function matchWords(subject: string, words: string[]) {
  var regex = new RegExp("\\b(?:" + words.join("|") + ")\\b", "g");
  const cleaned = subject.replace(regex, "");
  return cleaned.replace(/\./g, "_");
}
const db = getFirestore();

const updateLog = (docRef, docId: string, payload) => {
  const collectionRef = docRef.collection("logs");
  return collectionRef.doc(docId).update(payload);
}
const generateFileName = (options: string[], format: FileFormats): string => {
  return `${generateHash(options.join("_"))}`;
};
const omit = (keys: string[], obj: object) => {
  return Object.fromEntries(
    Object.entries(obj).filter((e) => !keys.includes(e[0]))
  );
};
const screenshot = async (req: Request, res: Response) => {
  console.log('made it to screenshot route')
  const options = res.locals.options;
  const { format, upload } = options;
  const startRoute = Date.now();
  try {
    console.log("taking screenshot and uploading");
    await incrementUsage(res.locals.user, res.locals.token, res.locals.options).then(id => res.locals.logId = id);
    const screenshot = await takeScreenshot(options);
    if (Buffer.isBuffer(screenshot)) {

    
    if (!upload) {
      res.setHeader("Content-Type", `image/${format}`);
      res.setHeader("Cache-Control", "max-age=86400");
      console.log(Date.now() - startRoute, " ms to finish api call");
      res.status(200).send(screenshot);
    } else {
      await uploadFromMemory(screenshot, res.locals.file_name, options);
      // res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
      console.log(Date.now() - startRoute, " ms to finish api call");
      res
        .status(200)
        .redirect(`https://cloud.screenshotify.app/${res.locals.file_name}`);
    }
    const userRef = db.collection("users").doc(res.locals.token.userid);
    updateLog(userRef, res.locals.logId, {status: "success", href: `https://cloud.screenshotify.app/${res.locals.file_name}`, latency: Date.now() - res.locals.start })
    } else throw new Error(screenshot)
  } catch (e) {
    const userRef = db.collection("users").doc(res.locals.token.userid);
    updateLog(userRef, res.locals.logId, {status: "failed", error: e.message, latency: Date.now() - res.locals.start})
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
