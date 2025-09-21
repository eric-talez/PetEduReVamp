import { useEffect, useState } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // YouTube 스타일 브레이크포인트: 1024px (lg 브레이크포인트와 일치)
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check on initial load
    checkMobile();
    
    // Listen for window resize events
    window.addEventListener("resize", checkMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function useClickAway<T extends HTMLElement = HTMLElement>(
  callback: () => void
) {
  const [ref, setRef] = useState<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && !ref.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);

  return (element: T | null) => {
    setRef(element);
    return element;
  };
}
