import { useEffect, useState } from "react";

export function useDarkMode(): [boolean, (val: boolean) => void] {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === "true" ? true : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return [darkMode, setDarkMode];
}
