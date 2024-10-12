"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

const Providers = ({ children }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent rendering on the server

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
};

export default Providers;
