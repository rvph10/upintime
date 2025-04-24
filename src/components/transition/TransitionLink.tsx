"use client";

import { ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { usePageTransition } from "./useTransition";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  isMenuLink?: boolean;
  dataCursorHover?: boolean;
  dataCursorText?: string;
  dataCursorType?: string;
}

/**
 * TransitionLink - A wrapper around Next.js Link component that applies page transitions
 * Use this for links that should trigger a page transition animation
 * Set isMenuLink=true for menu links to skip the transition
 */
export default function TransitionLink({
  href,
  children,
  className = "",
  isMenuLink = false,
  dataCursorHover = false,
  dataCursorText,
  dataCursorType,
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateTo(href, isMenuLink);
  };

  // Prepare data attributes for cursor
  const dataAttributes: Record<string, string | boolean> = {};
  if (dataCursorHover) dataAttributes["data-cursor-hover"] = true;
  if (dataCursorText) dataAttributes["data-cursor-text"] = dataCursorText;
  if (dataCursorType) dataAttributes["data-cursor-type"] = dataCursorType;

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...dataAttributes}
    >
      {children}
    </Link>
  );
}
