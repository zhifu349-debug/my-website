"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "./LayoutProvider";

export default function Navigation() {
  const { t, changeLocale, locale } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: `/${locale}`, labelKey: "navigation.home" },
    { href: `/${locale}/vps`, labelKey: "navigation.vps" },
    { href: `/${locale}/ai-tools`, labelKey: "navigation.aiTools" },
    { href: `/${locale}/tutorials`, labelKey: "navigation.tutorials" },
    { href: `/${locale}/comparisons`, labelKey: "navigation.comparisons" },
    { href: `/${locale}/resources`, labelKey: "navigation.resources" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold gradient-text tracking-tight"
            >
              CMS
            </Link>
            <div className="hidden ml-8 lg:flex lg:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-200 hover:bg-gray-100"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={locale}
              onChange={(e) => changeLocale(e.target.value as any)}
              className="appearance-none bg-gray-50 border border-gray-200 hover:border-gray-300 px-3 py-1.5 pr-8 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
            </select>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
