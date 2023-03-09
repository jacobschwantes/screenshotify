import clsx from "clsx";
import { NextComponentType, NextPageContext } from "next";
const labels = {
  percent: 37,
  degree: 186,
};
interface RangeProps {
  children: React.ReactNode;
  value: number;
  set: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValues?: boolean;
  label?: "degree" | "percent";
}
const Range: NextComponentType<NextPageContext, {}, RangeProps> = ({
  value,
  children,
  set,
  min = -1,
  max = 1,
  showValues = true,
  label,
  step = 1,
}) => (
  <div className="flex items-center space-x-3">
    <label htmlFor="customRange1" className=" font-medium">
      {children}
    </label>
    <div className="flex flex-1 items-center space-x-3">
      <input
        style={{
          backgroundSize: ((value - min) * 100) / (max - min) + "% 100%",
        }}
        className="slider h-0.5 w-full appearance-none rounded-full bg-zinc-600 p-0 focus:shadow-none focus:outline-none focus:ring-0"
        value={value}
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={(e) => set(parseFloat(e.target.value))}
      />
      {showValues && (
        <div className="relative">
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col -space-y-1.5  pb-0.5 text-zinc-400">
            <button
              className="h-4  rounded transition-all duration-300 hover:text-zinc-200"
              onClick={() => value + step <= max && set(value + step)}
            >
              <svg
                className="mt-0.5"
                height="inherit"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z" />
              </svg>
            </button>
            <button
              className="h-4 rounded transition-all duration-300 hover:text-zinc-200"
              onClick={() => value - step >= min && set(value - step)}
            >
              <svg height="inherit" fill="currentColor" viewBox="0 0 24 24">
                <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z" />
              </svg>
            </button>
          </div>

          <input
            onChange={(e) => set(parseFloat(e.target.value))}
            value={value}
            max={max}
            min={min}
            type="number"
            name="number-input"
            id="number-input"
            className="form-input block max-w-[75px] rounded-md border-zinc-300 py-1.5 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 sm:text-sm"
          />
        </div>
      )}
    </div>
    {/* {false && (
      <div className="text-zinc-400 text-xs mt-1 font-medium relative">
        <span className="absolute left-0">
          {min}
          {label && String.fromCharCode(labels[label])}
        </span>
        <span className="text-sm text-zinc-100 absolute left-1/2 -translate-x-1/2">
          {value}
          {label && String.fromCharCode(labels[label])}
        </span>
        <span className="absolute right-0">
          {max}
          {label && String.fromCharCode(labels[label])}
        </span>
      </div>
    )} */}
  </div>
);
export default Range;
