"use client";

import { usePathname } from "next/navigation";
import { MainNav } from "@/components/navigation/main-nav";

const HIDDEN_NAV_PREFIXES = ["/login", "/register", "/subscription"];

const shouldHideNav = (pathname: string | null) => {
  if (!pathname) return false;
  if (pathname === "/") return true;

  return HIDDEN_NAV_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
};

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideNav = shouldHideNav(pathname);

  return (
    <>
      {!hideNav && <MainNav />}
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8">
        {children}
      </main>
    </>
  );
};
