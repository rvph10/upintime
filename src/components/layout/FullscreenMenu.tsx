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
 */
interface FullscreenMenuProps {
  isOpen: boolean;
}

const FullscreenMenu = ({ isOpen }: FullscreenMenuProps) => {
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
      className="menu fixed top-0 left-0 w-screen h-screen bg-background-secondary z-50 pointer-events-none overflow-hidden pt-20"
      style={{
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      }}
    ></div>
  );
};

export default FullscreenMenu;
