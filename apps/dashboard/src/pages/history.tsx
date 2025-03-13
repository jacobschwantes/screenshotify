import { NextPage } from "next";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { RefreshIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useLogs } from "@hooks/swr";
import { useSWRConfig } from "swr";
import { Table, Modal } from "@components/index";
import { User } from "firebase/auth";
import { PageProps } from "@customTypes/global";
import { usePrefersDark } from "@hooks/theme";
type Log = {
  href: string;
  id: number;
  latency: number;
  status: string;
  timestamp: number;
  token_name: string;
  url: string;
  error: string;
};
const getInterval = (data: { logs: Log[] }) => {
  if (!data) return 0;
  if (data.logs && data.logs.some((item) => item.status === "processing"))
    return 6000;
  return 0;
};

const History: NextPage<PageProps> = (props) => {
  const { mutate } = useSWRConfig();
  const [spin, setSpin] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ message: "" });
  const [entriesCount, setEntriesCount] = useState(0);
  const [idToken, setIdToken] = useState(props.idToken);
  const batchSize = 10; // items per chunk
  const [active, setActive] = useState(1);
  const { logs, isLoadingLogs, isErrorLogs } = useLogs(
    idToken,
    `?limit=${batchSize}&page=${active}`,
    { refreshInterval: (data) => getInterval(data) }
  );
  const prefersDark = usePrefersDark();

  useEffect(() => {
    if (logs?.entries) {
      setEntriesCount(logs.entries);
    }
  }, [logs]);

  useEffect(() => {
    console.log("running side effect");
    props.user.getIdToken().then((result: string) => setIdToken(result));
  }, [isErrorLogs, props.user]);
  type ModalOptions = {
    message: string;
  };
  const dispatchModal = (options: ModalOptions) => {
    setModalContent(options);
    setOpen(true);
  };
  return (
    <div className="flex h-full w-screen flex-col  space-y-4 overflow-y-auto overflow-x-hidden p-5 sm:w-full">
      <div className="flex  w-full items-center justify-between border-b border-zinc-200 pb-5 dark:border-none dark:border-zinc-700">
        <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
          History
        </h3>
        <div className="mt-3 flex space-x-3 sm:mt-0 sm:ml-4">
          <button
            disabled={spin}
            type="button"
            onAnimationEnd={() => setSpin(false)}
            onClick={() => {
              setSpin(true);
              mutate(["/api/user/usage"]);
              mutate([`/api/user/logs?limit=${batchSize}&page=${active}`]);
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

      {/* {isErrorLogs && (
        <p className="text-red-400 font-medium">
          logs error: {isErrorLogs.message}
        </p>
      )} */}
      <div className=" overflow-x-auto sm:w-full">
        <Table
          logs={logs?.logs}
          isLoading={isLoadingLogs}
          dispatchModal={dispatchModal}
          batchSize={10}
        />
      </div>

      <Pagination
        pages={Math.ceil(entriesCount / batchSize)}
        setActive={setActive}
        active={active}
        size={entriesCount}
        batchSize={10}
      />

      <Modal
        dark={
          props.preferences.theme === "dark" ||
          (props.preferences.theme === "system" && prefersDark)
        }
        open={open}
        setOpen={setOpen}
        content={modalContent}
      />
    </div>
  );
};
interface PaginationProps {
  active: number;
  setActive: (page: number) => void;
  pages: number;
  batchSize: number;
  size: number;
}

const Pagination = (props: PaginationProps) => {
  return (
    <div className="flex flex-col items-start justify-between space-y-3 bg-white px-4 py-3 dark:bg-black sm:flex-row sm:items-center sm:px-6">
      <div className="flex w-full justify-between sm:hidden ">
        <button
          disabled={props.active === 1}
          onClick={() => props.setActive(props.active - 1)}
          className="relative inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Previous
        </button>

        <button
          disabled={props.active === props.pages}
          onClick={() => props.setActive(props.active + 1)}
          className="relative inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Next
        </button>
      </div>
      <div className="sm:hidden">
        <p className="text-sm text-zinc-700 dark:text-zinc-100">
          Showing{" "}
          <span className="font-medium">
            {1 + (props.active - 1) * props.batchSize}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {props.active * props.batchSize > props.size
              ? props.size
              : props.active * props.batchSize}
          </span>{" "}
          of <span className="font-medium">{props.size}</span> results
        </p>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-700 dark:text-zinc-100">
            Showing{" "}
            <span className="font-medium">
              {1 + (props.active - 1) * props.batchSize}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {props.active * props.batchSize > props.size
                ? props.size
                : props.active * props.batchSize}
            </span>{" "}
            of <span className="font-medium">{props.size}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              disabled={props.active === 1}
              onClick={() => props.setActive(props.active - 1)}
              className="relative inline-flex items-center rounded-l-md border border-zinc-300 bg-white px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900 "
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {props.pages > 5 ? (
              <>
                {(Math.ceil(props.active / 5) - 1) * 5 > 0 && (
                  <>
                    <button
                      className={
                        props.active === 1
                          ? " relative z-10 inline-flex items-center border border-blue-500 bg-blue-50 px-4  py-2 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                          : "relative inline-flex items-center border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
                      }
                      onClick={() => props.setActive(1)}
                    >
                      {1}
                    </button>
                    <span className="relative inline-flex items-center border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 ">
                      ...
                    </span>
                  </>
                )}
                {Array.from(Array(props.pages))
                  .map((item, idx) => idx + 1)
                  .slice(
                    (Math.ceil(props.active / 5) - 1) * 5,
                    Math.ceil(props.active / 5) * 5
                  )
                  .map((item, ind) => {
                    return (
                      <button
                        key={ind}
                        className={
                          props.active === item
                            ? " relative z-10 inline-flex items-center border border-blue-500 bg-blue-50 px-4  py-2 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                            : "relative inline-flex items-center border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
                        }
                        id={`${ind}`}
                        onClick={() => props.setActive(item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                {Math.floor(props.pages / 5) >= props.active / 5 && (
                  <>
                    <span className="relative inline-flex items-center border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 dark:border-zinc-900 dark:bg-black dark:text-zinc-200">
                      ...
                    </span>
                    <button
                      className={
                        props.active === props.pages
                          ? " relative z-10 inline-flex items-center border border-blue-500 bg-blue-50 px-4  py-2 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                          : "relative inline-flex items-center border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
                      }
                      onClick={() => props.setActive(props.pages)}
                    >
                      {props.pages}
                    </button>
                  </>
                )}
              </>
            ) : (
              Array.from(Array(props.pages)).map((item, ind) => {
                return (
                  <button
                    key={`pagination${ind}`}
                    className={
                      props.active === ind + 1
                        ? " relative z-10 inline-flex items-center border border-blue-500 bg-blue-50 px-4  py-2 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                        : "relative inline-flex items-center border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
                    }
                    id={`${ind}`}
                    onClick={() => props.setActive(++ind)}
                  >
                    {ind + 1}
                  </button>
                );
              })
            )}

            <button
              disabled={props.active === props.pages}
              onClick={() => props.setActive(props.active + 1)}
              className="relative inline-flex cursor-pointer items-center rounded-r-md border border-zinc-300 bg-white px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
export default History;
