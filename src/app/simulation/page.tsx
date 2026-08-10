"use client";

import { useEffect, useState } from "react";
import { Cpu, Play, RotateCcw, Sliders, Activity, Eye, Layers, ChevronRight } from "lucide-react";

const DEG = Math.PI / 180;

/**
 * Config ของตัวแปรที่ปรับได้ในแต่ละ Preset
 * รองรับ 2 แบบ: slider (ตัวเลขต่อเนื่อง) และ select (ตัวเลือกไม่ต่อเนื่อง เช่น ชนิดตัวกลาง)
 */
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
  subject: string;
  category: string;
  everyday: string; // สิ่งรอบตัวที่เชื่อมโยง
  emoji: string; // ไอคอนตัวอย่างจริงให้เห็นภาพเร็วๆ
  description: string;
  observation: string; // สังเกตอะไร (baseline hint จากหลักสูตร)
  iconColor: string;
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
    observation: "เงายาวเมื่อดวงอาทิตย์อยู่ต่ำ (มุมน้อย ตอนเช้า/เย็น) และเงาสั้นเมื่อดวงอาทิตย์อยู่สูง (มุมมาก ตอนเที่ยง)",
    iconColor: "text-lime-400 bg-lime-500/10 border-lime-500/30",
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
  water: { n: 1.33, label: "น้ำ", color: "#0ea5e9" },
  glass: { n: 1.5, label: "แก้ว", color: "#94a3b8" },
  diamond: { n: 2.42, label: "เพชร", color: "#c7d2fe" },
};

/** จุดไข่ปลาบนหน้าลูกเต๋าตามค่า 1-6 (มาตรฐานลูกเต๋าจริง) */
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

  const num = (key: string) => Number(paramValues[key]);
  const str = (key: string) => String(paramValues[key]);

  // Clock กลาง ขับเคลื่อนแอนิเมชันของทุก preset ที่ต้องการเวลา (ลูกตุ้ม, โพรเจกไทล์, สาย, วงกลม)
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

  // ตัวสุ่มลูกเต๋าจริงสำหรับ preset ความน่าจะเป็น
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

  /** คำนวณค่าที่แสดงผล + คำอธิบายแบบไดนามิกตาม preset ปัจจุบัน */
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
        const mu = 0.005; // มวลต่อความยาวโดยประมาณของสายกีตาร์ (kg/m)
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

  /** วาดภาพจำลองแบบ SVG ตาม preset ปัจจุบัน คำนวณจากค่าตัวแปรจริงและเวลา (elapsed) */
  function renderVisual() {
    switch (activePreset.id) {
      case "pendulum": {
        const L = num("L");
        const g = G_MAP[str("g")];
        const angleMax = num("angle") * DEG;
        const T = 2 * Math.PI * Math.sqrt(L / g);
        const angle = isPlaying ? angleMax * Math.cos((2 * Math.PI * elapsed) / T) : angleMax;
        const pivot = { x: 160, y: 34 };
        const rodPx = 40 + L * 55;
        const bob = { x: pivot.x + rodPx * Math.sin(angle), y: pivot.y + rodPx * Math.cos(angle) };
        const leftGuide = { x: pivot.x + rodPx * Math.sin(-angleMax), y: pivot.y + rodPx * Math.cos(-angleMax) };
        const rightGuide = { x: pivot.x + rodPx * Math.sin(angleMax), y: pivot.y + rodPx * Math.cos(angleMax) };
        return (
          <svg viewBox="0 0 320 260" className="w-full max-w-sm mx-auto">
            <defs>
              <radialGradient id="bobGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="55%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0369a1" />
              </radialGradient>
            </defs>
            {/* เพดานยึด (นาฬิกา/ชิงช้า) */}
            <rect x={pivot.x - 55} y={pivot.y - 14} width={110} height={10} rx={3} fill="#1e293b" stroke="#334155" />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={pivot.x - 50 + i * 12.5} y1={pivot.y - 4} x2={pivot.x - 58 + i * 12.5} y2={pivot.y + 6} stroke="#334155" strokeWidth={1.5} />
            ))}
            {/* ขอบเขตมุมแกว่งสุด */}
            <line x1={pivot.x} y1={pivot.y} x2={leftGuide.x} y2={leftGuide.y} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={pivot.x} y1={pivot.y} x2={rightGuide.x} y2={rightGuide.y} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
            {/* เชือกและลูกตุ้ม */}
            <line x1={pivot.x} y1={pivot.y} x2={bob.x} y2={bob.y} stroke="#64748b" strokeWidth={2} />
            <circle cx={pivot.x} cy={pivot.y} r={4} fill="#94a3b8" />
            <circle cx={bob.x} cy={bob.y} r={18} fill="url(#bobGrad)" stroke="#0c4a6e" strokeWidth={1} />
            <circle cx={bob.x - 5} cy={bob.y - 6} r={4} fill="#e0f2fe" fillOpacity={0.85} />
          </svg>
        );
      }
      case "projectile": {
        const u = num("u");
        const angle = num("angle") * DEG;
        const g = 9.8;
        const flight = (2 * u * Math.sin(angle)) / g || 0.01;
        const range = (u * u * Math.sin(2 * angle)) / g;
        // สเกลคงที่ (ไม่ปรับตามค่า u/angle) เพื่อให้เห็นความแตกต่างของระยะจริงเมื่อปรับค่า
        const scaleX = 1.55; // px ต่อ 1 เมตร (แนวนอน)
        const scaleY = 1.85; // px ต่อ 1 เมตร (แนวตั้ง)
        const originX = 25;
        const groundY = 195;
        const pts: string[] = [];
        for (let i = 0; i <= 40; i++) {
          const t = (flight * i) / 40;
          const x = originX + u * Math.cos(angle) * t * scaleX;
          const y = groundY - u * Math.sin(angle) * t * scaleY + 0.5 * g * t * t * scaleY;
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const t = isPlaying ? elapsed % flight : flight / 2;
        const bx = originX + u * Math.cos(angle) * t * scaleX;
        const by = groundY - u * Math.sin(angle) * t * scaleY + 0.5 * g * t * t * scaleY;
        const hoopX = Math.min(originX + range * scaleX, 300);
        return (
          <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto">
            <defs>
              <radialGradient id="ballGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="55%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </radialGradient>
              <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16532922" />
                <stop offset="100%" stopColor="#16532966" />
              </linearGradient>
            </defs>
            <rect x={0} y={195} width={320} height={25} fill="url(#groundGrad)" />
            <line x1={20} y1={195} x2={300} y2={195} stroke="#334155" strokeWidth={2} />
            {/* ไม้บรรทัดระยะทางบนพื้น */}
            {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((m) => {
              const x = originX + m * scaleX;
              if (x > 300) return null;
              return (
                <g key={m}>
                  <line x1={x} y1={195} x2={x} y2={200} stroke="#475569" strokeWidth={1} />
                  <text x={x} y={212} fontSize={8} fill="#64748b" textAnchor="middle">{m}m</text>
                </g>
              );
            })}
            {/* ห่วงบาสเกตบอลที่ตำแหน่งจุดตกจริง */}
            <line x1={hoopX} y1={195} x2={hoopX} y2={150} stroke="#78350f" strokeWidth={3} />
            <rect x={hoopX - 2} y={128} width={26} height={18} fill="#e2e8f0" fillOpacity={0.12} stroke="#94a3b8" strokeWidth={1} />
            <ellipse cx={hoopX} cy={150} rx={14} ry={4} fill="none" stroke="#fb923c" strokeWidth={2.5} />
            {/* วิถีโค้ง */}
            <polyline points={pts.join(" ")} fill="none" stroke="#fdba7488" strokeWidth={2} strokeDasharray="4 3" />
            {/* ลูกบาสเกตบอล */}
            <circle cx={bx} cy={by} r={9} fill="url(#ballGrad)" stroke="#7c2d12" strokeWidth={1} />
            <path d={`M ${bx - 9} ${by} Q ${bx} ${by - 4} ${bx + 9} ${by}`} stroke="#7c2d12" strokeWidth={1} fill="none" />
            <path d={`M ${bx} ${by - 9} Q ${bx - 4} ${by} ${bx} ${by + 9}`} stroke="#7c2d12" strokeWidth={1} fill="none" />
            <text x={hoopX} y={118} fontSize={10} fill="#fb923c" textAnchor="middle">R = {range.toFixed(1)}m</text>
          </svg>
        );
      }
      case "guitar": {
        const L = num("L");
        const T = num("T");
        const mu = 0.005;
        const f = (1 / (2 * L)) * Math.sqrt(T / mu);
        const animSpeed = Math.min(Math.max(2 + f / 15, 2), 14); // ยิ่ง f สูง สายสั่นไวขึ้นเห็นชัด
        const pitchColor = f < 120 ? "#38bdf8" : f < 260 ? "#c084fc" : "#f472b6";
        const amp = 15;
        const w = 90 + L * 140; // ความยาวสายบนจอ ผูกกับ L โดยตรง
        const startX = 60;
        const endX = startX + w;
        const n = 40;
        const pts: string[] = [];
        for (let i = 0; i <= n; i++) {
          const frac = i / n;
          const x = startX + frac * w;
          const envelope = Math.sin(Math.PI * frac);
          const y = 92 + amp * envelope * (isPlaying ? Math.sin(elapsed * animSpeed) : 1);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const soundCx = endX + 28;
        const soundCy = 96;
        const ringPulse = isPlaying ? (Math.sin(elapsed * animSpeed) + 1) / 2 : 0.5;
        return (
          <svg viewBox="0 0 320 200" className="w-full max-w-md mx-auto">
            <defs>
              <radialGradient id="bodyGrad" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#7c3aed33" />
                <stop offset="100%" stopColor="#4c1d9522" />
              </radialGradient>
            </defs>
            {/* ตัวกีตาร์ทรง figure-8 */}
            <ellipse cx={endX + 28} cy={92} rx={40} ry={52} fill="url(#bodyGrad)" stroke="#7c3aed66" strokeWidth={1.5} />
            <ellipse cx={endX + 28} cy={130} rx={28} ry={36} fill="url(#bodyGrad)" stroke="#7c3aed66" strokeWidth={1.5} />
            {/* วงคลื่นเสียงที่พัลส์ตามความถี่จริง */}
            <circle cx={soundCx} cy={soundCy} r={12 + ringPulse * 6} fill="none" stroke={pitchColor} strokeOpacity={0.5 - ringPulse * 0.2} strokeWidth={1.5} />
            <circle cx={soundCx} cy={soundCy} r={12 + ringPulse * 12} fill="none" stroke={pitchColor} strokeOpacity={0.3 - ringPulse * 0.15} strokeWidth={1.5} />
            <circle cx={soundCx} cy={soundCy} r={12} fill="#0f172a" stroke="#7c3aed66" strokeWidth={1.5} />
            {/* คอ/หัวกีตาร์ */}
            <rect x={startX - 38} y={88} width={38} height={8} rx={2} fill="#334155" />
            <circle cx={startX - 34} cy={92} r={2.5} fill="#94a3b8" />
            <circle cx={startX - 24} cy={92} r={2.5} fill="#94a3b8" />
            <circle cx={startX - 14} cy={92} r={2.5} fill="#94a3b8" />
            {/* สาย */}
            <line x1={startX} y1={92} x2={endX} y2={92} stroke="#475569" strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={startX} cy={92} r={4} fill="#94a3b8" />
            <circle cx={endX} cy={92} r={4} fill="#94a3b8" />
            <polyline points={pts.join(" ")} fill="none" stroke={pitchColor} strokeWidth={2.5} />
            {/* ตัวเลขความถี่ขนาดใหญ่ให้เห็นชัด */}
            <text x={startX} y={170} fontSize={22} fontWeight={800} fill={pitchColor}>{f.toFixed(0)} Hz</text>
            <text x={startX} y={188} fontSize={10} fill="#94a3b8">ยิ่งสายสั่นไว (ดูภาพ) ยิ่งเสียงสูง</text>
          </svg>
        );
      }
      case "refraction": {
        const th1 = num("angle") * DEG;
        const m = MEDIUM_MAP[str("medium")];
        const sinTh2 = Math.min(1, Math.sin(th1) / m.n);
        const th2 = Math.asin(sinTh2);
        const cx = 160;
        const cy = 115;
        const inLen = 85;
        const outLen = 85;
        const inX = cx - inLen * Math.sin(th1);
        const inY = cy - inLen * Math.cos(th1);
        const outX = cx + outLen * Math.sin(th2);
        const outY = cy + outLen * Math.cos(th2);
        return (
          <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto">
            <defs>
              <linearGradient id="mediumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={m.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={m.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            {/* ดวงอาทิตย์เป็นแหล่งกำเนิดแสง */}
            <circle cx={45} cy={28} r={13} fill="#fde047" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line
                  key={i}
                  x1={45 + 17 * Math.cos(a)}
                  y1={28 + 17 * Math.sin(a)}
                  x2={45 + 23 * Math.cos(a)}
                  y2={28 + 23 * Math.sin(a)}
                  stroke="#fde047"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}
            <rect x={20} y={115} width={280} height={85} fill="url(#mediumGrad)" />
            <line x1={20} y1={115} x2={300} y2={115} stroke="#475569" strokeWidth={1.5} />
            <line x1={cx} y1={20} x2={cx} y2={205} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={inX} y1={inY} x2={cx} y2={cy} stroke="#facc15" strokeWidth={2.5} />
            <line x1={cx} y1={cy} x2={outX} y2={outY} stroke="#22d3ee" strokeWidth={2.5} />
            <circle cx={cx} cy={cy} r={3} fill="#f8fafc" />
            <text x={215} y={198} fill="#94a3b8" fontSize={11}>ตัวกลาง: {m.label}</text>
          </svg>
        );
      }
      case "trig": {
        const A = num("A");
        const k = num("k");
        const phase = (num("phase") * Math.PI) / 180;
        const cx = 70;
        const cy = 110;
        const r = A * 26;
        const animSpeed = 1.1; // ความเร็วหมุนสาธิต (คงที่ ไม่ขึ้นกับ k)
        const theta = phase + (isPlaying ? elapsed * animSpeed : 0);
        const dotX = cx + r * Math.cos(theta);
        const dotY = cy - r * Math.sin(theta);
        const graphStart = 110;
        const graphEnd = 310;
        const pts: string[] = [];
        const n = 80;
        for (let i = 0; i <= n; i++) {
          const xNorm = (i / n) * 6; // ช่วงที่มองเห็นบนกราฟ (หน่วยเรเดียน x k)
          const y = cy - A * 26 * Math.sin(k * xNorm + theta);
          const x = graphStart + (i / n) * (graphEnd - graphStart);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        // จุดซ้ายสุดของกราฟ (i=0) มีความสูงเท่ากับกระเช้าบนล้อเป๊ะๆ เพราะ xNorm=0 -> sin(theta) เท่ากัน
        const curveStartY = cy - A * 26 * Math.sin(theta);
        return (
          <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto">
            {/* ขาตั้งล้อชิงช้าสวรรค์ */}
            <line x1={cx} y1={cy} x2={cx - 38} y2={195} stroke="#475569" strokeWidth={2} />
            <line x1={cx} y1={cy} x2={cx + 38} y2={195} stroke="#475569" strokeWidth={2} />
            <line x1={20} y1={195} x2={320} y2={195} stroke="#334155" strokeWidth={1.5} />
            {/* ล้อและซี่ล้อ */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#475569" strokeWidth={1.5} />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy - r * Math.sin(a)} stroke="#33415588" strokeWidth={1} />
              );
            })}
            {/* กระเช้าที่ตำแหน่งปัจจุบัน */}
            <line x1={cx} y1={cy} x2={dotX} y2={dotY} stroke="#fbbf24" strokeWidth={2} />
            <rect x={dotX - 6} y={dotY - 6} width={12} height={12} rx={3} fill="#fbbf24" stroke="#92400e" strokeWidth={1} />
            {/* เส้นประเชื่อมความสูงของกระเช้ากับจุดเริ่มกราฟ (พิสูจน์ว่าเท่ากัน) */}
            <line x1={dotX} y1={dotY} x2={graphStart} y2={curveStartY} stroke="#fbbf2488" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={graphStart} cy={curveStartY} r={4} fill="#fbbf24" />
            {/* กราฟคลื่นที่ไหลไปตามการหมุนจริง */}
            <line x1={graphStart} y1={cy} x2={graphEnd} y2={cy} stroke="#334155" strokeWidth={1} />
            <polyline points={pts.join(" ")} fill="none" stroke="#38bdf8" strokeWidth={2.5} />
            <text x={graphStart} y={205} fontSize={10} fill="#94a3b8">ความสูงกระเช้า = จุดบนคลื่น (จุดเหลือง)</text>
          </svg>
        );
      }
      case "derivative": {
        const t = isPlaying ? elapsed % 10 : num("x0");
        const s = t * t;
        const velocity = 2 * t;

        // แถวที่ 1: ถนน + รถวิ่งจริง (ตำแหน่งตามระยะทางจริง ยิ่งเวลาผ่านยิ่งวิ่งเร็ว)
        const roadStart = 30;
        const roadEnd = 300;
        const roadY = 40;
        const carX = roadStart + Math.min(s / 100, 1) * (roadEnd - roadStart);

        // แถวที่ 2: แถบความเร็ว
        const barX = 30;
        const barW = 270;
        const barY = 68;
        const barH = 14;
        const fillW = Math.min(velocity / 20, 1) * barW;

        // แถวที่ 3: กราฟระยะทาง-เวลา พร้อมเส้นสัมผัส
        const originX = 30;
        const originY = 205;
        const scaleX = 27; // px ต่อ 1 วินาที
        const scaleY = 1.2; // px ต่อ 1 เมตร
        const toPx = (tt: number) => ({ x: originX + tt * scaleX, y: originY - tt * tt * scaleY });
        const pts: string[] = [];
        for (let tt = 0; tt <= 10; tt += 0.25) {
          const { x, y } = toPx(tt);
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const p0 = toPx(t);
        const slopePxPerPx = (2 * t * scaleY) / scaleX;
        const dxPx = 40;
        const t1 = { x: p0.x - dxPx, y: p0.y + slopePxPerPx * dxPx };
        const t2 = { x: p0.x + dxPx, y: p0.y - slopePxPerPx * dxPx };

        return (
          <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto">
            {/* ถนน + รถ */}
            <text x={roadStart} y={20} fontSize={10} fill="#94a3b8">รถวิ่งจริง (ยิ่งเวลาผ่าน ยิ่งเร่งเร็วขึ้น)</text>
            <line x1={roadStart} y1={roadY} x2={roadEnd} y2={roadY} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
            <text x={carX} y={roadY - 8} fontSize={16} textAnchor="middle">🚗</text>

            {/* แถบความเร็ว */}
            <text x={barX} y={barY - 6} fontSize={10} fill="#94a3b8">ความเร็วตอนนี้</text>
            <rect x={barX} y={barY} width={barW} height={barH} rx={7} fill="#1e293b" stroke="#334155" strokeWidth={1} />
            <rect x={barX} y={barY} width={fillW} height={barH} rx={7} fill="#f97316" />
            <text x={barX + barW} y={barY + barH + 12} fontSize={11} fill="#f97316" textAnchor="end" fontWeight={700}>
              {velocity.toFixed(1)} m/s
            </text>

            {/* กราฟระยะทาง-เวลา */}
            <text x={originX} y={95} fontSize={10} fill="#94a3b8">กราฟระยะทาง (แกนตั้ง) - เวลา (แกนนอน)</text>
            <line x1={originX} y1={originY} x2={300} y2={originY} stroke="#334155" strokeWidth={1.5} />
            <line x1={originX} y1={originY} x2={originX} y2={100} stroke="#334155" strokeWidth={1.5} />
            <polyline points={pts.join(" ")} fill="none" stroke="#34d399" strokeWidth={2} />
            <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke="#f97316" strokeWidth={2.5} />
            <circle cx={p0.x} cy={p0.y} r={5} fill="#f97316" />
            <text x={originX + 5} y={originY + 14} fontSize={9} fill="#64748b">0</text>
            <text x={290} y={originY + 14} fontSize={9} fill="#64748b">10 วิ</text>
          </svg>
        );
      }
      case "shadow": {
        const h = num("height");
        const angleDeg = num("sunAngle");
        const angle = angleDeg * DEG;
        const shadowM = h / Math.tan(angle);
        const groundY = 170;
        const treeX = 230;
        const scale = 14; // px ต่อ 1 เมตร สำหรับความสูงต้นไม้
        const treeTopY = groundY - Math.max(h * scale, 30);
        const shadowScale = 10; // px ต่อ 1 เมตร สำหรับความยาวเงา (แยกสเกลให้พอดีจอ)
        const shadowPx = Math.min(shadowM * shadowScale, 210);
        const shadowTipX = treeX - shadowPx;
        // ยิ่งมุมมาก ดวงอาทิตย์ยิ่งอยู่สูง/เข้าใกล้กลางฟ้า
        const sunX = treeX + 40 + (80 - angleDeg) * 0.6;
        const sunY = 20 + (80 - angleDeg) * 1.4;
        return (
          <svg viewBox="0 0 320 200" className="w-full max-w-md mx-auto">
            <defs>
              <linearGradient id="shadowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0f172a" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#0f172a" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <line x1={10} y1={groundY} x2={310} y2={groundY} stroke="#334155" strokeWidth={2} />
            {/* ดวงอาทิตย์ */}
            <circle cx={sunX} cy={sunY} r={12} fill="#fde047" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line
                  key={i}
                  x1={sunX + 16 * Math.cos(a)}
                  y1={sunY + 16 * Math.sin(a)}
                  x2={sunX + 22 * Math.cos(a)}
                  y2={sunY + 22 * Math.sin(a)}
                  stroke="#fde047"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}
            {/* รังสีแสงจากดวงอาทิตย์ผ่านยอดต้นไม้ไปจรดปลายเงา */}
            <line x1={sunX} y1={sunY} x2={treeX} y2={treeTopY} stroke="#fde04799" strokeWidth={1.5} strokeDasharray="3 3" />
            <line x1={treeX} y1={treeTopY} x2={shadowTipX} y2={groundY} stroke="#fde04799" strokeWidth={1.5} strokeDasharray="3 3" />
            {/* เงาบนพื้น */}
            <rect x={shadowTipX} y={groundY - 4} width={treeX - shadowTipX} height={4} fill="url(#shadowGrad)" />
            {/* ต้นไม้ */}
            <line x1={treeX} y1={groundY} x2={treeX} y2={treeTopY + 14} stroke="#78350f" strokeWidth={4} />
            <text x={treeX} y={treeTopY + 6} fontSize={30} textAnchor="middle">🌳</text>
            {/* ป้ายบอกความยาวเงา */}
            <text x={(shadowTipX + treeX) / 2} y={groundY + 16} fontSize={11} fill="#a3e635" textAnchor="middle" fontWeight={700}>
              เงายาว {shadowM.toFixed(1)} ม.
            </text>
          </svg>
        );
      }
      case "probability": {
        const counts = [0, 0, 0, 0, 0, 0];
        rolls.forEach((r) => counts[r - 1]++);
        const total = rolls.length;
        const lastRoll = rolls[rolls.length - 1];
        const groundY = 180;
        const maxBarH = 130;
        const expectedY = groundY - maxBarH / 6; // เส้นอ้างอิง 1/6 ของทั้งหมด (คงที่เสมอ)
        const barW = 32;
        const gap = 12;
        const startX = 30;
        return (
          <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto">
            {/* ลูกเต๋าขนาดใหญ่แสดงค่าที่สุ่มได้ล่าสุด */}
            <g transform="translate(20,10)">
              <rect x={0} y={0} width={40} height={40} rx={9} fill="#1e293b" stroke="#475569" strokeWidth={1.5} />
              {lastRoll ? (
                <g transform="scale(1.18)">
                  <DicePips value={lastRoll} />
                </g>
              ) : (
                <text x={20} y={26} textAnchor="middle" fontSize={18} fill="#64748b">?</text>
              )}
            </g>
            <text x={72} y={26} fontSize={11} fill="#94a3b8">สุ่มไปแล้ว {total} ครั้ง</text>
            <text x={72} y={40} fontSize={10} fill="#64748b">ทอยล่าสุด: {lastRoll ?? "-"}</text>

            {/* เส้นอ้างอิง 1/6 */}
            <line x1={startX} y1={expectedY} x2={300} y2={expectedY} stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 3" />
            <text x={300} y={expectedY - 5} fontSize={9} fill="#fb7185" textAnchor="end">ค่าคาดหวัง (1/6)</text>
            <line x1={startX} y1={groundY} x2={300} y2={groundY} stroke="#334155" strokeWidth={1.5} />

            {/* แท่งกราฟความถี่ของแต่ละหน้า 1-6 */}
            {counts.map((c, i) => {
              const frac = total > 0 ? c / total : 0;
              const h = frac * maxBarH;
              const x = startX + i * (barW + gap);
              const y = groundY - h;
              const pct = total > 0 ? Math.round(frac * 100) : 0;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barW} height={h} rx={4} fill={lastRoll === i + 1 ? "#fb7185" : "#38bdf8"} fillOpacity={0.85} />
                  <text x={x + barW / 2} y={groundY + 16} fontSize={11} fill="#e2e8f0" textAnchor="middle" fontWeight={700}>
                    {i + 1}
                  </text>
                  {total > 0 && (
                    <text x={x + barW / 2} y={y - 5} fontSize={9} fill="#94a3b8" textAnchor="middle">
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
              ทดลองปรับตัวแปรทางฟิสิกส์และคณิตศาสตร์เพื่อสังเกตผลลัพธ์แบบเรียลไทม์ จากสิ่งรอบตัวในชีวิตประจำวัน
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
            {presets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 ${
                    isSelected
                      ? "bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/30"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-105 ${preset.iconColor}`}
                      >
                        <span aria-hidden>{preset.emoji}</span>
                      </div>
                      {isSelected ? (
                        <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${preset.iconColor}`}>
                          {preset.subject}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {preset.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="shrink-0">ตัวอย่างจริง:</span>
                    <span className="text-slate-300 line-clamp-1">{preset.everyday}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Work Area: Viewer Frame + Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Canvas Viewer Frame (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between p-6">

              {/* Tech Background Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

              {/* Canvas Top Status Bar */}
              <div className="relative z-10 flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${activePreset.iconColor}`}>
                    <span aria-hidden>{activePreset.emoji}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{activePreset.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">ตัวอย่างจริง: {activePreset.everyday}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {isPlaying ? "STATUS: RUNNING" : "STATUS: PAUSED"}
                  </span>
                </div>
              </div>

              {/* Center Live Visual */}
              <div className="relative z-10 my-6 flex-1 flex items-center justify-center">
                {renderVisual()}
              </div>

              {/* Explanation Box */}
              <div className="relative z-10 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-slate-300 text-xs shadow-xl space-y-1">
                <p className="font-bold text-sky-400">คำอธิบาย</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">{computed.explain}</p>
                <p className="text-[10px] text-slate-500 pt-1">พื้นฐานที่ควรสังเกต: {activePreset.observation}</p>
              </div>

              {/* Canvas Bottom Interactive Control Bar */}
              <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-md">

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

                {/* Stats Mock Buttons */}
                <div className="flex items-center gap-1.5 text-xs flex-wrap">
                  {computed.stats.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{s.label}: <strong className="text-white">{s.value}</strong></span>
                    </span>
                  ))}
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

              {/* Params Form UI */}
              <div className="space-y-5">
                {activePreset.params.map((p) =>
                  p.type === "slider" ? (
                    <div key={p.key} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">{p.label}</span>
                        <span className="text-sky-400 font-mono">
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
                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{p.min}</span>
                        <span>{p.max}</span>
                      </div>
                    </div>
                  ) : (
                    <div key={p.key} className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 block">{p.label}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.options.map((opt) => {
                          const isSel = str(p.key) === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setParam(p.key, opt.value)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                                isSel
                                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-transparent"
                                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* State Values Display Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Activity className="w-3.5 h-3.5 text-orange-400" />
                  <span>ค่าตัวแปรใน State ปัจจุบัน:</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 text-xs font-mono text-emerald-400 space-y-1">
                  {activePreset.params.map((p) => (
                    <p key={p.key}>
                      {p.key}: {paramValues[p.key]} {p.type === "slider" ? p.unit : ""}
                    </p>
                  ))}
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