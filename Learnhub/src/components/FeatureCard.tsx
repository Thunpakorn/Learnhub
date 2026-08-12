import Link from "next/link";
import { LucideIcon, ArrowRight, Sparkles } from "lucide-react";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge: string;
  gradient: string;
  accentColor: string;
  bgGlow: string;
}

/**
 * Component การ์ดฟีเจอร์หลัก 3 ใบสำหรับหน้าแรก (Home Page)
 * ตกแต่งในสไตล์การ์ดวิชากวดวิชา มี Gradient, เงาหนา และเอฟเฟกต์ Hover
 */
export default function FeatureCard({
  title,
  subtitle,
  description,
  icon: Icon,
  href,
  badge,
  gradient,
  accentColor,
  bgGlow,
}: FeatureCardProps) {
  return (
    <div className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 p-8 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl shadow-slate-950">
      
      {/* Background Radial Glow Effect */}
      <div className={`absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${bgGlow}`} />

      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-slate-950 stroke-[2.2]" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700/80">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {badge}
          </span>
        </div>

        {/* Card Title & Description */}
        <h3 className="text-2xl font-black text-white mb-1 tracking-tight group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
        <p className={`text-xs font-semibold uppercase tracking-wider ${accentColor} mb-3`}>
          {subtitle}
        </p>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
          เข้าใช้งานฟีเจอร์นี้
        </span>
        <Link
          href={href}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${gradient} text-slate-950 font-bold shadow-md group-hover:w-auto group-hover:px-4 transition-all duration-300 gap-2`}
        >
          <span className="hidden group-hover:inline text-xs font-extrabold whitespace-nowrap">
            เปิดใช้งาน
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
