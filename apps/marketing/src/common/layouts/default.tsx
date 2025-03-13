import { NextPage } from "next";
import Head from "next/head";
import { Header, Footer } from "@components/index";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col font-inter min-h-screen overflow-y-auto dark:bg-black bg-white ">
      <Head>
        <title>screenshotify</title>
      </Head>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
export default Layout;
