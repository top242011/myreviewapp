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
  title: {
    default: "เว็บรีวิวรายวิชา - แหล่งรวมรีวิวคอร์สเรียนสำหรับนักศึกษา",
    template: "%s | LearnRadar", // Changed template suffix
  },
  description: "แพลตฟอร์มรีวิวรายวิชาสำหรับนักศึกษาไทย ค้นหา อ่าน และเขียนรีวิววิชาและอาจารย์เพื่อการตัดสินใจลงทะเบียน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th"> {/* Changed language to Thai */}
      {/* Body class uses Geist font variables and antialiased text. Background and default text color are handled by globals.css. */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
