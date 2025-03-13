import { ExternalLinkIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import Link from "next/link";
import { Spinner } from "..";
const statusStyles = {
  success:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400 dark:bg-opacity-50",
  processing:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400 dark:backdrop-opacity-50",
  failed:
    "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:backdrop-opacity-50",
};
interface TableProps {
  logs: {
    url: string;
    status: "success" | "processing" | "failed";
    timestamp: number;
    latency: number;
    href: string;
    error: string;
  }[];
  isLoading: boolean;
  batchSize: number;
  dispatchModal: (options: { message: string }) => void;
}
export default function Table({
  logs,
  dispatchModal,
  isLoading,
  batchSize,
}: TableProps) {
  return !isLoading && logs ? (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-100 dark:border-zinc-900  dark:bg-black dark:shadow-none ">
      <table className="   divide-y divide-zinc-200 dark:divide-zinc-900  ">
        <thead>
          <tr>
            <th className="rounded-2xl bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black">
              URL
            </th>

            <th className=" bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black ">
              Status
            </th>
            <th className="rounded-2xl bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black">
              Date
            </th>

            <th className="rounded-2xl bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black">
              Latency
            </th>
            <th className="rounded-2xl bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black">
              Result
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-900 dark:bg-black     ">
          {logs.map(
            ({ url, status, timestamp, latency, href, error }, index) => (
              <tr
                key={index}
                className="rounded-2xl bg-white transition-all dark:bg-black "
              >
                <td className="w-full max-w-0 whitespace-nowrap rounded-2xl px-6 py-4 text-sm text-zinc-900">
                  <div className="flex ">
                    <p className="truncate text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 ">
                      {url}
                    </p>
                  </div>
                </td>

                <td className=" whitespace-nowrap px-6 py-4 text-sm text-zinc-500  ">
                  <span
                    className={clsx(
                      statusStyles[status],
                      " items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                    )}
                  >
                    {status}
                  </span>
                </td>
                <td className="whitespace-nowrap rounded-2xl px-6 py-4 text-left text-sm text-zinc-500 dark:text-zinc-400">
                  <time>{new Date(timestamp).toLocaleString()}</time>
                </td>
                <td className="whitespace-nowrap rounded-2xl px-6 py-4 text-left text-sm text-zinc-500 dark:text-zinc-400">
                  {status === "processing" ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    `${latency} ms`
                  )}
                </td>
                <td className="flex justify-center whitespace-nowrap rounded-2xl px-6 py-4 text-center text-sm text-zinc-500 ">
                  {status === "success" ? (
                    <Link passHref target="_blank" href={href} rel="noreferrer">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center text-blue-500"
                      >
                        <ExternalLinkIcon className="h-5" />
                      </a>
                    </Link>
                  ) : status === "processing" ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <button
                      onClick={() => dispatchModal({ message: error })}
                      className="font-medium text-blue-500"
                    >
                      View logs
                    </button>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <LoadingState items={batchSize} />
  );
}

const LoadingState = ({ items }: { items: number }) => (
  <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-100 before:absolute  before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-zinc-300 before:bg-gradient-to-r before:from-transparent before:via-zinc-100 before:to-transparent dark:border-zinc-900 dark:bg-black dark:shadow-none dark:before:border-rose-100/10 dark:before:via-rose-100/10">
    <table className="   divide-y divide-zinc-200 dark:divide-zinc-900 ">
      <thead>
        <tr>
          <th className="rounded-2xl bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black">
            URL
          </th>
          <th className="hidden bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black md:block">
            Status
          </th>
          <th className="rounded-2xl bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black">
            Date
          </th>

          <th className="rounded-2xl bg-zinc-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-black">
            Result
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-900 dark:bg-black     ">
        {Array.from(Array(items)).map((item, index) => (
          <tr key={index} className="rounded-2xl bg-white dark:bg-black ">
            <td className="w-full max-w-0 whitespace-nowrap rounded-2xl px-6 py-4 text-sm text-zinc-900">
              <div className="flex ">
                <p className="h-3 w-1/4 truncate rounded-full bg-zinc-200 text-zinc-500 group-hover:text-zinc-900 dark:bg-zinc-900 "></p>
              </div>
            </td>
            <td className="whitespace-nowrap rounded-2xl px-6 py-4 text-left text-sm text-zinc-500">
              <p className="w-30 h-3 rounded-full bg-zinc-200 dark:bg-zinc-900"></p>
            </td>
            <td className=" whitespace-nowrap px-6 py-4 text-sm text-zinc-500  ">
              <p
                className={
                  "  h-3 w-16 rounded-full bg-zinc-200 dark:bg-zinc-900"
                }
              ></p>
            </td>
            <td className="whitespace-nowrap rounded-2xl px-6 py-4 text-left text-sm text-zinc-500">
              <p className="w-30 h-3 rounded-full bg-zinc-200 dark:bg-zinc-900"></p>
            </td>
            <td className="whitespace-nowrap rounded-2xl px-6 py-4 text-center text-sm text-zinc-500 ">
              <p className="h-5 w-5 rounded-full  bg-zinc-200 dark:bg-zinc-900"></p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
