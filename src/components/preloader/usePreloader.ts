"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to manage preloader state
 *
 * Returns:
 * - isLoading: boolean indicating if the preloader is active
 * - setIsLoading: function to manually control the preloader state
 */
export function usePreloader(initialDelay = 10000) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit by looking for a session storage flag
    const hasVisited = sessionStorage.getItem("has_visited");
    if (hasVisited) {
      // For returning visitors (in the same session), don't show preloader
      setIsLoading(false);
    } else {
      // For first visit, show preloader and set the flag
      sessionStorage.setItem("has_visited", "true");

      // Safety timer to ensure preloader doesn't get stuck
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, initialDelay);

      return () => clearTimeout(timer);
    }
  }, [initialDelay]);

  return {
    isLoading,
    setIsLoading,
  };
}
