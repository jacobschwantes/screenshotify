const bucketName = "cloud.screenshotify.app";

import { Storage } from "@google-cloud/storage";
import { RequestOptions } from "utils/types/options";

const storage = new Storage();

export async function listFilesByPrefix(
	prefix: string,
	options: RequestOptions
) {
	const findOptions = {
		prefix: prefix,
		autoPaginate: false,
		maxResults: 1,
	};

	const [files] = await storage.bucket(bucketName).getFiles(findOptions);
	const suitableFiles = [];
	files.forEach((file) => {
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
			suitableFiles.push(file);
		}
	});

	return suitableFiles[0];
}
