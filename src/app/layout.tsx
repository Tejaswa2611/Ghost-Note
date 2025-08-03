import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/ui/navbar";
import AuthProvider from "@/context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });
import './globals.css'

export const metadata: Metadata = {
  title: "GhostNote - Anonymous Messaging Platform",
  description: "Send and receive anonymous messages safely and securely. Create unique links to receive anonymous messages with complete privacy.",
  keywords: ["anonymous messaging", "secure messaging", "private messages", "anonymous feedback"],
  authors: [{ name: "GhostNote Team" }],
  creator: "GhostNote",
  publisher: "GhostNote",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <NavBar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
      
    </html>
  );
}
