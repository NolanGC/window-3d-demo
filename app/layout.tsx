import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Head from 'next/head';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}
const meta = {
  cardImage: "https://storage.googleapis.com/window-objects/Screen%20Shot%202023-06-09%20at%208.48.58%20AM.png"
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <Head>
          <title>test</title>
          <meta content='test' name="description" />
          <meta property="og:url" content="https://window-3d-demo.vercel.app" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content='test' />
          <meta property="og:description" content='test' />
          <meta property="og:title" content='test' />
          <meta property="og:image" content={meta.cardImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content='test' />
          <meta name="twitter:description" content='test' />
          <meta name="twitter:image" content={meta.cardImage} />
        </Head>
        <SiteHeader />
        <div className="relative flex flex-1">
          {children}
        </div>
        <TailwindIndicator />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
