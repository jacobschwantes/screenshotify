import { NextPage } from "next";
import { useState } from "react";
import { RadioGroup, Switch } from "@headlessui/react";
import SettingsLayout from "@layouts/SettingsLayout";
import clsx from "clsx";
const plans = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    limit: "200 requests / mo",
  },
  {
    name: "Pro",
    priceMonthly: 9,
    priceYearly: 7.5,
    limit: "1000 requests / mo",
  },
  {
    name: "Pro+",
    priceMonthly: 15,
    priceYearly: 12.5,
    limit: "2500 requests / mo",
  },
];
const payments = [
  {
    id: 1,
    date: "1/1/2020",
    datetime: "2020-01-01",
    description: "Business Plan - Annual Billing",
    amount: "CA$109.00",
    href: "#",
  },
  // More payments...
];

const Billing: NextPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [annualBillingEnabled, setAnnualBillingEnabled] = useState(true);

  return (
    <div className="h-full flex-1 overflow-y-auto p-5">
      <SettingsLayout>
        <main className=" max-w-7xl pb-10  lg:py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Payment details */}
            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
              {/* Plan */}
              <section aria-labelledby="plan-heading">
                <form action="#" method="POST">
                  <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white py-6  dark:bg-black sm:p-6">
                      <div>
                        <h2
                          id="plan-heading"
                          className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                        >
                          Plan
                        </h2>
                      </div>

                      <RadioGroup
                        value={selectedPlan}
                        onChange={setSelectedPlan}
                      >
                        <RadioGroup.Label className="sr-only">
                          Pricing plans
                        </RadioGroup.Label>
                        <div className="relative -space-y-px rounded-md bg-white dark:bg-black">
                          {plans.map((plan, planIdx) => (
                            <RadioGroup.Option
                              key={plan.name}
                              value={plan}
                              className={({ checked }) =>
                                clsx(
                                  planIdx === 0
                                    ? "rounded-tl-md rounded-tr-md"
                                    : "",
                                  planIdx === plans.length - 1
                                    ? "rounded-bl-md rounded-br-md"
                                    : "",
                                  checked
                                    ? "z-10 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900 dark:bg-opacity-50"
                                    : "border-zinc-200 dark:border-zinc-800",
                                  "relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <span className="flex items-center text-sm">
                                    <span
                                      className={clsx(
                                        checked
                                          ? "border-transparent bg-blue-500"
                                          : "border-zinc-300 bg-white",
                                        active
                                          ? "ring-2 ring-zinc-900 ring-offset-2"
                                          : "",
                                        "flex h-4 w-4 items-center justify-center rounded-full border"
                                      )}
                                      aria-hidden="true"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                    <RadioGroup.Label
                                      as="span"
                                      className="ml-3 font-medium text-zinc-900 dark:text-zinc-300 "
                                    >
                                      {plan.name}
                                    </RadioGroup.Label>
                                  </span>
                                  <RadioGroup.Description
                                    as="span"
                                    className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                                  >
                                    <span
                                      className={clsx(
                                        checked
                                          ? "text-blue-900 dark:text-blue-500"
                                          : "text-zinc-900 dark:text-zinc-300",
                                        "font-medium"
                                      )}
                                    >
                                      $
                                      {annualBillingEnabled
                                        ? plan.priceYearly
                                        : plan.priceMonthly}{" "}
                                      / mo
                                    </span>{" "}
                                    <span
                                      className={
                                        checked
                                          ? "text-blue-700 dark:text-blue-500"
                                          : "text-zinc-500 dark:text-zinc-400"
                                      }
                                    >
                                      {annualBillingEnabled
                                        ? "billed yearly"
                                        : "billed monthly"}
                                    </span>
                                  </RadioGroup.Description>
                                  <RadioGroup.Description
                                    as="span"
                                    className={clsx(
                                      checked
                                        ? "text-blue-700 dark:text-blue-500"
                                        : "text-zinc-500",
                                      "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                                    )}
                                  >
                                    {plan.limit}
                                  </RadioGroup.Description>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>

                      <Switch.Group as="div" className="flex items-center">
                        <Switch
                          checked={annualBillingEnabled}
                          onChange={setAnnualBillingEnabled}
                          className={clsx(
                            annualBillingEnabled
                              ? "bg-blue-600"
                              : "bg-zinc-200 dark:bg-zinc-800",
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:ring-offset-zinc-900"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={clsx(
                              annualBillingEnabled
                                ? "translate-x-5"
                                : "translate-x-0",
                              "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          />
                        </Switch>
                        <Switch.Label as="span" className="ml-3">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Annual billing
                          </span>
                        </Switch.Label>
                      </Switch.Group>
                    </div>
                    <div className="bg-zinc-50 px-4 py-3 text-right dark:bg-black sm:px-6">
                      <button
                        disabled
                        type="submit"
                        className="inline-flex  justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </section>

              {/* Billing history */}
              {/* <section aria-labelledby="billing-history-heading">
                <div className="bg-white pt-6 shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 sm:px-6">
                    <h2
                      id="billing-history-heading"
                      className="text-lg leading-6 font-medium text-zinc-900"
                    >
                      Billing history
                    </h2>
                  </div>
                  <div className="mt-6 flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-t border-zinc-200">
                          <table className="min-w-full divide-y divide-zinc-200">
                            <thead className="bg-zinc-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                >
                                  Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                >
                                  Description
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                >
                                  Amount
                                </th>
                                {/*
                                    `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                                  */}
              {/* <th
                                  scope="col"
                                  className="relative px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                >
                                  <span className="sr-only">View receipt</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-zinc-200">
                              {payments.map((payment) => (
                                <tr key={payment.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                                    <time dateTime={payment.datetime}>
                                      {payment.date}
                                    </time>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {payment.description}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {payment.amount}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a
                                      href={payment.href}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      View receipt
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}
            </div>
          </div>
        </main>
      </SettingsLayout>
    </div>
  );
};

export default Billing;
