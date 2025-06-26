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

export const metadata: Metadata = {
  title: {
    default: "เว็บรีวิวรายวิชา - แหล่งรวมรีวิวคอร์สเรียนสำหรับนักศึกษา",
    template: "%s | เว็บรีวิวรายวิชา",
  },
  description: "แพลตฟอร์มรีวิวรายวิชาสำหรับนักศึกษาไทย ค้นหา อ่าน และเขียนรีวิววิชาและอาจารย์เพื่อการตัดสินใจลงทะเบียน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      {/* Applying background and text color directly as Tailwind utility classes on body. */}
      {/* This ensures the background and default text are handled by Tailwind's core processing. */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased
        bg-gradient-to-br from-purple-700 to-indigo-800 bg-fixed min-h-screen text-gray-100 overflow-x-hidden
        font-sans`} /* Added font-sans for the default font */>
        {children}
      </body>
    </html>
  );
}
