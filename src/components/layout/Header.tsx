"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import FullscreenMenu from "./FullscreenMenu";
import { usePreloaderContext } from "@/components/preloader/PreloaderProvider";

/**
 * Header component with interactive navigation that indicates current page
 * Now with GSAP animations that only trigger after preloader finishes
 */
function Header() {
  const { isLoading } = usePreloaderContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  // GSAP animations - only trigger when loading is done
  useEffect(() => {
    if (!isLoading && headerRef.current) {
      // Initial state - completely transparent
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(menuButtonRef.current, { opacity: 0, scale: 0.8 });

      // Create a timeline for header animations
      const headerTl = gsap.timeline({
        delay: 1.5, // Wait for page content to animate in
        defaults: {
          ease: "power3.out",
        },
      });

      // Animate header container first
      headerTl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      });

      // Then logo with a slight bounce
      headerTl.to(
        logoRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );

      // Then menu button with slight delay
      headerTl.to(
        menuButtonRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );
    }
  }, [isLoading]);

  return (
    <div
      ref={headerRef}
      className="px-4 md:px-12 py-2 md:py-8 fixed top-0 left-0 right-0 z-10 flex justify-between items-center text-foreground"
    >
      {/* Logo */}
      <div ref={logoRef}>
        <Link
          href="/"
          data-cursor-hover
          data-cursor-text="Home"
          className="transition-transform duration-300 hover:scale-110 block"
        >
          <Image
            src="/upintown.svg"
            alt="Up In Town Logo"
            width={48}
            height={48}
            priority
          />
        </Link>
      </div>

      {/* Menu toggle button */}
      <div
        ref={menuButtonRef}
        className="uppercase text-sm bg-foreground text-background w-16 rounded-full flex items-center justify-center h-14 font-semibold cursor-pointer transition-transform duration-300 hover:scale-110"
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
