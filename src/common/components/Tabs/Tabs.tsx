import { NextPageContext, NextComponentType } from "next";
import clsx from "clsx";
interface TabsProps {
  selected: string;
  setSelected: (id: any) => void;
  tabs: string[];
  children?: React.ReactNode;
}
const Tabs: NextComponentType<NextPageContext, {}, TabsProps> = ({
  tabs,
  children,
  selected,
  setSelected,
}) => (
  <div>
    <div className="flex space-x-2 rounded-xl bg-zinc-100 dark:bg-black dark:border dark:border-zinc-900 p-1 max-w-4xl ">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setSelected(tab)}
          className={clsx(
            "flex w-full items-center justify-center rounded-lg py-2.5 text-center text-sm font-medium capitalize leading-5 transition-all duration-300 hover:brightness-150",
            "ring-blue-600  ring-offset-2 ring-offset-blue-400 focus:outline-none dark:ring-offset-black focus:ring-2",
            tab === selected
              ? "bg-white text-blue-700 dark:text-blue-500 shadow dark:bg-blue-900 dark:bg-opacity-30  "
              : "text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-200 dark:text-zinc-300"
          )}
        >
          <h1 className="">{tab}</h1>
        </button>
      ))}
    </div>
    {children}
  </div>
);
export default Tabs;
