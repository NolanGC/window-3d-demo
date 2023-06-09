import "@/styles/globals.css"
import { Metadata } from "next"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Head from 'next/head';
import { PropsWithChildren } from 'react';

interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}



interface Props extends PropsWithChildren {
  meta?: PageMeta;
}


export default function Layout({ children, meta: pageMeta }: Props) {
  const meta = {
    title: 'OpenRouter',
    description: 'Authenticate and use your AI models in one place',
    //cardImage: 'https://storage.googleapis.com/window-objects/Screen%20Shot%202023-06-09%20at%208.48.58%20AM.png',
    cardImage: '/og.png',
    ...pageMeta
  };
  return (
    <>
    <html lang="en" suppressHydrationWarning={true}/>
    <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content="https://openrouter.ai"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <Toaster />
        </body>
        <html/>
    </>
  )
}
