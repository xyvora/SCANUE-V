// TODO: Need real types for any types

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, MessageSquare, User, LogIn, Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
    { href: '/account', icon: User, label: 'Account' },
    { href: '/login', icon: LogIn, label: 'Login' },
  ]

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.span
                className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1
                }}
              >
                SCANUE-V
              </motion.span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <NavLink key={item.href} href={item.href} icon={item.icon} active={pathname === item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <MobileNavLink key={item.href} href={item.href} icon={item.icon} active={pathname === item.href}>
                  {item.label}
                </MobileNavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function NavLink({ href, children, icon: Icon, active }: { href: string; children: React.ReactNode; icon: any; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-2 rounded-md text-sm font-medium ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
      tabIndex={0}
    >
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-5 h-5" />
        <span>{children}</span>
      </motion.div>
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
          layoutId="underline"
        />
      )}
    </Link>
  )
}

function MobileNavLink({ href, children, icon: Icon, active }: { href: string; children: React.ReactNode; icon: any; active: boolean }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
      tabIndex={0}
    >
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-5 h-5" />
        <span>{children}</span>
      </motion.div>
    </Link>
  )
}
