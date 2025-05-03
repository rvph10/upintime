/**
 * About section component with agency credentials and services
 * Featuring GSAP animations and enhanced visual design
 */
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SplitType from "split-type";

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement[]>([]);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const textElements = useRef<SplitType[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Background text animation
      gsap.fromTo(
        ".bg-text",
        { opacity: 0 },
        { opacity: 0.03, duration: 1.8, ease: "power3.out" },
      );

      // Heading text animation using SplitType
      if (headingRef.current) {
        const headingSplit = new SplitType(headingRef.current, {
          types: "words",
          tagName: "span",
        });

        textElements.current.push(headingSplit);

        gsap.from(headingSplit.words, {
          opacity: 0,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
        });
      }

      // Word reveal animation using SplitType
      const elementsToAnimate = gsap.utils.toArray<HTMLElement>(
        '[data-animate="word-reveal"]',
      );

      elementsToAnimate.forEach((element) => {
        const splitInstance = new SplitType(element, {
          types: "lines,words,chars",
          tagName: "span",
        });

        textElements.current.push(splitInstance);

        // Initially set reduced opacity
        gsap.set(splitInstance.words, { opacity: 0.1, y: 20 });

        // Animate to full opacity with scroll trigger
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

      // Button animation
      if (buttonRef.current) {
        gsap.from(buttonRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.2,
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 90%",
          },
        });
      }

      // Services animation
      servicesRef.current.forEach((service, index) => {
        gsap.from(service, {
          opacity: 0,
          x: 50,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.1 * index,
          scrollTrigger: {
            trigger: service,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, sectionRef);

    return () => {
      // Clean up text split instances
      // eslint-disable-next-line react-hooks/exhaustive-deps
      textElements.current.forEach((instance) => instance.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen relative overflow-hidden bg-background-secondary text-foreground-secondary"
    >
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="bg-text text-[20vw] font-black whitespace-nowrap text-foreground-secondary/10">
          UPINTOWN
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-full px-5 md:px-8 lg:px-12 py-20">
        {/* Hero text block */}
        <div
          ref={headingRef}
          className="text-foreground-secondary top-20 left-6 md:top-24 md:left-8 lg:left-12 lg:top-24 
                  font-black uppercase text-4xl md:text-5xl lg:text-7xl z-10 mb-16 md:mb-24"
        >
          <span className="block">CRAFTING DIGITAL</span>
          <span className="block">EXPERIENCES</span>
        </div>

        {/* Content grid */}
        <div className="w-full pt-12 md:pt-16 lg:pt-20 grid md:grid-cols-2 grid-cols-1 gap-8 lg:gap-16">
          {/* Left column - Experience and Pricing */}
          <div ref={leftColumnRef} className="space-y-8">
            <div data-animate="word-reveal" className="mb-12">
              <p className="text-xl md:text-2xl text-foreground-secondary leading-relaxed mb-8">
                We strip away the unnecessary to focus on what matters creating
                digital products that solve real problems for real people. No
                jargon, no cookie-cutter solutions. Just thoughtful design and
                clean code that works.
              </p>

              <p className="text-lg md:text-xl text-foreground-secondary/70 leading-relaxed mb-6">
                Each project receives our complete attention and expertise
                across frontend, backend, design, and deployment. From concept
                to launch and beyond, we&apos;re invested in your success.
              </p>

              <p className="text-lg md:text-xl text-foreground-secondary/70 leading-relaxed mb-6">
                Ready to transform your digital presence? Let&apos;s build
                something extraordinary together.
              </p>

              <Link
                href="/contact"
                ref={buttonRef}
                className="inline-flex items-center px-6 py-3 border bg-background text-foreground hover:bg-background/70 rounded-full transition-colors duration-300 hover:scale-105 font-medium group"
              >
                <span className="mr-2">Get in touch</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right column - Services */}
          <div ref={rightColumnRef} className="space-y-8">
            <div className="space-y-6 pt-0 md:pt-4">
              {[
                "Digital products that deliver real value",
                "Seamless integrations for modern businesses",
                "Precision-built web solutions that scale with you",
                "Transforming existing digital systems into assets",
                "From concept to deployment, complete digital solutions",
              ].map((service, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) servicesRef.current[index] = el;
                  }}
                  className="flex items-center border-b border-foreground-secondary/30 text-foreground-secondary pb-6 hover:border-foreground-secondary transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center mr-4 w-10 h-10 rounded-full text-foreground-secondary bg-background-secondary/20 border border-foreground-secondary/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                  <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform duration-300">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
