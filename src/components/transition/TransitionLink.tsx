"use client";

import { ReactNode, MouseEvent, forwardRef } from "react";
import Link from "next/link";
import { usePageTransition } from "./useTransition";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  isMenuLink?: boolean;
  style?: React.CSSProperties;
  "data-cursor-hover"?: boolean;
  "data-cursor-text"?: string;
  "data-cursor-type"?: string;
}

/**
 * TransitionLink - A wrapper around Next.js Link component that applies page transitions
 * Use this for links that should trigger a page transition animation
 * Set isMenuLink=true for menu links to skip the transition
 */
const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  (
    {
      href,
      children,
      className = "",
      isMenuLink = false,
      style,
      "data-cursor-hover": dataCursorHover,
      "data-cursor-text": dataCursorText,
      "data-cursor-type": dataCursorType,
    },
    ref
  ) => {
    const { navigateTo } = usePageTransition();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigateTo(href, isMenuLink);
    };

    return (
      <Link
        href={href}
        className={className}
        onClick={handleClick}
        ref={ref}
        style={style}
        data-cursor-hover={dataCursorHover}
        data-cursor-text={dataCursorText}
        data-cursor-type={dataCursorType}
      >
        {children}
      </Link>
    );
  }
);

TransitionLink.displayName = "TransitionLink";

export default TransitionLink;
