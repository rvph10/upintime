"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { usePreloader } from "./usePreloader";
import Preloader from "@/components/preloader/Preloader";

// Create context
type PreloaderContextType = {
  isLoading: boolean;
  isTransitioning: boolean;
  setIsLoading: (value: boolean) => void;
};

const PreloaderContext = createContext<PreloaderContextType | undefined>(
  undefined,
);

// Provider component
export function PreloaderProvider({ children }: { children: ReactNode }) {
  const { isLoading, setIsLoading } = usePreloader();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle transition between preloader and content
  useEffect(() => {
    // When preloader finishes, start a brief transition period
    if (!isLoading && !isTransitioning) {
      // No need to add transition if there was no preloader
      if (typeof window !== 'undefined' && localStorage.getItem("hasSeenPreloader")) {
        return;
      }
      
      setIsTransitioning(true);
      
      // Reset transition state after the delay
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 100); // Small delay to avoid flickering
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isTransitioning]);

  return (
    <PreloaderContext.Provider value={{ isLoading, isTransitioning, setIsLoading }}>
      {/* Show preloader only when loading */}
      {isLoading && <Preloader />}
      
      {/* This wrapper prevents children from rendering during transition */}
      <div className={`transition-opacity duration-200 ${isLoading || isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </PreloaderContext.Provider>
  );
}

// Hook to use the preloader context
export function usePreloaderContext() {
  const context = useContext(PreloaderContext);

  if (context === undefined) {
    throw new Error(
      "usePreloaderContext must be used within a PreloaderProvider",
    );
  }

  return context;
}