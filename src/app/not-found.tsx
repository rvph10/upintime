"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";

// Type definitions for GSAP and SplitText
interface GSAPWindow extends Window {
  SplitText?: SplitTextConstructor;
}

interface GSAPWithSplitText {
  SplitText?: SplitTextConstructor;
  registerPlugin: (plugin: unknown) => void;
  utils: {
    toArray: (target: unknown) => unknown[];
    wrap: (values: number[]) => number;
  };
}

// Type for SplitText constructor
interface SplitTextConstructor {
  new (element: HTMLElement, config: { type: string }): SplitTextResult;
}

// Type for SplitText result
interface SplitTextResult {
  chars: HTMLElement[];
  revert?: () => void;
}

/**
 * NotFound component that displays a 404 page with a link to return home
 */
export default function NotFound() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  // Add element to refs array - properly typed callback
  const addToRefs = (el: HTMLHeadingElement | null, index: number): void => {
    textRefs.current[index] = el;
  };

  useEffect(() => {
    const linkElement = linkRef.current;
    const container = containerRef.current;
    const textElements = textRefs.current.filter(
      Boolean,
    ) as HTMLHeadingElement[];

    if (!linkElement || !container || textElements.length === 0) return;

    // Try to load SplitText if available
    let splitTexts: SplitTextResult[] = [];
    let hasSplitText = false;

    try {
      // Check if we're in browser environment
      if (typeof window !== "undefined") {
        // Check if SplitText is available either on GSAP or window
        const gsapWithSplit = gsap as unknown as GSAPWithSplitText;
        const windowWithSplit = window as GSAPWindow;
        const SplitTextCheck =
          gsapWithSplit.SplitText || windowWithSplit.SplitText;

        if (SplitTextCheck) {
          hasSplitText = true;

          try {
            // Register plugin if available
            if (typeof gsap.registerPlugin === "function") {
              gsap.registerPlugin(SplitTextCheck);
            }

            // Create split text instances
            splitTexts = textElements.map((element) => {
              if (!element) return { chars: [] };
              return new SplitTextCheck(element, { type: "chars" });
            });
          } catch (error) {
            console.warn("Error initializing SplitText:", error);
            hasSplitText = false;
          }
        }
      }
    } catch (error) {
      console.warn(
        "SplitText plugin not available, falling back to simpler animation",
        error,
      );
      hasSplitText = false;
    }

    // Set initial state
    gsap.set(container, {
      perspective: 400,
    });

    // Timeline for hover animation
    const tl = gsap.timeline({ paused: true });

    if (hasSplitText && splitTexts.length > 0) {
      // Complex animation with SplitText
      splitTexts.forEach((split, index) => {
        if (!split || !split.chars || split.chars.length === 0) return;

        tl.to(
          split.chars,
          {
            duration: 0.4,
            y: -10,
            scale: 1.1,
            rotationY: gsap.utils.wrap([-15, 15]),
            rotationX: 10,
            stagger: 0.02,
            ease: "back.out(1.7)",
          },
          index * 0.05,
        );
      });
    } else {
      // Fallback animation without SplitText
      textElements.forEach((el, index) => {
        tl.to(
          el,
          {
            duration: 0.4,
            y: -5 * (index + 1), // Cascading effect
            scale: 1.05,
            ease: "back.out(1.7)",
          },
          index * 0.08,
        );
      });
    }

    // Add subtle container animation
    tl.to(
      container,
      {
        duration: 0.5,
        scale: 1.03,
        filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3))",
        ease: "power2.out",
      },
      0,
    );

    // Event listeners
    const enterAnimation = () => tl.play();
    const leaveAnimation = () => tl.reverse();

    linkElement.addEventListener("mouseenter", enterAnimation);
    linkElement.addEventListener("mouseleave", leaveAnimation);

    // Cleanup on component unmount
    return () => {
      linkElement.removeEventListener("mouseenter", enterAnimation);
      linkElement.removeEventListener("mouseleave", leaveAnimation);

      // Clean up split text if used
      if (hasSplitText) {
        splitTexts.forEach((split) => {
          if (split && typeof split.revert === "function") {
            split.revert();
          }
        });
      }
    };
  }, []);

  return (
    <div className="-mx-12 -mt-8 w-screen h-screen bg-background mb-6 overflow-hidden flex flex-col items-center justify-center">
      {/* Text content with responsive positioning */}
      <Link
        href="/"
        className="hidden absolute top-26 right-4 sm:right-6 md:right-10 lg:block text-right group transition-all z-10" /* Added z-10 */
        data-cursor-hover
        data-cursor-text="Head back to urbanity"
        data-cursor-type="link"
        ref={linkRef}
        style={{
          width: "200px",
          height: "150px" /* Explicitly taller */,
          border: "1px solid transparent",
          pointerEvents: "auto" /* Ensure pointer events work */,
        }}
      >
        <div
          ref={containerRef}
          className="cursor-pointer inline-block px-4 py-2 w-full pointer-events-auto" /* Added pointer-events-auto */
        >
          <h1
            ref={(el) => addToRefs(el, 0)}
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            You&apos;re
          </h1>
          <h1
            ref={(el) => addToRefs(el, 1)}
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            lost
          </h1>
          <h1
            ref={(el) => addToRefs(el, 2)}
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            in Town
          </h1>
        </div>
      </Link>
      {/* 404 */}
      <div className="flex justify-center items-center lg:absolute lg:bottom-0 lg:left-0 h-2/3">
        <Image
          src="/404.svg"
          alt="404"
          width={300}
          height={100}
          className="w-full h-full px-2"
          style={{ minWidth: "300px", maxWidth: "100%" }}
          priority
        />
      </div>

      <div className="block lg:hidden absolute bottom-10 right-4">
        <Link href="/" className="text-foreground flex-col text-right font-bold text-2xl hover:opacity-70 transition-opacity flex items-end">
          <div>You&apos;re lost</div>
          <div>in Town</div>
        </Link>
        <button className="bg-foreground text-background px-2 py-1 rounded-lg text-right font-bold text-xl hover:opacity-70 transition-opacity flex items-center">
          Back to home
        </button>
      </div>
    </div>
  );
}
