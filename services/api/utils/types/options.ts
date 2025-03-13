export type ScreenshotOptions = {
  width: number;
  height: number;
  format: FileFormats;
  quality: number;
  url: string;
  color_scheme: ColorSchemes;
  full_page: boolean;
};
export interface RequestOptions extends ScreenshotOptions {
  fresh: boolean;
  upload: boolean;
  token: string;
}
export type FileFormats = "webp" | "jpeg" | "png";
export type ColorSchemes = "light" | "dark" | "no-preference"; 