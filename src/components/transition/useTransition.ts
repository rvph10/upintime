"use client";

import { useTransitionRouter } from "next-view-transitions";

/**
 * Custom hook for page transitions
 * Provides a function to navigate between pages with a smooth transition effect
 * Allows skipping the transition for menu links
 */
export function usePageTransition() {
  const router = useTransitionRouter();

  /**
   * Animation function for the slide-in-out transition
   * Current page slides up and fades out while new page slides in from bottom
   */
  const slideInOut = () => {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      },
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  /**
   * Navigate to a URL with or without transition
   * @param url - The URL to navigate to
   * @param isMenuLink - Whether this is a menu link (to skip transition)
   */
  const navigateTo = (url: string, isMenuLink: boolean = false) => {
    if (isMenuLink) {
      // Regular navigation without transition for menu links
      router.push(url);
    } else {
      // Apply transition for non-menu links
      router.push(url, {
        onTransitionReady: slideInOut,
      });
    }
  };

  return { navigateTo };
}
