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
    <div className="flex max-w-4xl space-x-2 rounded-xl bg-zinc-100 p-1 dark:border dark:border-zinc-900 dark:bg-black ">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setSelected(tab)}
          className={clsx(
            "flex w-full items-center justify-center rounded-lg py-2.5 text-center text-sm font-medium capitalize leading-5 transition-all duration-300 hover:brightness-150",
            "ring-blue-600  ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 dark:ring-offset-black",
            tab === selected
              ? "bg-white text-blue-700 shadow dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-500  "
              : "text-zinc-700 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-200"
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
