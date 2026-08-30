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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-container-lowest text-on-surface font-body-md overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
