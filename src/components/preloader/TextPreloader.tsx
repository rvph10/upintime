"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloaderContext } from "./PreloaderProvider";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TextPreloader = () => {
  const { setIsLoading } = usePreloaderContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentences = [
      "Innovate. Create. Elevate.",
      "Digital solutions, expertly crafted",
      "Your vision, now UpInTown",
    ];

    let active = true;
    const ctx = gsap.context(() => {}); // Create a GSAP context for proper cleanup

    const runAnimation = async () => {
      try {
        // For each sentence
        for (let i = 0; i < sentences.length; i++) {
          if (!active) return;

          const words = sentences[i].split(" ");

          // Clear the container
          if (wordsContainerRef.current) {
            wordsContainerRef.current.innerHTML = "";

            // Create a wrapper for better word spacing
            const sentenceWrapper = document.createElement("div");
            sentenceWrapper.className =
              "flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4";
            wordsContainerRef.current.appendChild(sentenceWrapper);

            // Create word containers first without animation
            const wordContainers: HTMLDivElement[] = [];
            const letterElements: HTMLSpanElement[][] = [];

            // Create all word containers
            for (let j = 0; j < words.length; j++) {
              // Create word container for proper spacing
              const wordContainer = document.createElement("div");
              wordContainer.className = "word-container relative";
              sentenceWrapper.appendChild(wordContainer);
              wordContainers.push(wordContainer);

              // Split word into letters
              const letters = words[j].split("");
              const wordLetters: HTMLSpanElement[] = [];

              // Create letter spans but don't animate yet
              letters.forEach((letter) => {
                const letterSpan = document.createElement("span");
                letterSpan.textContent = letter;
                letterSpan.className = "letter-span inline-block opacity-0";
                letterSpan.style.transform = "translateY(20px) rotateY(45deg)";
                letterSpan.style.filter = "blur(5px)";
                wordContainer.appendChild(letterSpan);
                wordLetters.push(letterSpan);
              });

              letterElements.push(wordLetters);
            }

            // Now animate each word sequentially
            for (let j = 0; j < wordContainers.length; j++) {
              if (!active) return;

              // Choose a random animation style for this word
              const animStyle = Math.floor(Math.random() * 3);

              // Animate each letter in the word
              gsap.to(letterElements[j], {
                opacity: 1,
                y: 0,
                rotationY: 0,
                filter: "blur(0px)",
                stagger: 0.04, // Stagger the letters
                duration: 0.5,
                ease: "power2.out",
                delay: animStyle === 0 ? 0 : 0.1, // Small variation
              });

              // Add a subtle float animation to the word container
              if (animStyle === 1) {
                // Subtle float for some words
                gsap.fromTo(
                  wordContainers[j],
                  { y: 10 },
                  { y: 0, duration: 0.6, ease: "back.out(1.2)" },
                );
              } else if (animStyle === 2) {
                // Small scale effect for some words
                gsap.fromTo(
                  wordContainers[j],
                  { scale: 0.9 },
                  { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" },
                );
              }

              // Wait before next word
              await new Promise((resolve) =>
                setTimeout(resolve, 120 + animStyle * 30),
              );
            }
          }

          // Pause at the end of sentence
          await new Promise((resolve) => setTimeout(resolve, 1200));

          // Don't animate out the last sentence
          if (i < sentences.length - 1) {
            // Get all letter spans in current sentence
            const allLetters = Array.from(
              wordsContainerRef.current?.querySelectorAll(".letter-span") || [],
            );

            // Animate letters out with staggered blur effect
            gsap.to(allLetters, {
              opacity: 0,
              y: -10,
              filter: "blur(5px)",
              stagger: {
                from: "random", // Random starting point
                amount: 0.4, // Total stagger duration
              },
              duration: 0.4,
            });

            // Wait for exit animation
            await new Promise((resolve) => setTimeout(resolve, 600));
          }
        }

        // Final transition - corridor effect
        if (containerRef.current && overlayRef.current && active) {
          // First fade out the text with a staggered letter effect
          const allFinalLetters = Array.from(
            wordsContainerRef.current?.querySelectorAll(".letter-span") || [],
          );

          gsap.to(allFinalLetters, {
            opacity: 0,
            y: -15,
            rotationX: 45,
            filter: "blur(8px)",
            stagger: {
              from: "center",
              amount: 0.6,
            },
            duration: 0.6,
            ease: "power2.in",
          });

          // Wait for text to fade out
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Then animate the corridor effect
          gsap.to(overlayRef.current, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1.25,
            ease: "power4.inOut",
            onComplete: () => {
              if (active) {
                // Animation complete, notify the app
                setIsLoading(false);
              }
            },
          });
        }
      } catch (error) {
        console.error("Animation error:", error);
        if (active) setIsLoading(false);
      }
    };

    // Start the animation
    runAnimation();

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      if (active) setIsLoading(false);
    }, 10000);

    return () => {
      active = false;
      clearTimeout(fallbackTimeout);
      ctx.revert(); // Clean up all GSAP animations
    };
  }, [setIsLoading]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        backgroundColor: "#000000",
      }}
    >
      <div
        ref={containerRef}
        className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8"
      >
        <div className="text-xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-background w-full max-w-[90vw] md:max-w-4xl text-center">
          <div ref={wordsContainerRef} className="min-h-[1.2em]"></div>
        </div>
      </div>
    </div>
  );
};

export default TextPreloader;
