"use client";

import { useState } from "react";
import { Search, Sparkles, Compass, Atom, Calculator, Dna, Flame, ArrowUpRight, Filter, BookOpen } from "lucide-react";

/**
 * Interface สำหรับโครงสร้างข้อมูลการ์ดความรู้ Contextual Discovery Card (Mock Data)
 */
interface KnowledgeCard {
  id: string;
  topic: string; // เช่น "กีตาร์โปร่ง", "รังผึ้ง"
  title: string;
  subject: "Physics" | "Mathematics" | "Biology" | "Chemistry";
  subjectTh: string;
  categoryTag: string;
  summary: string;
  keyConcepts: string[];
  formulaPreview?: string;
  readTime: string;
  bgGlow: string;
  accentBorder: string;
  tagBg: string;
  tagText: string;
}

/**
 * Mock Data แสดงผลลัพธ์การ์ดความรู้ตัวอย่าง เพื่อสาธิต UI/UX ในการนำเสนอวิชาต่างๆ
 */
const mockKnowledgeCards: KnowledgeCard[] = [
  {
    id: "guitar-sound",
    topic: "กีตาร์โปร่ง",
    title: "คลื่นความถี่และการสั่นสะเทือนในสายกีตาร์",
    subject: "Physics",
    subjectTh: "ฟิสิกส์",
    categoryTag: "การเคลื่อนที่แบบคลื่น & เสียง",
    summary: "เมื่อคุณดีดสายกีตาร์ ความตึง มวลต่อความยาว และความยาวสายจะกำหนดความถี่ของคลื่นนิ่ง (Standing Wave) เกิดเป็นระดับเสียงตัวโน้ตต่างๆ",
    keyConcepts: ["ความถี่คลื่นนิ่ง (Harmonics)", "แรงตึงสาย (String Tension)", "การกำทอน (Resonance)"],
    formulaPreview: "f = (n / 2L) × √(T / μ)",
    readTime: "อ่าน 4 นาที",
    bgGlow: "from-sky-500/10 via-sky-500/5 to-transparent",
    accentBorder: "border-sky-500/40 hover:border-sky-400",
    tagBg: "bg-sky-500/10 border-sky-500/30",
    tagText: "text-sky-400",
  },
  {
    id: "honeycomb-math",
    topic: "รังผึ้งธรรมชาติ",
    title: "โครงสร้างหกเหลี่ยมกับการประหยัดพื้นที่ขั้นสูงสุด",
    subject: "Mathematics",
    subjectTh: "คณิตศาสตร์",
    categoryTag: "เรขาคณิต & ทฤษฎีพื้นที่",
    summary: "ทำไมผึ้งถึงสร้างรังเป็นรูปหกเหลี่ยมด้านเท่า? ในทางคณิตศาสตร์ รูปหกเหลี่ยมสามารถเติมเต็มพื้นที่ 2 มิติได้โดยไม่มีช่องว่าง และใช้วัสดุขี้ผึ้งสร้างน้อยที่สุดเมื่อเทียบกับปริมาตร",
    keyConcepts: ["Honeycomb Conjecture", "ทฤษฎีเทสเซลเลชัน (Tessellation)", "การหาค่าสูงสุด-ต่ำสุด (Optimization)"],
    formulaPreview: "P = 2 × 3^(1/4) × √A",
    readTime: "อ่าน 3 นาที",
    bgGlow: "from-purple-500/10 via-purple-500/5 to-transparent",
    accentBorder: "border-purple-500/40 hover:border-purple-400",
    tagBg: "bg-purple-500/10 border-purple-500/30",
    tagText: "text-purple-400",
  },
  {
    id: "basketball-parabola",
    topic: "การชู้ตลูกบาสเกตบอล",
    title: "วิถีโค้งพาราโบลาและการเคลื่อนที่แบบโพรเจกไทล์",
    subject: "Physics",
    subjectTh: "ฟิสิกส์",
    categoryTag: "กลศาสตร์ ม.4",
    summary: "ลูกบาสเกตบอลที่ลอยออกจากมือผู้เล่นเคลื่อนที่ตามแรงโน้มถ่วงเป็นเส้นโค้งพาราโบลา มุมชู้ตที่เหมาะสมที่สุดในการลงห่วงคือช่วง 45 - 52 องศา",
    keyConcepts: ["การเคลื่อนที่ 2 มิติ", "ความเร็วต้น (u)", "มุมยิงเหมาะสม (Optimal Angle)"],
    formulaPreview: "y = x tan(θ) - (g x²) / (2 u² cos²θ)",
    readTime: "อ่าน 5 นาที",
    bgGlow: "from-orange-500/10 via-orange-500/5 to-transparent",
    accentBorder: "border-orange-500/40 hover:border-orange-400",
    tagBg: "bg-orange-500/10 border-orange-500/30",
    tagText: "text-orange-400",
  },
  {
    id: "sunflower-fibonacci",
    topic: "ดอกทานตะวัน",
    title: "ลำดับฟีโบนักชีและมุมทองคำในการจัดเรียงเมล็ด",
    subject: "Biology",
    subjectTh: "ชีววิทยา & 수학",
    categoryTag: "พฤกษศาสตร์ & ลำดับคณิตศาสตร์",
    summary: "เมล็ดทานตะวันจัดเรียงหมุนวนเป็นเกลียวตามลำดับเลข Fibonacci (1, 1, 2, 3, 5, 8, 13...) และหมุนตามมุมทองคำ (137.5 องศา) เพื่อให้ได้รับแสงแดดมากที่สุด",
    keyConcepts: ["Fibonacci Sequence", "Golden Ratio (φ = 1.618)", "การสังเคราะห์แสง"],
    formulaPreview: "F(n) = F(n-1) + F(n-2)",
    readTime: "อ่าน 4 นาที",
    bgGlow: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    accentBorder: "border-emerald-500/40 hover:border-emerald-400",
    tagBg: "bg-emerald-500/10 border-emerald-500/30",
    tagText: "text-emerald-400",
  },
  {
    id: "rainbow-refraction",
    topic: "รุ้งกินน้ำ",
    title: "การหักเหและการกระจัดกระจายของแสงในหยดน้ำฝน",
    subject: "Physics",
    subjectTh: "ฟิสิกส์",
    categoryTag: "ทัศนศาสตร์ (Optics)",
    summary: "แสงอาทิตย์เข้าสู่หยดน้ำ เกิดการหักเห สะท้อนกลับหมดภายใน และกระจายออกเป็น 7 สีตามความยาวคลื่น มุมทำองศากับสายตาอยู่ที่ประมาณ 42 องศา",
    keyConcepts: ["กฎของสเนลล์ (Snell's Law)", "การสะท้อนกลับหมด", "การกระจายแสง (Dispersion)"],
    formulaPreview: "n₁ sin(θ₁) = n₂ sin(θ₂)",
    readTime: "อ่าน 5 นาที",
    bgGlow: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
    tagBg: "bg-cyan-500/10 border-cyan-500/30",
    tagText: "text-cyan-400",
  },
  {
    id: "soap-bubble-thinfilm",
    topic: "ฟองสบู่",
    title: "การแทรกสอดของแสงบนฟิล์มบางและแรงตึงผิว",
    subject: "Chemistry",
    subjectTh: "เคมี & ฟิสิกส์",
    categoryTag: "เคมีกายภาพ (Physical Chemistry)",
    summary: "สีสันแวววาวบนผิวฟองสบู่เกิดจากการแทรกสอดคลื่นแสงบนชั้นฟิล์มบางโมเลกุลของสบู่และน้ำ ร่วมกับแรงตึงผิวที่พยายามลดพื้นที่ผิวให้เป็นทรงกลม",
    keyConcepts: ["Thin-Film Interference", "แรงตึงผิว (Surface Tension)", "โมเลกุลมีขั้ว-ไม่มีขั้ว"],
    formulaPreview: "2 n d cos(θ) = m λ",
    readTime: "อ่าน 4 นาที",
    bgGlow: "from-rose-500/10 via-rose-500/5 to-transparent",
    accentBorder: "border-rose-500/40 hover:border-rose-400",
    tagBg: "bg-rose-500/10 border-rose-500/30",
    tagText: "text-rose-400",
  },
];

/**
 * หน้า Contextual Discovery Engine (src/app/discovery/page.tsx)
 * หน้านี้ทำเฉพาะ UI/UX เท่านั้น ใช้ useState เก็บค่าช่องค้นหาและตัวกรองวิชา
 */
export default function DiscoveryPage() {
  // useState สำหรับเก็บค่าข้อความค้นหาที่ผู้ใช้พิมพ์
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // useState สำหรับเก็บหมวดวิชาที่เลือกกรอง
  const [selectedSubject, setSelectedSubject] = useState<string>("ทั้งหมด");

  const subjects = [
    { name: "ทั้งหมด", icon: Filter },
    { name: "ฟิสิกส์", icon: Atom },
    { name: "คณิตศาสตร์", icon: Calculator },
    { name: "ชีววิทยา", icon: Dna },
    { name: "เคมี", icon: Flame },
  ];

  // กรองการ์ดตามหมวดวิชาและข้อความค้นหาเบื้องต้นสำหรับแสดงผล UI
  const filteredCards = mockKnowledgeCards.filter((card) => {
    const matchSubject =
      selectedSubject === "ทั้งหมด" || card.subjectTh.includes(selectedSubject);
    const matchQuery =
      searchQuery.trim() === "" ||
      card.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-bold shadow-md">
            <Compass className="w-4 h-4" />
            Contextual Discovery Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ค้นหาที่มา <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">คณิต-วิทย์</span> จากสิ่งรอบตัว
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            พิมพ์วัตถุ กิจกรรม หรือสิ่งที่สงสัยในชีวิตประจำวัน เพื่อค้นดูว่าหลักการฟิสิกส์ เคมี ชีวะ หรือคณิตศาสตร์ใดที่ซ่อนอยู่ในนั้น
          </p>
        </div>

        {/* Search Bar UI Section */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-300 pointer-events-none" />
            
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
              <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ลองพิมพ์สิ่งที่คุณสนใจ เช่น กีตาร์, ผึ้ง, บาสเกตบอล, รุ้งกินน้ำ..."
                className="w-full bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-base font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 hover:text-white mr-2"
                >
                  ล้างคำค้น
                </button>
              )}
              <button
                type="button"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-orange-500/20 hover:opacity-95 transition-all shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">ค้นหา</span>
              </button>
            </div>
          </div>

          {/* Quick Search Suggestion Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-500 font-semibold">คำค้นยอดนิยม:</span>
            {["กีตาร์โปร่ง", "รังผึ้ง", "ลูกบาสเกตบอล", "ดอกทานตะวัน", "รุ้งกินน้ำ", "ฟองสบู่"].map((keyword) => (
              <button
                key={keyword}
                onClick={() => setSearchQuery(keyword)}
                className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-orange-400 border border-slate-800 transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            const isSelected = selectedSubject === sub.name;
            return (
              <button
                key={sub.name}
                onClick={() => setSelectedSubject(sub.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/20 scale-105"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-slate-950 stroke-[2.5]" : "text-orange-400"}`} />
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Knowledge Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              ผลลัพธ์การ์ดความรู้ ({filteredCards.length} หัวข้อ)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              หมวดวิชา: <strong className="text-orange-400">{selectedSubject}</strong>
            </span>
          </div>

          {filteredCards.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">ไม่พบการ์ดความรู้ที่ตรงกับการค้นหา</h3>
              <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหาเป็นสิ่งรอบตัวอื่นๆ หรือเลือกระบุหมวดวิชา "ทั้งหมด"</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("ทั้งหมด");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-slate-950 text-xs font-bold"
              >
                รีเซ็ตการค้นหา
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className={`group relative bg-slate-900/80 border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-xl ${card.accentBorder}`}
                >
                  {/* Card Header Background Glow */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.bgGlow} rounded-full blur-2xl pointer-events-none`} />

                  <div>
                    {/* Top Subject Tag & Read Time */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${card.tagBg} ${card.tagText}`}>
                        {card.subjectTh}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
                        {card.readTime}
                      </span>
                    </div>

                    {/* Everyday Topic Badge */}
                    <div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">
                      สิ่งรอบตัว: <span className="text-slate-200">{card.topic}</span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-xl font-extrabold text-white mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                      {card.title}
                    </h3>

                    {/* Category Tag */}
                    <p className="text-xs text-slate-400 font-medium mb-3">
                      📌 {card.categoryTag}
                    </p>

                    {/* Summary */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {card.summary}
                    </p>

                    {/* Key Concepts Tags */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        แนวคิดสำคัญ:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {card.keyConcepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950/80 text-slate-300 border border-slate-800"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Formula Preview & Action Footer */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    {card.formulaPreview && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-300">
                        <span className="text-[10px] text-slate-500 font-sans">สูตรคำนวณ:</span>
                        <span className="font-bold">{card.formulaPreview}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>ดูคำอธิบายฉบับเต็ม</span>
                      <ArrowUpRight className="w-4 h-4 text-orange-400" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
