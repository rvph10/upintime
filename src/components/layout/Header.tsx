"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FullscreenMenu from "./FullscreenMenu";

/**
 * Header component with interactive navigation that indicates current page
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="px-12 py-8 fixed top-0 left-0 right-0 z-10 flex justify-between items-center text-foreground">
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

      {/* Menu toggle button - only on mobile/tablet */}
      <div
        className="uppercase text-sm font-semibold cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={handleOpenMenu}
        data-cursor-hover
        data-cursor-text="Open Menu"
      >
        Menu
      </div>
      {/* Fullscreen Menu Component */}
      <FullscreenMenu isOpen={menuOpen} onClose={handleCloseMenu} />
    </div>
  );
}

export default Header;
