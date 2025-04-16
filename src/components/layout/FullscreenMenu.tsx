"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * FullscreenMenu Component
 *
 * A minimalist fullscreen menu that creates a black corridor animation effect
 * when opening and closing.
 *
 * @param {boolean} isOpen - Controls the menu's open/close state
 * @param {() => void} onClose - Callback function to close the menu
 */
interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullscreenMenu = ({ isOpen, onClose }: FullscreenMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP animations and handle open/close
  useEffect(() => {
    const defaultEase = "power4.inOut";

    // Function to open menu
    const openMenu = () => {
      gsap.to(menuRef.current, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        pointerEvents: "all",
        duration: 1.25,
        ease: defaultEase,
      });
    };

    // Function to close menu
    const closeMenu = () => {
      gsap.to(menuRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        pointerEvents: "none",
        duration: 1.25,
        ease: defaultEase,
        onComplete: () => {
          gsap.set(menuRef.current, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
        },
      });
    };

    // Watch for isOpen changes and trigger animations
    if (isOpen) {
      openMenu();
    } else {
      if (menuRef.current) {
        const computedStyle = window.getComputedStyle(menuRef.current);
        const clipPath = computedStyle.clipPath;
        // Only run close animation if menu was previously open
        if (clipPath !== "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)") {
          closeMenu();
        }
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="menu fixed top-0 left-0 w-screen h-screen bg-[#101010] z-50 pointer-events-none"
      style={{
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      }}
    >
      {/* Close button - matches header menu button position and style */}
      <div className="px-4 md:px-12 py-2 md:py-8 fixed top-0 left-0 right-0 flex justify-between items-center">
        <div className="invisible">
          {/* Placeholder to maintain spacing */}
          <div className="w-12 h-11" />
        </div>
        <div
          className="uppercase bg-background text-foreground w-12 md:w-16 rounded-full flex items-center justify-center h-10 md:h-14 text-xs md:text-sm font-semibold cursor-pointer transition-transform duration-300 hover:scale-110"
          onClick={onClose}
          data-cursor-hover
          data-cursor-text="Close Menu"
        >
          Close
        </div>
      </div>
    </div>
  );
};

export default FullscreenMenu;
