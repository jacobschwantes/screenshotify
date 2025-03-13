const bucketName = "cloud.screenshotify.app";
import { Storage } from "@google-cloud/storage";

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
