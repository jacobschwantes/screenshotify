import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { Menu } from "@headlessui/react";
import {
  BellIcon,
  ClockIcon,
  MailIcon,
  CalendarIcon,
} from "@heroicons/react/outline";
import "react-toastify/dist/ReactToastify.css";
import { CheckIcon } from "@heroicons/react/solid";
import clsx from "clsx";
function findTime(time: number) {
  let now = Date.now();
  let difference = now / 1000 - time;
  if (difference < 3600) {
    return `${Math.round(difference / 60)} minutes ago`;
  }
  if (difference < 86400) {
    return `about ${Math.round(difference / 3600)} hours ago`;
  } else {
    return `${(difference / 86400).toFixed(0)} days ago`;
  }
}
const unread = [
  {
    icon: MailIcon,
    message: "You have a new message",
    submessage: "7 unread messages.",
    timestamp: 1643689162,
  },
  {
    icon: CalendarIcon,
    message: "You have a new message",
    submessage: "7 unread messages.",
    timestamp: 1643689162,
  },
];
const read = [
  {
    icon: MailIcon,
    message: "You have a new message",
    submessage: "7 unread messages.",
    timestamp: 1643689162,
  },
  {
    icon: CalendarIcon,
    message: "You have a new message",
    submessage: "7 unread messages.",
    timestamp: 1643689162,
  },
];
export default function Notifications() {
  const isLoading = false;
  // const mref = useMemo(() => query(collection(db, "users", auth.currentUser?.uid, "notifications"), where("timestamp", ">", start)), []);
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(mref, (snapshot) => {
  //     snapshot.docChanges().forEach((change) => {
  //       let data = change.doc.data();
  //       if (change.type === "added") {
  //         if (data.timestamp > start) {
  //           toast(data.message, {
  //             });
  //         }
  //       }
  //     });
  //   });
  //   return () => unsubscribe();
  // }, []);

  return (
    <Menu as="div" className=" inline-block  text-left xs:relative ">
      <div className="flex items-center">
        <Menu.Button className=" ">
          <span className=" absolute z-10 rounded-xl bg-red-500 px-1 text-xs font-semibold text-white ">
            {unread.length}
          </span>

          <BellIcon
            className="h-7 w-7 text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" absolute right-8 z-10 mt-2 origin-top-right rounded-md  bg-white dark:bg-zinc-800 shadow-lg ring-1  ring-black  ring-opacity-5 focus:outline-none xs:right-0 xs:left-auto xs:w-80 w-80 ">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div className=" flex items-center justify-between border-b dark:border-zinc-700 px-4 py-2 font-semibold transition-colors ">
                  <div className="flex flex-col dark:text-zinc-50  ">
                    Notifications
                    <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                      {isLoading
                        ? "loading.."
                        : `You have ${unread.length} unread messages`}
                    </span>
                  </div>
                  <CheckIcon className="h-6 w-6 cursor-pointer text-blue-500 hover:scale-110 hover:text-blue-600" />
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div className="block   text-sm transition-colors">
                  <h1 className="px-3 py-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    NEW
                  </h1>
                  {!isLoading &&
                    unread.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="flex cursor-pointer items-center space-x-3 bg-blue-50 dark:bg-zinc-700 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-600 "
                        >
                          <MailIcon
                            className="h-10 w-10 flex-shrink-0 rounded-full  text-blue-500 transition-colors"
                            aria-hidden="true"
                          />
                          <div className="flex flex-col space-y-1">
                            <h1 className="font-semibold dark:text-zinc-100 ">
                              {item.message}
                            </h1>
                            <p className="font-normal text-zinc-500 dark:text-zinc-400 ">
                              {item.submessage}
                            </p>
                            <h1 className="flex items-center text-xs text-zinc-400">
                              <ClockIcon className="mr-1 h-3 w-3 text-zinc-400" />{" "}
                              {findTime(item.timestamp / 1000)}
                            </h1>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </Menu.Item>
          </div>
          <div className="">
            <Menu.Item>
              {({ active }) => (
                <div className="block   text-sm transition-colors">
                  <h1 className="px-3 py-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    RECENT
                  </h1>
                  {unread.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex cursor-pointer items-start space-x-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 "
                      >
                        <item.icon
                          className="h-10 w-10 flex-shrink-0 rounded-full  text-blue-500 transition-colors"
                          aria-hidden="true"
                        />
                        <div className="flex flex-col space-y-1">
                          <h1 className="font-semibold dark:text-zinc-100 ">
                            {item.message}
                          </h1>
                          <p className="font-normal text-zinc-500 dark:text-zinc-400 ">
                            {item.submessage}
                          </p>
                          <h1 className="flex items-center text-xs text-zinc-400">
                            <ClockIcon className="mr-1 h-3 w-3 text-zinc-400" />
                            {findTime(item.timestamp)}
                          </h1>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Menu.Item>
          </div>
          <div className="">
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className={clsx(
                    active ? "bg-zinc-100 dark:bg-zinc-700" : "",
                    "block cursor-pointer rounded-b-lg border-t dark:border-zinc-700 px-4 py-2 text-center text-sm transition-colors dark:text-blue-500"
                  )}
                >
                  View All
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
