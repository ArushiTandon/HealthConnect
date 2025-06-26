// src/components/theme-provider.jsx
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, useState } from "react"

import { type ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  [key: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem {...props}>
      {mounted && children}
    </NextThemesProvider>
  )
}
