import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Up In Town - App Development Studio",
  description:
    "Professional app development studio specializing in modern, high-performance applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smoot">
      <body
        className={`${inter.className} bg-background text-primary min-h-screen mx-12 my-4 font-primary`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
