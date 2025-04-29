/**
 * Page transition utility functions to coordinate menu transitions
 * and page navigation in a synchronized manner.
 */

/**
 * Start loading a page in the background while an animation plays
 * @param destination - The URL to navigate to
 * @param onFinish - Optional callback when background loading completes
 */
export const startBackgroundPageLoad = (
  destination: string,
  onFinish?: () => void,
) => {
  // Dispatch custom event to trigger any prepare actions needed
  try {
    const event = new CustomEvent("pageTransitionStart", {
      detail: { destination },
      bubbles: true,
      cancelable: false,
    });
    window.dispatchEvent(event);
    console.log(`Started background loading for ${destination}`);

    // Notify callback if provided
    if (onFinish) {
      // We don't have a reliable way to know when the page is fully loaded in background
      // So just provide a callback mechanism for further actions
      setTimeout(onFinish, 100);
    }
  } catch (error) {
    console.error("Error in background page loading:", error);
  }
};

/**
 * Listen for page transition events
 * @param callback - Function to call when transition events occur
 * @returns Cleanup function
 */
export const listenForPageTransitions = (
  callback: (destination: string) => void,
) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.destination) {
      callback(customEvent.detail.destination);
    }
  };

  window.addEventListener("pageTransition", handler);
  window.addEventListener("pageTransitionStart", handler);

  // Return cleanup function
  return () => {
    window.removeEventListener("pageTransition", handler);
    window.removeEventListener("pageTransitionStart", handler);
  };
};
