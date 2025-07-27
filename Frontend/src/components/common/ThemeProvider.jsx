import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }) {
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