"use client";
import ContactForm from "@/components/contact/ContactForm";
import Spline from "@splinetool/react-spline";
export default function AboutPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {/* Form */}
      <ContactForm className="lg:absolute lg:bottom-16 lg:left-26"/>

      {/* Spline blob */}
      <Spline className="absolute z-[-1] h-full w-full"
        scene="https://prod.spline.design/PH0P4acRZe4DmDNP/scene.splinecode" 
      />

      {/* Corner Text */}
      <div className="absolute text-background mix-blend-difference top-16 left-5 font-bold uppercase text-3xl md:left-15 lg:left-26 md:top-26 lg:top-32 md:text-5xl lg:text-6xl">
        Get in <br />
        touch.
      </div>
      <div className="absolute text-background mix-blend-difference bottom-16 right-5 font-bold uppercase text-3xl md:right-15 lg:right-26 md:text-5xl lg:text-6xl">
        Drop us <br />a line.
      </div>
    </div>
  );
}
