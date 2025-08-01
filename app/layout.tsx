import type { Metadata , Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono,Lexend_Mega } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./sessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexendMega = Lexend_Mega({
  variable: "--font-lexend-mega",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",

};

// ✅ Moved viewport into a separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>

    <html lang="en">
      <body
        className={`${lexendMega.variable} ${geistMono.variable} antialiased`}
        >
        
          {children}
        
        <Toaster
          position="bottom-right"
          // reverseOrder={false}
          // toastOptions={{
            //   className: "bg-gray-800 text-white",
            //   style: {
              //     fontFamily: "var(--font-geist-sans)",
              //     fontSize: "14px",
              //   },
              // }}
              />
      </body>
    </html>
    </SessionWrapper>
  );
}
