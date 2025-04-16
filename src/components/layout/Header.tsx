"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FullscreenMenu from "./FullscreenMenu";
import { motion } from "framer-motion";

/**
 * Header component with interactive navigation that indicates current page
 * Now with smooth fade-in animations using Framer Motion
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.8,
        staggerChildren: 0.2,
        ease: "easeOut",
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="px-4 md:px-12 py-2 md:py-8 fixed top-0 left-0 right-0 z-10 flex justify-between items-center text-foreground"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Logo */}
      <div>
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
      </div>

      {/* Menu toggle button - only on mobile/tablet */}
      <div
        className="uppercase text-sm bg-foreground text-background w-14 rounded-full flex items-center justify-center h-14 font-semibold cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={handleOpenMenu}
        data-cursor-hover
        data-cursor-text="Open Menu"
      >
        Menu
      </div>
      {/* Fullscreen Menu Component */}
      <FullscreenMenu isOpen={menuOpen} onClose={handleCloseMenu} />
    </motion.div>
  );
}

export default Header;
