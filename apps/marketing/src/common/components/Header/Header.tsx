import { Disclosure } from "@headlessui/react";
import {
  BookOpenIcon,
  ChipIcon,
  CreditCardIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
const navigation = [
  { name: "Pricing", href: "/pricing", icon: CreditCardIcon },
  { name: "Docs", href: "https://docs.screenshotify.app", icon: BookOpenIcon },
  { name: "Dashboard", href: "https://dashboard.screenshotify.app", icon: ChipIcon },
];

export default function Header() {
  return (
    <Disclosure
      as="nav"
      className="bg-white dark:bg-black fixed w-full z-50 border-b dark:border-zinc-800 border-zinc-100 dark:bg-opacity-50 backdrop-blur-md"
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2  sm:px-6 lg:px-12 ">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center justify-between ">
                <Link href="/">
                  <div className="flex-shrink-0 flex items-center cursor-pointer p-2">
                    <img
                      className="hidden dark:block lg:hidden h-7 w-auto"
                      src="logo_short.png"
                      alt="screenshotify"
                    />
                    <span className="hidden dark:lg:flex  justify-center space-x-2 ">
                      <img
                        className=" h-7 "
                        src="logo.png"
                        alt="screenshotify"
                      />
                      {/* <h1 className="text-2xl font-medium  text-center">screenshotify</h1> */}
                    </span>
                    <img
                      className="block dark:hidden lg:hidden h-7 w-auto"
                      src="logo_short_light.png"
                      alt="screenshotify"
                    />
                    <span className="hidden lg:flex  justify-center space-x-2 lg:dark:hidden ">
                      <img
                        className=" h-7 "
                        src="logo_light.png"
                        alt="screenshotify"
                      />
                      {/* <h1 className="text-2xl font-medium  text-center">screenshotify</h1> */}
                    </span>
                  </div>
                </Link>
              </div>
              <div className="hidden sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a className="px-3 py-2 rounded-md  flex items-center justify-center dark:hover:text-white dark:text-zinc-300 text-zinc-900 hover:text-blue-600 font-medium transition-all duration-300 ">
                        {/* <item.icon className="h-6 mr-2 " /> */}
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:flex space-x-5 items-center">
                <a
                  href="https://dashboard.screenshotify.app"
                  className="flex  rounded-md border border-transparent items-center justify-center text-sm font-medium dark:text-white text-black hover:text-blue-500 transition-colors duration-300"
                >
                  Log in
                </a>
                <a
                  href="https://dashboard.screenshotify.app"
                  className="block  rounded-md border border-transparent px-3 py-1.5  bg-blue-600 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                >
                  Sign up
                </a>
              </div>

              <div className="flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-white dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600">
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

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="flex px-3 py-3 text-base font-medium dark:text-white hover:bg-gray-700 text-black  border-b last:border-hidden dark:border-zinc-700"
                >
                  <item.icon className="h-6 mr-2 text-blue-600" />
                  {item.name}
                </Disclosure.Button>
              ))}
              <div className="flex w-full space-x-3 pt-2">
                <Disclosure.Button
                  as="a"
                  href="https://dashboard.screenshotify.app"
                  className="block text-center w-full  rounded-md border border-transparent px-3 py-1.5  bg-white text-sm font-medium text-black shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                >
                  Log in
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="https://dashboard.screenshotify.app"
                  className="block text-center w-full  rounded-md border border-transparent px-3 py-1.5  bg-blue-600 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                >
                  Sign up
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
