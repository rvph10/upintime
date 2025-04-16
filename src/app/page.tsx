"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePreloaderContext } from "@/components/preloader/PreloaderProvider";

export default function Home() {
  const { isLoading } = usePreloaderContext();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only start animations when preloader is no longer showing
    if (!isLoading) {
      // Small delay to ensure the preloader has fully transitioned out
      const timer = setTimeout(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Animate the heading
        tl.to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3, // Small delay after preloader
        });

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
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="w-full h-[100vh] rounded-lg overflow-hidden flex items-center justify-center">
      <div className="w-full h-full text-center font-bold text-4xl md:text-6xl lg:text-9xl text-foreground flex flex-col items-center justify-center px-4">
        <h1 ref={headingRef} className="opacity-0 transform translate-y-8">
          Up In Town
        </h1>
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
