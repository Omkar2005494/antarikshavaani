import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AntarikshaVaani | AI Space Mission Intelligence",
  description: "Natural Language Mission Intelligence Agent for Indian Space Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-isro-blue selection:text-white">
        {children}
      </body>
    </html>
  );
}
