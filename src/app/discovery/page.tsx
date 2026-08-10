"use client";

import { FormEvent, useState } from "react";
import { Search, Sparkles, Compass, Atom, Calculator, Dna, Flame, Filter } from "lucide-react";

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
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

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

  const handleSearch = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError("โปรดพิมพ์คำค้นหาก่อนกดค้นหา");
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "ไม่สามารถค้นหาได้");
      }

      setSearchResult(data.result ?? "ไม่มีผลลัพธ์");
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSearching(false);
    }
  };

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
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-300 pointer-events-none" />

            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center flex-1 px-3">
                <Search className="w-6 h-6 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ลองพิมพ์สิ่งที่คุณสนใจ เช่น กีตาร์, ผึ้ง, บาสเกตบอล, รุ้งกินน้ำ..."
                  className="w-full bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-base font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pr-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResult(null);
                      setSearchError(null);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 hover:text-white"
                  >
                    ล้าง
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-orange-500/20 hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">ค้นหา</span>
                </button>
              </div>
            </div>
          </form>

          {isSearching || searchError || searchResult ? (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
              {isSearching ? (
                <p className="text-slate-300">กำลังค้นหาคำตอบจาก AI...</p>
              ) : searchError ? (
                <p className="text-rose-300">{searchError}</p>
              ) : searchResult ? (
                <div>
                  <h2 className="text-white text-lg font-semibold mb-3">ผลลัพธ์การค้นหาจาก AI</h2>
                  <p className="whitespace-pre-line text-slate-200 leading-relaxed">{searchResult}</p>
                </div>
              ) : null}
            </div>
          ) : null}

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

      </div>
    </div>
  );
}