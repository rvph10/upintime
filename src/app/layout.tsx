import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import CustomCursor from "@/components/cursor/CustomCursor";

export const metadata: Metadata = {
  title: "Up In Town - Development Studio",
  description:
    "Professional development studio specializing in modern, high-performance applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="mx-12 my-8 bg-background text-primary min-h-screen font-primary">
        <CustomCursor />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
