"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to detect if a media query matches the current screen size
 * @param query - The media query string to check against (e.g. '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined) {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    }
  }, [matches, query]);

  return matches;
};

export default useMediaQuery;