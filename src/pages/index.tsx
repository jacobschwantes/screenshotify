import { NextPage } from "next";
import { LineChart } from "@components/index";
import Link from "next/link";
import { useState, useEffect, SVGProps } from "react";
import {
  EmojiSadIcon,
  RefreshIcon,
  CalculatorIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import clsx from "clsx";
import { useUsage } from "@hooks/swr";
import { useSWRConfig } from "swr";
import { DateTime } from "luxon";
import { User } from "firebase/auth";
import { NextComponentType, NextPageContext } from "next";
import { PageProps } from "@customTypes/global";
import { usePrefersDark } from "@hooks/theme";

const Dashboard: NextPage<PageProps> = (props) => {
  const { mutate } = useSWRConfig();
  const [idToken, setIdToken] = useState(props.idToken);
  const [spin, setSpin] = useState(false);
  const prefersDark = usePrefersDark();
  const { usage, isLoading, isError } = useUsage(
    idToken,
    DateTime.now().zoneName.replace("/", "-")
  );
  useEffect(() => {
    if (isError) {
      props.user.getIdToken().then((result) => setIdToken(result));
    }
  }, [isError, props.user]);
  const [data, setData] = useState("1w");
  return (
    <div className="h-full space-y-4 overflow-y-auto p-5 ">
      <div className="flex  w-full items-center justify-between border-b border-zinc-200 pb-5 dark:border-none dark:border-zinc-700">
        <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h3>
        <div className=" flex space-x-3  sm:mt-0">
          <button
            disabled={spin}
            type="button"
            onAnimationEnd={() => setSpin(false)}
            onClick={() => {
              setSpin(true);
              mutate(["/api/user/usage"]);
              // asyncHero.execute();
            }}
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white p-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-black dark:ring-offset-zinc-800 dark:hover:bg-zinc-900 "
          >
            <RefreshIcon
              className={clsx(
                "h-6 text-zinc-400 dark:text-zinc-300  ",
                spin && "animate-spin-slow"
              )}
            />
          </button>
        </div>
      </div>
      <Stats
        isLoading={isLoading}
        stats={[
          {
            id: 1,
            name: "Requests",
            stat: usage?.data.usage,
            href: "/history",
            icon: PaperAirplaneIcon,
            change: "122",
            changeType: "increase",
          },
          {
            id: 2,
            name: "Quota Remaining",
            href: "/settings/billing",
            stat: usage?.data.quota - usage?.data.usage,
            icon: CalculatorIcon,
            change: "5.4%",
            changeType: "increase",
          },
          {
            id: 3,
            name: "Failed Requests",
            href: "/history",
            stat: `${(usage?.data?.errorCount === 0
              ? 0
              : (usage?.data?.errorCount / usage?.data?.usage) * 100
            ).toFixed(2)}%`,
            icon: EmojiSadIcon,
            change: "3.2%",
            changeType: "decrease",
          },
        ]}
      />
      {
        <LineChart
          isLoading={isLoading}
          seriesOption={data}
          setData={setData}
          data={
            data === "1w"
              ? usage?.data.chartData.usage7day
              : usage?.data.chartData.usage30day
          }
          dark={
            props.preferences.theme === "dark" ||
            (props.preferences.theme === "system" && prefersDark)
          }
        />
      }
    </div>
  );
};
interface StatsProps {
  isLoading: boolean;
  stats: {
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    id: number;
    name: string;
    stat?: number | string;
    href: string;
    change: string;
    changeType: string;
  }[];
}
const Stats: NextComponentType<NextPageContext, {}, StatsProps> = (props) => {
  return (
    <div>
      {props.isLoading ? (
        <dl className="mt-5 grid grid-cols-1 gap-5 opacity-70 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(Array(3)).map((item) => (
            <div
              key={item}
              className="relative overflow-hidden rounded-2xl bg-white shadow before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-zinc-300 before:bg-gradient-to-r before:from-transparent before:via-zinc-100 before:to-transparent dark:border dark:border-zinc-900 dark:bg-black dark:before:border-rose-100/10 dark:before:via-rose-100/10"
            >
              <div className="flex items-center space-x-4 p-6">
                <div className=" rounded-md bg-zinc-300 p-3 dark:bg-zinc-900">
                  <div className="tedark:bg-zinc-900 h-6 w-6 bg-zinc-300" />
                </div>
                <div className="flex flex-1 flex-col space-y-3">
                  <p className="h-3 w-1/6 truncate rounded-full bg-zinc-300 text-sm font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-100"></p>
                  <p className="h-3 w-1/3 rounded-full bg-zinc-300 text-2xl font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-200"></p>{" "}
                </div>
              </div>
              <div className="bg-zinc-50 p-6 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-zinc-100 before:bg-gradient-to-r before:from-transparent before:via-zinc-100 before:to-transparent dark:border-t dark:border-zinc-900 dark:bg-black dark:before:border-rose-100/10 dark:before:via-rose-100/10">
                <div className="h-3 w-1/6 rounded-full bg-zinc-300 dark:bg-zinc-900"></div>
              </div>
            </div>
          ))}
        </dl>
      ) : (
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {props.stats.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-2xl bg-white px-4 pt-5 pb-12 shadow dark:border dark:border-zinc-900 dark:bg-black sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-blue-600 p-3">
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-zinc-600 dark:text-zinc-100">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-200">
                  {item.stat}
                </p>
                {/* <p
                className={classNames(
                  item.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600",
                  "ml-2 flex items-baseline text-sm font-semibold"
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowSmUpIcon
                    className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowSmDownIcon
                    className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                )}

                <span className="sr-only">
                  {item.changeType === "increase" ? "Increased" : "Decreased"}{" "}
                  by
                </span>
                {item.change}
              </p> */}
                <div className="absolute inset-x-0 bottom-0 bg-zinc-50 px-4 py-4 dark:border-t dark:border-zinc-900 dark:bg-black sm:px-6">
                  <div className="text-sm">
                    <Link href={item.href}>
                      <a className="font-medium text-blue-600 hover:text-blue-500">
                        View all
                        <span className="sr-only"> {item.name} stats</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};

export default Dashboard;
