import { create } from "zustand";

type Theme = "light" | "dark";

const STORAGE_KEY = "nodepop-theme";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

/** index.html aplica la clase `dark` antes de pintar; aquí se parte de ese valor. */
export const useThemeStore = create<ThemeStore>()((set, get) => ({
  theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
  toggleTheme: () => {
    const theme: Theme = get().theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Sin almacenamiento disponible el tema dura solo esta visita.
    }
    set({ theme });
  },
}));
