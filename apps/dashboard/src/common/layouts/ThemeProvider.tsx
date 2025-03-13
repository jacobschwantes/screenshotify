import { usePrefersDark } from "@hooks/theme";
import clsx from "clsx";
import { NextPage } from "next";
interface ThemeProps {
  children: React.ReactNode;
  theme: "light" | "dark" | "system";
}
const ThemeProvider: NextPage<ThemeProps> = ({ children, theme }) => {
  const prefersDark = usePrefersDark();
  return (
    <div
      className={clsx(
        (theme === "system" && prefersDark) || theme === "dark" ? "dark" : ""
      )}
    >
      {children}
    </div>
  );
};
export default ThemeProvider;
