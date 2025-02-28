"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const isActive = usePathname() === href;

  return (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
        ${isActive
          ? "bg-gradient-to-r from-blue-600/70 to-purple-600/70 text-white shadow-lg backdrop-blur-md border border-white/10"
          : "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:text-blue-600 dark:hover:text-blue-400 hover:backdrop-blur-md"
        }
      `}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth-status");
        const data = await res.json();
        setIsLoggedIn(data.loggedIn);
      } catch (error) {
        console.error("Failed to check auth status", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-50/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-xl border-b border-blue-200/10 dark:border-blue-900/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <NavLink href="/chat">Chat</NavLink>
                <NavLink href="/account">Account</NavLink>
                <NavLink href="/help">Help</NavLink>
                <form action="/api/logout" method="POST">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50/30 dark:text-red-400 dark:hover:bg-red-900/10 transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-md border border-transparent hover:border-red-200/20 dark:hover:border-red-800/20"
                  >
                    Log Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                <NavLink href="/login">Log In</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
