/**
 * Hero section component for the About page
 * @returns Hero section with titles and tagline
 */
export const HeroSection = () => {
  return (
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
        data-animate="word-reveal"
        className="absolute text-background top-24 right-6 md:top-24 md:right-8 lg:right-12 lg:top-24
        font-bold text-sm md:text-base lg:text-lg max-w-xs md:max-w-sm lg:max-w-md text-right z-10
        hidden sm:block mix-blend-difference"
      >
        The city never sleeps, and neither do our applications. We build robust
        digital infrastructure that keeps your business moving 24/7, just like
        the urban rhythm that inspires us.
      </div>
    </section>
  );
};
