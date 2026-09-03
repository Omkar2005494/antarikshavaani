import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AntarikshaVaani - Mission Intelligence AI | Stackverse-labs",
  description: "AI-Powered Sovereign Mission Intelligence Agent for Indian Space Data (ISRO ISSDC PDS4 & SWOC)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: "#070e1d", colorScheme: "dark" }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#070e1d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#070e1d] text-slate-100 font-sans overflow-hidden antialiased" style={{ backgroundColor: "#070e1d", color: "#f1f5f9" }}>
        {children}
      </body>
    </html>
  );
}
