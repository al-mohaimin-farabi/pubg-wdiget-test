import { Oswald } from "next/font/google";
import "./globals.css";
import StoreProvider from "../components/StoreProvider";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata = {
  title: "PUBG WIDGET",
  description: "PUBG WIDGET",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} bg-transparent antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
