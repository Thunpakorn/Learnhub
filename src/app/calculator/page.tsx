"use client";

import { useState } from "react";
import { Calculator as CalcIcon, Delete, RotateCcw, Sparkles, HelpCircle, Info } from "lucide-react";
import { evaluate, format } from "mathjs";

/**
 * แปลงข้อความที่ผู้ใช้พิมพ์ในหน้าจอ (displayValue) ให้อยู่ในรูปแบบที่
 * math.js เข้าใจได้ถูกต้อง เนื่องจากปุ่มบางปุ่มส่งสัญลักษณ์ที่ไม่ตรงกับ
 * ไวยากรณ์ของ math.js โดยตรง (เช่น π ต้องแปลงเป็นคำว่า pi)
 *
 * @param expr ข้อความดิบจาก displayValue
 * @returns ข้อความที่พร้อมส่งเข้า evaluate() ของ math.js
 */
function preprocessExpression(expr: string): string {
  let result = expr;

  // แปลงสัญลักษณ์ π ให้เป็นคำว่า pi ที่ math.js รู้จัก
  result = result.replaceAll("π", "pi");

  // แปลงเครื่องหมาย % แบบเปอร์เซ็นต์ (เช่น 50%) ให้เป็น (50/100)
  // เพราะ % ใน math.js ปกติหมายถึง modulo ไม่ใช่เปอร์เซ็นต์
  result = result.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

  return result;
}

/**
 * จัดรูปแบบผลลัพธ์ตัวเลขให้อ่านง่าย ตัดทศนิยมที่ยาวเกินไปออก
 * และกันปัญหา floating point error (เช่น 0.1+0.2 ไม่ให้เพี้ยนเป็น 0.30000000000000004)
 *
 * @param value ผลลัพธ์ดิบที่ได้จาก math.js (อาจเป็น number, Fraction, Complex ฯลฯ)
 * @returns ข้อความผลลัพธ์ที่พร้อมแสดงผล
 */
function formatResult(value: unknown): string {
  if (typeof value === "number") {
    return format(value, { precision: 12 });
  }
  // สำหรับผลลัพธ์ประเภทอื่น (เช่น หน่วยวัด, เศษส่วน) ให้ math.js จัดรูปแบบให้เอง
  return format(value as never);
}

/**
 * หน้า Math Companion Scientific Calculator (src/app/calculator/page.tsx)
 * 
 * ข้อกำหนดสำคัญ (STRICT REQUIREMENTS):
 * 1. หน้านี้สร้างเฉพาะ UI/UX ของเครื่องคิดเลขวิทยาศาสตร์สำหรับนักเรียน ม.ปลาย เท่านั้น
 * 2. ใช้ useState เดียวชื่อ "displayValue" (string) ในการเก็บนิพจน์คณิตศาสตร์ที่ผู้ใช้พิมพ์
 * 3. ทุกปุ่ม (ตัวเลข, สัญลักษณ์, ฟังก์ชั่น) ให้ append ข้อความลงใน displayValue
 *    - ปุ่ม AC (Clear): รีเซ็ต displayValue เป็น "" (ค่าว่าง)
 *    - ปุ่ม DEL (Delete): ลบตัวอักษรตัวสุดท้ายออกจาก displayValue
 * 4. ปุ่ม "=" ให้เรียกฟังก์ชัน handleCalculate() ซึ่งมีเฉพาะ comment:
 *    // TODO: ใส่ logic คำนวณตรงนี้ (ห้ามใส่ eval() หรือ library คำนวณใดๆ ทั้งสิ้น)
 */
export default function CalculatorPage() {
  // state เดียวที่เก็บข้อความหรือนิพจน์คณิตศาสตร์ที่ผู้ใช้กดพิมพ์
  const [displayValue, setDisplayValue] = useState<string>("");

  // state เก็บผลลัพธ์การคำนวณ (แสดงในบรรทัดที่ 2 ของจอ)
  const [resultValue, setResultValue] = useState<string>("");

  // state เก็บข้อความ error กรณีสมการที่พิมพ์ไม่ถูกต้อง (เช่น วงเล็บไม่ครบ)
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * ฟังก์ชันสำหรับเพิ่มตัวอักษร/สัญลักษณ์ลงใน state displayValue
   * @param val สัญลักษณ์ทางคณิตศาสตร์ที่จะต่อท้ายข้อความเดิม
   */
  const handleAppend = (val: string) => {
    setDisplayValue((prev) => prev + val);
    // เคลียร์ผลลัพธ์/error เดิมทุกครั้งที่ผู้ใช้พิมพ์ต่อ เพื่อไม่ให้ค้างของเก่า
    setResultValue("");
    setErrorMessage("");
  };

  /**
   * ฟังก์ชันสำหรับลบตัวอักษรตัวสุดท้าย (Delete / Backspace)
   */
  const handleDelete = () => {
    setDisplayValue((prev) => prev.slice(0, -1));
    setResultValue("");
    setErrorMessage("");
  };

  /**
   * ฟังก์ชันสำหรับล้างหน้าจอเป็นค่าว่าง (Clear / AC)
   */
  const handleClear = () => {
    setDisplayValue("");
    setResultValue("");
    setErrorMessage("");
  };

  /**
   * ฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้กดปุ่ม "="
   * ใช้ math.js เป็นตัวคำนวณจริง (evaluate) โดยไม่ใช้ eval() ของ JavaScript
   * เพื่อความปลอดภัย (กัน code injection) และความแม่นยำของค่าทศนิยม
   */
  const handleCalculate = () => {
    // ไม่ต้องทำอะไรถ้าจอว่างเปล่า
    if (!displayValue.trim()) {
      return;
    }

    try {
      const expression = preprocessExpression(displayValue);
      const rawResult = evaluate(expression);
      setResultValue(formatResult(rawResult));
      setErrorMessage("");
    } catch (err) {
      // ดักจับกรณีสมการผิดรูปแบบ เช่น วงเล็บไม่ครบ หรือพิมพ์สัญลักษณ์ผิด
      setResultValue("");
      setErrorMessage("รูปแบบสมการไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-purple-400 text-xs font-bold shadow-md">
            <CalcIcon className="w-4 h-4" />
            Math Companion
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            เครื่องคิดเลขวิทยาศาสตร์ <span className="text-purple-400">มัธยมปลาย</span>
          </h1>
          <p className="text-slate-400 text-sm">
            เครื่องมือช่วยคำนวณสมการฟิสิกส์ เคมี และคณิตศาสตร์ รองรับฟังก์ชันตรีโกณมิติ ลอการิทึม และยกกำลัง
          </p>
        </div>

        {/* Calculator Main Container */}
        <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
          
          {/* Subtle Glow Header */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Display Screen Box (2 Lines) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 shadow-inner text-right space-y-2">
            
            {/* Line 1: Expression Display (Text typed by user) */}
            <div className="min-h-[32px] text-slate-300 font-mono text-lg sm:text-xl tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none flex items-center justify-end">
              {displayValue ? (
                <span className="text-purple-300 font-bold">{displayValue}</span>
              ) : (
                <span className="text-slate-600 italic text-sm">ป้อนสมการหรือตัวเลข...</span>
              )}
            </div>

            {/* Line 2: Result Line (แสดงผลลัพธ์จริงจาก math.js หรือข้อความ error) */}
            <div className="min-h-[40px] text-slate-500 font-mono text-2xl sm:text-3xl font-black tracking-tight border-t border-slate-900 pt-2 flex items-center justify-between">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-600">
                [ผลลัพธ์]
              </span>
              {errorMessage ? (
                <span className="text-rose-400 text-sm sm:text-base font-sans font-bold">
                  {errorMessage}
                </span>
              ) : (
                <span className={resultValue ? "text-white" : "text-slate-400"}>
                  {resultValue || "0"}
                </span>
              )}
            </div>

          </div>

          {/* Keypad Grid Section */}
          <div className="grid grid-cols-5 gap-2.5">
            
            {/* Row 1: Scientific Functions */}
            <button
              onClick={() => handleAppend("sin(")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              sin
            </button>
            <button
              onClick={() => handleAppend("cos(")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              cos
            </button>
            <button
              onClick={() => handleAppend("tan(")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              tan
            </button>
            <button
              onClick={() => handleAppend("log(")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              log
            </button>
            <button
              onClick={() => handleAppend("ln(")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              ln
            </button>

            {/* Row 2: Powers, Roots & Constants */}
            <button
              onClick={() => handleAppend("^2")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              x²
            </button>
            <button
              onClick={() => handleAppend("^")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              x^y
            </button>
            <button
              onClick={() => handleAppend("sqrt(")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              √
            </button>
            <button
              onClick={() => handleAppend("π")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              π
            </button>
            <button
              onClick={() => handleAppend("e")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 font-mono text-sm font-bold border border-slate-700/50 shadow hover:border-purple-400/50 transition-all active:scale-95"
            >
              e
            </button>

            {/* Row 3: Brackets, Factorial & Controls */}
            <button
              onClick={() => handleAppend("(")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-mono text-sm font-bold border border-slate-700/50 shadow transition-all active:scale-95"
            >
              (
            </button>
            <button
              onClick={() => handleAppend(")")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-mono text-sm font-bold border border-slate-700/50 shadow transition-all active:scale-95"
            >
              )
            </button>
            <button
              onClick={() => handleAppend("!")}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-mono text-sm font-bold border border-slate-700/50 shadow transition-all active:scale-95"
            >
              x!
            </button>
            <button
              onClick={handleClear}
              className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-sm border border-rose-500/40 shadow transition-all active:scale-95"
            >
              AC
            </button>
            <button
              onClick={handleDelete}
              className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-sm border border-amber-500/40 shadow flex items-center justify-center transition-all active:scale-95"
            >
              <Delete className="w-5 h-5" />
            </button>

            {/* Row 4: Numbers 7, 8, 9 & Operator / */}
            <button
              onClick={() => handleAppend("7")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              7
            </button>
            <button
              onClick={() => handleAppend("8")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              8
            </button>
            <button
              onClick={() => handleAppend("9")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              9
            </button>
            <button
              onClick={() => handleAppend("/")}
              className="p-4 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-mono text-xl font-bold border border-orange-500/30 shadow transition-all active:scale-95"
            >
              ÷
            </button>
            <button
              onClick={() => handleAppend("%")}
              className="p-4 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-mono text-xl font-bold border border-orange-500/30 shadow transition-all active:scale-95"
            >
              %
            </button>

            {/* Row 5: Numbers 4, 5, 6 & Operator * */}
            <button
              onClick={() => handleAppend("4")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              4
            </button>
            <button
              onClick={() => handleAppend("5")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              5
            </button>
            <button
              onClick={() => handleAppend("6")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              6
            </button>
            <button
              onClick={() => handleAppend("*")}
              className="p-4 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-mono text-xl font-bold border border-orange-500/30 shadow transition-all active:scale-95"
            >
              ×
            </button>
            <button
              onClick={() => handleAppend("^")}
              className="p-4 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-mono text-xl font-bold border border-orange-500/30 shadow transition-all active:scale-95"
            >
              ^
            </button>

            {/* Row 6: Numbers 1, 2, 3 & Operator - */}
            <button
              onClick={() => handleAppend("1")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              1
            </button>
            <button
              onClick={() => handleAppend("2")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              2
            </button>
            <button
              onClick={() => handleAppend("3")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              3
            </button>
            <button
              onClick={() => handleAppend("-")}
              className="p-4 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-mono text-xl font-bold border border-orange-500/30 shadow transition-all active:scale-95"
            >
              -
            </button>
            <button
              onClick={() => handleAppend("+")}
              className="p-4 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-mono text-xl font-bold border border-orange-500/30 shadow transition-all active:scale-95"
            >
              +
            </button>

            {/* Row 7: Number 0, Decimal Point & Equal Button */}
            <button
              onClick={() => handleAppend("0")}
              className="col-span-2 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              0
            </button>
            <button
              onClick={() => handleAppend(".")}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-bold border border-slate-700 shadow transition-all active:scale-95"
            >
              .
            </button>
            
            {/* Equal Button (Stubs handleCalculate without logic) */}
            <button
              onClick={handleCalculate}
              className="col-span-2 p-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-slate-950 font-mono text-2xl font-black shadow-lg shadow-orange-500/30 hover:opacity-95 transition-all active:scale-95"
            >
              =
            </button>

          </div>

          {/* Dev Note Footer Info Box */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-300 mb-0.5">สถานะฟังก์ชันคำนวณ:</p>
              <p className="text-[11px] leading-relaxed text-slate-400">
                ฟังก์ชัน <code className="text-purple-300 bg-slate-900 px-1 py-0.5 rounded font-mono">handleCalculate()</code> เชื่อมกับ math.js แล้ว
                รองรับ +, -, ×, ÷, sin/cos/tan, log/ln, √, x², x^y, factorial (!), π, e และวงเล็บ
                พร้อมดักจับสมการที่พิมพ์ผิดรูปแบบ
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}