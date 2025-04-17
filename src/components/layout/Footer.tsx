"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

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
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const navColumnsRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Setup letter animation
  useEffect(() => {
    if (logoContainerRef.current) {
      // Clear any existing content
      logoContainerRef.current.innerHTML = '';
      
      // Split the text into individual span elements for each letter
      const text = "upintown";
      const letters = text.split('');
      
      letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.className = "inline-block relative";
        // Initial state: positioned above, invisible
        span.style.opacity = '0';
        span.style.transform = 'translateY(-100px)';
        letterRefs.current[index] = span;
        logoContainerRef.current?.appendChild(span);
      });
    }
  }, []);

  // Animation setup with Intersection Observer
  useEffect(() => {
    // Initial state - slightly faded and offset for subtle entrance
    gsap.set(headingRef.current, { opacity: 0, y: 20 });
    gsap.set(formRef.current, { opacity: 0, y: 15 });
    gsap.set(navColumnsRef.current, { opacity: 0, y: 10 });
    
    // Create a timeline for staggered animations (paused initially)
    const tl = gsap.timeline({ 
      defaults: { duration: 0.8, ease: "power2.out" },
      paused: true
    });
    
    // Prepare animation sequence
    tl.to(headingRef.current, { opacity: 1, y: 0 })
      .to(formRef.current, { opacity: 1, y: 0 }, "-=0.5")
      .to(navColumnsRef.current, { opacity: 1, y: 0 }, "-=0.6");
      
    // Set up the Intersection Observer
    const footerElement = document.querySelector('footer');
    
    if (footerElement) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // When footer comes into view
          if (entry.isIntersecting) {
            // Play entrance animations
            tl.play();
            
            // Animate letters falling smoothly into place
            if (letterRefs.current.length > 0) {
              // Create a timeline for the falling animation
              const lettersTl = gsap.timeline({
                delay: 0.8 // Start after main content animations
              });
              
              // Add each letter to the timeline with staggered delays
              letterRefs.current.forEach((letter, index) => {
                if (letter) {
                  // Smooth falling motion
                  lettersTl.to(letter, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    delay: index * 0.05
                  }, index * 0.08);
                }
              });
              
              // After all letters have fallen, add a very subtle constant animation
              lettersTl.add(() => {
                letterRefs.current.forEach((letter, index) => {
                  if (letter) {
                    // Extremely subtle perpetual floating
                    gsap.to(letter, {
                      y: '-=2',
                      duration: 3 + (index % 2),
                      ease: "sine.inOut",
                      repeat: -1,
                      yoyo: true,
                      delay: index * 0.1
                    });
                  }
                });
              });
            }
            
            // Unobserve after triggering
            observer.unobserve(entry.target);
          }
        });
      }, {
        // Trigger when at least 20% of the footer is visible
        threshold: 0.2
      });
      
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
        { opacity: 1, y: 0, duration: 0.4 }
      );
    }
  }, [message]);

  // Email validation function
  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
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
            x: [-5, 5, -3, 3, 0]
          },
          duration: 0.5,
          ease: "power1.inOut"
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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Success!
      setIsSuccess(true);
      setMessage(data.message || 'Subscribed successfully!');
      
      // Animate input field on success
      const inputElement = formRef.current?.querySelector('input');
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
                delay: 0.5
              });
            }
          }
        });
      }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe');
      
      // Subtle shake animation for error
      if (formRef.current) {
        // Use keyframes for the shake animation instead of array
        gsap.to(formRef.current, {
          keyframes: {
            x: [-5, 5, -3, 3, 0]
          },
          duration: 0.5,
          ease: "power1.inOut"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative -mx-12 bottom-0 px-16 py-12 left-0 right-0 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        {/* Upper section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Left column */}
          <div className="flex flex-col gap-6 max-w-xl">
            <h2 ref={headingRef} className="text-5xl font-light mb-12">Make it happen.</h2>
            
            <div className="mt-4">
              <p className="text-base opacity-80 mb-2">Sign up for our newsletter</p>
              <form 
                ref={formRef}
                className="flex flex-col space-y-2"
                onSubmit={handleSubmit}
              >
                <div className={`flex border-b ${validationError ? 'border-red-400' : 'border-background/30'} pb-2 transition-all focus-within:border-background/80 max-w-md`}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Your email address" 
                    className={`bg-transparent w-full outline-none text-background placeholder:text-background/50 transition-all ${
                      validationError ? 'text-red-400' : ''
                    }`}
                    required
                    disabled={isLoading}
                    data-cursor-hover
                  />
                  <button 
                    type="submit" 
                    className={`ml-4 px-4 py-1 text-foreground bg-background rounded-full transition-colors ${
                      isLoading ? 'opacity-70' : validationError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background/90'
                    }`}
                    disabled={isLoading || !!validationError}
                    data-cursor-hover
                    data-cursor-text={isLoading ? "Subscribing..." : "Subscribe"}
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
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
                    className={`text-sm mt-2 ${isError ? 'text-red-300' : isSuccess ? 'text-green-300' : ''}`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Right columns */}
          <div ref={navColumnsRef} className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20 text-sm">
            {/* Navigation links */}
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider opacity-50 mb-2">(Navigation)</p>
              <Link href="/" className="hover:opacity-70 transition-opacity" data-cursor-hover>Home</Link>
              <Link href="/projects" className="hover:opacity-70 transition-opacity" data-cursor-hover>Projects</Link>
              <Link href="/about" className="hover:opacity-70 transition-opacity" data-cursor-hover>About</Link>
              <Link href="/contact" className="hover:opacity-70 transition-opacity" data-cursor-hover>Contact</Link>
            </div>
            
            {/* Social media */}
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider opacity-50 mb-2">(Connect)</p>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center" data-cursor-hover>
                Instagram <span className="ml-1">↗</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center" data-cursor-hover>
                Github <span className="ml-1">↗</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center" data-cursor-hover>
                LinkedIn <span className="ml-1">↗</span>
              </a>
            </div>
            
            {/* Contact info */}
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider opacity-50 mb-2">(Contact)</p>
              <a href="mailto:contact@upintown.dev" className="hover:opacity-70 transition-opacity" data-cursor-hover>contact@upintown.dev</a>
            </div>
          </div>
        </div>
        
        {/* Bottom section with logo and copyright */}
        <div className="flex flex-col">
          <div className="overflow-hidden py-6 h-[300px]">
            {/* Logo container with smooth falling letter animation */}
            <h1 
              ref={logoContainerRef} 
              className="text-[280px] font-bold leading-none tracking-tighter"
            ></h1>
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-background/20 mt-4 text-sm opacity-70">
            <p>© UpInTown {new Date().getFullYear()}</p>
            <p>Brussels — Belgium</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;