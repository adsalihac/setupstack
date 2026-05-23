import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return initialValue;
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error("Failed to read local storage value", error);
      try {
        window.localStorage.removeItem(key);
      } catch (removeError) {
        console.error("Failed to clear local storage value", removeError);
      }
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to write local storage value", error);
    }
  }, [key, value]);

  return { value, setValue };
}
