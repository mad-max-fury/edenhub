import { useEffect, useState } from "react";
import { SEARCH_DELAY } from "@/constants/data";

export const useDebounce = (
  input: string,
  delay: number = SEARCH_DELAY.sm,
): string => {
  const [debouncedInput, setDebouncedInput] = useState<string>("");
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedInput(input);
    }, delay);
    return () => clearTimeout(debounceTimer);
  }, [input, delay]);
  return debouncedInput;
};
