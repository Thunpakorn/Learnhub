"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    Compass,
    Atom,
    Calculator,
    Dna,
    Flame,
    Music,
    Trophy,
    Leaf,
    Gamepad2,
    Utensils,
    CheckCircle2,
    ArrowRight,
    RotateCcw,
    Check,
    ShieldAlert,
} from "lucide-react";

interface InterestItem {
    id: string;
    category: "subjects" | "everyday";
    title: string;
    subtitle: string;
    icon: React.ElementType;
    gradient: string;
    tagColor: string;
    borderActive: string;
}

const INTEREST_ITEMS: InterestItem[] = [
    // หมวดวิชาหลัก (Core Subjects)
    {
        id: "physics",
        category: "subjects",
        title: "ฟิสิกส์ (Physics)",
        subtitle: "คลื่น, เสียง, แสง, กลศาสตร์, แรงและการเคลื่อนที่",
        icon: Atom,
        gradient: "from-sky-500/20 via-sky-500/5 to-transparent",
        tagColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
        borderActive: "border-sky-500/60 shadow-sky-500/10",
    },
    {
        id: "math",
        category: "subjects",
        title: "คณิตศาสตร์ (Mathematics)",
        subtitle: "เรขาคณิต, ทฤษฎีพื้นที่, ฟังก์ชัน, สมการ และสถิติ",
        icon: Calculator,
        gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
        tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
        borderActive: "border-purple-500/60 shadow-purple-500/10",
    },
    {
        id: "biology",
        category: "subjects",
        title: "ชีววิทยา (Biology)",
        subtitle: "ธรรมชาติ, โครงสร้างสิ่งมีชีวิต, สังเคราะห์แสง, พฤกษศาสตร์",
        icon: Dna,
        gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        borderActive: "border-emerald-500/60 shadow-emerald-500/10",
    },
    {
        id: "chemistry",
        category: "subjects",
        title: "เคมี (Chemistry)",
        subtitle: "สารในชีวิตประจำวัน, ปฏิกิริยาเคมี, โมเลกุล, แรงตึงผิว",
        icon: Flame,
        gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
        tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        borderActive: "border-rose-500/60 shadow-rose-500/10",
    },

    // หมวดหัวข้อในชีวิตประจำวัน (Everyday Topics)
    {
        id: "music-sound",
        category: "everyday",
        title: "ดนตรีและเสียง",
        subtitle: "คลื่นความถี่ในสายกีตาร์, ความถี่คลื่นนิ่ง, การกำทอน",
        icon: Music,
        gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
        tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        borderActive: "border-amber-500/60 shadow-amber-500/10",
    },
    {
        id: "sports-motion",
        category: "everyday",
        title: "กีฬาและการเคลื่อนที่",
        subtitle: "วิถีโค้งพาราโบลาในบาสเกตบอล, การยิงโพรเจกไทล์, แรงโน้มถ่วง",
        icon: Trophy,
        gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
        tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
        borderActive: "border-orange-500/60 shadow-orange-500/10",
    },
    {
        id: "nature-patterns",
        category: "everyday",
        title: "ธรรมชาติและรูปทรง",
        subtitle: "ลำดับฟีโบนักชีในดอกทานตะวัน, โครงสร้างหกเหลี่ยมรังผึ้ง",
        icon: Leaf,
        gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
        tagColor: "text-teal-400 bg-teal-500/10 border-teal-500/30",
        borderActive: "border-teal-500/60 shadow-teal-500/10",
    },
    {
        id: "phenomena",
        category: "everyday",
        title: "ปรากฏการณ์ธรรมชาติ",
        subtitle: "การหักเหแสงในรุ้งกินน้ำ, การแทรกสอดฟิล์มบางบนฟองสบู่",
        icon: Compass,
        gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
        tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        borderActive: "border-cyan-500/60 shadow-cyan-500/10",
    },
    {
        id: "tech-gaming",
        category: "everyday",
        title: "เทคโนโลยีและเกม",
        subtitle: "เอนจินจำลองฟิสิกส์ในเกม, กราฟิกคอมพิวเตอร์, AI และโค้ดดิ้ง",
        icon: Gamepad2,
        gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
        tagColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
        borderActive: "border-indigo-500/60 shadow-indigo-500/10",
    },
    {
        id: "food-cooking",
        category: "everyday",
        title: "อาหารและการปรุง",
        subtitle: "เคมีของการเกิดปฏิกิริยาทำอาหาร, การถ่ายโอนความร้อน",
        icon: Utensils,
        gradient: "from-yellow-500/20 via-yellow-500/5 to-transparent",
        tagColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        borderActive: "border-yellow-500/60 shadow-yellow-500/10",
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([
        "physics",
        "sports-motion",
    ]);
    const [isDone, setIsDone] = useState(false);

    // Guard: ป้องกันไม่ให้ผู้ใช้ย้อนกลับมาทำหน้าเลือกความสนใจซ้ำได้
    useEffect(() => {
        if (typeof window !== "undefined") {
            const onboardingCompleted = sessionStorage.getItem("learnhub_onboarding_completed");
            if (onboardingCompleted === "true") {
                setIsDone(true);
                router.replace("/discovery");
            }
        }
    }, [router]);

    const toggleInterest = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedIds(INTEREST_ITEMS.map((item) => item.id));
    };

    const clearAll = () => {
        setSelectedIds([]);
    };

    const handleNext = () => {
        // บันทึกสถานะว่าทำ Onboarding เรียบร้อยแล้ว (ทำได้แค่ครั้งเดียว)
        if (typeof window !== "undefined") {
            sessionStorage.setItem("learnhub_onboarding_completed", "true");
        }
        // ใช้ router.replace เพื่อแทนที่ประวัติ ไม่ให้กดย้อนกลับ (Back) กลับมาหน้านี้ได้อีก
        router.replace("/discovery");
    };

    if (isDone) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <ShieldAlert className="w-12 h-12 text-orange-400 mb-3 animate-pulse" />
                <p className="text-base font-semibold text-white">กำลังนำท่านเข้าสู่ LearnHub Discovery...</p>
                <p className="text-xs text-slate-500 mt-1">ไม่อนุญาตให้แก้ไขข้อมูลย้อนหลัง</p>
            </div>
        );
    }

    const coreSubjects = INTEREST_ITEMS.filter((item) => item.category === "subjects");
    const everydayTopics = INTEREST_ITEMS.filter((item) => item.category === "everyday");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-bold shadow-md">
                        <Sparkles className="w-4 h-4" />
                        Step 2: เลือกความสนใจของคุณ
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                        จากห้องเรียนสู่สิ่งรอบตัว{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
                            คุณสนใจเรื่องไหนเป็นพิเศษ?
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        เลือกหัวข้อวิทย์-คณิตที่คุณสนใจ เพื่อปรับแต่งบทเรียนให้ตรงกับความต้องการของคุณก่อนเริ่มเรียนรู้
                    </p>
                </div>

                {/* Toolbar Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 font-bold text-sm border border-orange-500/20">
                            {selectedIds.length}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                เลือกแล้ว {selectedIds.length} จาก {INTEREST_ITEMS.length} หัวข้อ
                            </p>
                            <p className="text-xs text-slate-400">
                                {selectedIds.length === 0
                                    ? "โปรดเลือกความสนใจอย่างน้อย 1 เรื่อง"
                                    : "กดถัดไปเพื่อเริ่มสำรวจคณิต-วิทย์ในชีวิตประจำวัน"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={selectAll}
                            type="button"
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                            เลือกทั้งหมด
                        </button>
                        {selectedIds.length > 0 && (
                            <button
                                onClick={clearAll}
                                type="button"
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-transparent hover:border-rose-800/40 transition-colors flex items-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                ล้างการเลือก
                            </button>
                        )}
                    </div>
                </div>

                {/* Category 1: Core Subjects */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                        <Atom className="w-4 h-4 text-orange-400" />
                        <span>1. หมวดวิชาหลัก (Core Subjects)</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {coreSubjects.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            const IconComponent = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => toggleInterest(item.id)}
                                    className={`group relative text-left rounded-3xl p-5 border backdrop-blur-xl transition-all duration-200 cursor-pointer overflow-hidden ${isSelected
                                            ? `bg-slate-900/90 ${item.borderActive} shadow-lg`
                                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                                        }`}
                                >
                                    {isSelected && (
                                        <div
                                            className={`absolute -inset-1 bg-gradient-to-br ${item.gradient} opacity-50 blur-xl pointer-events-none`}
                                        />
                                    )}

                                    <div className="relative space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${isSelected
                                                        ? item.tagColor
                                                        : "bg-slate-800/60 border-slate-700 text-slate-400 group-hover:text-white"
                                                    }`}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </div>

                                            <div
                                                className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${isSelected
                                                        ? "bg-orange-500 border-orange-400 text-slate-950 shadow-md shadow-orange-500/20 scale-105"
                                                        : "border-slate-700 bg-slate-800/40 text-transparent group-hover:border-slate-500"
                                                    }`}
                                            >
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 leading-relaxed mt-1">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Category 2: Everyday Topics */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>2. หัวข้อในชีวิตประจำวัน (Everyday Topics)</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {everydayTopics.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            const IconComponent = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => toggleInterest(item.id)}
                                    className={`group relative text-left rounded-3xl p-5 border backdrop-blur-xl transition-all duration-200 cursor-pointer overflow-hidden ${isSelected
                                            ? `bg-slate-900/90 ${item.borderActive} shadow-lg`
                                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                                        }`}
                                >
                                    {isSelected && (
                                        <div
                                            className={`absolute -inset-1 bg-gradient-to-br ${item.gradient} opacity-50 blur-xl pointer-events-none`}
                                        />
                                    )}

                                    <div className="relative space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${isSelected
                                                        ? item.tagColor
                                                        : "bg-slate-800/60 border-slate-700 text-slate-400 group-hover:text-white"
                                                    }`}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </div>

                                            <div
                                                className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${isSelected
                                                        ? "bg-orange-500 border-orange-400 text-slate-950 shadow-md shadow-orange-500/20 scale-105"
                                                        : "border-slate-700 bg-slate-800/40 text-transparent group-hover:border-slate-500"
                                                    }`}
                                            >
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 leading-relaxed mt-1">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* Floating Bottom Action Bar */}
            <div className="fixed bottom-0 inset-x-0 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-2xl py-4 px-4 sm:px-6 lg:px-8 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs sm:text-sm text-slate-300 font-medium">
                            เมื่อกดถัดไปแล้ว ข้อมูลจะถูกบันทึกและไม่สามารถย้อนกลับมาแก้ไขได้
                        </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <span className="sm:hidden text-xs text-slate-400">
                            เลือกแล้ว {selectedIds.length} รายการ
                        </span>

                        <button
                            onClick={handleNext}
                            type="button"
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 ml-auto"
                        >
                            <span>ถัดไป</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
