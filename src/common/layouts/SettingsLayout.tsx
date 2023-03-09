import { NextPage } from "next";
import Link from "next/link";
import clsx from "clsx";
import {
  UserIcon,
  CreditCardIcon,
  AdjustmentsIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode
}
const SettingsLayout: NextPage<SettingsLayoutProps> = ({ children }) => {
  const router = useRouter();
  const tabs = [
    {
      name: "Account",
      href: "/settings/account",
      icon: UserIcon,
      current: router.asPath.includes("settings/account"),
    },
    {
      name: "Billing",
      href: "/settings/billing",
      icon: CreditCardIcon,
      current: router.asPath.includes("settings/billing"),
    },
    {
      name: "Preferences",
      href: "/settings/preferences",
      icon: AdjustmentsIcon,
      current: router.asPath.includes("settings/preferences"),
    },
  ];

  return (
    <div className="space-y-4 ">
       <div className="pb-5 dark:pb-0 border-b border-zinc-200 dark:border-zinc-700 dark:border-none sm:flex sm:items-center sm:justify-between w-full">
        <h3 className="text-lg leading-6 font-medium text-zinc-900 dark:text-zinc-100">
          Settings
        </h3>
      </div>
      <div className="flex space-x-2 rounded-xl bg-zinc-100 dark:bg-black dark:border dark:border-zinc-900 p-1 max-w-4xl ">
        {tabs.map((tab) => {
          return (
            <Link key={tab.name} href={tab.href}>
              <a
                key={tab.name}
                className={clsx(
                  "flex w-full items-center justify-center rounded-lg py-2.5 text-center text-sm font-medium capitalize leading-5 ",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 dark:ring-transparent",
                  tab.current
                    ? "bg-white text-blue-700 dark:text-blue-500 shadow dark:bg-zinc-900"
                    : "text-zinc-700 hover:bg-white/[0.12] hover:text-zinc-600 dark:hover:text-zinc-200 dark:text-zinc-300"
                )}
              >
                <h1 className="hidden sm:block">{tab.name}</h1>
                <tab.icon className="h-5 sm:hidden" />
              </a>
            </Link>
          );
        })}
      </div>
      <div className="rounded-xl bg-white dark:bg-black">{children}</div>
    </div>
  );
};
export default SettingsLayout



