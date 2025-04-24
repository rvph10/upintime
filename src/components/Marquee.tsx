import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MarqueeProps {
  text: string;
  index: number;
  speed?: number;
  spacing?: string;
  textSize?: string;
}

const Marquee = ({
  text,
  index,
  speed = 60,
  spacing = "mx-1 lg:mx-4",
  textSize = "text-4xl md:text-6xl lg:text-9xl",
}: MarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const direction = index % 2 === 0 ? -1 : 1; // Alternating direction based on index

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marqueeElement = marqueeRef.current;

    // Calculate container width and required repetitions
    const calculateRepeatCount = () => {
      const viewportWidth = window.innerWidth;
      // Use a more reliable approach to estimate text width
      const tempSpan = document.createElement("span");
      tempSpan.innerText = text;
      tempSpan.style.visibility = "hidden";
      tempSpan.className = spacing;
      document.body.appendChild(tempSpan);
      const textWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);

      return Math.ceil(viewportWidth / textWidth) + 5;
    };

    const repeatCount = calculateRepeatCount();
    marqueeElement.innerHTML = "";

    // Create two divs for seamless looping
    const container1 = document.createElement("div");
    const container2 = document.createElement("div");

    container1.className = "whitespace-nowrap inline-block";
    container2.className = "whitespace-nowrap inline-block";

    // Fill containers with repeated text
    for (let i = 0; i < repeatCount; i++) {
      container1.innerHTML += `<span class="${spacing}">${text}</span>`;
      container2.innerHTML += `<span class="${spacing}">${text}</span>`;
    }

    marqueeElement.appendChild(container1);
    marqueeElement.appendChild(container2);

    // Animation settings
    const animationSettings = {
      x: direction === -1 ? "-100%" : "0%",
      repeat: -1,
      duration: speed,
      ease: "linear",
      repeatRefresh: true,
      paused: false,
    };

    // Initial positions
    if (direction === -1) {
      gsap.set([container1, container2], { x: 0 });
    } else {
      gsap.set([container1, container2], { x: "-100%" });
    }

    // Create the animation
    const animation = gsap.to([container1, container2], animationSettings);
    animationRef.current = animation;

    // Ensure animation doesn't pause on hover
    const preventPause = (e: MouseEvent) => {
      e.preventDefault();
      if (animationRef.current && animationRef.current.paused()) {
        animationRef.current.play();
      }
    };

    // Add event listeners to ensure the animation never stops
    marqueeElement.addEventListener("mouseenter", preventPause);
    marqueeElement.addEventListener("mouseover", preventPause);
    marqueeElement.addEventListener("mouseleave", preventPause);

    // Handle window resize
    const handleResize = () => {
      // Kill existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }

      // Recalculate
      const newRepeatCount = calculateRepeatCount();

      // Update content
      container1.innerHTML = "";
      container2.innerHTML = "";

      for (let i = 0; i < newRepeatCount; i++) {
        container1.innerHTML += `<span class="${spacing}">${text}</span>`;
        container2.innerHTML += `<span class="${spacing}">${text}</span>`;
      }

      // Restart animation with new settings
      const newAnimation = gsap.to([container1, container2], animationSettings);
      animationRef.current = newAnimation;
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      marqueeElement.removeEventListener("mouseenter", preventPause);
      marqueeElement.removeEventListener("mouseover", preventPause);
      marqueeElement.removeEventListener("mouseleave", preventPause);
      window.removeEventListener("resize", handleResize);
    };
  }, [text, direction, spacing, speed]);

  return (
    <div className="overflow-visible whitespace-nowrap w-screen z-10 pointer-events-none">
      <div
        ref={marqueeRef}
        className="flex items-center h-full pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <span className={`${spacing} ${textSize}`}>{text}</span>
      </div>
    </div>
  );
};

export default Marquee;
