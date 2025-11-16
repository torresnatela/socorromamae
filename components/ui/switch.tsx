import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, ...props }, ref) => (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        ref={ref}
        className="sr-only peer"
        checked={checked}
        {...props}
      />
      <span
        className={cn(
          "block h-6 w-11 rounded-full bg-neutral-300 transition peer-checked:bg-brand-purple",
          className
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"
          )}
        />
      </span>
    </label>
  )
);

Switch.displayName = "Switch";
