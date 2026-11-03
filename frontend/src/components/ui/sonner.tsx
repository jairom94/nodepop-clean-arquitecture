import { Toaster as Sonner } from "sonner";
import { useThemeStore } from "@/store/theme/theme-store";

export function Toaster() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Sonner
      theme={theme}
      position="bottom-center"
      toastOptions={{ className: "!rounded-2xl !font-sans !font-medium" }}
    />
  );
}
