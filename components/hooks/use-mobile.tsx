import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook that determines if the current viewport is considered mobile.
 *
 * This hook sets up a media query listener to detect when the viewport width is less than the defined MOBILE_BREAKPOINT.
 * It returns a boolean value that is true if the viewport width is less than MOBILE_BREAKPOINT, and false otherwise.
 *
 * @returns {boolean} True if the viewport width is less than MOBILE_BREAKPOINT, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    // Create a media query list that matches when the viewport width is below MOBILE_BREAKPOINT
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // Handler to update the state when the media query's evaluated result changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    // Add the event listener to the media query list
    mql.addEventListener("change", onChange);
    // Set the initial state based on the current window width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // Cleanup the event listener on component unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Ensure the hook returns a boolean value
  return !!isMobile;
}
