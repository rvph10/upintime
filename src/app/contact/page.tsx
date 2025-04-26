"use client";
import ContactForm from "@/components/contact/ContactForm";
import Spline from "@splinetool/react-spline";

/**
 * Contact page component with responsive design
 * Maintains layout for larger screens while adapting for smaller devices
 */
export default function ContactPage() {
  return (
    <div className="w-full max-sm:mt-12 min-h-screen relative flex items-center justify-center px-5 py-16 md:p-0">
      {/* Form - Centered on mobile, positioned on larger screens */}
      <ContactForm className="w-full max-w-md lg:max-w-lg lg:absolute lg:bottom-16 lg:left-26 z-10" />
      {/* Form - Centered on mobile, positioned on larger screens */}
      <ContactForm className="w-full max-w-md lg:max-w-lg lg:absolute lg:bottom-16 lg:left-26 z-10" />

      {/* Spline blob with adjusted container */}
      <div className="absolute top-[-100px] left-0 right-0 bottom-0 h-[calc(100%+200px)] overflow-visible hidden md:block z-5">
        <Spline
          className="absolute z-[-1] h-full w-full inset-0"
          scene="https://prod.spline.design/PH0P4acRZe4DmDNP/scene.splinecode"
        />
      </div>

      {/* Corner email - Responsive positioning and text size */}
      <div
        className="absolute text-background mix-blend-difference 
          top-5 right-5 md:top-16 md:right-5 lg:right-26 lg:top-32
          font-bold uppercase text-xl hidden md:block md:text-3xl lg:text-6xl text-right z-10"
      >
        <a
          data-cursor-hover
          data-cursor-text="Email us"
          data-cursor-type="link"
          href="mailto:contact@upintown.dev"
          className="hover:opacity-80 transition-opacity"
        >
          contact
          <br />
          @upintown.dev
        </a>
      </div>

      {/* Corner Text - Top Left - Responsive positioning and text size */}
      <div
        className="absolute text-background mix-blend-difference 
        top-5 left-5 md:top-16 md:left-5 lg:left-26 lg:top-32
        font-bold uppercase text-xl sm:text-2xl md:text-3xl lg:text-6xl z-10"
      >
        Get in <br />
        touch.
      </div>

      {/* Corner Text - Bottom Right - Responsive positioning and text size */}
      <div
        className="absolute text-background mix-blend-difference 
        bottom-5 right-5 md:bottom-16 md:right-5 lg:right-26 lg:bottom-16
        font-bold uppercase text-xl sm:text-2xl md:text-3xl lg:text-6xl text-right z-10"
      >
        Drop us <br />a line.
      </div>
    </div>
  );
}
