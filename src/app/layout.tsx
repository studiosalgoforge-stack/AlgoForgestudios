
// src/app/layout.tsx.
import "./globals.css";
import { isMaintenanceMode } from "@/lib/maintenance";
import { headers } from 'next/headers';
import { MaintenancePage } from "@/components/maintenance-page";
import AppLayout from '@/components/AppLayout';
import Script from 'next/script'; // Import the Script component
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "AlgoForge Studios – AI & ML Education | Enterprise AI Solutions",
  description:
    "AlgoForge Studios provides advanced AI & ML training and enterprise AI solutions. Transform your skills with industry-grade machine learning, deep learning, and data science education.",
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
      "Join AlgoForge Studios and master real-world AI with expert-led courses, hands-on projects, and enterprise-grade solutions.",
    url: "https://www.algoforgestudios.in",
    siteName: "AlgoForge Studios",
    images: [
      {
        url: "/og-image.png", // place 1200×630 image in public/
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
    description:
      "Master AI, ML, and data science with industry-level training programs from AlgoForge Studios.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

<html lang="en" className="dark" suppressHydrationWarning>
  <head>
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
            "https://www.linkedin.com/company/algoforgestudios"
          ]
        }),
      }}
    />
  </head>

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const maintenanceMode = headersList.get('x-maintenance-mode') === 'true' || await isMaintenanceMode();

  if (maintenanceMode) {
    return (
      <html lang="en" className="dark">
        <body className="dark bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden text-white min-h-screen">
          <MaintenancePage />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="dark bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden text-white min-h-screen">
        {/* Add the Google Analytics Scripts here */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W9PX5MM194"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W9PX5MM194');
          `}
        </Script>
        
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );

}


