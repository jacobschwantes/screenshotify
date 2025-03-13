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

	// if fresh is true, skip cache and generate new image
	if (fresh) {
		next();
	} else {
		// check if the file exists in the cache
		const listFiles = await listFilesByPrefix(filePrefix, res.locals.options);
		if (listFiles) {
			res
				.status(200)
				.redirect(`https://cloud.screenshotify.app/${listFiles.name}`);
		} else next();
	}
};
