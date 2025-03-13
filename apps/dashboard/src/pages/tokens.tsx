import { NextComponentType, NextPage, NextPageContext } from "next";
import { toast } from "react-toastify";
import { useRef, Fragment } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  DuplicateIcon,
  CheckIcon,
  RefreshIcon,
  LockClosedIcon,
  LockOpenIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  CogIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Spinner from "@components/Spinner";
import { useTokens, useToken } from "@hooks/swr";
import { useSWRConfig } from "swr";
import { RadioGroup } from "@headlessui/react";
import { User } from "firebase/auth";
import { ApiKey, PageProps } from "@customTypes/global";
import { usePrefersDark } from "@hooks/theme";

const Tokens: NextPage<PageProps> = (props) => {
  const { mutate } = useSWRConfig();
  const [showKeys, setShowKeys] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [spin, setSpin] = useState(false);
  const [creatingToken, setCreatingToken] = useState(false);
  const [idToken, setIdToken] = useState(props.idToken);
  const { tokens, isLoading, isError, update } = useTokens(idToken);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const { token, isTokenLoading, isTokenError } = useToken(idToken, selected);
  const prefersDark = usePrefersDark();
  useEffect(() => {
    let timer1 = setTimeout(() => setCopiedId(""), 6000);
    return () => {
      clearTimeout(timer1);
    };
  }, [copiedId]);
  useEffect(() => {
    if (isTokenLoading) return;
    if (!isTokenLoading) setOpen(true);
  }, [selected, isTokenLoading]);

  useEffect(() => {
    if (isError) {
      props.user?.getIdToken().then((result) => setIdToken(result));
    }
  }, [isError, props.user]);

  const updateToken = async (key: string, options: Partial<ApiKey>) => {
    await fetch(`/api/user/tokens/${key}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(options),
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.json();
      })
      .then((data) => {
        mutate(["/api/user/tokens", idToken]);
        mutate([`/api/user/tokens/${key}`, idToken]);
        toast(
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            <span>
              <h1 className=" font-medium">Success</h1>
              <p className="text-sm font-extralight">{data.message}</p>
            </span>
          </div>,
          {
            theme: "dark",
            progressClassName: "toastProgressBlue",
          }
        );
      })
      .catch((e) =>
        toast(
          <div className="flex items-center space-x-3">
            <span>
              <h1 className=" font-medium">Failed</h1>
              <p className="text-sm font-extralight">{e.message}</p>
            </span>
          </div>,
          {
            type: "error",
          }
        )
      );
  };

  const deleteToken = async (key: string, name: string) => {
    await fetch(`/api/user/tokens/${key}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.json();
      })
      .then((data) => {
        const newData = tokens.keys.filter((token: ApiKey) => {
          return token.key !== key;
        });

        update({ ...{ keys: newData } });

        toast(
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            <span>
              <h1 className=" font-medium">Success</h1>
              <p className="text-sm font-extralight">
                {name} has been deleted.
              </p>
            </span>
          </div>,
          {
            theme: "dark",
            progressClassName: "toastProgressBlue",
          }
        );
      })
      .catch((e) => console.log("error, ", e));
  };
  const createToken = async () => {
    setCreatingToken(true);
    const result = await fetch("/api/user/tokens", {
      headers: { Authorization: `Bearer ${idToken}` },
      method: "POST",
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.json();
      })
      .then((data) => {
        toast(
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            <span>
              <h1 className=" font-medium">Success</h1>
              <p className="text-sm font-extralight">{data.message}</p>
            </span>
          </div>,
          {
            theme: "dark",
            progressClassName: "toastProgressBlue",
          }
        );
        let newKey = data.key;
        update({ ...tokens, newKey });
        return data;
      })
      .catch((e) =>
        toast(
          <div className="flex items-center space-x-3">
            <span>
              <h1 className=" font-medium">{e.error}</h1>
              <p className="text-sm font-extralight">{e.message}</p>
            </span>
          </div>,
          {
            type: "error",
          }
        )
      );
    setCreatingToken(false);
    return result;
  };

  return (
    <div className="flex flex-col items-start  p-5">
      <div className="mb-5 w-full  flex-col space-y-3 border-b border-zinc-200 pb-5 dark:border-none  dark:border-zinc-700 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0">
        <div className="flex flex-1 items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
            API Keys
          </h3>
          <div className="flex space-x-3">
            <button
              disabled={spin}
              type="button"
              onAnimationEnd={() => setSpin(false)}
              onClick={() => {
                setSpin(true);
                mutate(["/api/user/tokens", idToken]);
              }}
              className="inline-flex items-center rounded-md border border-zinc-300 bg-white p-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-black dark:ring-offset-zinc-800 dark:hover:bg-zinc-900 "
            >
              <RefreshIcon
                className={clsx(
                  "h-6 text-zinc-400 dark:text-zinc-300 ",
                  spin && "animate-spin-slow"
                )}
              />
            </button>
            <button
              type="button"
              onClick={() => setShowKeys(!showKeys)}
              className="inline-flex items-center rounded-md border border-zinc-300 bg-white p-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-black dark:ring-offset-zinc-800 dark:hover:bg-zinc-900"
            >
              {!showKeys ? (
                <EyeIcon className="h-6 text-zinc-400 dark:text-zinc-300" />
              ) : (
                <EyeOffIcon className="h-6 text-zinc-400 dark:text-zinc-300" />
              )}
            </button>
          </div>
        </div>
        <button
          disabled={creatingToken}
          onClick={() => createToken()}
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-black sm:w-auto"
        >
          Create Token
        </button>
      </div>

      {isLoading && (
        // <Spinner color="blue" />
        <div className="space-y-3">
          {Array.from(Array(5).keys()).map((item) => {
            return (
              <div key={item} className="w-full max-w-xl space-y-2">
                <div className=" h-3 w-1/4 animate-pulse  rounded-lg dark:bg-zinc-800"></div>
                <div className="relative flex h-14  w-[90vw] items-center justify-between overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-lg shadow-zinc-100 before:absolute before:inset-0  before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-zinc-300 before:bg-gradient-to-r before:from-transparent before:via-zinc-100 before:to-transparent dark:border-zinc-900 dark:bg-black dark:shadow-none dark:before:border-rose-100/10 dark:before:via-rose-100/10 sm:w-[34rem]">
                  <div className=" h-3 w-3/4 rounded-lg bg-zinc-300 dark:bg-zinc-800 "></div>
                  <DuplicateIcon className="h-6 text-zinc-300 transition-colors hover:text-blue-500 " />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* {isError && <div className="text-red-500">Error: {isError.message}</div>} */}

      {tokens?.keys && (
        <div className="w-full">
          <div className="flex max-w-xl flex-col space-y-2 ">
            {tokens.keys.map((item: ApiKey, index: number) => (
              <div key={item.name} className={clsx("space-y-1 transition-all")}>
                <p className="text-zinc-800 dark:text-zinc-200">{item.name}</p>

                <div className={"flex space-x-2"}>
                  <div className={clsx("relative w-full")}>
                    <input
                      value={item.key}
                      readOnly
                      spellCheck={false}
                      type="text"
                      className={clsx(
                        " form-input w-full cursor-pointer rounded-lg border border-zinc-300 py-4 pr-10 pl-4 font-medium text-zinc-400 transition-colors hover:border-blue-600 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-zinc-900 dark:bg-black dark:text-zinc-400",
                        !showKeys && "token-field"
                      )}
                    ></input>
                    <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.key);
                          toast(
                            <div className="flex items-center space-x-3">
                              <ClipboardCheckIcon className="h-6 w-6 text-blue-600" />
                              <span>
                                <p className="text-sm font-extralight">
                                  {item.name} copied to clipboard.
                                </p>
                              </span>
                            </div>,
                            {
                              theme: "dark",
                              progressClassName: "toastProgressBlue",
                            }
                          );
                          setCopiedId(`${index}`);
                        }}
                      >
                        {copiedId === `${index}` ? (
                          <CheckIcon className="h-6 text-blue-600" />
                        ) : (
                          <DuplicateIcon className="h-6 text-zinc-400 transition-colors hover:text-blue-600 dark:text-zinc-300" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelected(item.key);
                    }}
                  >
                    <CogIcon className="h-6 text-zinc-400 transition-colors hover:text-blue-600 dark:text-zinc-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {isTokenError && <div>Error: {isError.message}</div>}
          {token?.key && !isTokenLoading && (
            <TokenPage
              dark={
                props.preferences.theme === "dark" ||
                (props.preferences.theme === "system" && prefersDark)
              }
              setSelectedToken={setSelected}
              open={open}
              setOpen={setOpen}
              updateToken={updateToken}
              token={token.key}
              deleteToken={deleteToken}
            />
          )}
        </div>
      )}
    </div>
  );
};

const settings = [
  {
    id: "unlimited",
    name: "Unlimited",
    description: "Token will have unlimited quota",
  },
  {
    id: "limited",
    name: "Limited",
    description: "Token will be limited to token specific quota",
  },
];
interface TokenPageProps {
  token: ApiKey;
  updateToken: (token: string, newToken: Partial<ApiKey>) => Promise<void>;
  deleteToken: (token: string, name: string) => Promise<void>;
  open: boolean;
  setOpen: (setting: boolean) => void;
  setSelectedToken: (token: string) => void;
  dark: boolean;
}

const TokenPage: NextComponentType<NextPageContext, {}, TokenPageProps> = ({
  token,
  updateToken,
  deleteToken,
  open,
  setOpen,
  setSelectedToken,
  dark,
}) => {
  const [tokenOptions, setTokenOptions] = useState(token);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const cancelButtonRef = useRef(null);
  const eventHandler = (key: string, value: any) => {
    setTokenOptions((prevState: ApiKey) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleRegex = (name: string) => {
    if (!/^[\w-]+$/.test(name)) {
      setError("Invalid name");
      return false;
    }
    return true;
  };
  useEffect(() => {
    setTokenOptions(token);
  }, [token]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={clsx(dark ? "dark" : "", "relative z-10  ")}
        initialFocus={cancelButtonRef}
        onClose={() => {
          setOpen(false);
          setTimeout(() => setSelectedToken(""), 300);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-800 bg-opacity-30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center py-4 px-2 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl border border-zinc-400 bg-zinc-50 px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:border-zinc-900 dark:bg-black sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="space-y-6">
                  <h1 className="text-lg font-medium dark:text-white">
                    Token settings
                  </h1>
                  <div className="space-y-2">
                    <h1 className="font-medium text-zinc-800 dark:text-zinc-100 ">
                      Name
                    </h1>
                    <input
                      value={tokenOptions.name}
                      onChange={(e) => {
                        eventHandler("name", e.target.value);
                        setError("");
                      }}
                      type="text"
                      className={clsx(
                        "form-input w-full rounded-lg border border-zinc-300 p-3 text-sm font-medium text-zinc-500  transition-colors focus:outline-none dark:border-zinc-900 dark:bg-black dark:text-zinc-400 sm:w-1/2",
                        error ? "border-red-500" : "hover:border-blue-500"
                      )}
                    />
                    <p className="text-sm font-medium text-red-500">{error}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="">
                      <h1 className="font-medium text-zinc-800 dark:text-zinc-100 ">
                        Usage metrics
                      </h1>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 ">
                        Usage resets on Aug 1, 2022
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h1 className="font-medium text-zinc-800 dark:text-zinc-100 ">
                          Requests
                        </h1>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          <span className="text-zinc-800 dark:text-zinc-100 ">
                            {token.usage}{" "}
                          </span>
                          /{" "}
                          {tokenOptions.quota_limit === "unlimited" ? (
                            <>&infin;</>
                          ) : (
                            tokenOptions.quota
                          )}
                        </p>
                      </div>
                      {tokenOptions.quota_limit === "limited" && (
                        <div className="relative h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-900">
                          <span
                            style={{
                              width:
                                token.usage > tokenOptions.quota
                                  ? "100%"
                                  : (token.usage / tokenOptions.quota) * 100 +
                                    "%",
                            }}
                            className={`absolute h-1.5 rounded-full bg-blue-600`}
                          ></span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className=" space-y-3">
                    <div className="">
                      <h1 className="font-medium text-zinc-800 dark:text-zinc-100  ">
                        Quota limit
                      </h1>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 ">
                        Define whether this token would be quota limited
                      </p>
                    </div>

                    <RadioGroup
                      value={tokenOptions.quota_limit}
                      onChange={(item) => eventHandler("quota_limit", item)}
                    >
                      <RadioGroup.Label className="sr-only">
                        Privacy setting
                      </RadioGroup.Label>
                      <div className="-space-y-px rounded-md bg-white dark:bg-black">
                        {settings.map((setting, settingIdx) => (
                          <RadioGroup.Option
                            key={setting.name}
                            value={setting.id}
                            className={({ checked }) =>
                              clsx(
                                settingIdx === 0
                                  ? "rounded-tl-md rounded-tr-md"
                                  : "",
                                settingIdx === settings.length - 1
                                  ? "rounded-bl-md rounded-br-md"
                                  : "",
                                checked
                                  ? "z-10 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900"
                                  : "border-zinc-200 dark:border-zinc-900",
                                "relative flex cursor-pointer border p-4 focus:outline-none dark:bg-opacity-30"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span
                                  className={clsx(
                                    checked
                                      ? "border-transparent bg-blue-600"
                                      : "border-zinc-300 bg-white dark:border-zinc-800 dark:bg-black",
                                    active
                                      ? "ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-black"
                                      : "",
                                    "mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border"
                                  )}
                                  aria-hidden="true"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />
                                </span>
                                <span className="ml-3 flex w-full justify-between space-x-4">
                                  <RadioGroup.Label
                                    as="span"
                                    className={clsx(
                                      checked
                                        ? "text-blue-900 dark:text-blue-500"
                                        : "text-zinc-900 dark:text-zinc-300",
                                      "block text-sm font-medium"
                                    )}
                                  >
                                    {setting.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={clsx(
                                      checked
                                        ? "text-blue-700 dark:text-blue-500"
                                        : "text-zinc-500 dark:text-zinc-400",
                                      "block text-sm"
                                    )}
                                  >
                                    {setting.description}
                                  </RadioGroup.Description>
                                </span>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                    {tokenOptions.quota_limit === "limited" && (
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-1 pt-1">
                          <label className=" font-medium text-zinc-800 dark:text-zinc-100">
                            Limit
                          </label>
                          <input
                            value={tokenOptions.quota}
                            min={token.usage}
                            max={1000}
                            onChange={(e) =>
                              eventHandler("quota", parseInt(e.target.value))
                            }
                            type="range"
                            className="slider h-1.5 w-full appearance-none rounded-full bg-blue-600 p-0 focus:shadow-none focus:outline-none focus:ring-0"
                            id="customRange1"
                          />
                        </div>
                        <input
                          value={tokenOptions.quota}
                          min={token.usage}
                          max={1000}
                          onChange={(e) =>
                            eventHandler("quota", parseInt(e.target.value))
                          }
                          type="number"
                          className="form-input max-w-[80px] cursor-pointer rounded-lg border border-zinc-300 text-sm font-medium text-zinc-500 transition-colors hover:outline hover:outline-1 hover:outline-blue-500 focus:outline-none dark:border-zinc-900 dark:bg-black dark:text-zinc-400"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          eventHandler("locked", !tokenOptions.locked)
                        }
                        type="button"
                        className={clsx(
                          tokenOptions.locked
                            ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
                          "inline-flex items-center rounded-md border border-transparent p-2 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black"
                        )}
                      >
                        {tokenOptions.locked ? (
                          <LockClosedIcon className="h-5 w-5" />
                        ) : (
                          <LockOpenIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteLoading(true);
                          deleteToken(token.key, token.name).then(() => {
                            setDeleteLoading(false);
                            setOpen(false);
                            setTimeout(() => setSelectedToken(""), 300);
                          });
                        }}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-2 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:ring-offset-black sm:px-4"
                      >
                        {deleteLoading ? (
                          <Spinner className="h-5 w-5" />
                        ) : (
                          <span>
                            <span className="hidden sm:block">
                              Revoke Token{" "}
                            </span>
                            <TrashIcon className="h-5 w-5 sm:hidden" />
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-zinc-900 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-900"
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => setSelectedToken(""), 300);
                        }}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!isEqual(token, tokenOptions)) {
                            setUpdateLoading(true);
                            const regexCheck = handleRegex(tokenOptions.name);
                            if (regexCheck) {
                              const allowed = [
                                "locked",
                                "name",
                                "quota",
                                "quota_limit",
                              ];
                              const filtered = Object.keys(tokenOptions)
                                .filter((key) => allowed.includes(key))
                                .reduce((obj, key) => {
                                  return {
                                    ...obj,
                                    [key]:
                                      tokenOptions[key as keyof typeof token],
                                  };
                                }, {});

                              updateToken(token.key, filtered).then(() => {
                                setUpdateLoading(false);
                                setTimeout(() => setSelectedToken(""), 300);
                                setOpen(false);
                              });
                            } else {
                              setUpdateLoading(false);
                            }
                          } else {
                            setTimeout(() => setSelectedToken(""), 300);
                            setOpen(false);
                          }
                        }}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:ring-offset-black"
                      >
                        {updateLoading ? (
                          <Spinner className="h-5 w-5" />
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Tokens;
