"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

/**
 * About page component with Nibblix-inspired scroll animation
 * Simplified implementation with optimized performance
 */
export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safety check for SSR
    if (typeof window === "undefined") return;

    // Register GSAP plugin
    gsap.registerPlugin(ScrollTrigger);

    // Clear any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach((t) => t.kill());
    ScrollTrigger.clearMatchMedia();

    // Set up the initial state
    if (window.innerWidth < 768) {
      gsap.set(imageContainerRef.current, {
        y: "-250%",
        scale: 0.9,
      });
    } else if (window.innerWidth < 900) {
      gsap.set(imageContainerRef.current, {
        y: "-180%",
        scale: 0.7,
      });
    } else {
      gsap.set(imageContainerRef.current, {
        y: "-80%",
        x: "-30%",
        scale: 0.4,
      });
    }

    // Set initial state for text overlay - hidden
    gsap.set(textOverlayRef.current, {
      opacity: 0,
    });

    // Create the main animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".intro-section",
        start: "top bottom",
        end: "top 10%",
        scrub: 0.5,
      },
    });

    // Add animations to the timeline
    tl.to(
      imageContainerRef.current,
      {
        y: "0%",
        x: "0%",
        scale: 1,
        ease: "none",
      },
      0,
    );

    // Animate text overlay to appear when the image is expanded
    tl.to(
      textOverlayRef.current,
      {
        opacity: 1,
        ease: "power2.out",
      },
      0.8, // Start this animation at 80% of the timeline to make it appear near the end
    );

    // Clean up function
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full transition-colors min-h-screen overflow-hidden bg-white"
    >
      {/* Hero Section */}
      <section className="w-full h-screen relative">
        {/* Main Title - larger on desktop, smaller on mobile */}
        <div
          className="title-text absolute text-background top-20 left-6 md:top-24 md:left-8 lg:left-12 lg:top-24 
          font-black uppercase text-3xl md:text-5xl lg:text-7xl z-10 mix-blend-difference"
        >
          CODE
          <br />
          MEET CITY
        </div>

        {/* Bottom Section Title - responsive positioning */}
        <div
          className="absolute text-background bottom-12 md:bottom-16 lg:bottom-20 right-6 md:right-8 lg:right-12
          font-black uppercase text-3xl md:text-5xl lg:text-7xl text-right z-10 mix-blend-difference"
        >
          BUILDING
          <br />
          DIGITAL TOWNS
        </div>

        {/* Tagline - hidden on small mobile, visible elsewhere with responsive positioning */}
        <div
          className="absolute text-background top-24 right-6 md:top-24 md:right-8 lg:right-12 lg:top-24
          font-bold text-sm md:text-base lg:text-lg max-w-xs md:max-w-sm lg:max-w-md text-right z-10
          hidden sm:block mix-blend-difference"
        >
          The city never sleeps, and neither do our applications. We build
          robust digital infrastructure that keeps your business moving 24/7,
          just like the urban rhythm that inspires us.
        </div>
      </section>

      {/* Intro Section - Animation trigger area */}
      <section className="intro-section w-full px-5 md:px-8 lg:px-12 relative">
        <div
          ref={imageContainerRef}
          className="relative transform-gpu origin-center"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2em",
            willChange: "transform",
          }}
        >
          {/* Image preview container */}
          <div className="w-full aspect-video rounded-md lg:rounded-3xl overflow-hidden">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/inspirations.GIF"
                alt="inspirations"
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
                priority
              />

              {/* Text overlay that appears when expanded */}
              <div
                ref={textOverlayRef}
                className="absolute bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 
                           bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium
                           shadow-lg z-10 pointer-events-none"
              >
                Our inspirations
              </div>
            </div>
          </div>
        </div>
        <div className="md:hidden flex justify-start items-center font-bold text-sm mt-6">
          The city never sleeps, and neither do our applications. We build
          robust digital infrastructure that keeps your business moving 24/7,
          just like the urban rhythm that inspires us.
        </div>
      </section>

      {/* Outro Section */}
      <section className="w-full min-h-screen px-5 md:px-8 lg:px-12 flex items-center justify-center">
        <p className="font-medium text-xl md:text-2xl lg:text-3xl text-center max-w-xl mx-auto">
          Delve into coding without clutter.
        </p>
      </section>
    </div>
  );
}
