"use client";

import { useEffect } from "react";

function isTypingContext(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.getAttribute("contenteditable") === "true"
  );
}

export function useKeyboardShortcuts(handlers, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return () => {};
    }

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();
      const typing = isTypingContext(event.target);

      if (typing && key !== "escape") {
        return;
      }

      if (key === "n" && typeof handlers?.onNew === "function") {
        event.preventDefault();
        handlers.onNew();
      }

      if (key === "/" && typeof handlers?.onSearchFocus === "function") {
        event.preventDefault();
        handlers.onSearchFocus();
      }

      if (key === "escape" && typeof handlers?.onEscape === "function") {
        handlers.onEscape();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, handlers]);
}
