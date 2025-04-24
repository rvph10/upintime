"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import FullscreenMenu from "./FullscreenMenu";
import { usePreloaderContext } from "@/components/preloader/PreloaderProvider";

/**
 * HeaderWrapper component that only renders the Header when the preloader is done
 * This prevents the header from briefly appearing during preloader transitions
 */
export function HeaderWrapper() {
  const { isLoading } = usePreloaderContext();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure preloader transition is complete
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return <Header />;
}

/**
 * Header component with interactive navigation that indicates current page
 * Now with GSAP animations that only trigger after preloader finishes
 * Features mix-blend-mode: difference for visual contrast against backgrounds
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // if mobile, set logo size to 32
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const logoSize = isMobile ? 36 : 48;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // GSAP animations - trigger immediately on mount
  useEffect(() => {
    if (headerRef.current && !hasAnimated.current) {
      hasAnimated.current = true;

      // Initial state - completely transparent
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(menuButtonRef.current, { opacity: 0, scale: 0.8 });

      // Create a timeline for header animations with a delay to match preloader transition
      const headerTl = gsap.timeline({
        delay: 0.1, // Reduced delay since we're now properly handling mounting
        defaults: {
          ease: "power3.out",
        },
      });

      // Animate header container first
      headerTl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      });

      // Then logo with a slight bounce
      headerTl.to(
        logoRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.4", // Slightly overlap with header animation
      );

      // Then menu button with slight delay
      headerTl.to(
        menuButtonRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.4", // Slightly overlap with logo animation
      );
    }
  }, []);

  return (
    <>
      <div
        ref={headerRef}
        className="px-4 py-4 fixed top-0 left-0 right-0 z-[200] flex justify-between items-center text-foreground opacity-0 mix-blend-difference select-none"
      >
        {/* Logo */}
        <div ref={logoRef} className="opacity-0 relative z-[201]">
          <Link
            href="/"
            data-cursor-hover
            data-cursor-text="Home"
            data-cursor-type="link"
            className="transition-transform duration-300 hover:scale-110 block"
          >
            <Image
              src="/upintown-white.svg"
              alt="Up In Town Logo"
              width={logoSize}
              height={logoSize}
              priority
            />
          </Link>
        </div>

        {/* Menu toggle button */}
        <div
          ref={menuButtonRef}
          className="uppercase text-xs md:text-sm bg-white text-foreground w-12 md:w-16 rounded-full flex items-center justify-center h-10 md:h-14 font-semibold cursor-pointer transition-transform duration-300 hover:scale-110 opacity-0 relative z-[201]"
          onClick={toggleMenu}
          data-cursor-hover
          data-cursor-text={menuOpen ? "Close Menu" : "Open Menu"}
          data-cursor-type="button"
        >
          {menuOpen ? "Close" : "Menu"}
        </div>
      </div>

      {/* Fullscreen Menu Component - moved outside header div */}
      <FullscreenMenu
        isOpen={menuOpen}
        onLinkClick={() => setMenuOpen(false)}
      />
    </>
  );
}

export default Header;
