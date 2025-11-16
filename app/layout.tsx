import type { Metadata } from "next";
import { Inter, Questrial } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/navigation/main-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-questrial",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Socorro Mamãe",
  description:
    "Base UX importada do ZIP do Figma AI com navegação principal e rotas estáveis."
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR" className={`${inter.variable} ${questrial.variable}`}>
    <body className="bg-[var(--shell-bg)] text-[var(--shell-text)] antialiased">
      <MainNav />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8">
        {children}
      </main>
    </body>
  </html>
);

export default RootLayout;
