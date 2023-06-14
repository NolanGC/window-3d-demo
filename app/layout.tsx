import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head"

interface RootLayoutProps {
  children: React.ReactNode
}
export function Banner() {
  return (
    <div className="bg-orange-200 text-orange-900 text-center py-2">
      <p>
        🚀 We're live on
        <a href="https://www.producthunt.com" target="_blank" rel="noreferrer" className="underline mx-2">
          Product Hunt
        </a> 
      and we'd really appreciate your support! 🚀
      </p>
    </div>
  )
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
       
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <Banner></Banner>
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
