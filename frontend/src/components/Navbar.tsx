/* eslint-disable sort-imports */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";
import { useEffect, useState } from "react";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            : "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:text-blue-600 dark:hover:text-blue-400"
        }
      `}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isLoggedIn();
      setLoggedIn(isAuth);
    };
    checkAuth();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 backdrop-blur-md border-b border-blue-200/30 dark:border-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <>
                <NavLink href="/chat">Chat</NavLink>
                <NavLink href="/account">Account</NavLink>
                <NavLink href="/settings">Settings</NavLink>
                <NavLink href="/help">Help</NavLink>
                <form action="/api/logout" method="POST">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-300"
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
