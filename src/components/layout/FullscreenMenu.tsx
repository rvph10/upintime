"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import Marquee from "../Marquee";
import { startBackgroundPageLoad } from "@/lib/utils/pageTransition";

interface MenuItem {
  name: string;
  href: Route;
}

interface FullscreenMenuProps {
  isOpen: boolean;
  onLinkClick?: () => void;
}

const FullscreenMenu = ({ isOpen, onLinkClick }: FullscreenMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Initialize the timeline only once
  useEffect(() => {
    if (menuRef.current && contentRef.current) {
      gsap.set(menuRef.current, {
        opacity: 0,
        clipPath:
          "polygon(49.75% 49.75%, 50.25% 49.75%, 50.25% 50.25%, 49.75% 50.25%)",
        pointerEvents: "none",
      });
      gsap.set(contentRef.current, { opacity: 0 });

      // Create the animation timeline
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          // Animation completed
        },
        onReverseComplete: () => {
          // Animation reversed
          gsap.set(menuRef.current, {
            opacity: 0,
            clipPath:
              "polygon(49.75% 49.75%, 50.25% 49.75%, 50.25% 50.25%, 49.75% 50.25%)",
            pointerEvents: "none",
          });
        },
      });

      // Setup the corridor animation sequence
      tl.to(menuRef.current, {
        duration: 0.3,
        opacity: 1,
      });

      tl.to(
        menuRef.current,
        {
          duration: 1,
          clipPath: "polygon(49.75% 0%, 50.25% 0%, 50.25% 100%, 49.75% 100%)",
        },
        "-=0.3",
      );

      tl.to(menuRef.current, {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        pointerEvents: "all",
      });

      // Fade in content
      tl.to(
        contentRef.current,
        {
          opacity: 1,
          duration: 0.6,
        },
        "-=0.5",
      );

      setTimeline(tl);
    }

    return () => {
      if (timeline) {
        timeline.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { name: "HOME", href: "/" as Route },
      { name: "ABOUT", href: "/about" as Route },
      { name: "PROJECTS", href: "/projects" as Route },
      { name: "CONTACT", href: "/contact" as Route },
    ],
    [],
  );

  // prefetch the pages
  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  // Control timeline playback based on isOpen state
  useEffect(() => {
    if (!timeline) return;

    if (isOpen) {
      timeline.play();
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
    } else {
      timeline.reverse();
      // Re-enable scrolling when menu is closed
      document.body.style.overflow = "";
    }
  }, [isOpen, timeline]);

  // Cleanup function to ensure scrolling is re-enabled if component unmounts while open
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Handle link click with delayed navigation
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: Route,
  ) => {
    e.preventDefault();

    // Store navigation information in sessionStorage for the target page to detect
    sessionStorage.setItem("menuNavigation", "true");
    sessionStorage.setItem("menuDestination", href);

    // Immediately start loading the target page in the background
    router.prefetch(href);

    // Use our utility to start background loading and dispatch events
    startBackgroundPageLoad(href as string);

    // Trigger menu closing first
    if (onLinkClick) {
      onLinkClick();
    }

    // Wait for animation to complete before actual navigation
    setTimeout(() => {
      router.push(href);
    }, 800); // Match this with the total animation duration
  };

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 w-screen h-screen bg-background-secondary z-50 pointer-events-none overflow-hidden"
      style={{
        opacity: 0,
        clipPath:
          "polygon(49.75% 49.75%, 50.25% 49.75%, 50.25% 50.25%, 49.75% 50.25%)",
      }}
    >
      {/* Content container */}
      <div
        ref={contentRef}
        className="h-full w-full opacity-0 flex flex-col justify-center items-center relative"
      >
        {/* Menu blocks container */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 w-full">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="text-center relative w-full"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center justify-center relative pointer-events-auto">
                <Link
                  href={item.href}
                  className={`text-3xl sm:text-4xl md:text-6xl lg:text-9xl font-bold text-foreground-secondary hover:text-foreground-secondary/80 transition-colors duration-300 ${hoveredItem === item.name ? "opacity-0" : "opacity-100"}`}
                  data-cursor-hover
                  data-cursor-text="View"
                  data-cursor-type="link"
                  onClick={(e) => handleLinkClick(e, item.href)}
                >
                  {item.name}
                </Link>

                {hoveredItem === item.name && !("ontouchstart" in window) && (
                  <Link
                    href={item.href}
                    data-cursor-type="link"
                    data-cursor-text="View"
                    data-cursor-hover
                    className="absolute left-0 right-0 text-3xl sm:text-4xl md:text-6xl lg:text-9xl font-bold text-foreground-secondary flex items-center justify-center h-16 sm:h-20 md:h-24 lg:h-32 pointer-events-auto"
                    onClick={(e) => handleLinkClick(e, item.href)}
                  >
                    <Marquee text={item.name} speed={10} index={index} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 w-full px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pointer-events-auto">
          {/* Social Links - Left */}
          <div className="flex gap-3 sm:gap-4 md:gap-5 text-sm sm:text-base">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-secondary hover:opacity-70 transition-opacity flex items-center"
              data-cursor-hover
              data-cursor-type="link"
            >
              Instagram
            </a>
            <a
              href="https://github.com/rvph10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-secondary hover:opacity-70 transition-opacity flex items-center"
              data-cursor-hover
              data-cursor-type="link"
            >
              Github
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-secondary hover:opacity-70 transition-opacity flex items-center"
              data-cursor-hover
              data-cursor-type="link"
            >
              LinkedIn
            </a>
          </div>

          {/* Email - Right */}
          <a
            href="mailto:contact@upintown.dev"
            className="text-foreground-secondary hover:opacity-70 transition-opacity text-sm sm:text-base"
            data-cursor-hover
            data-cursor-type="link"
          >
            contact@upintown.dev
          </a>
        </div>
      </div>
    </div>
  );
};

export default FullscreenMenu;
