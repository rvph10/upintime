import Image from "next/image";
/**
 * Team section component with team member profiles and future growth indication
 */
export const TeamSection = () => {
  return (
    <section className="w-full min-h-screen px-5 md:px-8 lg:px-12 relative">
      {/* Top left corner title */}
      <div
        className="absolute text-background top-20 left-6 md:top-24 md:left-8 lg:left-12 lg:top-24 
                  font-black uppercase text-3xl md:text-5xl lg:text-7xl z-10 mix-blend-difference"
      >
        INTRODUCING THE
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NEIGHBORHOOD
      </div>
      {/* Content positioned below the title */}
      <div className="w-full pt-48 md:pt-56 lg:pt-80 text-foreground-secondary">
        {/* First team member - Raphael */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24 mb-28 md:mb-36">
          {/* Left column - Text content */}
          <div className="w-full md:w-1/2 order-2 md:order-1 md:pt-24"></div>

          {/* Right column - Image, Name, Role */}
          <div className="w-full md:w-1/2 order-1 md:order-2 flex flex-col">
            {/* Title and Name section */}
            <div className="mb-6 md:mb-8">
              <div className="text-foreground-secondary/70 uppercase text-sm md:text-base font-medium tracking-wide mb-1">
                FOUNDER
              </div>
              <h2
                data-animate="word-reveal"
                className="text-4xl md:text-6xl lg:text-7xl font-bold"
              >
                Raphael Genu
              </h2>
            </div>
            {/* Image container with styling */}
            <div className="relative">
              {/* Main portrait */}
              <div className="relative w-full max-w-lg md:max-w-xl h-[550px] md:h-[650px] overflow-hidden rounded-md">
                <Image
                  src="/me.jpg"
                  alt="Raphael Genu"
                  fill
                  className="object-cover transition-all duration-500 grayscale-100 hover:grayscale-0 scale-[1.6] -translate-x-[60px] translate-y-[80px]"
                />
              </div>

              {/* Skills */}
              <p className="text-base md:text-lg lg:text-xl mt-2 font-bold leading-relaxed flex flex-row gap-4">
                <span
                  data-cursor-hover
                  data-cursor-type="link"
                  data-cursor-text="What you see and touch on a website/app - the buttons, layouts, and visuals."
                >
                  Frontend
                </span>
                <span
                  data-cursor-hover
                  data-cursor-type="link"
                  data-cursor-text="What you don't see, but is essential for the website/app to function - the backend logic, databases, and server-side processing."
                >
                  Backend
                </span>
                <span
                  data-cursor-hover
                  data-cursor-type="link"
                  data-cursor-text="The design of the website/app - the colors, fonts, and overall look."
                >
                  Design
                </span>
                <span
                  data-cursor-hover
                  data-cursor-type="link"
                  data-cursor-text="The infrastructure and systems that keep the website/app running - the servers, databases, and networks."
                >
                  DevOps
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Join Our Team Section - Replacing the placeholder second team member */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24 mb-28 md:mb-36">
          {/* Left column - Join Visual with vertical offset */}
          <div className="w-full md:w-1/2 order-1 md:order-1 flex flex-col md:-mt-[680px] lg:-mt-[680px]">
            {/* Title and Call to Action section */}
            <div className="mb-6 md:mb-8">
              <div className="text-foreground-secondary/70 uppercase text-sm md:text-base font-medium tracking-wide mb-1">
                JOIN OUR TOWN
              </div>
              <h2
                data-animate="word-reveal"
                className="text-4xl md:text-6xl lg:text-7xl font-bold"
              >
                Could Be You
              </h2>
            </div>
            {/* Image container with styling */}
            <div className="relative">
              {/* Join Team Visual */}
              <div className="relative w-full max-w-lg md:max-w-xl h-[550px] md:h-[650px] overflow-hidden bg-gradient-to-br rounded-md from-foreground-secondary/5 to-foreground-secondary/20 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-foreground-secondary/70 text-xl md:text-2xl lg:text-3xl font-light mb-4">
                    We&apos;re growing our team
                  </div>
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-foreground-secondary/40 flex items-center justify-center mb-6">
                    <span className="text-3xl">+</span>
                  </div>
                  <p className="text-foreground-secondary/80 max-w-md">
                    As we expand, we&apos;re looking for passionate individuals
                    to join our journey. Interested in being part of something
                    special from the early stages?
                  </p>
                  <button
                    className="mt-8 px-6 py-3 border border-foreground-secondary/40 hover:border-foreground-secondary/80 
                              transition-all duration-300 rounded-full text-sm uppercase tracking-wide
                              hover:bg-foreground-secondary/10"
                  >
                    Get in touch
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Text content */}
          <div className="w-full md:w-1/2 order-2 md:order-2 md:pt-24"></div>
        </div>
      </div>
    </section>
  );
};
