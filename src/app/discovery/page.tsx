"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles, Compass, Atom, Calculator, Dna, Flame, Filter, Plus, Paperclip, Camera, FileText, X } from "lucide-react";

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
  fullInformation?: string;
  solution: string;
  trick: string;
  image: string;
}

interface AttachmentItem {
  id: string;
  type: "file" | "photo";
  name: string;
  previewUrl: string;
  file?: File;
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
      fullInformation: `คำถามนี้เชื่อมโยงกับหลักการพื้นฐานของ${category} และควรเริ่มจากตัวอย่างในชีวิตจริง เช่น การสังเกตสิ่งรอบตัวเพื่อสร้างความเข้าใจที่ลึกขึ้น`,
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
        information: String(
          item.information ??
            item.info ??
            item.summary ??
            item.answer ??
            item.text ??
            item.description ??
            "ไม่มีข้อมูลรายละเอียด"
        ),
        solution: String(item.solution ?? item.tip ?? "ไม่มีคำตอบแบบสั้น"),
        trick: String(item.trick ?? item.tip ?? "ลองเชื่อมกับตัวอย่างในชีวิตประจำวัน"),
        fullInformation: String(
          item.fullInformation ??
            item.information ??
            item.answer ??
            item.summary ??
            item.text ??
            item.description ??
            "ไม่มีข้อมูลเพิ่มเติม"
        ),
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
        information: raw,        fullInformation: raw,        solution: "ลองอ่านคำอธิบายจาก AI แล้วเชื่อมกับตัวอย่างในชีวิตประจำวัน",
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
  const [expandedResultIndex, setExpandedResultIndex] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("ทั้งหมด");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);

  const subjects = [
    { name: "ทั้งหมด", icon: Filter },
    { name: "ฟิสิกส์", icon: Atom },
    { name: "คณิตศาสตร์", icon: Calculator },
    { name: "ชีววิทยา", icon: Dna },
    { name: "เคมี", icon: Flame },
  ];

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setCameraError(null);
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAttachments = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      type: "file" as const,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    setAttachments((current) => [...current, ...newAttachments]);
    setShowAttachmentMenu(false);
    event.target.value = "";
  };

  const handleTakePhoto = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraActive(true);
      setShowAttachmentMenu(false);
    } catch (error) {
      setCameraError("ไม่สามารถเข้าถึงกล้องได้ โปรดอนุญาตการใช้งานกล้อง");
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch(() => {
          /* ignore autoplay failure */
        });
    }
  }, [isCameraActive]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.png`, { type: "image/png" });
      const photoAttachment: AttachmentItem = {
        id: `photo-${Date.now()}`,
        type: "photo",
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        file,
      };
      setAttachments((current) => [...current, photoAttachment]);
      stopCamera();
    }, "image/png");
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      attachments.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl));
    };
  }, [attachments]);

  const removeAttachment = (id: string) => {
    setAttachments((current) => current.filter((item) => item.id !== id));
  };

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

  const handleSearch = async (event?: FormEvent<HTMLFormElement>, overrideQuery?: string) => {
    event?.preventDefault();
    const query = (overrideQuery ?? searchQuery).trim();
    if (!query) {
      setSearchError("โปรดพิมพ์คำค้นหาก่อนกดค้นหา");
      setSearchResults(null);
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Surface the real error from the backend — don't hide it with fallback
        throw new Error(data?.error || `เซิร์ฟเวอร์ตอบกลับ HTTP ${response.status}`);
      }

      const normalized = normalizeResults(data.result, query);
      if (!normalized || normalized.length === 0) {
        throw new Error("AI ไม่ส่งข้อมูลกลับมา กรุณาลองใหม่อีกครั้ง");
      }
      setSearchResults(normalized);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : String(error));
      // Do NOT set fallback results here — we want the error to be visible
      setSearchResults(null);
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
              <button
                type="button"
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 hover:border-slate-500 transition"
                aria-label="Open attachment menu"
              >
                <Plus className="w-5 h-5" />
              </button>

              <div className="flex items-center flex-1 px-3">
                <Search className="w-6 h-6 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ลองพิมพ์สิ่งที่คุณสนใจ เช่น กีตาร์, ผึ้ง, บาสเกตบอล, รุ้งกินน้ำ..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-base font-medium"
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

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept="*/*"
                multiple
              />
            </div>

            {showAttachmentMenu && (
              <div className="absolute left-0 right-0 mt-3 rounded-3xl border border-slate-700 bg-slate-950/95 shadow-2xl shadow-slate-950/40 p-4 z-10">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="cursor-pointer rounded-3xl border border-slate-700 bg-slate-900/90 p-4 flex items-center gap-3 hover:border-slate-500 transition">
                    <Paperclip className="w-5 h-5 text-slate-200" />
                    <span className="text-sm text-slate-100">แนบไฟล์</span>
                    <input
                      type="file"
                      accept="*/*"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleTakePhoto}
                    className="rounded-3xl border border-slate-700 bg-slate-900/90 p-4 flex items-center gap-3 hover:border-slate-500 transition"
                  >
                    <Camera className="w-5 h-5 text-slate-200" />
                    <span className="text-sm text-slate-100">ถ่ายรูป</span>
                  </button>
                </div>
                {cameraError && (
                  <p className="mt-3 text-sm text-rose-300">{cameraError}</p>
                )}
              </div>
            )}
          </form>

          {attachments.length > 0 && (
            <div className="mb-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg shadow-slate-950/10">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <FileText className="w-5 h-5 text-amber-300" />
                  <span>ไฟล์ที่แนบ</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    attachments.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl));
                    setAttachments([]);
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  ลบทั้งหมด
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="min-w-[160px] max-w-[220px] rounded-3xl border border-slate-700 bg-slate-950/90 overflow-hidden shadow-lg shadow-slate-950/20">
                    <div className="relative h-28 bg-slate-800/70 flex items-center justify-center overflow-hidden">
                      <img src={attachment.previewUrl} alt={attachment.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs text-slate-400 uppercase tracking-[0.18em]">{attachment.type === "photo" ? "ภาพถ่าย" : "ไฟล์"}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="text-slate-400 hover:text-white"
                          aria-label="Remove attachment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-100 truncate">{attachment.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCameraActive && (
            <div className="fixed inset-0 z-50 bg-slate-950/95 p-4 sm:p-6">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-white text-xl font-semibold">โหมดกล้องเต็มหน้าจอ</h3>
                    <p className="text-slate-400 text-sm">เล็งกล้อง แล้วกดถ่ายเพื่อเพิ่มภาพในแถบแสดงตัวอย่าง</p>
                  </div>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 hover:border-slate-500 transition"
                  >
                    ยกเลิก
                  </button>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-3xl bg-black">
                  <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-orange-400 transition"
                  >
                    <Camera className="w-5 h-5" />
                    ถ่ายรูป
                  </button>
                  <div className="text-slate-400 text-xs sm:text-sm">หากไม่เห็นภาพ ให้อนุญาตการเข้าถึงกล้องในเบราว์เซอร์ของคุณ</div>
                </div>
              </div>
            </div>
          )}

          {(isSearching || searchError || searchResults) && (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
              {/* Loading state */}
              {isSearching && (
                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="animate-spin h-5 w-5 text-orange-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>กำลังค้นหาคำตอบ...</span>
                </div>
              )}

              {/* Error state — shown clearly, no silent fallback */}
              {!isSearching && searchError && (
                <div className="rounded-2xl border border-rose-700/40 bg-rose-950/30 p-4 text-rose-300">
                  <p className="font-semibold mb-1">⚠️ เกิดข้อผิดพลาดจาก AI</p>
                  <p className="text-sm leading-relaxed">{searchError}</p>
                  <button
                    type="button"
                    onClick={() => handleSearch(undefined, searchQuery)}
                    className="mt-3 text-xs font-semibold text-orange-400 hover:text-orange-300 underline underline-offset-2"
                  >
                    ลองอีกครั้ง
                  </button>
                </div>
              )}

              {/* AI Result Cards */}
              {!isSearching && searchResults && searchResults.length > 0 && (
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-white text-lg font-semibold">ความรู้เกี่ยวกับ{searchQuery}</h2>
                    <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300">
                      {searchResults.length} หมวดหมู่
                    </span>
                  </div>

                  <div className="grid w-full gap-4 lg:grid-cols-2">
                    {searchResults.map((item, index) => (
                      <article
                        key={`${item.category}-${index}`}
                        className="rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 shadow-lg shadow-slate-950/20"
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
                            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">ชื่อหัวข้อ</p>
                            <h3 className="text-base font-semibold text-white">{item.topicName}</h3>
                          </div>

                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">ข้อมูล</p>
                            <p className="leading-relaxed">
                              {expandedResultIndex === index
                                ? item.fullInformation ?? item.information
                                : item.information.length > 220
                                ? `${item.information.slice(0, 220)}...`
                                : item.information}
                            </p>
                            {(item.fullInformation && item.fullInformation !== item.information) || item.information.length > 220 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedResultIndex((current) =>
                                    current === index ? null : index
                                  )
                                }
                                className="mt-2 inline-flex rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
                              >
                                {expandedResultIndex === index ? "ย่อ" : "เพิ่มเติม"}
                              </button>
                            ) : null}
                          </div>

                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">คำตอบ / วิธีแก้</p>
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

                  {/* Readdi Link */}
                  <div className="pt-2 text-center">
                    <a
                      href="https://readdi.ais.co.th/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-6 py-3 text-sm font-semibold text-orange-300 transition-all hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-400/60"
                    >
                      <span>📚</span>
                      <span>เลือกดูหนังสือ E-Book เกี่ยวกับ {searchQuery} ได้ที่ Readdi</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-500 font-semibold">คำค้นยอดนิยม:</span>
            {["กีตาร์โปร่ง", "รังผึ้ง", "ลูกบาสเกตบอล", "ดอกทานตะวัน", "รุ้งกินน้ำ", "ฟองสบู่"].map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleSearch(undefined, keyword)}
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
