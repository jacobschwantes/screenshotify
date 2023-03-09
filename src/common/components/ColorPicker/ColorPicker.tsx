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
    <div className="flex items-center space-x-2 relative">
      <Popover
      
        render={() =>
          type === "hex" ? (
            <div className="bg-zinc-900 p-3 rounded-lg space-y-3">
              <HexColorPicker color={color} onChange={setColor} className="" />
              <div className="flex items-center space-x-3">
                <p className="text-zinc-400 font-bold text-base">HEX</p>
                <HexColorInput
                  className="form-input shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-zinc-700 rounded-md bg-zinc-800 w-20 text-zinc-300 font-medium"
                  color={color}
                  onChange={setColor}
                />
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 p-3 rounded-lg space-y-3">
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
          className="rounded-full p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 border-zinc-500 border-2 z-10 border-opacity-30 "
        />
      </Popover>
    </div>
  );
};
export default ColorPicker;
