"use client";

import { useEffect } from "react";

export default function HashScroll() {
  useEffect(() => {
    const handleHash = () => {
      // Get the current hash from the URL
      const hash = window.location.hash;
      if (!hash) return;

      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    handleHash();

    // Run whenever the hash changes
    window.addEventListener("hashchange", handleHash);

    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return null;
}
