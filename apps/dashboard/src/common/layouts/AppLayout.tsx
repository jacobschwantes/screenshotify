import { NextPage } from "next";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import { Header, Navigation } from "@components/index";
import { ReactNode } from "react";
interface AppLayoutProps {
  children: ReactNode;
}
const AppLayout: NextPage<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden dark:bg-black">
      <Head>
        <title>screenshotify | app</title>
      </Head>
      <ToastContainer
        position="bottom-right"
        className="text-sm"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
        pauseOnHover
      />
      <div className="fixed z-10 w-full ">
        <Header />
      </div>
      <div className=" hidden pt-20 dark:border-r dark:border-zinc-900 dark:bg-black sm:block ">
        <Navigation wideNav={false} />
      </div>
      <div className="h-full flex-1 pt-16">{children}</div>
    </div>
  );
};

export default AppLayout;
