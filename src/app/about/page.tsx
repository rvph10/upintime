"use client";

import { useRef } from "react";
import { HeroSection } from "@/components/about/HeroSection";
import { IntroSection } from "@/components/about/IntroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { TeamSection } from "@/components/about/TeamSection";
import { useAnimations } from "@/components/about/hooks/useAnimations";

/**
 * About page component with Nibblix-inspired scroll animation
 * Refactored implementation with optimized performance and better component structure
 */
export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const cyclingTextRef = useRef<HTMLSpanElement>(null);

  // Initialize animations with refs
  useAnimations({
    containerRef,
    imageContainerRef,
    cyclingTextRef,
  });

  return (
    <div
      ref={containerRef}
      className="w-full transition-colors min-h-screen overflow-hidden bg-white"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Intro Section - Animation trigger area */}
      <IntroSection
        imageContainerRef={imageContainerRef}
        cyclingTextRef={cyclingTextRef}
      />

      {/* About Section */}
      <AboutSection />

      {/* Team Presentation Section */}
      <TeamSection />
    </div>
  );
}
