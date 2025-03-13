import { matchWords } from "../validation/regex";
import { generateFileName } from "../processing/naming";
import { listFilesByPrefix } from "../gc/find";
export const lookupCache = async (req, res, next) => {
  const {
    height,
    width,
    url,
    format,
    fresh,
    upload,
    quality,
    color_scheme,
    full_page,
  } = res.locals.options;

  const cleanUrl = matchWords(url, ["https://", "http", "www."]);
  const filePrefix = generateFileName(
    [cleanUrl, width, height, quality, color_scheme, full_page],
    format
  );
  const fileName = `${filePrefix}${9000000000000 - Date.now()}.${format}`;
  res.locals.file_name = fileName;
  if (fresh) {
    console.log("skipping cache..");
    next();
  } else {
    console.log("checking cache..");
    const startFind = Date.now();
    const listFiles = await listFilesByPrefix(filePrefix, res.locals.options);
    console.log(Date.now() - startFind, " ms to find files");
    if (listFiles) {
      console.log("current file exists");
      res
        .status(200)
        .redirect(`https://cloud.screenshotify.app/${listFiles.name}`);
    } else next();
  }
};
