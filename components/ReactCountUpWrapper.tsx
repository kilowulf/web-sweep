"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

/**
 * ReactCountUpWrapper Component.
 *
 * A simple wrapper around the react-countup library to display animated counting.
 * It waits for the component to mount before rendering the CountUp component, which avoids hydration issues.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.value - The numerical value to animate to.
 * @returns {JSX.Element|string} The CountUp component displaying the value, or a dash "-" if not mounted.
 */
export default function ReactCountUpWrapper({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after the component mounts to avoid hydration mismatches.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "-";
  }

  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
}
