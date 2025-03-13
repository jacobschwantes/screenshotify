import sharp from "sharp";

const convertToWebp = (image: Buffer, quality: number) => {
  return sharp(image).webp({ effort: 6, quality }).toBuffer();
};
export default convertToWebp
