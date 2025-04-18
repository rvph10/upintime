"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import SimpleAnimatedLogo from "./SimpleAnimatedLogo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Refs for animation targets
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const navColumnsRef = useRef<HTMLDivElement>(null);

  // Animation setup with Intersection Observer
  useEffect(() => {
    // Initial state - slightly faded and offset for subtle entrance
    gsap.set(headingRef.current, { opacity: 0, y: 20 });
    gsap.set(formRef.current, { opacity: 0, y: 15 });
    gsap.set(navColumnsRef.current, { opacity: 0, y: 10 });

    // Create a timeline for staggered animations (paused initially)
    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power2.out" },
      paused: true,
    });

    // Prepare animation sequence
    tl.to(headingRef.current, { opacity: 1, y: 0 })
      .to(formRef.current, { opacity: 1, y: 0 }, "-=0.5")
      .to(navColumnsRef.current, { opacity: 1, y: 0 }, "-=0.6");

    // Set up the Intersection Observer
    const footerElement = document.querySelector("footer");

    if (footerElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // When footer comes into view
            if (entry.isIntersecting) {
              // Play entrance animations
              tl.play();

              // Unobserve after triggering
              observer.unobserve(entry.target);
            }
          });
        },
        {
          // Trigger when at least 20% of the footer is visible
          threshold: 0.2,
        },
      );

      // Start observing the footer
      observer.observe(footerElement);
    }

    return () => {
      // Cleanup animations
      tl.kill();
    };
  }, []);

  // Message animation when it appears
  useEffect(() => {
    if (message && messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.4 },
      );
    }
  }, [message]);

  // Email validation function
  const validateEmail = (email: string) => {
    if (!email.includes("@")) {
      return "Please include an '@' in the email address";
    }
    return "";
  };

  // Handle email input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setValidationError(validateEmail(newEmail));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submission
    const error = validateEmail(email);
    if (error) {
      setIsError(true);
      setMessage(error);

      // Subtle shake animation for error
      if (formRef.current) {
        gsap.to(formRef.current, {
          keyframes: {
            x: [-5, 5, -3, 3, 0],
          },
          duration: 0.5,
          ease: "power1.inOut",
        });
      }
      return;
    }

    // Reset states
    setMessage("");
    setIsError(false);
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Success!
      setIsSuccess(true);
      setMessage(data.message || "Subscribed successfully!");

      // Animate input field on success
      const inputElement = formRef.current?.querySelector("input");
      if (inputElement) {
        gsap.to(inputElement, {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.1)",
          duration: 0.3,
          onComplete: () => {
            setEmail(""); // Clear the input after animation
            // Reset the animation
            if (inputElement) {
              gsap.to(inputElement, {
                backgroundColor: "transparent",
                boxShadow: "none",
                duration: 0.5,
                delay: 0.5,
              });
            }
          },
        });
      }
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error ? error.message : "Failed to subscribe",
      );

      // Subtle shake animation for error
      if (formRef.current) {
        // Use keyframes for the shake animation
        gsap.to(formRef.current, {
          keyframes: {
            x: [-5, 5, -3, 3, 0],
          },
          duration: 0.5,
          ease: "power1.inOut",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative -mx-12 bottom-0 px-16 sm:px-8 xs:px-6 py-12 sm:py-8 left-0 right-0 bg-foreground text-background">
      <div className="max-w-7xl mx-auto flex flex-col justify-center">
        {/* Upper section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 sm:mb-10">
          {/* Left column */}
          <div className="flex flex-col gap-6 max-w-xl w-full">
            <h2
              ref={headingRef}
              className="text-5xl sm:text-4xl xs:text-3xl font-light mb-12 sm:mb-8"
            >
              Make it happen.
            </h2>

            <div className="mt-4 w-full">
              <p className="text-base opacity-80 mb-2">
                Sign up for our newsletter
              </p>
              <form
                ref={formRef}
                className="flex flex-col space-y-2 w-full"
                onSubmit={handleSubmit}
              >
                <div
                  className={`flex flex-col sm:flex-row border-b ${validationError ? "border-red-400" : "border-background/30"} pb-2 transition-all focus-within:border-background/80 max-w-md w-full`}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Your email address"
                    className={`bg-transparent w-full outline-none text-background placeholder:text-background/50 transition-all ${
                      validationError ? "text-red-400" : ""
                    }`}
                    required
                    disabled={isLoading}
                    data-cursor-hover
                  />
                  <button
                    type="submit"
                    className={`sm:ml-4 mt-3 sm:mt-0 px-4 py-1 text-foreground bg-background rounded-full transition-colors ${
                      isLoading
                        ? "opacity-70"
                        : validationError
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-background/90"
                    }`}
                    disabled={isLoading || !!validationError}
                    data-cursor-hover
                    data-cursor-text={
                      isLoading ? "Subscribing..." : "Subscribe"
                    }
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>

                {/* Validation error message */}
                {validationError && (
                  <p className="text-sm text-red-400 mt-2 animate-fadeIn">
                    {validationError}
                  </p>
                )}

                {/* Feedback message */}
                {message && !validationError && (
                  <p
                    ref={messageRef}
                    className={`text-sm mt-2 ${isError ? "text-red-300" : isSuccess ? "text-green-300" : ""}`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Right columns */}
          <div
            ref={navColumnsRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20 sm:gap-8 text-sm w-full sm:w-auto"
          >
            {/* Navigation links */}
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider opacity-50 mb-2">
                (Navigation)
              </p>
              <Link
                href="/"
                className="hover:opacity-70 transition-opacity"
                data-cursor-hover
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="hover:opacity-70 transition-opacity"
                data-cursor-hover
              >
                Projects
              </Link>
              <Link
                href="/about"
                className="hover:opacity-70 transition-opacity"
                data-cursor-hover
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:opacity-70 transition-opacity"
                data-cursor-hover
              >
                Contact
              </Link>
            </div>

            {/* Social media */}
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider opacity-50 mb-2">
                (Connect)
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity flex items-center"
                data-cursor-hover
              >
                Instagram <span className="ml-1">↗</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity flex items-center"
                data-cursor-hover
              >
                Github <span className="ml-1">↗</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity flex items-center"
                data-cursor-hover
              >
                LinkedIn <span className="ml-1">↗</span>
              </a>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1 mt-6 md:mt-0">
              <p className="text-xs uppercase tracking-wider opacity-50 mb-2">
                (Contact)
              </p>
              <a
                href="mailto:contact@upintown.dev"
                className="hover:opacity-70 transition-opacity"
                data-cursor-hover
              >
                contact@upintown.dev
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section with animated logo and copyright */}
        <div className="flex flex-col mt-4">
          <div className="overflow-hidden py-6 w-full flex items-center justify-center">
            {/* SimplifiedAnimatedLogo component */}
            <SimpleAnimatedLogo />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-background/20 mt-4 text-sm opacity-70 gap-2">
            <p>© UpInTown {new Date().getFullYear()}</p>
            <p>Brussels — Belgium</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
