import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Notifications } from "@components/index";
import {
  ArrowRightIcon,
  BellIcon,
  BookOpenIcon,
  ChipIcon,
  DownloadIcon,
  ChartBarIcon,
  KeyIcon,
  ArchiveIcon,
  CogIcon,
  MenuIcon,
  XIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import logo from "../../../../public/logo.png";
import logo_short from "../../../../public/logo_short.png";
import logo_light from "../../../../public/logo_light.png";
import Image from "next/future/image";
import { signOut, getAuth } from "firebase/auth";
import { firebaseApp } from "@modules/auth/firebase/client";
const auth = getAuth(firebaseApp);
export default function Header() {
  const router = useRouter();
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: ChartBarIcon,
      current: router.asPath === "/",
    },
    {
      name: "Tokens",
      href: "/tokens",
      icon: KeyIcon,
      current: router.asPath.includes("tokens"),
    },
    {
      name: "History",
      href: "/history",
      icon: ArchiveIcon,
      current: router.asPath.includes("history"),
    },
    {
      name: "Settings",
      href: "/settings/account",
      icon: CogIcon,
      current: router.asPath.includes("settings"),
    },
  ];
  return (
    <Disclosure
      as="nav"
      className="z-30 bg-white shadow-sm dark:border-b dark:border-zinc-900 dark:bg-black"
    >
      {({ open, close }) => (
        <>
          <div className=" px-2 sm:px-6 lg:px-6 ">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center justify-between sm:flex-1 ">
                <Link href="/">
                  <span className="flex items-end justify-center space-x-2 dark:text-white  ">
                    <Image
                      className=" hidden h-7 w-auto dark:sm:block  "
                      src={logo}
                      alt="logo"
                    />
                    <Image
                      className=" hidden h-7 w-auto dark:hidden sm:block  "
                      src={logo_light}
                      alt="logo"
                    />
                    <Image
                      className="h-8  w-auto sm:hidden"
                      src={logo_short}
                      alt="logo"
                    />
                  </span>
                </Link>

                {/* <div className="hidden sm:block">
                  <div className="flex space-x-4 z-20 items-center">
                    <Notifications />
                  </div>
                </div> */}
              </div>
              <div className="flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="absolute z-10 w-screen bg-white dark:bg-black sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item, index) => (
                <Link key={index} href={item.href}>
                  <button
                    onClick={() => close()}
                    key={item.name}
                    className={clsx(
                      item.current
                        ? "bg-blue-200 text-blue-600 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-600   "
                        : "text-zinc-500 dark:text-zinc-300 ",
                      " flex w-full  items-center space-x-2 rounded-lg border border-transparent p-3  text-center transition-all hover:bg-zinc-100 dark:bg-opacity-50 dark:hover:bg-zinc-900"
                    )}
                  >
                    <item.icon
                      className={"h-6 w-6 flex-shrink-0 transition-colors "}
                      aria-hidden="true"
                    />
                    <span
                      className={clsx(
                        item.current
                          ? "text-blue-600"
                          : "text-zinc-600 dark:text-white"
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                </Link>
              ))}
              <div className="flex w-full space-x-3 p-2">
                <Disclosure.Button
                  onClick={() => signOut(auth)}
                  className="block w-full rounded-md  border border-transparent bg-blue-600 px-3 py-1.5  text-center text-sm font-medium text-white shadow transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Log out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
