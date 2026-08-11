"use client";

import { useEffect, useState } from "react";
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Activity,
  Eye,
  Layers,
  ChevronRight,
  Sparkles,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  Atom,
  Calculator as MathIcon,
} from "lucide-react";

const DEG = Math.PI / 180;

interface SliderParam {
  key: string;
  type: "slider";
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}
interface SelectParam {
  key: string;
  type: "select";
  label: string;
  value: string;
  options: { label: string; value: string }[];
}
type ParamConfig = SliderParam | SelectParam;

interface SimulationPreset {
  id: string;
  name: string;
  subject: "ฟิสิกส์" | "คณิตศาสตร์";
  category: string;
  everyday: string;
  emoji: string;
  description: string;
  observation: string;
  iconColor: string;
  badgeBg: string;
  glowColor: string;
  params: ParamConfig[];
}

const presets: SimulationPreset[] = [
  {
    id: "pendulum",
    name: "การแกว่งแบบฮาร์มอนิก (SHM)",
    subject: "ฟิสิกส์",
    category: "การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย",
    everyday: "นาฬิกาลูกตุ้ม, ชิงช้าเด็กเล่น",
    emoji: "🕰️",
    description: "ศึกษาความสัมพันธ์ระหว่างความยาวเชือก มุมเริ่มต้น และค่า g กับคาบการแกว่ง",
    observation: "คาบการแกว่งเปลี่ยนตามความยาวเชือก แต่ไม่เปลี่ยนตามมุมเริ่มต้น",
    iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    badgeBg: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    glowColor: "rgba(56, 189, 248, 0.15)",
    params: [
      { key: "L", type: "slider", label: "ความยาวเชือก (L)", value: 1.5, min: 0.3, max: 3, step: 0.1, unit: "ม." },
      { key: "angle", type: "slider", label: "มุมเริ่มต้น (θ)", value: 30, min: 5, max: 70, step: 5, unit: "°" },
      {
        key: "g",
        type: "select",
        label: "ค่า g (แรงโน้มถ่วง)",
        value: "earth",
        options: [
          { label: "โลก (9.8)", value: "earth" },
          { label: "ดวงจันทร์ (1.62)", value: "moon" },
          { label: "ดาวอังคาร (3.71)", value: "mars" },
        ],
      },
    ],
  },
  {
    id: "projectile",
    name: "การเคลื่อนที่แบบโพรเจกไทล์",
    subject: "ฟิสิกส์",
    category: "กลศาสตร์ ม.ปลาย",
    everyday: "ขว้างบอล, ยิงจรวดน้ำ, เตะฟุตบอล",
    emoji: "🏀",
    description: "ปรับความเร็วต้นและมุมยิง เพื่อดูวิถีโค้งพาราโบลาและระยะไกลสุด",
    observation: "ระยะไกลสุดเกิดที่มุม 45° เสมอ ไม่ว่าความเร็วต้นเท่าไร",
    iconColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    badgeBg: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    glowColor: "rgba(249, 115, 22, 0.15)",
    params: [
      { key: "u", type: "slider", label: "ความเร็วต้น (u)", value: 20, min: 5, max: 40, step: 1, unit: "m/s" },
      { key: "angle", type: "slider", label: "มุมยิง (θ)", value: 45, min: 5, max: 85, step: 1, unit: "°" },
    ],
  },
  {
    id: "guitar",
    name: "คลื่นเสียงและความถี่",
    subject: "ฟิสิกส์",
    category: "คลื่นและเสียง",
    everyday: "สายกีตาร์, หลอดดูดเป่าเสียง",
    emoji: "🎸",
    description: "ปรับความยาวสายและแรงตึงสาย เพื่อดูว่าความถี่เสียง (โน้ต) เปลี่ยนไปอย่างไร",
    observation: "ความถี่เสียง (โน้ต) เปลี่ยนตามความยาว/แรงตึงสาย",
    iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    badgeBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    glowColor: "rgba(168, 85, 247, 0.15)",
    params: [
      { key: "L", type: "slider", label: "ความยาวสาย (L)", value: 0.65, min: 0.3, max: 1.0, step: 0.05, unit: "ม." },
      { key: "T", type: "slider", label: "แรงตึงสาย (T)", value: 80, min: 20, max: 150, step: 5, unit: "N" },
    ],
  },
  {
    id: "refraction",
    name: "การหักเหของแสง (กฎสเนล)",
    subject: "ฟิสิกส์",
    category: "ทัศนศาสตร์",
    everyday: "หลอดดูดที่ดูงอในแก้วน้ำ, เลนส์แว่นตา",
    emoji: "🌈",
    description: "ปรับมุมตกกระทบและชนิดตัวกลาง เพื่อดูมุมหักเหของแสง",
    observation: "มุมหักเหเปลี่ยนตามความหนาแน่นตัวกลาง",
    iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    badgeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    glowColor: "rgba(6, 182, 212, 0.15)",
    params: [
      { key: "angle", type: "slider", label: "มุมตกกระทบ (θ₁)", value: 30, min: 5, max: 80, step: 1, unit: "°" },
      {
        key: "medium",
        type: "select",
        label: "ชนิดตัวกลาง (จากอากาศเข้าสู่...)",
        value: "water",
        options: [
          { label: "น้ำ (n=1.33)", value: "water" },
          { label: "แก้ว (n=1.5)", value: "glass" },
          { label: "เพชร (n=2.42)", value: "diamond" },
        ],
      },
    ],
  },
  {
    id: "trig",
    name: "ฟังก์ชันตรีโกณมิติ",
    subject: "คณิตศาสตร์",
    category: "ฟังก์ชันตรีโกณมิติ",
    everyday: "ล้อชิงช้าสวรรค์หมุน, คลื่นทะเล",
    emoji: "🎡",
    description: "ปรับแอมพลิจูด ความถี่ และเฟส เพื่อดูรูปร่างกราฟ sin ที่เปลี่ยนไป",
    observation: "รูปร่างกราฟ sin/cos เปลี่ยนตามค่าที่ปรับ",
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.15)",
    params: [
      { key: "A", type: "slider", label: "แอมพลิจูด (A)", value: 1.5, min: 0.5, max: 3, step: 0.1, unit: "" },
      { key: "k", type: "slider", label: "ความถี่เชิงมุม (k)", value: 1, min: 0.5, max: 3, step: 0.1, unit: "" },
      { key: "phase", type: "slider", label: "เฟส (φ)", value: 0, min: 0, max: 360, step: 15, unit: "°" },
    ],
  },
  {
    id: "derivative",
    name: "อนุพันธ์ (อัตราการเปลี่ยนแปลง)",
    subject: "คณิตศาสตร์",
    category: "แคลคูลัสเบื้องต้น",
    everyday: "ความเร็วรถ ณ ขณะหนึ่ง (speedometer)",
    emoji: "🚗",
    description: "เลื่อนจุดบนกราฟระยะทาง-เวลา s(t) = t² เพื่อดูเส้นสัมผัส (ความเร็วขณะนั้น)",
    observation: "เส้นสัมผัส (tangent) เปลี่ยนความชันตามจุดที่เลือก",
    iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.15)",
    params: [
      { key: "x0", type: "slider", label: "ตำแหน่งเวลา (t)", value: 4, min: 0.5, max: 9.5, step: 0.5, unit: "s" },
    ],
  },
  {
    id: "shadow",
    name: "เงาต้นไม้กับดวงอาทิตย์ (สามเหลี่ยมคล้าย)",
    subject: "คณิตศาสตร์",
    category: "อัตราส่วนตรีโกณมิติเบื้องต้น",
    everyday: "เงาต้นไม้/เสาธงตอนเช้า-เที่ยง-เย็น",
    emoji: "🌳",
    description: "ปรับความสูงต้นไม้และมุมดวงอาทิตย์ เพื่อดูว่าความยาวเงาเปลี่ยนไปอย่างไร",
    observation: "เงายาวเมื่อดวงอาทิตย์อยู่ต่ำ (มุมน้อย) และเงาสั้นเมื่อดวงอาทิตย์อยู่สูง (มุมมาก)",
    iconColor: "text-lime-400 bg-lime-500/10 border-lime-500/30",
    badgeBg: "bg-lime-500/15 text-lime-300 border-lime-500/30",
    glowColor: "rgba(132, 204, 22, 0.15)",
    params: [
      { key: "height", type: "slider", label: "ความสูงต้นไม้ (h)", value: 4, min: 1, max: 10, step: 0.5, unit: "ม." },
      { key: "sunAngle", type: "slider", label: "มุมดวงอาทิตย์เหนือขอบฟ้า", value: 45, min: 10, max: 80, step: 5, unit: "°" },
    ],
  },
  {
    id: "probability",
    name: "ความน่าจะเป็น (กฎจำนวนมาก)",
    subject: "คณิตศาสตร์",
    category: "ความน่าจะเป็นและสถิติ",
    everyday: "ทอยลูกเต๋า, เกมไพ่",
    emoji: "🎲",
    description: "สุ่มทอยลูกเต๋าจริงต่อเนื่อง แล้วดูว่าค่าเฉลี่ยลู่เข้าค่าคาดหวังทางทฤษฎีอย่างไร",
    observation: "กราฟผลลัพธ์ลู่เข้าค่าคาดหวังทางทฤษฎีเมื่อสุ่มมากขึ้น (กฎจำนวนมาก)",
    iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    badgeBg: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    glowColor: "rgba(244, 63, 94, 0.15)",
    params: [
      {
        key: "speed",
        type: "select",
        label: "จำนวนครั้งที่สุ่มต่อรอบ",
        value: "1",
        options: [
          { label: "ทีละ 1 ครั้ง", value: "1" },
          { label: "ทีละ 10 ครั้ง", value: "10" },
          { label: "ทีละ 50 ครั้ง", value: "50" },
        ],
      },
    ],
  },
];

const G_MAP: Record<string, number> = { earth: 9.8, moon: 1.62, mars: 3.71 };
const G_LABEL: Record<string, string> = { earth: "โลก", moon: "ดวงจันทร์", mars: "ดาวอังคาร" };
const MEDIUM_MAP: Record<string, { n: number; label: string; color: string }> = {
  water: { n: 1.33, label: "น้ำ", color: "#38bdf8" },
  glass: { n: 1.5, label: "แก้ว", color: "#94a3b8" },
  diamond: { n: 2.42, label: "เพชร", color: "#a5b4fc" },
};

function DicePips({ value }: { value: number }) {
  const layout: Record<number, [number, number][]> = {
    1: [[17, 17]],
    2: [[9, 9], [25, 25]],
    3: [[9, 9], [17, 17], [25, 25]],
    4: [[9, 9], [25, 9], [9, 25], [25, 25]],
    5: [[9, 9], [25, 9], [17, 17], [9, 25], [25, 25]],
    6: [[9, 9], [25, 9], [9, 17], [25, 17], [9, 25], [25, 25]],
  };
  return (
    <>
      {(layout[value] || []).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill="#f8fafc" />
      ))}
    </>
  );
}

function initParams(preset: SimulationPreset): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  preset.params.forEach((p) => {
    out[p.key] = p.value;
  });
  return out;
}

export default function SimulationPage() {
  const [activePreset, setActivePreset] = useState<SimulationPreset>(presets[0]);
  const [paramValues, setParamValues] = useState<Record<string, number | string>>(initParams(presets[0]));
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [elapsed, setElapsed] = useState<number>(0);
  const [rolls, setRolls] = useState<number[]>([]);
  const [activeSubject, setActiveSubject] = useState<"all" | "ฟิสิกส์" | "คณิตศาสตร์">("all");

  const num = (key: string) => Number(paramValues[key]);
  const str = (key: string) => String(paramValues[key]);

  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setElapsed((e) => e + dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  useEffect(() => {
    if (activePreset.id !== "probability" || !isPlaying) return;
    const batch = num("speed") || 1;
    const id = setInterval(() => {
      setRolls((r) => {
        if (r.length >= 500) return r;
        const next = [...r];
        for (let i = 0; i < batch; i++) next.push(1 + Math.floor(Math.random() * 6));
        return next;
      });
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePreset.id, isPlaying, paramValues.speed]);

  const handleSelectPreset = (preset: SimulationPreset) => {
    setActivePreset(preset);
    setParamValues(initParams(preset));
    setIsPlaying(true);
    setElapsed(0);
    setRolls([]);
  };

  const handleResetParams = () => {
    setParamValues(initParams(activePreset));
    setIsPlaying(true);
    setElapsed(0);
    setRolls([]);
  };

  const setParam = (key: string, value: number | string) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
  };

  const filteredPresets = presets.filter(
    (p) => activeSubject === "all" || p.subject === activeSubject
  );

  function getComputed(): { stats: { label: string; value: string }[]; explain: string } {
    switch (activePreset.id) {
      case "pendulum": {
        const L = num("L");
        const g = G_MAP[str("g")];
        const T = 2 * Math.PI * Math.sqrt(L / g);
        return {
          stats: [
            { label: "คาบการแกว่ง (T)", value: `${T.toFixed(2)} วินาที` },
            { label: "บนดาว", value: G_LABEL[str("g")] },
          ],
          explain: `คาบการแกว่ง T = 2π√(L/g) = ${T.toFixed(2)} วินาที — สังเกตว่าคาบขึ้นกับความยาวเชือกและค่า g เท่านั้น ลองปรับ "มุมเริ่มต้น" ดูสิ คาบจะไม่เปลี่ยนเลย!`,
        };
      }
      case "projectile": {
        const u = num("u");
        const angle = num("angle") * DEG;
        const g = 9.8;
        const range = (u * u * Math.sin(2 * angle)) / g;
        const flight = (2 * u * Math.sin(angle)) / g;
        const maxH = (u * Math.sin(angle)) ** 2 / (2 * g);
        return {
          stats: [
            { label: "ระยะไกลสุด (R)", value: `${range.toFixed(1)} m` },
            { label: "ความสูงสุด", value: `${maxH.toFixed(1)} m` },
            { label: "เวลาลอยในอากาศ", value: `${flight.toFixed(2)} s` },
          ],
          explain: `ลูกบอลกำลังบินตามวิถีโค้งจริง ที่มุม ${num("angle")}° ไปได้ไกล ${range.toFixed(1)} เมตร (ห่วงบาสจะขยับตามระยะนี้เป๊ะๆ) — ลองปรับมุมไปที่ 45° ดูสิ จะได้ระยะไกลที่สุดเสมอ ไม่ว่าความเร็วต้นจะเป็นเท่าไร`,
        };
      }
      case "guitar": {
        const L = num("L");
        const T = num("T");
        const mu = 0.005;
        const f = (1 / (2 * L)) * Math.sqrt(T / mu);
        const pitchLabel = f < 120 ? "เสียงทุ้ม 🔉" : f < 260 ? "เสียงกลาง 🔊" : "เสียงแหลม 📯";
        return {
          stats: [
            { label: "ความถี่เสียง (f)", value: `${f.toFixed(1)} Hz` },
            { label: "โทนเสียง", value: pitchLabel },
          ],
          explain: `f = (1/2L)√(T/μ) = ${f.toFixed(1)} Hz (${pitchLabel}) — ลองดึงสายให้ตึงขึ้น (T) หรือกดสายให้สั้นลง (L) สายจะสั่นถี่ขึ้น มองเห็นได้จากคลื่นที่สั่นเร็วขึ้นในภาพ และเสียงจะสูงขึ้นตาม`,
        };
      }
      case "refraction": {
        const th1 = num("angle") * DEG;
        const m = MEDIUM_MAP[str("medium")];
        const sinTh2 = Math.min(1, Math.sin(th1) / m.n);
        const th2 = Math.asin(sinTh2) / DEG;
        return {
          stats: [
            { label: "มุมหักเห (θ₂)", value: `${th2.toFixed(1)}°` },
            { label: "ดัชนีหักเห", value: `n = ${m.n}` },
          ],
          explain: `เมื่อแสงเดินทางจากอากาศเข้าสู่${m.label} มุมหักเห = ${th2.toFixed(1)}° ซึ่งเล็กกว่ามุมตกกระทบเสมอ เพราะตัวกลางที่หนาแน่นกว่าทำให้แสงเบนเข้าใกล้เส้นปกติมากขึ้น`,
        };
      }
      case "trig": {
        const A = num("A");
        const k = num("k");
        const period = (2 * Math.PI) / k;
        return {
          stats: [
            { label: "คาบ (Period)", value: `${period.toFixed(2)}` },
            { label: "แอมพลิจูด", value: `${A}` },
          ],
          explain: `กระเช้าสีเหลืองบนล้อชิงช้าสวรรค์กำลังหมุน ความสูงของมันตอนนี้คือค่าเดียวกับจุดซ้ายสุดของคลื่นสีฟ้าทางขวาเป๊ะๆ (เส้นประลากเชื่อมให้ดู) — เมื่อล้อหมุนครบรอบ คลื่นก็จะไหลผ่านไปครบ 1 คาบ ลอง: A ทำให้คลื่นสูง/เตี้ย, k ทำให้คลื่นถี่ขึ้น, φ เลื่อนจุดเริ่มต้นของคลื่น`,
        };
      }
      case "derivative": {
        const x0 = isPlaying ? elapsed % 10 : num("x0");
        const y0 = x0 * x0;
        const slope = 2 * x0;
        return {
          stats: [
            { label: "เวลา (t)", value: `${x0.toFixed(1)} วินาที` },
            { label: "ระยะทางที่วิ่งไปแล้ว", value: `${y0.toFixed(1)} ม.` },
            { label: "ความเร็วขณะนี้", value: `${slope.toFixed(1)} m/s` },
          ],
          explain: `รถคันนี้วิ่งตามสูตร s(t) = t² (ยิ่งเวลาผ่านไป ยิ่งวิ่งเร็วขึ้น) ที่วินาทีที่ ${x0.toFixed(1)} รถวิ่งไปแล้ว ${y0.toFixed(1)} เมตร และกำลังวิ่งด้วยความเร็ว ${slope.toFixed(1)} m/s — ความเร็วนี้คือ "ความชัน" ของเส้นสัมผัสบนกราฟ (สีส้ม) กด "หยุดชั่วคราว" แล้วเลื่อนแถบเลื่อนเองเพื่อดูจุดที่สนใจ`,
        };
      }
      case "shadow": {
        const h = num("height");
        const angle = num("sunAngle") * DEG;
        const shadow = h / Math.tan(angle);
        return {
          stats: [
            { label: "ความยาวเงา", value: `${shadow.toFixed(1)} ม.` },
            { label: "ความสูงต้นไม้", value: `${h} ม.` },
          ],
          explain: `เงา = ความสูง ÷ tan(มุม) = ${h} ÷ tan(${num("sunAngle")}°) = ${shadow.toFixed(1)} เมตร — ตอนเช้า/เย็นดวงอาทิตย์อยู่ต่ำ (มุมน้อย) เงาจะทอดยาวมาก ส่วนตอนเที่ยงดวงอาทิตย์อยู่สูง (มุมมาก) เงาจะสั้นลง ลองลากมุมไปมาดูสิ!`,
        };
      }
      case "probability": {
        const avg = rolls.length ? rolls.reduce((a, b) => a + b, 0) / rolls.length : 0;
        return {
          stats: [
            { label: "จำนวนครั้งที่สุ่ม", value: `${rolls.length}` },
            { label: "ค่าเฉลี่ยปัจจุบัน", value: rolls.length ? avg.toFixed(2) : "-" },
          ],
          explain: rolls.length
            ? `สุ่มไปแล้ว ${rolls.length} ครั้ง — สังเกตแท่งกราฟแต่ละหน้า (1-6) ตอนแรกจะสูงต่ำไม่เท่ากัน แต่ยิ่งสุ่มมากขึ้น แท่งทั้ง 6 จะค่อยๆ สูงใกล้เคียงกันที่เส้นประ (1/6 ของทั้งหมด) นี่คือ "กฎจำนวนมาก"`
            : `กด "เริ่มการจำลอง" เพื่อเริ่มทอยลูกเต๋าแบบสุ่มจริง แล้วดูว่าแท่งกราฟแต่ละหน้าจะค่อยๆ สูงเท่ากันได้อย่างไร`,
        };
      }
      default:
        return { stats: [], explain: "" };
    }
  }

  /** วาดภาพจำลองแบบ Real-Life Photorealistic SVG (ฉากหลังภาพจริง + เลเยอร์เวกเตอร์ตอบสนอง) */
  function renderVisual() {
    switch (activePreset.id) {
      case "pendulum": {
        const L = num("L");
        const g = G_MAP[str("g")];
        const angleMax = num("angle") * DEG;
        const T = 2 * Math.PI * Math.sqrt(L / g);
        const angle = isPlaying ? angleMax * Math.cos((2 * Math.PI * elapsed) / T) : angleMax;
        const pivot = { x: 180, y: 38 };
        const rodPx = 45 + L * 58;
        const bob = { x: pivot.x + rodPx * Math.sin(angle), y: pivot.y + rodPx * Math.cos(angle) };
        const leftGuide = { x: pivot.x + rodPx * Math.sin(-angleMax), y: pivot.y + rodPx * Math.cos(-angleMax) };
        const rightGuide = { x: pivot.x + rodPx * Math.sin(angleMax), y: pivot.y + rodPx * Math.cos(angleMax) };

        return (
          <svg viewBox="0 0 360 270" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            <defs>
              <radialGradient id="brassBob3D" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="25%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
            </defs>

            {/* ฉากหลังภาพตู้ไม้โบราณจริง Photorealistic Clock Cabinet Background */}
            <image href="/simulations/pendulum_clock_bg.png" x="0" y="0" width="360" height="270" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
            <rect x="0" y="0" width="360" height="270" fill="#000000" fillOpacity="0.2" />

            {/* มุมแกว่งสูงสุดซ้าย-ขวา */}
            <line x1={pivot.x} y1={pivot.y} x2={leftGuide.x} y2={leftGuide.y} stroke="#fbbf2466" strokeWidth={1.5} strokeDasharray="4 3" />
            <line x1={pivot.x} y1={pivot.y} x2={rightGuide.x} y2={rightGuide.y} stroke="#fbbf2466" strokeWidth={1.5} strokeDasharray="4 3" />

            {/* ก้านและหัวยึดทองเหลือง 3D Brass Rod & Pivot */}
            <line x1={pivot.x} y1={pivot.y} x2={bob.x} y2={bob.y} stroke="#fef3c7" strokeWidth={3} strokeLinecap="round" />
            <line x1={pivot.x} y1={pivot.y} x2={bob.x} y2={bob.y} stroke="#b45309" strokeWidth={1} />
            <circle cx={pivot.x} cy={pivot.y} r={6} fill="#fbbf24" stroke="#ffffff" strokeWidth={2} />

            {/* ลูกตุ้มทองเหลืองบริสุทธิ์ Real Brass Bob */}
            <circle cx={bob.x} cy={bob.y} r={21} fill="url(#brassBob3D)" stroke="#451a03" strokeWidth={1.5} />
            <circle cx={bob.x - 6} cy={bob.y - 7} r={6} fill="#ffffff" fillOpacity={0.8} />

            {/* ป้าย Telemetry สลักทองเหลือง */}
            <g transform="translate(15, 15)">
              <rect x={0} y={0} width={95} height={28} rx={6} fill="#0f172acc" stroke="#fbbf24" strokeWidth={1.5} />
              <text x={10} y={18} fill="#fef3c7" fontSize={11} fontWeight={800} fontFamily="mono">⏱️ T = {T.toFixed(2)}s</text>
            </g>
          </svg>
        );
      }
      case "projectile": {
        const u = num("u");
        const angle = num("angle") * DEG;
        const g = 9.8;
        const flight = (2 * u * Math.sin(angle)) / g || 0.01;
        const range = (u * u * Math.sin(2 * angle)) / g;
        const maxH = (u * Math.sin(angle)) ** 2 / (2 * g);
        const scaleX = 1.6;
        const scaleY = 1.9;
        const originX = 30;
        const groundY = 195;
        const pts: string[] = [];
        for (let i = 0; i <= 50; i++) {
          const t = (flight * i) / 50;
          const x = originX + u * Math.cos(angle) * t * scaleX;
          const y = groundY - u * Math.sin(angle) * t * scaleY + 0.5 * g * t * t * scaleY;
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const t = isPlaying ? elapsed % flight : flight / 2;
        const bx = originX + u * Math.cos(angle) * t * scaleX;
        const by = groundY - u * Math.sin(angle) * t * scaleY + 0.5 * g * t * t * scaleY;
        const hoopX = Math.min(originX + range * scaleX, 310);
        const apexX = originX + (u * Math.cos(angle) * (flight / 2)) * scaleX;
        const apexY = groundY - maxH * scaleY;

        return (
          <svg viewBox="0 0 360 240" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            <defs>
              <radialGradient id="realBball3D" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="30%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#431407" />
              </radialGradient>
            </defs>

            {/* ฉากหลังสนามบาสเกตบอลไม้จริง Photorealistic Basketball Court Background */}
            <image href="/simulations/basketball_court_bg.png" x="0" y="0" width="360" height="240" preserveAspectRatio="xMidYMid slice" opacity="0.9" />

            {/* แป้นและห่วงบาสเกตบอลอาชีพ Pro Basketball Stand */}
            <line x1={hoopX} y1={195} x2={hoopX} y2={135} stroke="#1e293b" strokeWidth={5} />
            <rect x={hoopX - 4} y={110} width={30} height={26} fill="#ffffff" fillOpacity={0.3} stroke="#f8fafc" strokeWidth={2} rx={2} />
            <rect x={hoopX + 2} y={120} width={18} height={12} fill="none" stroke="#ea580c" strokeWidth={2} />
            <ellipse cx={hoopX} cy={136} rx={15} ry={4.5} fill="none" stroke="#ea580c" strokeWidth={3.5} />

            {/* เส้นบอกระดับความสูงสุด H_max */}
            {maxH > 2 && apexX < 330 && (
              <g>
                <line x1={originX} y1={apexY} x2={apexX} y2={apexY} stroke="#fb923c" strokeWidth={1.5} strokeDasharray="3 3" />
                <text x={apexX + 5} y={apexY + 4} fontSize={9} fill="#f8fafc" fontWeight={800} fontFamily="mono">H = {maxH.toFixed(1)}m</text>
              </g>
            )}

            {/* วิถีโค้งพาราโบลา Trajectory Trail */}
            <polyline points={pts.join(" ")} fill="none" stroke="#f97316" strokeWidth={3} strokeDasharray="5 3" />

            {/* ลูกบาสเกตบอล 3D (ร่องดำ 4 เส้น + แสงสะท้อน + การหมุน Spin) */}
            <g transform={`translate(${bx}, ${by}) rotate(${isPlaying ? (elapsed * 280) % 360 : 0})`}>
              <circle cx={0} cy={0} r={11} fill="url(#realBball3D)" stroke="#431407" strokeWidth={1.8} />
              <line x1={-11} y1={0} x2={11} y2={0} stroke="#1e293b" strokeWidth={1.5} />
              <line x1={0} y1={-11} x2={0} y2={11} stroke="#1e293b" strokeWidth={1.5} />
              <path d="M -9 -6 Q -2 0 -9 6" stroke="#1e293b" strokeWidth={1.3} fill="none" />
              <path d="M 9 -6 Q 2 0 9 6" stroke="#1e293b" strokeWidth={1.3} fill="none" />
              <circle cx={-3.5} cy={-3.5} r={3} fill="#ffffff" fillOpacity={0.7} />
            </g>

            {/* ป้ายมาร์กเกอร์ระยะ R */}
            <g transform={`translate(${Math.min(hoopX - 35, 260)}, 95)`}>
              <rect x={0} y={0} width={75} height={22} rx={6} fill="#0f172acc" stroke="#f97316" strokeWidth={1.5} />
              <text x={37} y={15} fontSize={10} fontWeight={800} fill="#f97316" textAnchor="middle" fontFamily="mono">R = {range.toFixed(1)}m</text>
            </g>
          </svg>
        );
      }
      case "guitar": {
        const L = num("L");
        const T = num("T");
        const mu = 0.005;
        const f = (1 / (2 * L)) * Math.sqrt(T / mu);
        const animSpeed = Math.min(Math.max(2 + f / 15, 2), 14);
        const pitchColor = f < 120 ? "#38bdf8" : f < 260 ? "#c084fc" : "#f472b6";
        const amp = 16;
        const w = 95 + L * 140;
        const startX = 65;
        const endX = startX + w;
        const n = 40;
        const ptsUpper: string[] = [];
        const ptsLower: string[] = [];
        for (let i = 0; i <= n; i++) {
          const frac = i / n;
          const x = startX + frac * w;
          const envelope = Math.sin(Math.PI * frac);
          const yCur = 95 + amp * envelope * (isPlaying ? Math.sin(elapsed * animSpeed) : 1);
          const yOpp = 95 - amp * envelope * (isPlaying ? Math.sin(elapsed * animSpeed) : 1);
          ptsUpper.push(`${x.toFixed(1)},${yCur.toFixed(1)}`);
          ptsLower.push(`${x.toFixed(1)},${yOpp.toFixed(1)}`);
        }
        const soundCx = endX + 32;
        const soundCy = 95;
        const ringPulse = isPlaying ? (Math.sin(elapsed * animSpeed) + 1) / 2 : 0.5;

        return (
          <svg viewBox="0 0 360 210" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            {/* ฉากหลังตัวกีตาร์ไม้จริง Photorealistic Acoustic Guitar Body Background */}
            <image href="/simulations/acoustic_guitar_bg.png" x="0" y="0" width="360" height="210" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
            <rect x="0" y="0" width="360" height="210" fill="#000000" fillOpacity="0.25" />

            {/* วงคลื่นเสียงพัลส์เปล่งออกจากช่องเสียง */}
            <circle cx={soundCx} cy={soundCy} r={19 + ringPulse * 16} fill="none" stroke={pitchColor} strokeOpacity={0.8 - ringPulse * 0.4} strokeWidth={2.5} />
            <circle cx={soundCx} cy={soundCy} r={19 + ringPulse * 28} fill="none" stroke={pitchColor} strokeOpacity={0.4 - ringPulse * 0.2} strokeWidth={1.5} />

            {/* หมุดยึดสายหัว-ท้าย */}
            <rect x={startX - 12} y={75} width={12} height={40} fill="#1e293b" stroke="#cbd5e1" strokeWidth={1.5} rx={2} />
            <rect x={endX} y={75} width={12} height={40} fill="#1e293b" stroke="#cbd5e1" strokeWidth={1.5} rx={2} />

            {/* สายสั่นสะเทือน */}
            <polyline points={ptsUpper.join(" ")} fill="none" stroke={pitchColor} strokeWidth={3} />
            <polyline points={ptsLower.join(" ")} fill="none" stroke={pitchColor} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="2 2" />

            {/* ป้ายบอกระดับความถี่ f */}
            <g transform="translate(200, 15)">
              <rect x={0} y={0} width={140} height={32} rx={8} fill="#0f172ad0" stroke={pitchColor} strokeWidth={1.5} />
              <text x={70} y={21} fontSize={16} fontWeight={900} fill={pitchColor} textAnchor="middle" fontFamily="mono">{f.toFixed(1)} Hz</text>
            </g>
          </svg>
        );
      }
      case "refraction": {
        const th1 = num("angle") * DEG;
        const m = MEDIUM_MAP[str("medium")];
        const sinTh2 = Math.min(1, Math.sin(th1) / m.n);
        const th2 = Math.asin(sinTh2);
        const cx = 180;
        const cy = 120;
        const inLen = 95;
        const outLen = 95;
        const inX = cx - inLen * Math.sin(th1);
        const inY = cy - inLen * Math.cos(th1);
        const outX = cx + outLen * Math.sin(th2);
        const outY = cy + outLen * Math.cos(th2);

        return (
          <svg viewBox="0 0 360 240" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            {/* ฉากหลังห้องแล็บออปติกส์มืดจริง Photorealistic Optics Lab Background */}
            <image href="/simulations/optics_lab_bg.png" x="0" y="0" width="360" height="240" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
            <rect x="0" y="0" width="360" height="240" fill="#000000" fillOpacity="0.3" />

            {/* ขอบเขตปริซึมตัวกลาง */}
            <rect x={30} y={120} width={300} height={95} fill={m.color} fillOpacity={0.25} stroke={m.color} strokeWidth={2} rx={4} />
            <line x1={30} y1={120} x2={330} y2={120} stroke="#ffffff" strokeWidth={2.5} />

            {/* กล่องยิงเลเซอร์ */}
            <rect x={inX - 18} y={inY - 10} width={28} height={16} rx={3} fill="#1e293b" stroke="#facc15" strokeWidth={1.5} />
            <circle cx={inX - 10} cy={inY - 2} r={3} fill="#ef4444" />

            {/* เส้นฉาก Normal */}
            <line x1={cx} y1={25} x2={cx} y2={210} stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="4 4" />

            {/* ลำแสงเลเซอร์เข้ม */}
            <line x1={inX} y1={inY} x2={cx} y2={cy} stroke="#facc15" strokeWidth={3.5} />
            <line x1={cx} y1={cy} x2={outX} y2={outY} stroke="#22d3ee" strokeWidth={3.5} />
            <circle cx={cx} cy={cy} r={4.5} fill="#ffffff" stroke="#facc15" strokeWidth={1.5} />

            <text x={cx - 38} y={cy - 25} fill="#facc15" fontSize={11} fontWeight={800} fontFamily="mono">θ₁ = {num("angle")}°</text>
            <text x={cx + 12} y={cy + 35} fill="#22d3ee" fontSize={11} fontWeight={800} fontFamily="mono">θ₂ = {(th2 / DEG).toFixed(1)}°</text>
            <text x={220} y={205} fill="#f8fafc" fontSize={11} fontWeight={700}>{m.label} (n = {m.n})</text>
          </svg>
        );
      }
      case "trig": {
        const A = num("A");
        const k = num("k");
        const phase = (num("phase") * Math.PI) / 180;
        const cx = 80;
        const cy = 115;
        const r = A * 28;
        const animSpeed = 1.1;
        const theta = phase + (isPlaying ? elapsed * animSpeed : 0);
        const dotX = cx + r * Math.cos(theta);
        const dotY = cy - r * Math.sin(theta);
        const graphStart = 125;
        const graphEnd = 335;
        const pts: string[] = [];
        const n = 80;
        for (let i = 0; i <= n; i++) {
          const xNorm = (i / n) * 6;
          const y = cy - A * 28 * Math.sin(k * xNorm + theta);
          const x = graphStart + (i / n) * (graphEnd - graphStart);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const curveStartY = cy - A * 28 * Math.sin(theta);

        return (
          <svg viewBox="0 0 360 230" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            {/* ฉากหลังชิงช้าสวรรค์สวนสนุกจริง Photorealistic Ferris Wheel Background */}
            <image href="/simulations/ferris_wheel_bg.png" x="0" y="0" width="360" height="230" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
            <rect x="0" y="0" width="360" height="230" fill="#000000" fillOpacity="0.3" />

            {/* กระเช้าหมุนตามองศา */}
            <line x1={cx} y1={cy} x2={dotX} y2={dotY} stroke="#fbbf24" strokeWidth={2.5} />
            <rect x={dotX - 7} y={dotY - 7} width={14} height={14} rx={3} fill="#fbbf24" stroke="#78350f" strokeWidth={1.5} />

            {/* เส้นประเลเซอร์เชื่อมโยงจุดคลื่น */}
            <line x1={dotX} y1={dotY} x2={graphStart} y2={curveStartY} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3 3" />
            <circle cx={graphStart} cy={curveStartY} r={5} fill="#fbbf24" stroke="#ffffff" strokeWidth={1.5} />

            {/* กราฟ Sine Wave บนจอ HUD */}
            <line x1={graphStart} y1={cy} x2={graphEnd} y2={cy} stroke="#64748b" strokeWidth={1.5} />
            <polyline points={pts.join(" ")} fill="none" stroke="#38bdf8" strokeWidth={3} />

            <text x={graphStart} y={218} fontSize={10} fill="#f8fafc" fontFamily="mono" fontWeight={700}>y = {A} sin({k}x + {num("phase")}°)</text>
          </svg>
        );
      }
      case "derivative": {
        const t = isPlaying ? elapsed % 10 : num("x0");
        const s = t * t;
        const velocity = 2 * t;
        const roadStart = 35;
        const roadEnd = 320;
        const roadY = 42;
        const carX = roadStart + Math.min(s / 100, 1) * (roadEnd - roadStart);

        const originX = 35;
        const originY = 210;
        const scaleX = 28;
        const scaleY = 1.25;
        const toPx = (tt: number) => ({ x: originX + tt * scaleX, y: originY - tt * tt * scaleY });
        const pts: string[] = [];
        for (let tt = 0; tt <= 10; tt += 0.25) {
          const { x, y } = toPx(tt);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const p0 = toPx(t);
        const slopePxPerPx = (2 * t * scaleY) / scaleX;
        const dxPx = 45;
        const t1 = { x: p0.x - dxPx, y: p0.y + slopePxPerPx * dxPx };
        const t2 = { x: p0.x + dxPx, y: p0.y - slopePxPerPx * dxPx };

        return (
          <svg viewBox="0 0 360 235" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            {/* ฉากหลังถนนไฮเวย์จริง Photorealistic Highway Road Background */}
            <image href="/simulations/asphalt_road_bg.png" x="0" y="0" width="360" height="235" preserveAspectRatio="xMidYMid slice" opacity="0.85" />

            {/* รถสปอร์ตวิ่งบนถนน */}
            <g transform={`translate(${carX - 16}, ${roadY - 16})`}>
              <rect x={0} y={4} width={32} height={12} rx={4} fill="#f97316" stroke="#431407" strokeWidth={1} />
              <rect x={6} y={0} width={18} height={8} rx={2} fill="#38bdf8" />
              <circle cx={7} cy={16} r={3.5} fill="#0f172a" stroke="#94a3b8" strokeWidth={1} />
              <circle cx={25} cy={16} r={3.5} fill="#0f172a" stroke="#94a3b8" strokeWidth={1} />
            </g>

            {/* กราฟ s(t) = t² */}
            <line x1={originX} y1={originY} x2={325} y2={originY} stroke="#cbd5e1" strokeWidth={1.5} />
            <line x1={originX} y1={originY} x2={originX} y2={90} stroke="#cbd5e1" strokeWidth={1.5} />
            <polyline points={pts.join(" ")} fill="none" stroke="#34d399" strokeWidth={3} />

            {/* เส้นสัมผัส Tangent Line */}
            <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke="#f97316" strokeWidth={3} />
            <circle cx={p0.x} cy={p0.y} r={6} fill="#f97316" stroke="#ffffff" strokeWidth={1.5} />

            <g transform="translate(195, 12)">
              <rect x={0} y={0} width={150} height={28} rx={6} fill="#0f172acc" stroke="#f97316" strokeWidth={1.5} />
              <text x={75} y={18} fontSize={11} fill="#f97316" fontWeight={800} fontFamily="mono" textAnchor="middle">v = 2t = {velocity.toFixed(1)} m/s</text>
            </g>
          </svg>
        );
      }
      case "shadow": {
        const h = num("height");
        const angleDeg = num("sunAngle");
        const angle = angleDeg * DEG;
        const shadowM = h / Math.tan(angle);
        const groundY = 175;
        const treeX = 245;
        const scale = 14;
        const treeTopY = groundY - Math.max(h * scale, 35);
        const shadowScale = 10;
        const shadowPx = Math.min(shadowM * shadowScale, 220);
        const shadowTipX = treeX - shadowPx;
        const sunX = treeX + 45 + (80 - angleDeg) * 0.65;
        const sunY = 20 + (80 - angleDeg) * 1.35;

        return (
          <svg viewBox="0 0 360 220" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            {/* ฉากหลังสวนสาธารณะจริง Photorealistic Sunny Park Background */}
            <image href="/simulations/sunny_park_bg.png" x="0" y="0" width="360" height="220" preserveAspectRatio="xMidYMid slice" opacity="0.9" />

            {/* ดวงอาทิตย์พร้อมรัศมีแสง */}
            <circle cx={sunX} cy={sunY} r={14} fill="#fde047" stroke="#ffffff" strokeWidth={1.5} />
            <line x1={sunX} y1={sunY} x2={treeX} y2={treeTopY} stroke="#fde047" strokeWidth={1.5} strokeDasharray="4 3" />
            <line x1={treeX} y1={treeTopY} x2={shadowTipX} y2={groundY} stroke="#fde047" strokeWidth={1.5} strokeDasharray="4 3" />

            {/* เงาทอดสมจริงบนพื้น */}
            <rect x={shadowTipX} y={groundY - 3} width={treeX - shadowTipX} height={6} fill="#0f172a" fillOpacity={0.65} rx={3} />

            {/* ต้นไม้ 3D Canopy */}
            <line x1={treeX} y1={groundY} x2={treeX} y2={treeTopY + 16} stroke="#78350f" strokeWidth={5} strokeLinecap="round" />
            <circle cx={treeX} cy={treeTopY + 10} r={22} fill="#15803d" stroke="#14532d" strokeWidth={1} />
            <circle cx={treeX - 10} cy={treeTopY + 4} r={16} fill="#22c55e" stroke="#14532d" strokeWidth={1} />
            <circle cx={treeX + 10} cy={treeTopY + 4} r={16} fill="#16a34a" stroke="#14532d" strokeWidth={1} />

            <g transform={`translate(${(shadowTipX + treeX) / 2 - 45}, 182)`}>
              <rect x={0} y={0} width={90} height={20} rx={5} fill="#0f172acc" stroke="#a3e635" strokeWidth={1.5} />
              <text x={45} y={14} fontSize={10} fill="#a3e635" textAnchor="middle" fontWeight={800}>เงายาว {shadowM.toFixed(1)} ม.</text>
            </g>
          </svg>
        );
      }
      case "probability": {
        const counts = [0, 0, 0, 0, 0, 0];
        rolls.forEach((r) => counts[r - 1]++);
        const total = rolls.length;
        const lastRoll = rolls[rolls.length - 1];
        const groundY = 185;
        const maxBarH = 135;
        const expectedY = groundY - maxBarH / 6;
        const barW = 34;
        const gap = 14;
        const startX = 35;

        return (
          <svg viewBox="0 0 360 230" className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80">
            {/* ฉากหลังโต๊ะคาสิโนจริง Photorealistic Casino Felt Table Background */}
            <image href="/simulations/casino_dice_bg.png" x="0" y="0" width="360" height="230" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
            <rect x="0" y="0" width="360" height="230" fill="#000000" fillOpacity="0.25" />

            {/* ลูกเต๋า 3D */}
            <g transform="translate(25,12)">
              <rect x={0} y={0} width={42} height={42} rx={10} fill="#1e293b" stroke="#ffffff" strokeWidth={2} />
              {lastRoll ? (
                <g transform="scale(1.24)">
                  <DicePips value={lastRoll} />
                </g>
              ) : (
                <text x={21} y={28} textAnchor="middle" fontSize={20} fill="#f8fafc" fontWeight={700}>?</text>
              )}
            </g>
            <text x={80} y={28} fontSize={12} fill="#f8fafc" fontWeight={700}>สุ่มไปแล้ว {total} ครั้ง</text>
            <text x={80} y={44} fontSize={11} fill="#cbd5e1">ทอยล่าสุด: <tspan fill="#f59e0b" fontWeight={800}> {lastRoll ?? "-"}</tspan></text>

            {/* เส้นอ้างอิงทางทฤษฎี (1/6) */}
            <line x1={startX} y1={expectedY} x2={340} y2={expectedY} stroke="#fb7185" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={340} y={expectedY - 5} fontSize={10} fill="#fb7185" textAnchor="end" fontWeight={800}>ค่าคาดหวัง (16.7%)</text>
            <line x1={startX} y1={groundY} x2={340} y2={groundY} stroke="#f8fafc" strokeWidth={2} />

            {/* แท่งกราฟความถี่ 3D Bar */}
            {counts.map((c, i) => {
              const frac = total > 0 ? c / total : 0;
              const h = frac * maxBarH;
              const x = startX + i * (barW + gap);
              const y = groundY - h;
              const pct = total > 0 ? Math.round(frac * 100) : 0;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barW} height={h} rx={5} fill={lastRoll === i + 1 ? "#fb7185" : "#38bdf8"} fillOpacity={0.9} stroke="#ffffff" strokeWidth={1} />
                  <text x={x + barW / 2} y={groundY + 18} fontSize={12} fill="#ffffff" textAnchor="middle" fontWeight={800}>
                    {i + 1}
                  </text>
                  {total > 0 && (
                    <text x={x + barW / 2} y={y - 6} fontSize={10} fill="#f8fafc" textAnchor="middle" fontFamily="mono" fontWeight={700}>
                      {pct}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }
      default:
        return null;
    }
  }

  const computed = getComputed();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-sky-500/10 via-orange-500/10 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Dynamic Hero Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-bold shadow-inner">
              <Cpu className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>Interactive Simulation Hub</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-slate-400 font-normal">Active Learning Engine</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              ห้องปฏิบัติการจำลอง{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-400 to-orange-400">
                3D Interactive
              </span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              ทดลองปรับตัวแปรทางฟิสิกส์และคณิตศาสตร์เพื่อสังเกตผลลัพธ์แบบเรียลไทม์ เชื่อมโยงปรากฏการณ์จริงรอบตัวในชีวิตประจำวัน
            </p>
          </div>

          {/* Quick Telemetry Summary Pill */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-slate-300 text-xs font-mono flex items-center gap-2.5 shadow-lg backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/50" />
              <span>Physics Vector Engine</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">READY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-orange-400" />
                <span>8 การทดลอง</span>
              </span>
            </div>
          </div>
        </div>

        {/* Preset Selector Container with Subject Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>เลือกแบบจำลองการทดลอง (Presets)</span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-800 text-slate-400 font-mono">
                {filteredPresets.length}
              </span>
            </h2>

            {/* Category Tabs Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-xs">
              <button
                onClick={() => setActiveSubject("all")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeSubject === "all"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ทั้งหมด (8)
              </button>
              <button
                onClick={() => setActiveSubject("ฟิสิกส์")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeSubject === "ฟิสิกส์"
                    ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>ฟิสิกส์ (4)</span>
              </button>
              <button
                onClick={() => setActiveSubject("คณิตศาสตร์")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeSubject === "คณิตศาสตร์"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MathIcon className="w-3.5 h-3.5" />
                <span>คณิตศาสตร์ (4)</span>
              </button>
            </div>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`group p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? "bg-slate-900 border-sky-500/80 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/40 -translate-y-1"
                      : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 10px 30px -10px ${preset.glowColor}` : undefined,
                  }}
                >
                  {/* Subtle active background gradient */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        background: `radial-gradient(circle at top right, ${preset.glowColor}, transparent 70%)`,
                      }}
                    />
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-300 group-hover:scale-110 shadow-md ${preset.iconColor}`}
                      >
                        <span aria-hidden>{preset.emoji}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${preset.badgeBg}`}>
                        {preset.subject}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-sky-300 transition-colors">
                      {preset.name}
                    </h3>
                    
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate pr-2">📍 {preset.everyday}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Work Area: Visualizer Studio Frame + Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Canvas Visualizer Studio Frame (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800/90 overflow-hidden shadow-2xl min-h-[460px] flex flex-col justify-between p-5 sm:p-6 backdrop-blur-xl">

              {/* High-Tech Background Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

              {/* Viewport Top Header Toolbar */}
              <div className="relative z-10 flex items-center justify-between bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-md">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-inner ${activePreset.iconColor}`}>
                    <span aria-hidden>{activePreset.emoji}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-white">{activePreset.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${activePreset.badgeBg}`}>
                        {activePreset.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">สิ่งรอบตัว: {activePreset.everyday}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-2 border transition-all ${
                    isPlaying
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                    {isPlaying ? "LIVE ANIMATION" : "PAUSED"}
                  </span>
                </div>
              </div>

              {/* Center Canvas Live Visualizer Display (Real-Life Photorealistic Engine) */}
              <div className="relative z-10 my-6 flex-1 flex items-center justify-center p-2">
                <div className="w-full flex items-center justify-center">
                  {renderVisual()}
                </div>
              </div>

              {/* Live Explanation & Observation Box */}
              <div className="relative z-10 bg-slate-950/90 p-4 rounded-2xl border border-slate-800/80 text-slate-300 text-xs shadow-xl space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2 font-bold text-sky-400">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <span>คำอธิบายปรากฏการณ์ & การคำนวณ</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Realtime Math Engine</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{computed.explain}</p>
                <div className="pt-1.5 border-t border-slate-800/40 flex items-start gap-2 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>จุดสังเกตหลักสูตร:</strong> {activePreset.observation}</span>
                </div>
              </div>

              {/* Bottom Telemetry Controls & Live Output Indicators */}
              <div className="relative z-10 mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                      isPlaying
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20"
                        : "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-slate-950 hover:opacity-95 shadow-orange-500/25"
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current stroke-[2]" /> : <Play className="w-4 h-4 fill-current stroke-[2]" />}
                    <span>{isPlaying ? "หยุดชั่วคราว (Pause)" : "เริ่มการจำลอง (Play)"}</span>
                  </button>

                  <button
                    onClick={handleResetParams}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all hover:text-white active:scale-95"
                    title="รีเซ็ตค่าเริ่มต้น"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Live Stats Telemetry Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {computed.stats.map((s, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shrink-0 flex items-center gap-2 shadow-inner"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-slate-400">{s.label}:</span>
                      <strong className="text-white font-mono text-xs">{s.value}</strong>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>

          {/* Control Panel Sidebar (1 Col) */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">

              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                    <Sliders className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">แผงควบคุมตัวแปร</h3>
                    <p className="text-[10px] text-slate-400">ปรับแต่งค่าเพื่อดูผลลัพธ์แบบเรียลไทม์</p>
                  </div>
                </div>

                <button
                  onClick={handleResetParams}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>คืนค่าเดิม</span>
                </button>
              </div>

              {/* Dynamic Parameter Controllers */}
              <div className="space-y-5">
                {activePreset.params.map((p) =>
                  p.type === "slider" ? (
                    <div key={p.key} className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-200">{p.label}</span>
                        <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30 font-mono text-xs">
                          {paramValues[p.key]} {p.unit}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={num(p.key)}
                        onChange={(e) => setParam(p.key, parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                        <span>Min: {p.min}</span>
                        <span>Max: {p.max}</span>
                      </div>
                    </div>
                  ) : (
                    <div key={p.key} className="space-y-2.5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                      <span className="text-xs font-bold text-slate-200 block">{p.label}</span>
                      <div className="flex flex-col gap-1.5">
                        {p.options.map((opt) => {
                          const isSel = str(p.key) === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setParam(p.key, opt.value)}
                              className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                                isSel
                                  ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-slate-950 border-transparent shadow-md font-extrabold"
                                  : "bg-slate-900 text-slate-300 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSel && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Live State Variables Inspection Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-orange-400" />
                    <span>State Telemetry Inspector</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 text-xs font-mono text-emerald-400 space-y-1.5 border border-slate-800">
                  {activePreset.params.map((p) => (
                    <div key={p.key} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">{p.key}:</span>
                      <span className="text-emerald-400 font-bold">
                        {paramValues[p.key]} {p.type === "slider" ? p.unit : ""}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                    <span>isPlaying:</span>
                    <span className={isPlaying ? "text-emerald-400" : "text-amber-400"}>
                      {isPlaying ? "true" : "false"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}