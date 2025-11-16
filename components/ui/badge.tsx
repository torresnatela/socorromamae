import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "muted";
};

export const Badge = ({ className, tone = "default", ...props }: BadgeProps) => {
  const toneClass =
    tone === "success"
      ? "bg-green-50 text-green-700 border border-green-200"
      : tone === "muted"
        ? "bg-neutral-100 text-neutral-700 border border-neutral-200"
        : "bg-purple-50 text-purple-700 border border-purple-100";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
        toneClass,
        className
      )}
      {...props}
    />
  );
};
