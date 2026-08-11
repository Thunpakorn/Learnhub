"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search, Sparkles, Compass, Atom, Calculator, Dna, Flame, Filter } from "lucide-react";

interface KnowledgeCard {
  id: string;
  topic: string;
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

interface AiResultCard {
  category: string;
  topicName: string;
  information: string;
  solution: string;
  trick: string;
  image: string;
}

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
    subjectTh: "ชีววิทยา & คณิตศาสตร์",
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

function buildFallbackResults(query: string): AiResultCard[] {
  const normalized = query.toLowerCase();
  const isMath = /(เลข|สมการ|ฟังก์ชัน|คณิต|จำนวน|กราฟ|เศษ|อสมการ|พื้นที่|ทฤษฎี)/.test(normalized);
  const isScience = /(ฟิสิกส์|เคมี|ชีว|แสง|คลื่น|เสียง|ดาว|น้ำ|สาร|เซลล์|พลัง|รุ้ง|สบู่|กีตาร์|ผึ้ง|บาส|ลูก)/.test(normalized);
  const category = isMath && isScience ? "วิทยาศาสตร์ & คณิตศาสตร์" : isMath ? "คณิตศาสตร์" : isScience ? "วิทยาศาสตร์" : "วิทยาศาสตร์";
  const image = category.includes("คณิต") ? "📐" : "🔬";

  return [
    {
      category,
      topicName: query || "หัวข้อที่คุณสนใจ",
      information: `คำถามนี้มีความเกี่ยวข้องกับหลักการพื้นฐานของ${category}ที่สามารถเชื่อมโยงกับการเรียนรู้ในชีวิตประจำวันได้อย่างเป็นระบบ`,
      solution: "แบ่งคำถามออกเป็นส่วนเล็ก ๆ แล้วเชื่อมกับหลักการที่เกี่ยวข้องอย่างชัดเจน",
      trick: "ลองใช้ตัวอย่างจากสิ่งที่เห็นรอบตัวเพื่อเข้าใจได้ง่ายขึ้น",
      image,
    },
  ];
}

function normalizeResults(raw: unknown, query: string): AiResultCard[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
      .map((item) => ({
        category: String(item.category ?? item.categoryName ?? "วิทยาศาสตร์"),
        topicName: String(item.topicName ?? item.topic ?? (query || "หัวข้อที่คุณสนใจ")),
        information: String(item.information ?? item.info ?? item.summary ?? "ไม่มีข้อมูลรายละเอียด"),
        solution: String(item.solution ?? item.answer ?? "ไม่มีคำตอบแบบสั้น"),
        trick: String(item.trick ?? item.tip ?? "ลองเชื่อมกับตัวอย่างในชีวิตประจำวัน"),
        image: String(item.image ?? "🔍"),
      }));
  }

  if (raw && typeof raw === "object") {
    const maybeItems = (raw as Record<string, unknown>).items;
    if (Array.isArray(maybeItems)) {
      return normalizeResults(maybeItems, query);
    }
  }

  if (typeof raw === "string" && raw.trim()) {
    return [
      {
        category: "วิทยาศาสตร์",
        topicName: query || "หัวข้อที่คุณสนใจ",
        information: raw,
        solution: "ลองอ่านคำอธิบายจาก AI แล้วเชื่อมกับตัวอย่างในชีวิตประจำวัน",
        trick: "แบ่งหัวข้อออกเป็นคำหลักเพื่อจำได้ง่าย",
        image: "🧠",
      },
    ];
  }

  return buildFallbackResults(query);
}

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<AiResultCard[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("ทั้งหมด");

  const subjects = [
    { name: "ทั้งหมด", icon: Filter },
    { name: "ฟิสิกส์", icon: Atom },
    { name: "คณิตศาสตร์", icon: Calculator },
    { name: "ชีววิทยา", icon: Dna },
    { name: "เคมี", icon: Flame },
  ];

  const filteredCards = useMemo(() => {
    return mockKnowledgeCards.filter((card) => {
      const matchSubject =
        selectedSubject === "ทั้งหมด" || card.subjectTh.includes(selectedSubject);
      const matchQuery =
        searchQuery.trim() === "" ||
        card.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchQuery;
    });
  }, [searchQuery, selectedSubject]);

  const handleSearch = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError("โปรดพิมพ์คำค้นหาก่อนกดค้นหา");
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);

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

      setSearchResults(normalizeResults(data.result, query));
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : String(error));
      setSearchResults(buildFallbackResults(query));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
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
                      setSearchResults(null);
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

          {(isSearching || searchError || searchResults) && (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
              {isSearching ? (
                <p className="text-slate-300">กำลังค้นหาคำตอบจาก AI...</p>
              ) : searchError ? (
                <p className="text-rose-300 mb-4">{searchError}</p>
              ) : null}

              {searchResults && searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-white text-lg font-semibold">ผลลัพธ์การค้นหาจาก AI</h2>
                    <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300">
                      {searchResults.length} กล่องตามหมวดหมู่
                    </span>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {searchResults.map((item, index) => (
                      <article
                        key={`${item.category}-${index}`}
                        className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 shadow-lg shadow-slate-950/20"
                      >
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                            {item.category}
                          </span>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
                            {item.image || "🔍"}
                          </div>
                        </div>

                        <div className="space-y-3 text-sm text-slate-300">
                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">ชื่อหัวข้อที่ค้นหา</p>
                            <h3 className="text-base font-semibold text-white">{item.topicName}</h3>
                          </div>

                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">ข้อมูล</p>
                            <p className="leading-relaxed">{item.information}</p>
                          </div>

                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">คำตอบ/วิธีแก้</p>
                            <p className="leading-relaxed text-amber-200">{item.solution}</p>
                          </div>

                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">ทริก</p>
                            <p className="leading-relaxed text-emerald-300">{item.trick}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

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
