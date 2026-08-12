import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LearnHub - เปลี่ยนสิ่งรอบตัวเป็นความรู้คณิต-วิทย์ ม.ปลาย",
  description: "แพลตฟอร์มสำหรับนักเรียนระดับมัธยมปลาย เปลี่ยนพฤติกรรมการเรียนรู้จาก Passive เป็น Active ด้วย Discovery Engine, 3D Simulation และ Scientific Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-orange-500 selection:text-slate-950">
        {/* Nav Bar ร่วมทั้งเว็บไซต์ */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>
        
        {/* Footer ร่วมทั้งเว็บไซต์ */}
        <Footer />
      </body>
    </html>
  );
}
