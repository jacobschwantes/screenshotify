import { NextPage } from "next";
import { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import SettingsLayout from "@layouts/SettingsLayout";
import Spinner from "@components/Spinner";
import { toast } from "react-toastify";
import { getFunctions, httpsCallable } from "firebase/functions";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { User } from "firebase/auth";
const functions = getFunctions();
const resetPassword = httpsCallable(functions, "resetPassword");
interface AccountProps {
  idToken: string;
  user: User;
}
const Account: NextPage<AccountProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const handleResetPassword = () => {
    setLoading(true);
    resetPassword()
      .then((result) => {
        setLoading(false);
        toast(
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            <span>
              <p className="text-sm font-extralight">
                Password reset email sent to {props.user.email}.
              </p>
            </span>
          </div>,
          {
            theme: "dark",
            progressClassName: "toastProgressBlue",
          }
        );
      })
      .catch((e: any) =>
        toast(
          <div className="flex items-center space-x-3">
            <span>
              <h1 className=" font-medium">{e.error}</h1>
              <p className="text-sm font-extralight">{e.message}</p>
            </span>
          </div>,
          {
            type: "error",
          }
        )
      );
  };
  return (
    <div className="flex-1  p-5 h-full overflow-y-auto ">
      <SettingsLayout>
        <main className="  space-y-5 max-w-7xl">
          <p className="dark:text-zinc-300 font-medium">
            Signed in as: <span className="font-normal ">{props.user.email}</span>
          </p>
          <button
            onClick={handleResetPassword}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-black"
          >
            Reset password {loading && <Spinner className="h-5 w-5" />}
          </button>
          {/* <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              <section aria-labelledby="payment-details-heading">
                <form action="#" method="POST">
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="bg-white py-6 px-4 sm:p-6">
                      <div>
                        <h2
                          id="payment-details-heading"
                          className="text-lg leading-6 font-medium text-zinc-900"
                        >
                          Payment details
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          Update your billing information. Please note that
                          updating your location could affect your tax rates.
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-4 gap-6">
                        <div className="col-span-4 sm:col-span-2">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            First name
                          </label>
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            autoComplete="cc-given-name"
                            className="form-input mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-4 sm:col-span-2">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            Last name
                          </label>
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            autoComplete="cc-family-name"
                            className="form-input mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-4 sm:col-span-2">
                          <label
                            htmlFor="email-address"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            Email address
                          </label>
                          <input
                            type="text"
                            name="email-address"
                            id="email-address"
                            autoComplete="email"
                            className="form-input mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="expiration-date"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            Expration date
                          </label>
                          <input
                            type="text"
                            name="expiration-date"
                            id="expiration-date"
                            autoComplete="cc-exp"
                            className="form-input mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                            placeholder="MM / YY"
                          />
                        </div>

                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="security-code"
                            className="flex items-center text-sm font-medium text-zinc-700"
                          >
                            <span>Security code</span>
                            <QuestionMarkCircleIcon
                              className="ml-1 flex-shrink-0 h-5 w-5 text-zinc-300"
                              aria-hidden="true"
                            />
                          </label>
                          <input
                            type="text"
                            name="security-code"
                            id="security-code"
                            autoComplete="cc-csc"
                            className="form-input mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-4 sm:col-span-2">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            autoComplete="country-name"
                            className="mt-1 block w-full bg-white border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
                          </select>
                        </div>

                        <div className="col-span-4 sm:col-span-2">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            ZIP / Postal code
                          </label>
                          <input
                            type="text"
                            name="postal-code"
                            id="postal-code"
                            autoComplete="postal-code"
                            className="form-input mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-zinc-50 text-right sm:px-6">
                      <button
                        type="submit"
                        className="bg-zinc-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div> */}
        </main>
      </SettingsLayout>
    </div>
  );
};

export default Account;
