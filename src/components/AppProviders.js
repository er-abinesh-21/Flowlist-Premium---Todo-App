"use client";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";

import PwaRegistrar from "./PwaRegistrar";

function ThemedToaster() {
  const { isDarkMode } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "14px",
          background: isDarkMode ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.95)",
          color: isDarkMode ? "#f8fafc" : "#0f172a",
          border: isDarkMode ? "1px solid rgba(148, 163, 184, 0.24)" : "1px solid rgba(148, 163, 184, 0.3)",
          backdropFilter: "blur(12px)",
        },
      }}
    />
  );
}

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PwaRegistrar />
        {children}
        <ThemedToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
