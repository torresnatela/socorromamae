import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Socorro Mamãe",
  description:
    "Caregiver authentication foundations with a simple MVC-friendly Next.js scaffold."
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR">
    <body>
      <main>{children}</main>
    </body>
  </html>
);

export default RootLayout;
