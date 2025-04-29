import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HeaderWrapper } from "@/components/layout/Header";
import { CursorProvider } from "@/components/cursor/CustomCursor";
import { PreloaderProvider } from "@/components/preloader/PreloaderProvider";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import { ViewTransitions } from "next-view-transitions";
import PageTransitionWrapper from "@/components/layout/PageTransitionWrapper";

/**
 * Viewport configuration for better responsive behavior
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ebebeb",
  viewportFit: "cover",
};

/**
 * Metadata configuration for SEO
 */
export const metadata: Metadata = {
  title: {
    template: "%s | Up In Town",
    default: "Up In Town - Development Studio",
  },
  description:
    "Professional development studio specializing in modern, high-performance applications.",
  keywords: [
    "development studio",
    "web development",
    "modern applications",
    "high-performance",
  ],
  authors: [{ name: "Up In Town" }],
  creator: "Up In Town",
  metadataBase: new URL("https://upintown.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://upintown.dev",
    title: "Up In Town - Development Studio",
    description:
      "Professional development studio specializing in modern, high-performance applications.",
    siteName: "Up In Town",
  },
  twitter: {
    card: "summary_large_image",
    title: "Up In Town - Development Studio",
    description:
      "Professional development studio specializing in modern, high-performance applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth h-full">
      <head>
        {/* Preconnect to critical domains */}
        <link
          rel="preconnect"
          href="https://prod.spline.design"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://va.vercel-scripts.com"
          crossOrigin="anonymous"
        />

        {/* Preconnect to Google Fonts with DNS prefetch */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Critical CSS inline (minimal set) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * {cursor: none !important;}
              body {
                overscroll-behavior: none;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              ::-webkit-scrollbar {width: 0px;}
              ::selection {
                background: rgba(200, 200, 200, 0.2);
                color: inherit;
              }
            `,
          }}
        />
      </head>
      <body
        className="bg-background text-primary min-h-screen font-primary 
                   flex flex-col overflow-x-hidden relative
                   selection:bg-foreground-secondary/20"
      >
        <ViewTransitions>
          <PreloaderProvider>
            <CursorProvider>
              <HeaderWrapper />
              <main>
                <PageTransitionWrapper>{children}</PageTransitionWrapper>
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
