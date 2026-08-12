"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // จำลองกระบวนการ Login แล้วนำทางไปยังหน้า Onboarding (เลือกความสนใจ)
    setTimeout(() => {
      router.replace("/onboarding");
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card (โครงสร้างตามดีไซน์รูปภาพอ้างอิง) */}
      <div className="relative max-w-md w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-7">

        {/* Learnhub Logo Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-full blur-md opacity-50 group-hover:opacity-80 transition duration-300" />
            <div className="relative w-20 h-20 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center shadow-xl">
              <Image
                src="/logo.svg"
                alt="LearnHub Logo"
                width={52}
                height={52}
                priority
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              LearnHub Login
            </h1>
            <p className="text-xs text-slate-400">
              ลงชื่อเข้าสู่ระบบ LearnHub Active Learning Platform
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block ml-1">
              Username
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl py-3.5 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block ml-1">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl py-3.5 pl-11 pr-11 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Log In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-slate-950 font-black text-base shadow-lg shadow-orange-500/20 hover:opacity-95 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
            >
              <span>{isSubmitting ? "กำลังเข้าสู่ระบบ..." : "Log In"}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Subtitle Links & Footer Line */}
        <div className="space-y-4 pt-1">
          <div>
            <button
              type="button"
              onClick={() => alert("ระบบลืมรหัสผ่าน: โปรดติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน")}
              className="text-xs text-amber-400/90 hover:text-amber-300 font-semibold transition-colors hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800/90 w-full" />
          </div>

          <p className="text-[11px] text-slate-500">
            LearnHub Active Learning Platform © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
