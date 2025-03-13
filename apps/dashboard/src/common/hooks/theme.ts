import { useEffect, useState } from "react";
export const usePrefersDark = () => {
  const [prefersDark, setPrefersDark] = useState(false);
  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").matches &&
      setPrefersDark(true);
  }, []);
  return prefersDark;
};
