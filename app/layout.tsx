import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SparklesCore } from "@/components/ui/sparkles";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const APP_NAME = "Void";
const APP_DEFAULT_TITLE = "Void - Cosmic Mindfulness";
const APP_TITLE_TEMPLATE = "%s - Void";
const APP_DESCRIPTION = "Absolute immersion. Visual silence.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-[#050507] text-white font-sans selection:bg-[#4DEEEA]/30`}
      >
        <Providers>
          {/* Sparkles/Starfield */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={2}
              particleDensity={30}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>

          <main className="relative z-10 min-h-screen flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
