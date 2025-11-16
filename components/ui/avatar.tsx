import Image from "next/image";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  imageUrl?: string;
};

export const Avatar = ({ name, imageUrl, className, ...props }: AvatarProps) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 text-purple-800 font-semibold shadow-inner",
        className
      )}
      aria-label={name}
      {...props}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={name} fill sizes="48px" className="object-cover" />
      ) : (
        initial
      )}
    </div>
  );
};
