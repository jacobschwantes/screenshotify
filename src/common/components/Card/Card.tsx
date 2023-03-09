import {
  HomeIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "@heroicons/react/solid";
const numeral = require("numeral");
interface CardProps {
  count: number;
  isLoading: boolean;
  isError: boolean;
  title: string;
  change: number;
  type: string;
}
export default function Card({
  count,
  isLoading,
  isError,
  title,
  change,
  type,
}: CardProps) {
  function Value() {
    if (isLoading) return <span className=" animate-pulse">1,234</span>;
    if (isError) return <span className=" text-red-600 ">err</span>;
    return type === "count"
      ? numeral(count).format("0,0")
      : numeral(count).format("00:00:00");
  }

  return (
    <div className="flex   items-center  justify-between rounded-2xl  border border-zinc-100 p-6 shadow-lg shadow-zinc-100 dark:border-zinc-900 dark:bg-zinc-800 dark:shadow-zinc-900">
      <div className="flex flex-col space-y-3">
        <span className="space-y-3">
          <h1 className=" text text-left font-semibold dark:text-zinc-100 ">
            {title}
          </h1>
          <div className="flex items-center space-x-2">
            {change < 0 ? (
              <TrendingDownIcon className="  h-6 w-6 rounded-full bg-red-100 p-1 text-red-500 dark:bg-red-600 dark:bg-opacity-25 dark:text-red-500" />
            ) : (
              <TrendingUpIcon className="  h-6 w-6 rounded-full bg-green-100 p-1 text-green-500 dark:bg-lime-600 dark:bg-opacity-25 dark:text-green-500" />
            )}
            <span className=" text-sm font-semibold  dark:text-zinc-100">
              {(change > 0 ? "+" : "") + change.toFixed(1)}%
            </span>
          </div>
        </span>

        <h1 className="text-left text-4xl  font-bold dark:text-zinc-100">
          <Value />
        </h1>
      </div>
    </div>
  );
}
