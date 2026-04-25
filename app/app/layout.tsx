import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local AI Screen Assistant",
  description: "On-demand local-first screen reasoning assistant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
