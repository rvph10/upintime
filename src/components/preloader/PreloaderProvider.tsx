"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePreloader } from "./usePreloader";
import Preloader from "@/components/preloader/Preloader";

// Create context
type PreloaderContextType = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const PreloaderContext = createContext<PreloaderContextType | undefined>(
  undefined,
);

// Provider component
export function PreloaderProvider({ children }: { children: ReactNode }) {
  const { isLoading, setIsLoading } = usePreloader();

  return (
    <PreloaderContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Preloader />}
      {children}
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
