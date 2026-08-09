"use client";

import { useState } from "react";
import { Cpu, Play, RotateCcw, Sliders, Box, Activity, Eye, Layers, ChevronRight, Zap, Flame, ShieldAlert } from "lucide-react";

/**
 * Interface สำหรับ Preset Simulation (Mock UI Data)
 */
interface SimulationPreset {
  id: string;
  name: string;
  subject: string;
  category: string;
  description: string;
  defaultParams: {
    param1: { label: string; value: number; min: number; max: number; step: number; unit: string };
    param2: { label: string; value: number; min: number; max: number; step: number; unit: string };
    param3: { label: string; value: number; min: number; max: number; step: number; unit: string };
  };
  iconColor: string;
}

const simulationPresets: SimulationPreset[] = [
  {
    id: "pendulum",
    name: "การแกว่งของลูกตุ้มนาฬิกา (Simple Pendulum)",
    subject: "ฟิสิกส์ ม.4",
    category: "การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย",
    description: "ศึกษาสอบทานความสัมพันธ์ระหว่างความยาวสายมวล และคาบการแกว่งภายใต้แรงโน้มถ่วงธรรมชาติ",
    defaultParams: {
      param1: { label: "ความยาวสาย (L)", value: 1.5, min: 0.2, max: 5.0, step: 0.1, unit: "เมตร" },
      param2: { label: "มวลลูกตุ้ม (m)", value: 0.5, min: 0.1, max: 2.0, step: 0.1, unit: "กก." },
      param3: { label: "มุมปล่อย (θ)", value: 30, min: 5, max: 80, step: 5, unit: "องศา" },
    },
    iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  },
  {
    id: "circuit",
    name: "วงจรไฟฟ้ากระแสตรงเบื้องต้น (DC Circuit)",
    subject: "ฟิสิกส์ ม.5",
    category: "ไฟฟ้าและแม่เหล็ก",
    description: "ทดลองต่อตัวต้านทานแบบอนุกรมและขนาน วัดกระแสไฟฟ้า (I) และความต่างศักย์ (V) ตามกฎของโอห์ม",
    defaultParams: {
      param1: { label: "แรงดันแบตเตอรี่ (V)", value: 12, min: 1, max: 48, step: 1, unit: "โวลต์" },
      param2: { label: "ความต้านทาน R1", value: 10, min: 1, max: 100, step: 1, unit: "โอห์ม" },
      param3: { label: "ความต้านทาน R2", value: 20, min: 1, max: 100, step: 1, unit: "โอห์ม" },
    },
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    id: "sound-wave",
    name: "คลื่นเสียงและการกำทอน (Sound Wave Resonance)",
    subject: "ฟิสิกส์ ม.5",
    category: "คลื่นและทัศนศาสตร์",
    description: "ปรับความถี่คลื่นเสียงในท่อเรโซแนนซ์ เพื่อสังเกตตำแหน่งโหนด (Node) และแอนติโหนด (Antinode)",
    defaultParams: {
      param1: { label: "ความถี่เสียง (f)", value: 440, min: 100, max: 2000, step: 10, unit: "Hz" },
      param2: { label: "ความยาวท่อ (L)", value: 1.0, min: 0.1, max: 3.0, step: 0.1, unit: "เมตร" },
      param3: { label: "อุณหภูมิอากาศ (T)", value: 25, min: 0, max: 50, step: 1, unit: "°C" },
    },
    iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  {
    id: "projectile",
    name: "การเคลื่อนที่แบบโพรเจกไทล์ (Projectile Motion)",
    subject: "ฟิสิกส์ ม.4",
    category: "กลศาสตร์ ม.ปลาย",
    description: "จำลองยิงวัตถุกลางอากาศ ปรับความเร็วต้นและมุมยิง เพื่อดูระยะทางสูงสุดและเวลาที่ลอยในอากาศ",
    defaultParams: {
      param1: { label: "ความเร็วต้น (u)", value: 25, min: 5, max: 100, step: 1, unit: "m/s" },
      param2: { label: "มุมทำกับแนวระดับ (θ)", value: 45, min: 0, max: 90, step: 1, unit: "องศา" },
      param3: { label: "แรงต้านอากาศ (Cd)", value: 0.1, min: 0.0, max: 1.0, step: 0.05, unit: "ratio" },
    },
    iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
];

/**
 * หน้า Simulation Hub (src/app/simulation/page.tsx)
 * หน้านี้ทำเฉพาะ UI/UX เท่านั้น มี preset list, 3D viewer placeholder frame
 * และ Control Panel ปรับตัวแปร (useState เก็บค่าแสดงบนหน้าจอ ไม่มีการคำนวณจริง)
 */
export default function SimulationPage() {
  // เลือก Preset ปัจจุบัน
  const [activePreset, setActivePreset] = useState<SimulationPreset>(simulationPresets[0]);

  // useState เก็บค่าตัวแปรใน Control Panel สำหรับแสดงผลบน UI
  const [val1, setVal1] = useState<number>(activePreset.defaultParams.param1.value);
  const [val2, setVal2] = useState<number>(activePreset.defaultParams.param2.value);
  const [val3, setVal3] = useState<number>(activePreset.defaultParams.param3.value);

  // useState จำลองสถานะ Play / Pause
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // เปลี่ยน Preset และรีเซ็ตค่าตัวแปรตาม default
  const handleSelectPreset = (preset: SimulationPreset) => {
    setActivePreset(preset);
    setVal1(preset.defaultParams.param1.value);
    setVal2(preset.defaultParams.param2.value);
    setVal3(preset.defaultParams.param3.value);
    setIsPlaying(false);
  };

  // รีเซ็ตค่าตัวแปรกลับเป็นค่าเริ่มต้น
  const handleResetParams = () => {
    setVal1(activePreset.defaultParams.param1.value);
    setVal2(activePreset.defaultParams.param2.value);
    setVal3(activePreset.defaultParams.param3.value);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-bold mb-2">
              <Cpu className="w-4 h-4" />
              Interactive Simulation Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ห้องปฏิบัติการจำลอง <span className="text-sky-400">3D Interactive</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              ทดลองปรับตัวแปรทางฟิสิกส์และคณิตศาสตร์เพื่อสังเกตผลลัพธ์แบบเรียลไทม์ (UI Mockup Frame)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              WebGL Ready Frame
            </span>
          </div>
        </div>

        {/* Preset Cards Selector Bar */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            เลือกแบบจำลองการทดลอง (Presets)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {simulationPresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/30"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${preset.iconColor}`}>
                        {preset.subject}
                      </span>
                      {isSelected && <ChevronRight className="w-4 h-4 text-sky-400" />}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {preset.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>หมวด: {preset.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Work Area: 3D Viewer Frame + Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3D Canvas Viewer Placeholder Frame (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between p-6">
              
              {/* Tech Background Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

              {/* Canvas Top Status Bar */}
              <div className="relative z-10 flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{activePreset.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">3D Viewport • Resolution 1080p</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {isPlaying ? "STATUS: RUNNING" : "STATUS: PAUSED"}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-300">
                    60 FPS
                  </span>
                </div>
              </div>

              {/* Center Canvas Mock Graphic Placeholder */}
              <div className="relative z-10 my-10 text-center flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-sky-500/40 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-orange-500/40 animate-[spin_10s_linear_infinite_reverse]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className={`w-10 h-10 ${isPlaying ? "text-orange-400 animate-bounce" : "text-sky-400"}`} />
                  </div>
                </div>

                <div className="max-w-md bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-slate-300 text-xs shadow-xl space-y-1">
                  <p className="font-bold text-sky-400">พื้นที่สำหรับ WebGL 3D Viewer</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    ตรงนี้เว้นไว้สำหรับทีมอื่นนำไลบรารี Three.js หรือ WebGL มาเรนเดอร์แบบจำลอง 3D โต้ตอบในภายหลัง
                  </p>
                </div>
              </div>

              {/* Canvas Bottom Interactive Control Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                
                {/* Play / Pause Toggle Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                      isPlaying
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                        : "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:opacity-95 shadow-orange-500/20"
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current stroke-[2]" />
                    <span>{isPlaying ? "หยุดชั่วคราว (Pause)" : "เริ่มการจำลอง (Play)"}</span>
                  </button>

                  <button
                    onClick={handleResetParams}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="รีเซ็ตค่าเริ่มต้น"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* View Controls Mock Buttons */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>มุมมองกล้อง 3D</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300">
                    รีเซ็ตมุมมอง
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* Control Panel (1 Col) */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-extrabold text-white">แผงควบคุมตัวแปร</h3>
                </div>
                <button
                  onClick={handleResetParams}
                  className="text-xs font-bold text-orange-400 hover:underline"
                >
                  คืนค่าเดิม
                </button>
              </div>

              {/* Sliders Form UI */}
              <div className="space-y-5">
                
                {/* Param 1 Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{activePreset.defaultParams.param1.label}</span>
                    <span className="text-sky-400 font-mono">
                      {val1} {activePreset.defaultParams.param1.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activePreset.defaultParams.param1.min}
                    max={activePreset.defaultParams.param1.max}
                    step={activePreset.defaultParams.param1.step}
                    value={val1}
                    onChange={(e) => setVal1(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{activePreset.defaultParams.param1.min}</span>
                    <span>{activePreset.defaultParams.param1.max}</span>
                  </div>
                </div>

                {/* Param 2 Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{activePreset.defaultParams.param2.label}</span>
                    <span className="text-sky-400 font-mono">
                      {val2} {activePreset.defaultParams.param2.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activePreset.defaultParams.param2.min}
                    max={activePreset.defaultParams.param2.max}
                    step={activePreset.defaultParams.param2.step}
                    value={val2}
                    onChange={(e) => setVal2(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{activePreset.defaultParams.param2.min}</span>
                    <span>{activePreset.defaultParams.param2.max}</span>
                  </div>
                </div>

                {/* Param 3 Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{activePreset.defaultParams.param3.label}</span>
                    <span className="text-sky-400 font-mono">
                      {val3} {activePreset.defaultParams.param3.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={activePreset.defaultParams.param3.min}
                    max={activePreset.defaultParams.param3.max}
                    step={activePreset.defaultParams.param3.step}
                    value={val3}
                    onChange={(e) => setVal3(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{activePreset.defaultParams.param3.min}</span>
                    <span>{activePreset.defaultParams.param3.max}</span>
                  </div>
                </div>

              </div>

              {/* State Values Display Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Activity className="w-3.5 h-3.5 text-orange-400" />
                  <span>ค่าตัวแปรใน State ปัจจุบัน (UI Only):</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 text-xs font-mono text-emerald-400 space-y-1">
                  <p>param1: {val1} {activePreset.defaultParams.param1.unit}</p>
                  <p>param2: {val2} {activePreset.defaultParams.param2.unit}</p>
                  <p>param3: {val3} {activePreset.defaultParams.param3.unit}</p>
                  <p className="text-slate-500 text-[10px] pt-1">isPlaying: {isPlaying ? "true" : "false"}</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
