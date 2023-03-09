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
    <div className="flex items-center space-x-3 flex-1">
      <input
        style={{
          backgroundSize: ((value - min) * 100) / (max - min) + "% 100%",
        }}
        className="appearance-none h-0.5 p-0 focus:outline-none focus:ring-0 focus:shadow-none bg-zinc-600 rounded-full slider w-full"
        value={value}
        type="range"
        min={min}
        max={max}
        step={step}
        onChange={(e) => set(parseFloat(e.target.value))}
      />
      {showValues && (
        <div className="relative">
          <div className="absolute text-zinc-400 right-2 top-1/2 -translate-y-1/2 -space-y-1.5 pb-0.5  flex flex-col">
            <button
              className="hover:text-zinc-200  transition-all duration-300 h-4 rounded"
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
              className="hover:text-zinc-200 transition-all duration-300 h-4 rounded"
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
            className="form-input shadow-sm focus:ring-blue-600 focus:border-blue-600 block max-w-[75px] sm:text-sm border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 rounded-md py-1.5"
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
