import generateHash from "./generateCR32";
import { FileFormats } from "utils/types/options";
export const generateFileName = (
  options: string[],
  format: FileFormats
): string => {
  return `${generateHash(options.join("_"))}`;
};
