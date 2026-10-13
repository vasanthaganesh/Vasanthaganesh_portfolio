import type { Metadata, Viewport } from "next";
import { Unbounded, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site, contact } from "@/content/portfolio";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-unbounded", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-inter-tight", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

const description =
  "Vasanthaganesh R — Backend Java Engineer · Enterprise Microservices & Scalable Systems from Puducherry, India. Core Java, Spring Boot, Hibernate, PostgreSQL, Microservices.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Vasanthaganesh R — Backend Java Engineer · Enterprise Microservices & Scalable Systems",
  description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Vasanthaganesh R — Backend Java Engineer · Enterprise Microservices & Scalable Systems",
    description,
    url: site.url,
    siteName: "Vasanthaganesh R",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasanthaganesh R — Backend Java Engineer · Enterprise Microservices & Scalable Systems",
    description,
  },
};

export const viewport: Viewport = { themeColor: "#030407" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vasanthaganesh R",
  url: site.url,
  email: `mailto:${contact.email}`, // vasanthaganesh11@gmail.com
  telephone: contact.phone,
  jobTitle: "Backend Java Engineer · Enterprise Microservices & Scalable Systems",
  homeLocation: { "@type": "Place", name: "Puducherry, India" },
  sameAs: contact.channels.map((c) => c.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
