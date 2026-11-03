import { cn } from "@/lib/utils";

interface TagChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  size?: "sm" | "default";
}

export function TagChip({ label, selected, onClick, size = "default" }: TagChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full border font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        size === "sm" ? "h-9 px-3.5 text-sm" : "h-11 px-4.5",
        selected
          ? "border-transparent bg-foreground text-background"
          : "border-input bg-card text-foreground hover:bg-muted",
      )}
    >
      {label}
    </button>
  );
}
