import { RefObject } from "react";
import Image from "next/image";

interface IntroSectionProps {
  imageContainerRef: RefObject<HTMLDivElement | null>;
  cyclingTextRef: RefObject<HTMLSpanElement | null>;
}

/**
 * Introduction section with animated image and cycling text
 */
export const IntroSection = ({
  imageContainerRef,
  cyclingTextRef,
}: IntroSectionProps) => {
  return (
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
        <div className="w-full aspect-video rounded-md lg:rounded-xl overflow-hidden">
          <div className="relative w-full h-full overflow-hidden isolate">
            <Image
              src="/inspirations.GIF"
              alt="inspirations"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
            />

            {/* Apply positioning and blend styles directly to the span */}
            <span
              ref={cyclingTextRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 text-background mix-blend-difference font-black text-[80px] md:text-[160px] lg:text-[300px] uppercase opacity-0"
            ></span>
          </div>
        </div>
      </div>
    </section>
  );
};
