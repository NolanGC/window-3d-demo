// import "@/styles/globals.css"
// import { Metadata } from "next"
// import { siteConfig } from "@/config/site"
// import { fontSans } from "@/lib/fonts"
// import { cn } from "@/lib/utils"
// import { SiteHeader } from "@/components/site-header"
// import { TailwindIndicator } from "@/components/tailwind-indicator"
// import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"
// import Head  from "next/head"

// // export const metadata: Metadata = {
// //   openGraph: {
// //     title: "test",
// //     description: "test",
// //   },
// //   title: {
// //     default: "test",
// //     template: `%s - ${"test"}`,
// //   },
// //   description: "test",
// //   themeColor: [
// //     { media: "(prefers-color-scheme: light)", color: "white" },
// //     { media: "(prefers-color-scheme: dark)", color: "black" },
// //   ],
// //   icons: {
// //     icon: "/favicon.ico",
// //     shortcut: "/favicon-16x16.png",
// //     apple: "/apple-touch-icon.png",
// //   },
// // }


// export default function Layout({ children }) {
//   return (
//       <html lang="en" suppressHydrationWarning>
//         <body
//           className={cn(
//             "min-h-screen bg-background font-sans antialiased",
//             fontSans.variable
//           )}
//         >
//           <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//             <div className="relative flex min-h-screen flex-col">
//               <SiteHeader />
//               <div className="flex-1">{children}</div>
//             </div>
//             <TailwindIndicator />
//           </ThemeProvider>
//           <Toaster />
//         </body>
        
//       </html>
//   )
// }

export const metadata = {
  title: "NextGram",
  description:
    "A sample Next.js app showing dynamic routing with modals as a route.",
  openGraph: {
    title: "NextGram",
    description:
      "A sample Next.js app showing dynamic routing with modals as a route.",
     "images": "https://window-3d-demo.vercel.app/api/og",
  },
  metadataBase: new URL("https://window-3d-demo.vercel.app/"),
};

export default function Layout(props) {
  return (
    <html>
      <body>
        {props.children}
      </body>
    </html>
  );
}