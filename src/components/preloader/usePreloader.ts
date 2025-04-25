"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to manage preloader state
 *
 * Returns:
 * - isLoading: boolean indicating if the preloader is active
 * - isTransitioning: boolean indicating if the preloader is transitioning out
 * - setIsLoading: function to manually control the preloader state
 */
export function usePreloader(initialDelay = 10000) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle the loading state change with a transition period
  const handleLoadingChange = (newLoadingState: boolean) => {
    if (newLoadingState === false && isLoading === true) {
      // When switching from loading to not loading, add transition period
      setIsTransitioning(true);
      // Transition duration (should match the header animation duration)
      setTimeout(() => {
        setIsLoading(false);
        // Add a small delay before completing the transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800); // This matches the header animation timing
      }, 100);
    } else {
      setIsLoading(newLoadingState);
    }
  };

  useEffect(() => {
    // Check if this is the first visit by looking for a session storage flag
    const hasVisited = sessionStorage.getItem("has_visited");
    if (hasVisited) {
      // For returning visitors (in the same session), don't show preloader
      setIsLoading(false);
      setIsTransitioning(false);
    } else {
      // For first visit, show preloader and set the flag
      sessionStorage.setItem("has_visited", "true");

      // Safety timer to ensure preloader doesn't get stuck
      const timer = setTimeout(() => {
        handleLoadingChange(false);
      }, initialDelay);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDelay]);

  return {
    isLoading,
    isTransitioning,
    setIsLoading: handleLoadingChange,
  };
}
