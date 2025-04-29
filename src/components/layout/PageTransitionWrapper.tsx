"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { listenForPageTransitions } from "@/lib/utils/pageTransition";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that handles page transitions and background loading
 * This enables smooth transitions between pages when navigating from the menu
 */
const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, setDestination] = useState<string | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Check if this is a navigation from the menu
    const isMenuNavigation =
      sessionStorage.getItem("menuNavigation") === "true";

    if (isMenuNavigation) {
      // Clear the session storage flag
      sessionStorage.removeItem("menuNavigation");

      // Get the destination from session storage
      const menuDestination = sessionStorage.getItem("menuDestination");
      if (menuDestination) {
        sessionStorage.removeItem("menuDestination");
        console.log(`Page detected menu navigation to ${menuDestination}`);
      }
    }

    // Mark as mounted
    mountedRef.current = true;

    // Listen for page transition events
    const cleanup = listenForPageTransitions((dest) => {
      if (pathname === dest) {
        // This is the destination page - start preparing
        console.log(`Destination page ${dest} is preparing for transition`);
        setDestination(dest);
        setIsTransitioning(true);
      }
    });

    return cleanup;
  }, [pathname]);

  // When pathname changes, we know we've completed a navigation
  useEffect(() => {
    if (mountedRef.current) {
      // Reset transition state
      setIsTransitioning(false);
      setDestination(null);
    }
  }, [pathname]);

  return (
    <div
      className={`page-transition-wrapper ${isTransitioning ? "is-transitioning" : ""}`}
    >
      {children}
    </div>
  );
};

export default PageTransitionWrapper;
