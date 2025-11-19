import type { Metadata } from "next";
import { Inter, Questrial } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/navigation/app-shell";
import { AppProviders } from "@/app/providers";

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
      <AppProviders>
        <AppShell>{children}</AppShell>
      </AppProviders>
    </body>
  </html>
);

export default RootLayout;
