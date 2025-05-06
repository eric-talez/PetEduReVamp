import { Button } from "./Button";
import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <motion.span
          initial={{ scale: theme === "dark" ? 0 : 1 }}
          animate={{ scale: theme === "dark" ? 0 : 1 }}
          transition={{ duration: 0.3, ease: [0.5, 1.5, 0.75, 1.25] }}
          className="absolute inset-0 flex items-center justify-center theme-toggle-sun text-accent"
        >
          <Sun className="w-4 h-4" />
        </motion.span>
        <motion.span
          initial={{ scale: theme === "light" ? 0 : 1 }}
          animate={{ scale: theme === "light" ? 0 : 1 }}
          transition={{ duration: 0.3, ease: [0.5, 1.5, 0.75, 1.25] }}
          className="absolute inset-0 flex items-center justify-center theme-toggle-moon text-primary"
        >
          <Moon className="w-4 h-4" />
        </motion.span>
      </div>
    </Button>
  );
}
