import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- Start: Updated Metadata for global site information ---
export const metadata: Metadata = {
  title: {
    default: "เว็บรีวิวรายวิชา - แหล่งรวมรีวิวคอร์สเรียน", // Default title for all pages
    template: "%s | เว็บรีวิวรายวิชา", // Template for page-specific titles
  },
  description: "แพลตฟอร์มรีวิวรายวิชาสำหรับนักศึกษาไทย ค้นหา อ่าน และเขียนรีวิววิชาและอาจารย์",
  // You can add more metadata here like keywords, openGraph etc.
};
// --- End: Updated Metadata ---


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}