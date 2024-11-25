import localFont from "next/font/local";
import "./globals.css";
import { OrderProvider } from "@/contexts/OrderContext";
import BottomNav from "/components/BottomNav";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "公園前點單系統",
  description: "點單小幫手",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <OrderProvider>
          <div className="pb-16">{children}</div>
          <BottomNav />
        </OrderProvider>
      </body>
    </html>
  );
}
