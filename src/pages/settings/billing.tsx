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
    priceYearly: 7.50,
    limit: "1000 requests / mo",
  },
  {
    name: "Pro+",
    priceMonthly: 15,
    priceYearly: 12.50,
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
    <div className="flex-1 overflow-y-auto h-full p-5">
      <SettingsLayout>
        <main className=" pb-10 lg:py-12  max-w-7xl">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Payment details */}
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              {/* Plan */}
              <section aria-labelledby="plan-heading">
                <form action="#" method="POST">
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="bg-white dark:bg-black py-6  space-y-6 sm:p-6">
                      <div>
                        <h2
                          id="plan-heading"
                          className="text-lg leading-6 font-medium text-zinc-900 dark:text-zinc-100"
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
                        <div className="relative bg-white dark:bg-black rounded-md -space-y-px">
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
                                    ? "bg-blue-50 border-blue-200 dark:border-blue-900 dark:bg-blue-900 dark:bg-opacity-50 z-10"
                                    : "border-zinc-200 dark:border-zinc-800",
                                  "relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <span className="flex items-center text-sm">
                                    <span
                                      className={clsx(
                                        checked
                                          ? "bg-blue-500 border-transparent"
                                          : "bg-white border-zinc-300",
                                        active
                                          ? "ring-2 ring-offset-2 ring-zinc-900"
                                          : "",
                                        "h-4 w-4 rounded-full border flex items-center justify-center"
                                      )}
                                      aria-hidden="true"
                                    >
                                      <span className="rounded-full bg-white w-1.5 h-1.5" />
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
                                      ${annualBillingEnabled ? plan.priceYearly : plan.priceMonthly} / mo
                                    </span>{" "}
                                   
                                    <span
                                      className={
                                        checked
                                          ? "text-blue-700 dark:text-blue-500"
                                          : "text-zinc-500 dark:text-zinc-400"  
                                      }
                                    >
                                      {annualBillingEnabled ? 'billed yearly' : 'billed monthly'} 
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
                            annualBillingEnabled ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-zinc-900 focus:ring-blue-600"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={clsx(
                              annualBillingEnabled
                                ? "translate-x-5"
                                : "translate-x-0",
                              "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
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
                    <div className="px-4 py-3 bg-zinc-50 dark:bg-black text-right sm:px-6">
                      <button
                      disabled
                        type="submit"
                        className="bg-blue-600  border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
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
