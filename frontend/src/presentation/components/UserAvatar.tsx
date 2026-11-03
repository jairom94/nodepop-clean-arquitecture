import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  lastname?: string;
  className?: string;
}

export function UserAvatar({ name, lastname = "", className }: UserAvatarProps) {
  const initials = `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground",
        className,
      )}
    >
      {initials}
    </span>
  );
}
