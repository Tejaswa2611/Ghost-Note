import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/ui/navbar";
import AuthProvider from "@/context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });
import './globals.css'

export const metadata: Metadata = {
  title: "FeedForward - Anonymous Feedback Management System",
  description: "Enterprise-grade anonymous feedback platform for organizations. Collect honest feedback from employees, customers, and stakeholders with complete anonymity and AI-powered insights.",
  keywords: ["anonymous feedback", "employee feedback", "organizational feedback", "HR tools", "360 feedback", "performance management", "enterprise feedback"],
  authors: [{ name: "FeedForward Development Team" }],
  creator: "FeedForward",
  publisher: "FeedForward",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
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
