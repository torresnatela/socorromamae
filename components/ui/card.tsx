import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "surface-card bg-white border border-neutral-200 shadow-card",
      className
    )}
    {...props}
  />
);
