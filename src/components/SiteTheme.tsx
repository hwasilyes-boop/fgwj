"use client";

import { useEffect } from "react";

export default function SiteTheme() {
  useEffect(() => {
    fetch("/api/settings")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load settings");
        return response.json();
      })
      .then((settings) => {
        const root = document.documentElement;

        if (settings.primary_color) {
          root.style.setProperty("--site-brand", settings.primary_color);
        }

        if (settings.background_color) {
          root.style.setProperty("--site-background", settings.background_color);
        }

        if (settings.text_color) {
          root.style.setProperty("--site-text", settings.text_color);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
