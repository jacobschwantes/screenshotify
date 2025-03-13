/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = "cloud.screenshotify.app";

// The contents that you want to upload
const contents = "these are my contents";

// The new ID for your GCS file
const destFileName = "your-new-file-name";

// Imports the Google Cloud Node.js client library
import { Storage } from "@google-cloud/storage";
import { ScreenshotOptions } from "utils/types/options";

// Creates a client
const storage = new Storage();

export async function uploadFromMemory(
  file: Buffer,
  fileName: string,
  options: any
) {
  try {
    await storage
      .bucket(bucketName)
      .file(fileName)
      .save(file, {
        metadata: {
          contentType: `image/${options.format}`,
          metadata: {
            url: options.url,
            width: options.width,
            height: options.height,
            quality: options.quality,
            color_scheme: options.color_scheme,
            full_page: options.full_page,
          },
        },
      });
  } catch (e) {
    console.log(e);
  }
}
