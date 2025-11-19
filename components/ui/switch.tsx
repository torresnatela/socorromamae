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
          "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full bg-neutral-300 transition-colors duration-200 peer-checked:bg-brand-purple",
          // Use pseudo-element for the thumb so peer-checked can move it (must be a sibling of the input)
          "after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-200 after:ease-in-out peer-checked:after:translate-x-5",
          className
        )}
      />
    </label>
  )
);

Switch.displayName = "Switch";
