import type { Metadata } from "next";
import "./globals.css";
import '../../public/fonts/Orbitron.css'
import { ViewTransitions } from "next-view-transitions";


export const metadata: Metadata = {
  title: "Galactic<Code>",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">

        <body
          className={`antialiased`}
        >
          <main>

            {children}
          </main>
        </body>
      </html>
    </ViewTransitions>
  );
}
