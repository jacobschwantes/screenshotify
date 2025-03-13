import { ColorSchemes, FileFormats, RequestOptions } from "utils/types/options";
import { isValidUrl } from "../validation/regex";

function initOptions(options?: Partial<RequestOptions>): RequestOptions {
  const defaults = {
    url: "",
    token: "",
    width: 1920,
    height: 1080,
    format: "jpeg" as FileFormats,
    quality: 80,
    color_scheme: "light" as ColorSchemes,
    full_page: false,
    fresh: false,
    upload: true,
  };

  return {
    ...defaults,
    ...options,
  };
}

export const checkOptions = async (req, res, next) => {
  const {
    url,
    width,
    height,
    format,
    quality,
    color_scheme,
    full_page,
    fresh,
    upload,
  } = req.query;
  try {
    Object.keys(req.query).forEach((key) => {
      switch (key) {
        case "url":
          if (typeof url === "string") {
            if (isValidUrl(url)) break;
            else
              throw Error(
                "Invalid URL. URL must be in form of http(s)://example.com."
              );
          } else
            throw Error(
              "Invalid URL parameter. Only one URL may be requested at a time."
            );
          break;
        case "width":
          if (width > 5120 || width < 0 || typeof width !== "number")
            throw Error(
              "Invalid viewport width dimension. Acceptable values range from 0 to 5120."
            );
          break;
        case "height":
          if (height > 2880 || height < 0 || typeof width !== "number")
            throw Error(
              "Invalid viewport height dimension. Acceptable values range from 0 to 2880."
            );
          break;
        case "format":
          if (
            !["jpeg", "png", "webp"].includes(format) ||
            typeof format !== "string"
          )
            throw Error(
              "Invalid image format. Acceptable values are png, jpeg, or webp."
            );
          break;
        case "quality":
          if (quality > 100 || quality < 0 || typeof quality !== "number")
            throw Error(
              "Invalid quality value. Acceptable values range from 0 to 100."
            );
          break;
        case "color_scheme":
          if (
            !["light", "dark", "no-preference"].includes(color_scheme) ||
            typeof color_scheme !== "string"
          )
            throw Error(
              "Invalid color scheme option. Acceptable values are light, dark, or no-preference"
            );
          break;
        case "full_page":
          if (typeof full_page !== "boolean")
            throw Error(
              "Invalid full page option. Acceptable values are true or false."
            );
          break;
        case "fresh":
          if (typeof fresh !== "boolean")
            throw Error(
              "Invalid fresh value. Acceptable values are true or false."
            );
          break;
        case "upload":
          if (typeof upload !== "boolean")
            throw Error(
              "Invalid upload value. Acceptable values are true or false."
            );
          break;
        default:
          break;
      }

      
    });
    const options = initOptions(req.query);
    console.log(options);
    res.locals.options = options;
    next();
  } catch (e) {
    res.status(400).send(e.message);
  }
};
