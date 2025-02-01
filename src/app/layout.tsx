import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "@/context/StoreProvider";
const raleway = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <StoreProvider>
          <body className={`${raleway.className} antialiased`}>
            {children}
            <Toaster />
          </body>
        </StoreProvider>
      </AuthProvider>
    </html>
  );
}
