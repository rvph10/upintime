"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { gsap } from "gsap";

/**
 * Type definition for cursor context
 */
interface CursorContextType {
  setCursorType: (type: CursorType) => void;
  setCursorText: (text: string) => void;
}

/**
 * Available cursor types
 */
type CursorType =
  | "default"
  | "text"
  | "link"
  | "button"
  | "draggable"
  | "custom";

// Create context with default values
const CursorContext = createContext<CursorContextType>({
  setCursorType: () => {},
  setCursorText: () => {},
});

/**
 * Custom hook to use cursor context
 */
export const useCursor = () => useContext(CursorContext);

/**
 * CursorProvider component to wrap application
 */
export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [cursorText, setCursorText] = useState<string>("");

  return (
    <CursorContext.Provider value={{ setCursorType, setCursorText }}>
      {children}
      <CustomCursor cursorType={cursorType} initialCursorText={cursorText} />
    </CursorContext.Provider>
  );
};

/**
 * Type definition for element hover handlers
 */
interface CursorHoverHandlers {
  enter: (e: Event) => void;
  leave: () => void;
}

/**
 * CustomCursor props
 */
interface CustomCursorProps {
  cursorType?: CursorType;
  initialCursorText?: string;
}

/**
 * CustomCursor component that replaces the default cursor with a custom circle
 * using mix-blend-mode: difference for better visibility across different backgrounds
 * and GSAP for hover animations with magnetic effect and trailing motion.
 * Automatically disabled on touch devices.
 */
const CustomCursor = ({
  cursorType = "default",
  initialCursorText = "",
}: CustomCursorProps) => {
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState<string>(initialCursorText);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const currentHoverElement = useRef<Element | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Update cursor text when prop changes
  useEffect(() => {
    setCursorText(initialCursorText);
  }, [initialCursorText]);

  // Check if device is touch-capable on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      // Check for touch capability
      const isTouchCapable =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // Use a proper type for navigator.msMaxTouchPoints and handle possible undefined
        ((navigator as Navigator & { msMaxTouchPoints?: number })
          .msMaxTouchPoints ?? 0) > 0;

      // Sometimes devices have touch capability but are being used with a mouse
      // We can detect this by checking for mouse events
      const isUsingMouse = window.matchMedia("(pointer: fine)").matches;

      // Set to touch device if it has touch capability and isn't being used with a mouse
      setIsTouchDevice(isTouchCapable && !isUsingMouse);

      // If this is a touch device, remove the no-cursor styles
      if (isTouchCapable && !isUsingMouse) {
        // Remove the style that hides the default cursor
        document.querySelectorAll("*").forEach((el) => {
          (el as HTMLElement).style.removeProperty("cursor");
        });

        // Add a style tag to override the !important from the original CSS
        const styleEl = document.createElement("style");
        styleEl.id = "enable-default-cursor";
        styleEl.textContent = "* { cursor: auto !important; }";
        document.head.appendChild(styleEl);
      }
    };

    checkTouchDevice();

    // Also check when window is resized, as user might switch between device modes
    window.addEventListener("resize", checkTouchDevice);

    return () => {
      window.removeEventListener("resize", checkTouchDevice);
      // Clean up the style element if it exists
      document.getElementById("enable-default-cursor")?.remove();
    };
  }, []);

  /**
   * Adds event listeners to interactive elements
   */
  const addInteractiveListeners = useCallback(() => {
    // Skip if this is a touch device
    if (isTouchDevice) return;

    // Target the actual anchor elements rendered by Next.js Link components
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"], [data-cursor-hover]',
    );

    const handleMouseHoverStart = (e: Event) => {
      setIsHovering(true);
      currentHoverElement.current = e.currentTarget as Element;

      // Get cursor text from data attribute if present
      const target = e.currentTarget as Element;
      const text = target.getAttribute("data-cursor-text") || "";
      setCursorText(text);

      // Get cursor type from data attribute if present
      const type = target.getAttribute("data-cursor-type") as CursorType | null;
      if (type) {
        // Apply specific cursor styles based on type
        if (cursorRef.current) {
          switch (type) {
            case "button":
              cursorRef.current.classList.add("cursor-button");
              break;
            case "link":
              cursorRef.current.classList.add("cursor-link");
              break;
            case "text":
              cursorRef.current.classList.add("cursor-text");
              break;
            case "draggable":
              cursorRef.current.classList.add("cursor-draggable");
              break;
            default:
              break;
          }
        }
      }
    };

    const handleMouseHoverEnd = () => {
      setIsHovering(false);
      currentHoverElement.current = null;
      setCursorText("");

      // Remove all cursor type classes
      if (cursorRef.current) {
        cursorRef.current.classList.remove(
          "cursor-button",
          "cursor-link",
          "cursor-text",
          "cursor-draggable",
        );
      }
    };

    interactiveElements.forEach((element) => {
      // Remove existing listeners to prevent duplicates
      element.removeEventListener("mouseenter", handleMouseHoverStart);
      element.removeEventListener("mouseleave", handleMouseHoverEnd);

      // Add listeners
      element.addEventListener("mouseenter", handleMouseHoverStart);
      element.addEventListener("mouseleave", handleMouseHoverEnd);

      // Store the handlers on the element for cleanup
      (
        element as HTMLElement & { _cursorHoverHandlers?: CursorHoverHandlers }
      )._cursorHoverHandlers = {
        enter: handleMouseHoverStart,
        leave: handleMouseHoverEnd,
      };
    });
  }, [isTouchDevice]); // Add isTouchDevice as a dependency

  useEffect(() => {
    // Skip all cursor-related logic if this is a touch device
    if (isTouchDevice) return;

    let cursorTimeout: NodeJS.Timeout;

    // Directly position cursor at exact mouse coordinates
    const updatePosition = (e: MouseEvent) => {
      if (!visible) setVisible(true);

      // Reset timeout to hide cursor when inactive
      clearTimeout(cursorTimeout);
      cursorTimeout = setTimeout(() => {
        if (visible) setVisible(false);
      }, 5000);

      if (!cursorRef.current || !trailRef.current) return;

      // Apply magnetic effect if currently hovering over an element
      if (isHovering && currentHoverElement.current) {
        const hoverRect = currentHoverElement.current.getBoundingClientRect();
        const hoverCenterX = hoverRect.left + hoverRect.width / 2;
        const hoverCenterY = hoverRect.top + hoverRect.height / 2;

        // Calculate distance between cursor and element center
        const distanceX = e.clientX - hoverCenterX;
        const distanceY = e.clientY - hoverCenterY;

        // Calculate the element's size factor (larger elements need less magnetic pull)
        const elementSize = Math.max(hoverRect.width, hoverRect.height);
        const sizeFactor = Math.min(1, 100 / elementSize); // Reduce effect as element size increases

        // Limit the maximum distance for magnetic effect
        const maxDistance = 100;
        const normalizedDistanceX =
          Math.abs(distanceX) > maxDistance
            ? (distanceX / Math.abs(distanceX)) * maxDistance
            : distanceX;
        const normalizedDistanceY =
          Math.abs(distanceY) > maxDistance
            ? (distanceY / Math.abs(distanceY)) * maxDistance
            : distanceY;

        // Apply magnetic pull with size adjustment (stronger when closer to center, weaker for larger elements)
        const baseStrength = 0.15; // Base magnetic strength
        const magnetStrength = baseStrength * sizeFactor;
        const pullX = normalizedDistanceX * magnetStrength;
        const pullY = normalizedDistanceY * magnetStrength;

        // Position cursor elements directly using left/top for accuracy
        cursorRef.current.style.left = `${e.clientX - pullX}px`;
        cursorRef.current.style.top = `${e.clientY - pullY}px`;

        // Update trail with a delay for trailing effect
        gsap.to(trailRef.current, {
          left: `${e.clientX - pullX}px`,
          top: `${e.clientY - pullY}px`,
          duration: 0.5,
          ease: "power2.out",
        });

        // Position the text label
        if (textRef.current) {
          const isLongText = cursorText.split(" ").length > 15;
          const verticalOffset = 30; // Keep consistent vertical offset
          const horizontalOffset = isLongText ? 20 : 0; // Only keep horizontal offset for long text
          textRef.current.style.left = `${e.clientX + horizontalOffset}px`;
          textRef.current.style.top = `${e.clientY + verticalOffset}px`;
        }
      } else {
        // Direct positioning for main cursor
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;

        // Animate trail for smooth effect
        gsap.to(trailRef.current, {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          duration: 0.3,
          ease: "power2.out",
        });

        // Position the text label
        if (textRef.current) {
          const isLongText = cursorText.split(" ").length > 15;
          const verticalOffset = 30; // Keep consistent vertical offset
          const horizontalOffset = isLongText ? 20 : 0; // Only keep horizontal offset for long text
          textRef.current.style.left = `${e.clientX + horizontalOffset}px`;
          textRef.current.style.top = `${e.clientY + verticalOffset}px`;
        }
      }
    };

    // Mouse press effect
    const handleMouseDown = () => {
      setIsClicking(true);
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 0.85,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    // Hide cursor when mouse leaves the window
    const handleMouseLeave = () => setVisible(false);

    // Show cursor when mouse enters the window
    const handleMouseEnter = () => setVisible(true);

    // Add event listeners for mouse movement
    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Run addInteractiveListeners right after component mount and after a short delay
    // to ensure all Next.js Link components are properly rendered
    addInteractiveListeners();

    // Run again after a short delay to catch any dynamically rendered elements
    setTimeout(() => {
      addInteractiveListeners();
    }, 500);

    // Setup MutationObserver to detect DOM changes
    observerRef.current = new MutationObserver((mutations) => {
      // Check for removed nodes that were being hovered
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (
            node instanceof Element &&
            node.contains(currentHoverElement.current)
          ) {
            // Reset hover state if the removed element was being hovered
            setIsHovering(false);
            currentHoverElement.current = null;
            setCursorText("");
          }
        });
      });

      // Add listeners to new elements
      addInteractiveListeners();
    });

    // Start observing the document with the configured parameters
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "href",
        "role",
        "data-cursor-hover",
        "data-cursor-text",
        "data-cursor-type",
      ],
    });

    // Remove event listeners on cleanup
    return () => {
      clearTimeout(cursorTimeout);
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      // Clean up all event listeners from interactive elements
      document
        .querySelectorAll(
          'a, button, input, select, textarea, [role="button"], [data-cursor-hover]',
        )
        .forEach((element) => {
          const typedElement = element as HTMLElement & {
            _cursorHoverHandlers?: CursorHoverHandlers;
          };
          const handlers = typedElement._cursorHoverHandlers;
          if (handlers) {
            element.removeEventListener("mouseenter", handlers.enter);
            element.removeEventListener("mouseleave", handlers.leave);
            delete typedElement._cursorHoverHandlers;
          }
        });

      // Disconnect the observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visible, isHovering, cursorText, isTouchDevice, addInteractiveListeners]); // Added addInteractiveListeners

  // GSAP animation for cursor size changes on hover
  useEffect(() => {
    if (isTouchDevice || !cursorRef.current || !trailRef.current) return;

    // Get cursor style based on cursorType
    const getCursorStyle = () => {
      switch (cursorType) {
        case "button":
          return {
            width: "70px",
            height: "70px",
            marginLeft: "-35px",
            marginTop: "-35px",
            backgroundColor: "#fff",
            borderColor: "transparent",
          };
        case "link":
          return {
            width: "60px",
            height: "60px",
            marginLeft: "-30px",
            marginTop: "-30px",
            backgroundColor: isClicking ? "#0070f3" : "#fff",
            borderColor: "transparent",
          };
        case "text":
          return {
            width: "6px",
            height: "30px",
            marginLeft: "-3px",
            marginTop: "-15px",
            backgroundColor: "#fff",
            borderRadius: "2px",
            borderColor: "transparent",
          };
        case "draggable":
          return {
            width: "50px",
            height: "50px",
            marginLeft: "-25px",
            marginTop: "-25px",
            backgroundColor: "transparent",
            borderColor: "#fff",
            borderWidth: "2px",
            borderStyle: "solid",
          };
        default:
          return {
            width: isHovering ? "60px" : "20px",
            height: isHovering ? "60px" : "20px",
            marginLeft: isHovering ? "-30px" : "-10px",
            marginTop: isHovering ? "-30px" : "-10px",
            backgroundColor: "#fff",
            borderColor: "transparent",
          };
      }
    };

    const cursorStyle = getCursorStyle();

    // Animate main cursor size changes
    gsap.to(cursorRef.current, {
      width: cursorStyle.width,
      height: cursorStyle.height,
      marginLeft: cursorStyle.marginLeft,
      marginTop: cursorStyle.marginTop,
      backgroundColor: cursorStyle.backgroundColor,
      borderColor: cursorStyle.borderColor,
      borderWidth: cursorStyle.borderWidth,
      borderStyle: cursorStyle.borderStyle,
      borderRadius: cursorStyle.borderRadius || "50%",
      opacity: visible ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate trail cursor - hide it completely when hovering
    gsap.to(trailRef.current, {
      width: isHovering ? "30px" : "8px",
      height: isHovering ? "30px" : "8px",
      marginLeft: isHovering ? "-15px" : "-4px",
      marginTop: isHovering ? "-15px" : "-4px",
      opacity: isHovering ? 0 : visible ? 0.5 : 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate text visibility
    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: isHovering && cursorText ? 1 : 0,
        y: isHovering && cursorText ? 0 : 10,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHovering, visible, cursorText, isTouchDevice, cursorType, isClicking]);

  // Don't render anything if this is a touch device
  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor element */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-solid border-transparent"
        style={{
          backgroundColor: "#fff",
          mixBlendMode: "difference",
          position: "fixed",
          top: 0,
          left: 0,
          transition: "border-color 0.3s",
        }}
      />

      {/* Trail cursor element */}
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          backgroundColor: "#fff",
          mixBlendMode: "difference",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      />

      {/* Text label */}
      {cursorText && (
        <div
          ref={textRef}
          className="fixed pointer-events-none z-[9999] text-xs text-center font-semibold uppercase tracking-wider"
          style={{
            color: "#fff",
            mixBlendMode: "difference",
            position: "fixed",
            top: 0,
            left: 0,
            transform: "translate(-50%, 0)",
            whiteSpace: cursorText.split(" ").length > 15 ? "normal" : "nowrap",
            maxWidth: cursorText.split(" ").length > 15 ? "400px" : "none",
            lineHeight: "1.2",
            padding: "2px",
            marginTop: "8px",
            backgroundColor:
              cursorText.split(" ").length > 15
                ? "rgba(0, 0, 0, 0.8)"
                : "transparent",
            borderRadius: cursorText.split(" ").length > 15 ? "4px" : "0",
            opacity: 0,
          }}
        >
          {cursorText}
        </div>
      )}
    </>
  );
};

export default CustomCursor;
