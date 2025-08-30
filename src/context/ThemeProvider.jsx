import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({ theme: "mono", setTheme: () => {}, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // Permanently lock theme to 'mono'
  const [theme, setTheme] = useState("mono");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", "mono");
    }
  }, []);

  // No-op toggle to preserve API compatibility
  const toggleTheme = () => {};

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
