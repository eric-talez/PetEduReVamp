import { useEffect } from "react";

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export default function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Build the key combination string
      const keys = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.shiftKey) keys.push('shift');
      if (event.altKey) keys.push('alt');
      if (event.metaKey) keys.push('meta');
      
      // Add the main key
      keys.push(event.key.toLowerCase());
      
      const combination = keys.join('+');
      
      // Check if this combination exists in our shortcuts
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
