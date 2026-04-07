"use client";

import { MoonStar, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

import styles from "@/styles/components.module.css";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle color mode"
      className={styles.themeToggle}
      onClick={toggleTheme}
    >
      {isDarkMode ? <Sun size={16} /> : <MoonStar size={16} />}
      <span>{isDarkMode ? "Light" : "Dark"}</span>
    </button>
  );
}
