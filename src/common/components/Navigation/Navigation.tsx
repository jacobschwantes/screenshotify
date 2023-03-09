import {
  CogIcon,
  LogoutIcon,
  KeyIcon,
  ChartBarIcon,
  ArchiveIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { signOut, getAuth } from "firebase/auth";
import { firebaseApp } from "@modules/auth/firebase/client";
import { useRouter } from "next/router";
import clsx from "clsx";
const auth = getAuth(firebaseApp);
interface NavigationProps {
  wideNav: boolean;
}
export default function Navigation({ wideNav }: NavigationProps) {
  const router = useRouter();
  const generalNavigation = [
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
    <nav className=" flex flex-col justify-between p-3 z-10 h-full  ">
      <div className="flex-col  space-y-4 ">
        {generalNavigation.map((item, index) => (
          <Link key={index} href={item.href}>
            <a
              key={item.name}
              className={clsx(
                item.current
                  ? "bg-blue-200 text-blue-600 dark:bg-blue-900 dark:text-blue-600   "
                  : "text-zinc-400 dark:text-zinc-300 ",
                " flex items-center  p-3 rounded-lg border border-transparent text-center transition-all  hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:bg-opacity-50 "
              )}
            >
              <item.icon
                className={
                  "h-6 w-6 flex-shrink-0 transition-colors " +
                  (wideNav ? " mr-3 " : " group-hover:mr-3")
                }
                aria-hidden="true"
              />
              <span className={wideNav ? " flex" : " hidden group-hover:flex"}>
                {item.name}
              </span>
            </a>
          </Link>
        ))}
      </div>

      <div>
        <button
          onClick={() => {
            signOut(auth);
          }}
          className={clsx(
            " flex items-center  p-3 rounded-lg border border-transparent text-center  text-zinc-400 dark:text-zinc-300 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:bg-opacity-50 "
          )}
        >
          <LogoutIcon
            className={"h-6 w-6 flex-shrink-0 transition-colors "}
            aria-hidden="true"
          />
        </button>
      </div>
    </nav>
  );
}
