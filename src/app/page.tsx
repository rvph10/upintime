"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePreloaderContext } from "@/components/preloader/PreloaderProvider";

export default function Home() {
  const { isLoading } = usePreloaderContext();
  const subheadingRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Function to run animations
  const runAnimations = () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(subheadingRef.current, { opacity: 0, y: 20 });

    // Animate the subheading
    tl.to(
      subheadingRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 1,
      },
      "-=0.5",
    ); // Start before the previous animation finishes
  };

  // Handle initial load animation
  useEffect(() => {
    // Only start animations when preloader is no longer showing
    if (!isLoading) {
      // Small delay to ensure the preloader has fully transitioned out
      const timer = setTimeout(() => {
        runAnimations();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Listen for navigation events
  useEffect(() => {
    const handlePageTransition = (event: CustomEvent) => {
      if (event.detail.destination === "/") {
        setShouldAnimate(true);
      }
    };

    // Add event listener for custom navigation events
    window.addEventListener(
      "pageTransition",
      handlePageTransition as EventListener,
    );

    return () => {
      window.removeEventListener(
        "pageTransition",
        handlePageTransition as EventListener,
      );
    };
  }, []);

  // Run animations when shouldAnimate changes
  useEffect(() => {
    if (shouldAnimate) {
      runAnimations();
      setShouldAnimate(false);
    }
  }, [shouldAnimate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full text-center font-bold text-4xl md:text-6xl lg:text-9xl text-foreground flex flex-col items-center justify-center px-4">
        <h1 className="transform translate-y-8 pb-6 tracking">UpInTown</h1>
        <div
          ref={subheadingRef}
          className="text-lg md:text-xl lg:text-2xl font-medium mt-6 md:mt-8 lg:mt-12 text-foreground/60 w-full md:w-2/3 lg:w-1/4 opacity-0 transform translate-y-8"
        >
          Constructing digital landmarks that captivate the town
        </div>
      </div>
    </div>
  );
}
