"use client";

import { usePreloaderContext } from "./PreloaderProvider";
import TextPreloader from "./TextPreloader";

/**
 * Preloader Component
 *
 * Displays a text-based animation that reveals sentences word by word
 * when the website initially loads
 */
const Preloader = () => {
  const { isLoading } = usePreloaderContext();

  // Don't render anything if preloading is complete
  if (!isLoading) return null;

  return <TextPreloader />;
};

export default Preloader;
