"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Compass, Cpu, Calculator, Sparkles, Menu, X } from "lucide-react";

/**
 * Component Navbar หลักของ LearnHub
 * แสดงผลบนทุกหน้าของเว็บไซต์ มีเมนู responsive สำหรับมือถือ
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // รายการเมนูหลัก (นำ "หน้าแรก" ออกแล้ว เริ่มต้นที่ Discovery Engine)
  const navItems = [
    { name: "Discovery Engine", href: "/discovery", icon: Compass },
    { name: "Simulation Hub", href: "/simulation", icon: Cpu },
    { name: "Math Companion", href: "/calculator", icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand (คลิกแล้วไปหน้า Discovery Engine) */}
          <Link href="/discovery" className="flex items-center gap-3 group">
            <div className="w-11 h-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.svg" alt="LearnHub" width={44} height={44} priority />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">Hub</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Active Learning Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-semibold shadow-md shadow-orange-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-slate-950 stroke-[2.5]" : "text-orange-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/discovery"
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-slate-950 hover:opacity-95 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>เริ่มค้นหาความรู้</span>
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-slate-950" : "text-orange-400"}`} />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/discovery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 shadow-lg shadow-orange-500/25"
            >
              <Sparkles className="w-5 h-5" />
              <span>เริ่มค้นหาความรู้</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}