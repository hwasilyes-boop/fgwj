"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, User, Heart } from "lucide-react";
import { useCart } from "@/context/cart";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logo, setLogo] = useState("");
  const { totalItems } = useCart();

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load settings");
        return response.json();
      })
      .then((data) => {
        setLogo(data.logo_image || "");
      })
      .catch(() => {
        setLogo("");
      });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <img
                src={logo}
                alt="Wrapy"
                className="max-w-[150px] sm:max-w-[180px] max-h-12 object-contain"
              />
            ) : (
              <>
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                  WRAPY
                </span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-brand" />
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/skins"
              className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide uppercase"
            >
              Skins
            </Link>

            <Link
              href="/skins?featured=true"
              className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide uppercase"
            >
              Featured
            </Link>

            <Link
              href="/skins?bestseller=true"
              className="text-sm text-gray-300 hover:text-white transition-colors tracking-wide uppercase"
            >
              Best Sellers
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/account/wishlist"
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/account"
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/cart"
              className="relative text-gray-400 hover:text-white transition-colors p-2"
            >
              <ShoppingBag className="w-5 h-5" />

              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-black text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden text-gray-400 hover:text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark border-t border-dark-border animate-fade-in">
          <nav className="px-4 py-6 space-y-4">
            <Link
              href="/skins"
              onClick={() => setMenuOpen(false)}
              className="block text-lg text-gray-300 hover:text-white transition-colors"
            >
              All Skins
            </Link>

            <Link
              href="/skins?featured=true"
              onClick={() => setMenuOpen(false)}
              className="block text-lg text-gray-300 hover:text-white transition-colors"
            >
              Featured
            </Link>

            <Link
              href="/skins?bestseller=true"
              onClick={() => setMenuOpen(false)}
              className="block text-lg text-gray-300 hover:text-white transition-colors"
            >
              Best Sellers
            </Link>

            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="block text-lg text-gray-300 hover:text-white transition-colors"
            >
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
