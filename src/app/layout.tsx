import type { Metadata } from "next";
import "./globals.css";
import { HeaderWrapper } from "@/components/layout/Header";
import { CursorProvider } from "@/components/cursor/CustomCursor";
import { PreloaderProvider } from "@/components/preloader/PreloaderProvider";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import { ViewTransitions } from "next-view-transitions";

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
    <html lang="en" className="scroll-smooth h-full">
      <body className="mx-12 mt-8 bg-background text-primary h-full font-primary flex flex-col overflow-x-hidden">
        <ViewTransitions>
          <PreloaderProvider>
            <CursorProvider>
              <HeaderWrapper />
              <main>
                {children}
                <Analytics />
              </main>
              <Footer />
            </CursorProvider>
          </PreloaderProvider>
        </ViewTransitions>
      </body>
    </html>
  );
}
