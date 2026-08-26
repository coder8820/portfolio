"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

let currentTheme: Theme = "dark";
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setThemeTo(next: Theme) {
  currentTheme = next;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("theme", next);
  }
  emitChange();
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    if (currentTheme !== initial) setThemeTo(initial);
  }, []);

  const toggle = useCallback(() => {
    setThemeTo(currentTheme === "dark" ? "light" : "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
