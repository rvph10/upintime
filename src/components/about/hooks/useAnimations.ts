import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TextPlugin } from "gsap/dist/TextPlugin";
import SplitType from "split-type";

// Register TextPlugin globally
gsap.registerPlugin(TextPlugin);

// Words to cycle through in the animation
export const CYCLING_WORDS = ["HUMAN", "MOTION", "SHAPES", "DIGITAL", "FLOW"];

interface UseAnimationsProps {
  containerRef: RefObject<HTMLDivElement | null>;
  imageContainerRef: RefObject<HTMLDivElement | null>;
  cyclingTextRef: RefObject<HTMLSpanElement | null>;
}

/**
 * Custom hook to handle all GSAP animations for the About page
 */
export const useAnimations = ({
  containerRef,
  imageContainerRef,
  cyclingTextRef,
}: UseAnimationsProps) => {
  useEffect(() => {
    // Safety check for SSR
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.getAll().forEach((t) => t.kill());
    ScrollTrigger.clearMatchMedia();

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        // Desktop
        "(min-width: 900px)": () => {
          gsap.set(imageContainerRef.current, {
            y: "-80%",
            x: "-30%",
            scale: 0.4,
          });
          createScrollAnimation();
        },
        // Tablet
        "(min-width: 768px) and (max-width: 899px)": () => {
          gsap.set(imageContainerRef.current, { y: "-180%", scale: 0.7 });
          createScrollAnimation();
        },
        // Mobile
        "(max-width: 767px)": () => {
          gsap.set(imageContainerRef.current, { y: "-250%", scale: 0.9 });
          createScrollAnimation();
        },
      });

      // Text Reveal Animation setup
      const elementsToAnimate = gsap.utils.toArray<HTMLElement>(
        '[data-animate="word-reveal"]',
      );
      const splitInstances: SplitType[] = [];

      elementsToAnimate.forEach((element) => {
        const splitInstance = new SplitType(element, {
          types: "lines,words,chars",
          tagName: "span",
        });
        splitInstances.push(splitInstance);
        gsap.set(splitInstance.words, { opacity: 0.1, y: 0 });
        gsap.to(splitInstance.words, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "center center",
            scrub: 1.5,
          },
        });
      });

      return () => {
        splitInstances.forEach((instance) => instance.revert());
      };
    }, containerRef);

    // Function to create the word cycling animation timeline
    function createWordCycleAnimation() {
      if (!cyclingTextRef.current) return null;

      const wordTl = gsap.timeline({
        repeat: -1, // Loop indefinitely
        repeatDelay: 0.2, // Short pause between loops
        paused: true, // Start paused, will be played by main timeline
        defaults: { ease: "power4.inOut" },
      });

      CYCLING_WORDS.forEach((word) => {
        wordTl
          .set(cyclingTextRef.current, { textContent: word, opacity: 0, y: 30 }) // Set text and initial state (invisible, slightly down)
          .to(cyclingTextRef.current, { opacity: 1, y: 0, duration: 0.4 }) // Fade in and move up
          .to(
            cyclingTextRef.current,
            { opacity: 0, y: -30, duration: 0.4 },
            "+=1.0",
          ); // Wait 1s, then fade out and move up
      });

      return wordTl;
    }

    // Function to create the main scroll animation timeline
    function createScrollAnimation() {
      // Create and get the word cycle timeline instance FIRST
      const wordCycleTimeline = createWordCycleAnimation();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".intro-section",
          start: "top bottom",
          end: "top 10%",
          scrub: 0.5,
          // Add onUpdate callback to control word cycle based on progress
          onUpdate: (self) => {
            if (wordCycleTimeline) {
              const threshold = 0.9; // Play when main timeline is 90% complete (triggers later)
              if (self.progress > threshold && wordCycleTimeline.paused()) {
                wordCycleTimeline.play();
              } else if (
                self.progress <= threshold &&
                !wordCycleTimeline.paused()
              ) {
                wordCycleTimeline.pause();
                // Optional: Immediately hide the text when pausing
                gsap.set(cyclingTextRef.current, { opacity: 0 });
              }
            }
          },
        },
      });

      tl.to(
        imageContainerRef.current,
        { y: "0%", x: "0%", scale: 1, ease: "none" },
        0,
      ).to(
        containerRef.current,
        { backgroundColor: "#101010", ease: "none" },
        window.innerWidth > 768 ? 0.05 : 0.1,
      );

      return tl;
    }

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [containerRef, imageContainerRef, cyclingTextRef]);
};
