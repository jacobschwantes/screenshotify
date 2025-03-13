import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { NextComponentType, NextPageContext } from "next";
import React from "react";
interface ToggleProps {
  setEnabled: (value: boolean) => void;
  enabled: boolean;
  children: React.ReactNode;
}
const Toggle: NextComponentType<NextPageContext, {}, ToggleProps> = ({
  enabled,
  setEnabled,
  children,
}) => {
  return (
    <div className="flex items-start justify-between">
      {children}
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={clsx(
          enabled ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:ring-offset-zinc-900"
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </div>
  );
};
export default Toggle;
