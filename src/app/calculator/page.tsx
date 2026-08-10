"use client";

import { useState } from "react";
import { Calculator as CalcIcon, Delete, RotateCcw, Sparkles, HelpCircle, Info } from "lucide-react";
import { evaluate, format, parse, MathNode } from "mathjs";

type AngleMode = "DEG" | "RAD";

/**
 * สร้าง scope object สำหรับส่งเข้า math.js evaluate()
 * เมื่อโหมดเป็น DEG จะ override ฟังก์ชัน sin/cos/tan ให้แปลงองศาเป็นเรเดียนก่อนคำนวณ
 * (ทำผ่าน scope แทนการแก้ไขข้อความสมการ เพื่อไม่ให้เกิดปัญหากับวงเล็บซ้อนหลายชั้น)
 *
 * @param mode โหมดมุมปัจจุบัน ("DEG" หรือ "RAD")
 * @returns scope object พร้อมส่งเข้า evaluate(expr, scope)
 */
function getAngleScope(mode: AngleMode): Record<string, (x: number) => number> {
  if (mode === "RAD") {
    // โหมด RAD ใช้ค่า default ของ math.js ตรงๆ ไม่ต้อง override อะไร
    return {};
  }
  return {
    sin: (x: number) => Math.sin((x * Math.PI) / 180),
    cos: (x: number) => Math.cos((x * Math.PI) / 180),
    tan: (x: number) => Math.tan((x * Math.PI) / 180),
  };
}

/**
 * โครงสร้างข้อมูลของ 1 ขั้นตอนการคำนวณ ใช้แสดงใน panel "ดูวิธีคิด"
 */
type CalculationStep = {
  id: string;
  expression: string; // ส่วนของสมการที่คำนวณในขั้นนี้ เช่น "sin(30)"
  result: string; // ผลลัพธ์ของขั้นนี้ เช่น "0.5"
  description: string; // คำอธิบายภาษาไทยว่าทำไมต้องคิดขั้นนี้
};

// พจนานุกรมแปลชื่อฟังก์ชัน/ตัวดำเนินการของ math.js เป็นคำอธิบายภาษาไทย
const FUNCTION_LABELS: Record<string, string> = {
  sin: "คำนวณค่าไซน์ (sin)",
  cos: "คำนวณค่าโคไซน์ (cos)",
  tan: "คำนวณค่าแทนเจนต์ (tan)",
  log10: "คำนวณลอการิทึม ฐาน 10",
  log: "คำนวณลอการิทึมธรรมชาติ (ln)",
  sqrt: "คำนวณรากที่สอง",
  factorial: "คำนวณแฟกทอเรียล",
};

const OPERATOR_LABELS: Record<string, string> = {
  "+": "บวก",
  "-": "ลบ",
  "*": "คูณ (ทำก่อนบวก/ลบ ตามลำดับการดำเนินการ)",
  "/": "หาร (ทำก่อนบวก/ลบ ตามลำดับการดำเนินการ)",
  "^": "ยกกำลัง (ทำก่อนคูณ/หาร ตามลำดับการดำเนินการ)",
};

/**
 * เดินตามต้นไม้โครงสร้างสมการ (Expression Tree) ของ math.js แบบ post-order
 * (ประมวลผลกิ่งในสุด/วงเล็บก่อน) เพื่อสร้างรายการขั้นตอนการคำนวณทีละขั้น
 * ตรงกับลำดับการคำนวณจริงตามหลัก BODMAS ที่ math.js parser จัดลำดับไว้ให้แล้ว
 *
 * @param node ต้นไม้โครงสร้างสมการจาก math.parse()
 * @param steps อาเรย์ที่สะสมผลลัพธ์แต่ละขั้น (ส่งต่อแบบ mutate เพื่อความง่าย)
 * @returns ผลลัพธ์ตัวเลขของกิ่งนี้ (ใช้ให้กิ่งแม่เรียกต่อ)
 */
function walkAndCollectSteps(
  node: MathNode,
  steps: CalculationStep[],
  scope: Record<string, unknown>
): number {
  // FunctionNode คือฟังก์ชัน เช่น sin(30), sqrt(16)
  if (node.type === "FunctionNode") {
    const fnNode = node as unknown as { fn: { name: string }; args: MathNode[] };
    const fnName = fnNode.fn.name;
    const argValues = fnNode.args.map((arg) => walkAndCollectSteps(arg, steps, scope));
    const value = evaluate(node.toString(), scope);

    steps.push({
      id: `step-${steps.length}`,
      expression: `${fnName}(${argValues.join(", ")})`,
      result: formatResult(value),
      description: FUNCTION_LABELS[fnName] ?? `คำนวณฟังก์ชัน ${fnName}`,
    });

    return typeof value === "number" ? value : Number(value);
  }

  // OperatorNode คือตัวดำเนินการ เช่น +, -, *, /, ^
  if (node.type === "OperatorNode") {
    const opNode = node as unknown as { op: string; args: MathNode[] };
    const leftVal = walkAndCollectSteps(opNode.args[0], steps, scope);

    // ตัวดำเนินการเอกภาค (unary) เช่น เครื่องหมายลบหน้าตัวเลข -5 มีแค่ args เดียว
    if (opNode.args.length === 1) {
      const value = evaluate(node.toString(), scope);
      return typeof value === "number" ? value : Number(value);
    }

    const rightVal = walkAndCollectSteps(opNode.args[1], steps, scope);
    const value = evaluate(node.toString(), scope);

    steps.push({
      id: `step-${steps.length}`,
      expression: `${formatResult(leftVal)} ${opNode.op} ${formatResult(rightVal)}`,
      result: formatResult(value),
      description: OPERATOR_LABELS[opNode.op] ?? `ดำเนินการ ${opNode.op}`,
    });

    return typeof value === "number" ? value : Number(value);
  }

  // ParenthesisNode คือวงเล็บ ให้ข้ามไปดูข้างในตรงๆ ไม่ต้องสร้าง step แยก
  if (node.type === "ParenthesisNode") {
    const parenNode = node as unknown as { content: MathNode };
    return walkAndCollectSteps(parenNode.content, steps, scope);
  }

  // ConstantNode / SymbolNode (ตัวเลขหรือค่าคงที่ล้วนๆ เช่น pi, e) ไม่ต้องสร้าง step
  const leafValue = evaluate(node.toString(), scope);
  return typeof leafValue === "number" ? leafValue : Number(leafValue);
}

/**
 * ฟังก์ชันหลักสำหรับสร้างขั้นตอนวิธีคิดจากข้อความสมการ
 * ใช้เรียกพร้อมกับตอนกดปุ่ม "=" เพื่อเตรียมข้อมูลไว้ให้ panel "ดูวิธีคิด"
 *
 * @param expr ข้อความสมการที่ preprocess แล้ว (พร้อมส่งเข้า math.js)
 * @param scope scope object สำหรับควบคุมโหมด DEG/RAD (จาก getAngleScope)
 * @returns รายการขั้นตอนการคำนวณ เรียงตามลำดับที่คำนวณจริง
 */
function generateSteps(expr: string, scope: Record<string, unknown>): CalculationStep[] {
  const steps: CalculationStep[] = [];
  const tree = parse(expr);
  walkAndCollectSteps(tree, steps, scope);
  return steps;
}

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
 * หมายเหตุสำคัญ: ค่า default ของ math.js (notation: "auto") จะสลับเป็น
 * scientific notation (เช่น 3.6288e+5) ทันทีที่ค่าตั้งแต่ 100,000 ขึ้นไป
 * ซึ่งเกณฑ์นี้ไวเกินไปสำหรับเครื่องคิดเลขทั่วไป (9! = 362880 ไม่ควรโดนแปลง)
 * จึงบังคับใช้ notation "fixed" สำหรับตัวเลขที่ยังไม่ใหญ่มาก แล้วค่อยสลับ
 * ไปใช้ "auto" เฉพาะตัวเลขที่ใหญ่/เล็กเกินไปจริงๆ (เกิน 15 หลัก) เพื่อไม่ให้
 * จอล้นด้วยเลขยาวเป็นพรืด
 *
 * @param value ผลลัพธ์ดิบที่ได้จาก math.js (อาจเป็น number, Fraction, Complex ฯลฯ)
 * @returns ข้อความผลลัพธ์ที่พร้อมแสดงผล
 */
function formatResult(value: unknown): string {
  if (typeof value === "number") {
    const absValue = Math.abs(value);
    const isExtremeMagnitude = absValue !== 0 && (absValue >= 1e15 || absValue < 1e-9);

    if (isExtremeMagnitude) {
      // เลขใหญ่/เล็กเกินไปจริงๆ ค่อยใช้ scientific notation กันจอล้น
      return format(value, { precision: 12, notation: "auto" });
    }

    // กรณีทั่วไป บังคับแสดงเป็นเลขเต็มตามปกติ (ไม่ใช้ scientific notation)
    // notation "fixed" จะโชว์ทศนิยม 12 หลักเต็มเสมอ (เช่น "362880.000000000000")
    // จึงต้องตัดเลข 0 ท้ายทศนิยมที่ไม่มีความหมายออก และตัดจุดทศนิยมทิ้งถ้าไม่เหลือหลักใดๆ
    const fixedStr = format(value, { precision: 12, notation: "fixed" });
    return fixedStr.includes(".")
      ? fixedStr.replace(/0+$/, "").replace(/\.$/, "")
      : fixedStr;
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

  // state เก็บรายการขั้นตอนวิธีคิด (คำนวณพร้อมกับตอนกด "=" เก็บไว้เฉยๆ)
  const [steps, setSteps] = useState<CalculationStep[]>([]);

  // state ควบคุมว่ากำลังเปิด panel "ดูวิธีคิด" อยู่หรือไม่
  const [showSteps, setShowSteps] = useState<boolean>(false);

  // state โหมดหน่วยมุมของ sin/cos/tan (DEG = องศา, RAD = เรเดียน)
  // ค่าเริ่มต้นเป็น DEG เพราะนักเรียน ม.ปลาย คุ้นเคยกับหน่วยองศามากกว่า
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");

  /**
   * ฟังก์ชันสำหรับเพิ่มตัวอักษร/สัญลักษณ์ลงใน state displayValue
   * @param val สัญลักษณ์ทางคณิตศาสตร์ที่จะต่อท้ายข้อความเดิม
   */
  /**
   * ฟังก์ชันสลับโหมดหน่วยมุม DEG/RAD
   * ต้องเคลียร์ผลลัพธ์/steps เดิมด้วย เพราะคำตอบของ sin/cos/tan จะเปลี่ยนไปตามโหมด
   * (ผลลัพธ์เก่าที่ค้างอยู่จะกลายเป็นค่าที่คำนวณผิดโหมดทันทีถ้าไม่เคลียร์)
   */
  const toggleAngleMode = (mode: AngleMode) => {
    setAngleMode(mode);
    setResultValue("");
    setErrorMessage("");
    setSteps([]);
    setShowSteps(false);
  };

  const handleAppend = (val: string) => {
    setDisplayValue((prev) => prev + val);
    // เคลียร์ผลลัพธ์/error/steps เดิมทุกครั้งที่ผู้ใช้พิมพ์ต่อ เพื่อไม่ให้ค้างของเก่า
    setResultValue("");
    setErrorMessage("");
    setSteps([]);
    setShowSteps(false);
  };

  /**
   * ฟังก์ชันสำหรับลบตัวอักษรตัวสุดท้าย (Delete / Backspace)
   */
  const handleDelete = () => {
    setDisplayValue((prev) => prev.slice(0, -1));
    setResultValue("");
    setErrorMessage("");
    setSteps([]);
    setShowSteps(false);
  };

  /**
   * ฟังก์ชันสำหรับล้างหน้าจอเป็นค่าว่าง (Clear / AC)
   */
  const handleClear = () => {
    setDisplayValue("");
    setResultValue("");
    setErrorMessage("");
    setSteps([]);
    setShowSteps(false);
  };

  /**
   * ฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้กดปุ่ม "="
   * ใช้ math.js เป็นตัวคำนวณจริง (evaluate) โดยไม่ใช้ eval() ของ JavaScript
   * เพื่อความปลอดภัย (กัน code injection) และความแม่นยำของค่าทศนิยม
   * พร้อมสร้างขั้นตอนวิธีคิด (steps) เก็บไว้สำหรับ panel "ดูวิธีคิด"
   */
  const handleCalculate = () => {
    // ไม่ต้องทำอะไรถ้าจอว่างเปล่า
    if (!displayValue.trim()) {
      return;
    }

    try {
      const expression = preprocessExpression(displayValue);
      const scope = getAngleScope(angleMode);
      const rawResult = evaluate(expression, scope);
      setResultValue(formatResult(rawResult));
      setErrorMessage("");

      // สร้างขั้นตอนวิธีคิด ดักจับ error แยกจากการคำนวณหลัก
      // เผื่อกรณีที่ evaluate() ผ่านแต่ parse tree walker มีปัญหา (เช่น syntax แปลกๆ)
      try {
        setSteps(generateSteps(expression, scope));
      } catch {
        setSteps([]);
      }
    } catch (err) {
      // ดักจับกรณีสมการผิดรูปแบบ เช่น วงเล็บไม่ครบ หรือพิมพ์สัญลักษณ์ผิด
      setResultValue("");
      setErrorMessage("รูปแบบสมการไม่ถูกต้อง");
      setSteps([]);
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

          {/* DEG/RAD Toggle - สลับหน่วยมุมสำหรับ sin/cos/tan */}
          <div className="flex justify-end mb-3">
            <div className="inline-flex bg-slate-950 border border-slate-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => toggleAngleMode("DEG")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  angleMode === "DEG"
                    ? "bg-purple-500/30 text-purple-200 border border-purple-400/50"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                DEG
              </button>
              <button
                onClick={() => toggleAngleMode("RAD")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  angleMode === "RAD"
                    ? "bg-purple-500/30 text-purple-200 border border-purple-400/50"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                RAD
              </button>
            </div>
          </div>

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

          {/* ปุ่ม "ดูวิธีคิด" - โผล่เฉพาะตอนมีผลลัพธ์และมีมากกว่า 1 ขั้นตอน */}
          {steps.length > 1 && (
            <button
              onClick={() => setShowSteps((prev) => !prev)}
              className="w-full mb-4 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {showSteps ? "ซ่อนวิธีคิด" : "ดูวิธีคิด"}
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Steps Panel - แสดงขั้นตอนการคำนวณทีละขั้น */}
          {showSteps && steps.length > 1 && (
            <div className="mb-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              {steps.map((step, index) => {
                const isLastStep = index === steps.length - 1;
                return (
                  <div key={step.id} className="flex gap-2.5 items-start">
                    <div
                      className={`min-w-[22px] h-[22px] rounded-md text-xs font-bold flex items-center justify-center ${
                        isLastStep
                          ? "bg-orange-900/60 text-orange-200"
                          : "bg-purple-900/60 text-purple-200"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-sm text-slate-200">
                        {step.expression} ={" "}
                        <span className={isLastStep ? "text-white font-bold" : "text-amber-400 font-bold"}>
                          {step.result}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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