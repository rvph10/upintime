"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePreloaderContext } from "./PreloaderProvider";

const BrutalTextPreloader = () => {
  const { setIsLoading } = usePreloaderContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const wordContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation timing constants (in seconds)
    const TIMING = {
      WORD_DISPLAY: 0.6, // How long each word is displayed
      WORD_FADE_IN: 0.15, // Word entrance animation
      WORD_FADE_OUT: 0.1, // Word exit animation
      WORD_GAP: 0.15, // Gap between words
      SEQUENCE_GAP: 0.3, // Gap between sequences
      FINAL_HOLD: 0.8, // How long to hold the last word
      FINAL_TRANSITION: 0.5, // Final overlay transition
    };

    // Bold, impactful word sequences focused on development expertise
    const wordSequences = [
      ["BELOW", "BEYOND", "ABOVE"],
      ["MAKE", "IT", "HAPPEN"],
      ["UpInTown"],
    ];

    let active = true;
    const ctx = gsap.context(() => {});

    const runAnimation = async () => {
      try {
        // For each word sequence
        for (let i = 0; i < wordSequences.length; i++) {
          if (!active) return;
          const words = wordSequences[i];
          const isLastSequence = i === wordSequences.length - 1;

          // Clear the container
          if (wordContainerRef.current) {
            wordContainerRef.current.innerHTML = "";

            // Create word element but keep it hidden initially
            const wordElement = document.createElement("div");
            wordElement.className =
              "font-bold tracking-tight transform scale-100";
            wordContainerRef.current.appendChild(wordElement);

            // Display each word with a "brutal" animation
            for (let j = 0; j < words.length; j++) {
              if (!active) return;
              const isLastWord = j === words.length - 1;

              // Set the word text
              wordElement.textContent = words[j];

              // Reset styles for new word
              gsap.set(wordElement, {
                opacity: 0,
                scale: 1.2,
                y: 0,
              });

              // Brutal entrance - quick, high impact
              gsap.to(wordElement, {
                opacity: 1,
                scale: 1,
                duration: TIMING.WORD_FADE_IN,
                ease: "power1.out",
              });

              // Hold word
              await new Promise((resolve) =>
                setTimeout(resolve, TIMING.WORD_DISPLAY * 1000),
              );

              // Brutal exit - quick cut (unless it's the last word of the sequence)
              if (!isLastWord) {
                gsap.to(wordElement, {
                  opacity: 0,
                  scale: 0.9,
                  duration: TIMING.WORD_FADE_OUT,
                  ease: "power1.in",
                });

                // Brief pause between words
                await new Promise((resolve) =>
                  setTimeout(resolve, TIMING.WORD_GAP * 1000),
                );
              }
            }

            // Hold the last word longer
            await new Promise((resolve) =>
              setTimeout(resolve, TIMING.FINAL_HOLD * 1000),
            );

            // Clear for next sequence unless it's the last sequence
            if (!isLastSequence) {
              gsap.to(wordElement, {
                opacity: 0,
                duration: TIMING.WORD_FADE_OUT,
              });

              await new Promise((resolve) =>
                setTimeout(resolve, TIMING.SEQUENCE_GAP * 1000),
              );
            }
          }
        }

        // Final brutal transition
        if (containerRef.current && overlayRef.current && active) {
          // Hard cut transition at the end
          gsap.to(wordContainerRef.current, {
            opacity: 0,
            duration: TIMING.WORD_FADE_OUT,
          });

          await new Promise((resolve) =>
            setTimeout(resolve, TIMING.SEQUENCE_GAP * 1000),
          );

          // Final overlay transition - brutal slides
          gsap.to(overlayRef.current, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: TIMING.FINAL_TRANSITION,
            ease: "power2.inOut",
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

    // Calculate total animation duration for fallback timeout
    const totalWords = wordSequences.reduce((sum, seq) => sum + seq.length, 0);
    const estimatedDuration =
      totalWords *
        (TIMING.WORD_DISPLAY + TIMING.WORD_FADE_IN + TIMING.WORD_GAP) +
      (wordSequences.length - 1) * TIMING.SEQUENCE_GAP +
      TIMING.FINAL_HOLD +
      TIMING.FINAL_TRANSITION;

    // Add 1 second buffer to estimated duration
    const fallbackTimeout = setTimeout(
      () => {
        if (active) setIsLoading(false);
      },
      (estimatedDuration + 1) * 1000,
    );

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
        className="fixed inset-0 flex items-center justify-center p-4"
      >
        <div className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-white w-full max-w-[90vw] text-center">
          <div ref={wordContainerRef} className="min-h-[1.2em]"></div>
        </div>
      </div>
    </div>
  );
};

export default BrutalTextPreloader;
