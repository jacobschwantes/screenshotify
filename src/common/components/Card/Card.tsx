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
    <div className="rounded-2xl   p-6  shadow-zinc-100 dark:shadow-zinc-900  flex justify-between items-center shadow-lg border-zinc-100 dark:border-zinc-900 dark:bg-zinc-800 border">
      <div className="space-y-3 flex flex-col">
        <span className="space-y-3">
          <h1 className=" font-semibold text-left text dark:text-zinc-100 ">
            {title}
          </h1>
          <div className="flex space-x-2 items-center">
            {change < 0 ? (
              <TrendingDownIcon className="  h-6 w-6 bg-red-100 dark:bg-red-600 dark:bg-opacity-25 text-red-500 dark:text-red-500 rounded-full p-1" />
            ) : (
              <TrendingUpIcon className="  h-6 w-6 bg-green-100 dark:bg-lime-600 dark:bg-opacity-25 dark:text-green-500 text-green-500 rounded-full p-1" />
            )}
            <span className=" font-semibold text-sm  dark:text-zinc-100">
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
