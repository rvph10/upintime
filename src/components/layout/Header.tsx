"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Header component with interactive navigation that indicates current page
 */
function Header() {
  const pathname = usePathname();

  /**
   * Determines if the given path matches current pathname
   */
  const isActive = (path: string) => {
    if (path === "Home") return pathname === "/";
    return pathname === `/${path.toLowerCase()}`;
  };

  /**
   * Formats link text to show when active
   */
  const getLinkText = (path: string) => {
    return isActive(path) ? `(${path})` : path;
  };

  return (
    <div className="px-12 py-8 bg-gradient-to-b from-background to-transparent backdrop-blur-sm fixed top-0 left-0 right-0 z-10 flex justify-between items-center text-foreground">
      {/* Logo */}
      <Link
        href="/"
        data-cursor-hover
        data-cursor-text="Home"
        className="transition-transform duration-300 hover:scale-110"
      >
        <Image
          src="/upintown.svg"
          alt="Up In Town Logo"
          width={48}
          height={48}
        />
      </Link>

      {/* Navbar */}
      <div className="flex items-center gap-12 font-semibold">
        <Link href="/" data-cursor-hover>
          <span className="group relative hover:scale-110 transition-transform duration-300 inline-block">
            {getLinkText("Home")}
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link href="/work" data-cursor-hover>
          <span className="group relative hover:scale-110 transition-transform duration-300 inline-block">
            {getLinkText("Work")}
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link href="/about" data-cursor-hover>
          <span className="group relative hover:scale-110 transition-transform duration-300 inline-block">
            {getLinkText("About")}
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link href="/contact" data-cursor-hover data-cursor-text="Get In Touch">
          <span className="group relative hover:scale-110 transition-transform duration-300 inline-block">
            {getLinkText("Contact")}
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>
    </div>
  );
}

export default Header;
