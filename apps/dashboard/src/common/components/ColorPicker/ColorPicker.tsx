import { NextComponentType, NextPageContext } from "next";
import Popover from "../Popover/Popover";
import {
  HexColorPicker,
  HexColorInput,
  RgbaStringColorPicker,
} from "react-colorful";
interface ColorPickerProps {
  color: string;
  setColor: (val: string) => void;
  type: string;
}
const ColorPicker: NextComponentType<NextPageContext, {}, ColorPickerProps> = ({
  color,
  setColor,
  type = "hex",
}) => {
  return (
    <div className="relative flex items-center space-x-2">
      <Popover
        render={() =>
          type === "hex" ? (
            <div className="space-y-3 rounded-lg bg-zinc-900 p-3">
              <HexColorPicker color={color} onChange={setColor} className="" />
              <div className="flex items-center space-x-3">
                <p className="text-base font-bold text-zinc-400">HEX</p>
                <HexColorInput
                  className="form-input block w-20 rounded-md border-zinc-700 bg-zinc-800 font-medium text-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  color={color}
                  onChange={setColor}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 rounded-lg bg-zinc-900 p-3">
              <RgbaStringColorPicker
                color={color}
                onChange={setColor}
                className=""
              />
              <p>{color}</p>
            </div>
          )
        }
      >
        <button
          style={{ background: color }}
          className="z-10 rounded-full border-2 border-zinc-500 border-opacity-30 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 "
        />
      </Popover>
    </div>
  );
};
export default ColorPicker;
