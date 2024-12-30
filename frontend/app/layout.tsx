// import './globals.css'
import { Inter } from "next/font/google";
import { Navigation } from "../components/Navigation";
import { PageTransition } from "../components/PageTransition";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Chat Interface",
  description: "An advanced AI chat interface with multiple agent types",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
