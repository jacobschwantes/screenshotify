/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = "cloud.screenshotify.app";

// The directory prefix to search for
// const prefix = 'myDirectory/';

// The delimiter to use
// const delimiter = '/';

// Imports the Google Cloud client library
import { Storage } from "@google-cloud/storage";
import { RequestOptions } from "utils/types/options";

// Creates a client
const storage = new Storage();

export async function listFilesByPrefix(
  prefix: string,
  options: RequestOptions
) {
  /**
   * This can be used to list all blobs in a "folder", e.g. "public/".
   *
   * The delimiter argument can be used to restrict the results to only the
   * "files" in the given "folder". Without the delimiter, the entire tree under
   * the prefix is returned. For example, given these blobs:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * If you just specify prefix = 'a/', you'll get back:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * However, if you specify prefix='a/' and delimiter='/', you'll get back:
   *
   *   /a/1.txt
   */
  const findOptions = {
    prefix: prefix,
    autoPaginate: false,
    maxResults: 1,
  };

  const [files] = await storage.bucket(bucketName).getFiles(findOptions);
  const suitableFiles = [];
  const startForEach = Date.now();
  await files.forEach((file) => {
    console.log(file.name);
    let { url, width, height, quality, color_scheme, full_page } =
      file.metadata.metadata;
    let format = file.metadata.contentType;
    let createdAt = Date.parse(file.metadata.timeCreated);
    if (
      url === options.url &&
      width === `${options.width}` &&
      height === `${options.height}` &&
      format === `image/${options.format}` &&
      quality === `${options.quality}` &&
      color_scheme === options.color_scheme &&
      full_page === `${options.full_page}` &&
      Date.now() - createdAt < 86400000
    ) {
      console.log("file is suitable");
      suitableFiles.push(file);
    }
  });
  console.log(Date.now() - startForEach, " ms for for each");
  return suitableFiles[0];
}
