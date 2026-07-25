import type { Metadata, Viewport } from "next";
import {
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { AmbientBackground } from "@/components/ambient/AmbientBackground";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Editorial serif accent — used sparingly for one hero/section emphasis (the Stripe move).
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://northstar.ai"),
  title: {
    default: "Northstar — Your AI growth hire",
    template: "%s · Northstar",
  },
  description:
    "Northstar is agentic growth marketing — an AI growth hire that designs and deploys campaigns end-to-end using the tools you already use. One brief in. A thousand experiments out. You build. We grow.",
  keywords: [
    "agentic marketing",
    "AI growth marketing",
    "AI performance marketing",
    "AI ad creative",
    "AEO",
    "marketing automation",
  ],
  openGraph: {
    title: "Northstar — Your AI growth hire",
    description:
      "Agentic growth marketing that operates the tools you already use and deploys campaigns end-to-end. You build. We grow.",
    type: "website",
    url: "https://northstar.ai",
    siteName: "Northstar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northstar — Your AI growth hire",
    description: "One brief in. A thousand experiments out. You build. We grow.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body>
        <AmbientBackground />
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
