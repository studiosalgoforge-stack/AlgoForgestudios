// src/app/layout.tsx
import "./globals.css";
import { isMaintenanceMode } from "@/lib/maintenance";
// We don't need 'headers' for the maintenance check anymore
import { MaintenancePage } from "@/components/maintenance-page";
import AppLayout from "@/components/AppLayout";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlgoForge Studios – AI & ML Education | Enterprise AI Solutions",
  description:
    "AlgoForge Studios provides advanced AI & ML training and enterprise AI solutions.",
  keywords: [
    "AlgoForge Studios",
    "AI training India",
    "machine learning course",
    "deep learning",
    "AI institute",
    "enterprise AI solutions",
    "data science education",
  ],
  metadataBase: new URL("https://www.algoforgestudios.in"),
  openGraph: {
    title: "AlgoForge Studios – Transforming Careers with AI & ML",
    description:
      "Join AlgoForge Studios and master real-world AI with expert-led courses.",
    url: "https://www.algoforgestudios.in",
    siteName: "AlgoForge Studios",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AlgoForge Studios",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoForge Studios – AI & ML Education",
    description: "Master AI, ML, and data science.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check the Database for maintenance mode
  const maintenanceMode = await isMaintenanceMode();

  // If Maintenance is ON, show the Maintenance Page immediately
  if (maintenanceMode) {
    return (
      <html lang="en" className="dark">
        <body className="dark bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen">
          <MaintenancePage />
        </body>
      </html>
    );
  }

  // Otherwise, render the app normally
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AlgoForge Studios",
              url: "https://www.algoforgestudios.in",
              logo: "https://www.algoforgestudios.in/logo.png",
              sameAs: [
                "https://www.instagram.com/algoforgestudios",
                "https://www.linkedin.com/company/algoforgestudios",
              ],
            }),
          }}
        />
      </head>

      <body className="dark bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen">
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CFQYK79X85"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CFQYK79X85');
          `}
        </Script>

        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );

}
