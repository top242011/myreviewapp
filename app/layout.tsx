import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Assumes these are your chosen fonts
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "เว็บรีวิวรายวิชา", // Updated title
  description: "แพลตฟอร์มรีวิวรายวิชาสำหรับนักศึกษา", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th"> {/* Changed language to Thai */}
      {/* The body class handles the font variables and antialiased text.
          The background and default text color are handled by globals.css. */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
