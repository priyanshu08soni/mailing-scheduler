import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";
import { 
  ClerkProvider
} from "@clerk/nextjs";
const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['400','500','600','700'],
  variable: '--font-ibm-plex'
})
export const metadata: Metadata = {
  title: "Mail-Scheduler",
  description: "Mail-Scheduler",
};
// Improved type for the `cn` function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: {colorPrimary: '#624cf5'}
    }}>
      <html lang="en">
          <body
            className={`${cn("font-IBMPlex antialiased", IBMPlex.variable)}`}
            >
            {children}
          </body>
        </html>
    </ClerkProvider>
  );
}
