"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UrlObject } from "url";

const links = [
  { href: "/", label: "Início" },
  { href: "/login", label: "Login" },
  { href: "/register/child", label: "Cadastro criança" },
  { href: "/register/caregiver", label: "Cadastro cuidador" },
  { href: "/subscription", label: "Assinatura" },
  { href: "/chat", label: "Chat" },
  { href: "/progress", label: "Progresso" },
  { href: "/health", label: "Health" }
];

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink text-white font-bold shadow-sm">
            SM
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-700 font-semibold">
              Socorro Mamãe
            </p>
            <p className="text-sm text-neutral-600">Base UX importada</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 text-sm font-semibold text-neutral-700 md:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href as unknown as UrlObject}
                className={cn(
                  "rounded-full px-3 py-2 transition hover:bg-purple-50",
                  isActive && "bg-purple-100 text-purple-800"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
