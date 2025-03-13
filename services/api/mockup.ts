import { createMockup } from "./utils/mockups/createMockup";
import { getAverageColor } from "fast-average-color-node";
import takeScreenshot from "./utils/screenshot/takeScreenshot";
const mockup = async (req, res) => {
    const startMockup = Date.now()
  const { height, width, url, format, backgroundColor, quality } = req.query;
  const options = res.locals.options;
  console.log('entered mockup route')
  try {
    const screenshot = await takeScreenshot(options);
    if (screenshot) {
        console.log(1)
        const color = await getAverageColor(screenshot, {algorithm: "simple"});
        console.log(color)
      const mockup = await createMockup(screenshot, color.rgb);
      if (true) {
        console.log(2)
        res.setHeader("Content-Type", "image/jpeg");
        // res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
        console.log(Date.now() - startMockup, ' ms to create mockup')
        res.status(200).send(mockup);
      } else {
        throw new Error("failed to take mockup");
      }
    } else {
      throw new Error("failed to take screenshot");
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
export default mockup