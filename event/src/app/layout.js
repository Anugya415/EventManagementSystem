import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardLayout from "../components/DashboardLayout";
import { AuthProvider } from "../components/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EventMan - Event Management System",
  description: "Professional event management system for planning and organizing conferences, weddings, and workshops",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
