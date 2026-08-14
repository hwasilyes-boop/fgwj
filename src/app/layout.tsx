import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/context/cart";
import SiteTheme from "@/components/SiteTheme";
import "./globals.css";

export const metadata: Metadata = {
  title: "WRAPY â€” Premium Phone Skins",
  description: "Wrap your world. Premium phone skins designed for those who demand excellence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark text-white antialiased min-h-screen">
        <CartProvider>
          <SiteTheme />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

