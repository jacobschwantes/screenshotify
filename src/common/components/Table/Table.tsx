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
    <div className="rounded-2xl bg-white dark:bg-black border shadow-lg dark:shadow-none shadow-zinc-100  border-zinc-200 dark:border-zinc-900 ">
      <table className="   divide-y divide-zinc-200 dark:divide-zinc-900  ">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider rounded-2xl">
              URL
            </th>

            <th className=" px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider ">
              Status
            </th>
            <th className="px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider rounded-2xl">
              Date
            </th>

            <th className="px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider rounded-2xl">
              Latency
            </th>
            <th className="px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider rounded-2xl">
              Result
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-zinc-200 dark:divide-zinc-900     ">
          {logs.map(
            ({ url, status, timestamp, latency, href, error }, index) => (
              <tr
                key={index}
                className="bg-white dark:bg-black rounded-2xl transition-all "
              >
                <td className="max-w-0 w-full px-6 py-4 whitespace-nowrap text-sm text-zinc-900 rounded-2xl">
                  <div className="flex ">
                    <p className="dark:text-zinc-400 text-zinc-500 truncate group-hover:text-zinc-900 ">
                      {url}
                    </p>
                  </div>
                </td>

                <td className=" px-6 py-4 whitespace-nowrap text-sm text-zinc-500  ">
                  <span
                    className={clsx(
                      statusStyles[status],
                      " items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                    )}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-left whitespace-nowrap text-sm dark:text-zinc-400 text-zinc-500 rounded-2xl">
                  <time>{new Date(timestamp).toLocaleString()}</time>
                </td>
                <td className="px-6 py-4 text-left whitespace-nowrap text-sm dark:text-zinc-400 text-zinc-500 rounded-2xl">
                  {status === "processing" ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    `${latency} ms`
                  )}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-zinc-500 rounded-2xl flex justify-center ">
                  {status === "success" ? (
                    <Link passHref target="_blank" href={href} rel="noreferrer">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 flex items-center justify-center"
                      >
                        <ExternalLinkIcon className="h-5" />
                      </a>
                    </Link>
                  ) : status === "processing" ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <button
                      onClick={() => dispatchModal({ message: error })}
                      className="text-blue-500 font-medium"
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
  <div className="overflow-hidden relative rounded-2xl bg-white dark:bg-black border shadow-lg dark:shadow-none shadow-zinc-100  border-zinc-200 dark:border-zinc-900 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t dark:before:border-rose-100/10 before:border-zinc-300 before:bg-gradient-to-r before:from-transparent dark:before:via-rose-100/10 before:via-zinc-100 before:to-transparent">
    <table className="   divide-y divide-zinc-200 dark:divide-zinc-900 ">
      <thead>
        <tr>
          <th className="px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider rounded-2xl">
            URL
          </th>
          <th className="hidden px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider md:block">
            Status
          </th>
          <th className="px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider rounded-2xl">
            Date
          </th>

          <th className="px-6 py-3 bg-zinc-50 dark:bg-black text-left text-xs font-medium text-zinc-500 uppercase tracking-wider rounded-2xl">
            Result
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-black divide-y divide-zinc-200 dark:divide-zinc-900     ">
        {Array.from(Array(items)).map((item, index) => (
          <tr key={index} className="bg-white dark:bg-black rounded-2xl ">
            <td className="max-w-0 w-full px-6 py-4 whitespace-nowrap text-sm text-zinc-900 rounded-2xl">
              <div className="flex ">
                <p className="text-zinc-500 truncate group-hover:text-zinc-900 h-3 dark:bg-zinc-900 bg-zinc-200 w-1/4 rounded-full "></p>
              </div>
            </td>
            <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-zinc-500 rounded-2xl">
              <p className="h-3 dark:bg-zinc-900 bg-zinc-200 w-30 rounded-full"></p>
            </td>
            <td className=" px-6 py-4 whitespace-nowrap text-sm text-zinc-500  ">
              <p className={"  h-3 dark:bg-zinc-900 bg-zinc-200 w-16 rounded-full"}></p>
            </td>
            <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-zinc-500 rounded-2xl">
              <p className="h-3 dark:bg-zinc-900 bg-zinc-200 w-30 rounded-full"></p>
            </td>
            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-zinc-500 rounded-2xl ">
              <p className="h-5 dark:bg-zinc-900 bg-zinc-200  w-5 rounded-full"></p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
