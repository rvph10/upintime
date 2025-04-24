import React, { useRef, useEffect, useState } from "react";

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
  speed = 20,
  spacing = "mx-1 lg:mx-4",
  textSize = "text-4xl md:text-6xl lg:text-9xl",
}: MarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef1 = useRef<HTMLDivElement>(null);
  const contentRef2 = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const direction = index % 2 === 0 ? -1 : 1; // Alternating direction based on index
  const [elementWidth, setElementWidth] = useState(0);

  // Custom animation loop using requestAnimationFrame instead of GSAP
  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    if (!contentRef1.current || !contentRef2.current) return;

    // Calculate how far we've moved
    const elapsed = timestamp - startTimeRef.current;
    // Adjust speed - lower number = faster animation
    const speedFactor = 0.05 / speed;

    // Calculate position based on elapsed time
    let position = (elapsed * speedFactor) % 100;

    // Apply the position differently based on direction
    if (direction === -1) {
      contentRef1.current.style.transform = `translateX(-${position}%)`;
      contentRef2.current.style.transform = `translateX(-${position + 100}%)`;

      // When the first container goes off-screen, reset positions
      if (position > 99.9) {
        position = 0;
        startTimeRef.current = timestamp;
      }
    } else {
      contentRef1.current.style.transform = `translateX(${position - 100}%)`;
      contentRef2.current.style.transform = `translateX(${position}%)`;

      // When the second container goes off-screen, reset positions
      if (position > 99.9) {
        position = 0;
        startTimeRef.current = timestamp;
      }
    }

    // Continue the animation loop
    requestRef.current = requestAnimationFrame(animate);
  };

  // Calculate how many repeats we need to fill the screen
  useEffect(() => {
    const calculateNeededRepeats = () => {
      if (!marqueeRef.current) return 5;

      // Create a test element to measure text width
      const testElement = document.createElement("span");
      testElement.textContent = text;
      testElement.className = spacing + " " + textSize;
      testElement.style.position = "absolute";
      testElement.style.visibility = "hidden";
      document.body.appendChild(testElement);

      const singleWidth = testElement.offsetWidth;
      document.body.removeChild(testElement);

      const screenWidth = window.innerWidth;
      const repeatsNeeded = Math.ceil(screenWidth / singleWidth) + 2;

      return repeatsNeeded;
    };

    const repeats = calculateNeededRepeats();
    setElementWidth(repeats);

    // Start the animation
    requestRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      const newRepeats = calculateNeededRepeats();
      setElementWidth(newRepeats);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [text, spacing, textSize, speed]);

  // Create repeated text elements
  const createRepeatedElements = (count: number) => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      elements.push(
        <span key={i} className={spacing}>
          {text}
        </span>,
      );
    }
    return elements;
  };

  return (
    <div
      className="overflow-hidden whitespace-nowrap w-screen z-10 select-none"
      ref={marqueeRef}
      style={{
        pointerEvents: "none",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <div className="relative">
        <div
          ref={contentRef1}
          className={`absolute whitespace-nowrap inline-block ${textSize}`}
          style={{
            willChange: "transform",
            pointerEvents: "none",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          {createRepeatedElements(elementWidth)}
        </div>
        <div
          ref={contentRef2}
          className={`absolute whitespace-nowrap inline-block ${textSize}`}
          style={{
            willChange: "transform",
            pointerEvents: "none",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          {createRepeatedElements(elementWidth)}
        </div>

        {/* Invisible spacer to maintain height */}
        <div className={`opacity-0 ${textSize}`}>{text}</div>
      </div>
    </div>
  );
};

export default Marquee;
