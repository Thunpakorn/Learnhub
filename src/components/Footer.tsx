import Link from "next/link";
import Image from "next/image";
import { Sparkles, BookOpen, Atom, Calculator, Cpu, ShieldCheck } from "lucide-react";

/**
 * Component Footer หลักของ LearnHub
 * แสดงผลที่ด้านล่างของทุกหน้า แสดงข้อมูลแพลตฟอร์มและหมวดวิชา
 */
export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 lg:py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image src="/logo.svg" alt="LearnHub" width={40} height={40} />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Learn<span className="text-orange-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              เปลี่ยนการเรียนรู้แบบเดิม สู่พื้นที่ทดลองเสมือนจริง แพลตฟอร์มที่ชวน 'ลงมือ' ปรับและสำรวจสิ่งรอบตัว ค้นพบคำตอบที่ซ่อนอยู่ใกล้ตัว ในแบบที่ไม่เคยสังเกตมาก่อน
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Visual & Interactive Learning
              </span>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-400" />
              ฟีเจอร์หลัก
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/discovery" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Discovery Engine
                </Link>
              </li>
              <li>
                <Link href="/simulation" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Simulation Hub 2.5  D
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Math Companion
                </Link>
              </li>
            </ul>
          </div>


          {/* EdTech Vibe Note */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-400" />
              สำหรับผู้พัฒนา
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              โครงสร้าง UI/UX นี้ออกแบบมาเพื่อรองรับ Logic การคำนวณ API และ 3D WebGL ในอนาคต
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Next.js 15 • TypeScript • Tailwind CSS
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LearnHub Platform. สงวนลิขสิทธิ์เฉพาะ UI/UX Template</p>
          <p className="text-slate-400">ออกแบบสำหรับนักเรียน  ยุค Visual & Interactive Learning</p>
        </div>
      </div>
    </footer>
  );
}