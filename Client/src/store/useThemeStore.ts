import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme immediately
        const isDark =
          theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", isDark);
        set({ isDarkMode: isDark });
      },
      isDarkMode: false,
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const isDark =
            state.theme === "dark" ||
            (state.theme === "system" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches);
          document.documentElement.classList.toggle("dark", isDark);
          state.isDarkMode = isDark;
        }
      },
    }
  )
);
