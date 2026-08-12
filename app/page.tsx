'use client';

import { useMemo, useState } from 'react';

type LessonId =
  | 'intro'
  | 'objective'
  | 'numberSystem'
  | 'conversion'
  | 'examples'
  | 'tool'
  | 'quiz';

type Lesson = {
  id: LessonId;
  label: string;
  title: string;
};

const lessons: Lesson[] = [
  { id: 'intro', label: '01 บทนำ', title: 'บทนำ' },
  { id: 'objective', label: '02 จุดประสงค์', title: 'จุดประสงค์' },
  { id: 'numberSystem', label: '03 ระบบเลขฐาน 2 และ 10', title: 'ระบบเลขฐาน' },
  { id: 'conversion', label: '04 หลักการแปลงเลข', title: 'หลักการแปลงเลข' },
  { id: 'examples', label: '05 ตัวอย่างวิธีทำ', title: 'ตัวอย่างวิธีทำ' },
  { id: 'tool', label: '06 เครื่องมือคำนวณ Interactive', title: 'เครื่องมือคำนวณ' },
  { id: 'quiz', label: '07 แบบฝึกหัดทดสอบความเข้าใจ', title: 'แบบฝึกหัด' },
];

function binaryToDecimal(value: string): string {
  const input = value.trim();
  if (!input) return '0';
  if (!/^[01]+$/.test(input)) return 'กรอกเฉพาะ 0 และ 1 เท่านั้น';

  let result = 0;
  for (let i = 0; i < input.length; i += 1) {
    const bit = Number(input[i]);
    const weight = 2 ** (input.length - i - 1);
    result += bit * weight;
  }

  return result.toString();
}

function decimalToBinary(value: string): string {
  const input = value.trim();
  if (!input) return '0';
  if (!/^\d+$/.test(input)) return 'กรอกเลขจำนวนเต็มบวกเท่านั้น';

  const number = Number(input);
  if (!Number.isSafeInteger(number) || number < 0) {
    return 'เลขต้องเป็นจำนวนเต็มที่ปลอดภัย';
  }

  if (number === 0) return '0';

  let result = '';
  let current = number;

  while (current > 0) {
    result = `${current % 2}${result}`;
    current = Math.floor(current / 2);
  }

  return result;
}

function createQuizQuestion() {
  const value = Math.floor(Math.random() * 128) + 1;
  return {
    value,
    prompt: `แปลง ${value} จากฐาน 10 เป็นฐาน 2`,
    answer: decimalToBinary(String(value)),
  };
}

export default function Home() {
  const [activeLesson, setActiveLesson] = useState<LessonId>('intro');
  const [binaryInput, setBinaryInput] = useState('101101');
  const [decimalInput, setDecimalInput] = useState('45');
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0, 1, 0, 1]);
  const [expandedConcept, setExpandedConcept] = useState('why-binary');
  const [quiz, setQuiz] = useState(createQuizQuestion());
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<{ status: 'idle' | 'correct' | 'wrong'; message: string }>({
    status: 'idle',
    message: '',
  });

  const binaryFromBits = bits.join('');
  const convertedDecimal = useMemo(() => binaryToDecimal(binaryFromBits), [binaryFromBits]);
  const conversionFromBinary = useMemo(() => binaryToDecimal(binaryInput), [binaryInput]);
  const conversionFromDecimal = useMemo(() => decimalToBinary(decimalInput), [decimalInput]);

  const binaryBreakdown = useMemo(() => {
    const normalized = binaryInput.trim() || '0';
    return Array.from(normalized).map((digit, index) => {
      const position = normalized.length - index - 1;
      const weight = 2 ** position;
      return {
        digit,
        position,
        weight,
        value: Number(digit) * weight,
      };
    });
  }, [binaryInput]);

  const decimalBreakdown = useMemo(() => {
    const value = Number(decimalInput);
    if (!Number.isFinite(value) || value < 0) {
      return [] as Array<{ step: string }>;
    }

    const rows: Array<{ step: string }> = [];
    let current = value;

    while (current > 0) {
      const quotient = Math.floor(current / 2);
      const remainder = current % 2;
      rows.push({ step: `${current} ÷ 2 = ${quotient} เศษ ${remainder}` });
      current = quotient;
    }

    return rows;
  }, [decimalInput]);

  const toggleBit = (index: number) => {
    setBits((current) => current.map((bit, bitIndex) => (bitIndex === index ? (bit === 1 ? 0 : 1) : bit)));
  };

  const handleQuizSubmit = () => {
    const normalized = quizAnswer.trim().replace(/^0+/, '') || '0';
    const correct = normalized === quiz.answer;

    setQuizFeedback({
      status: correct ? 'correct' : 'wrong',
      message: correct
        ? 'ถูกต้อง! คุณเข้าใจหลักการแปลงเลขฐาน 10 เป็นฐาน 2 แล้ว'
        : `คำตอบที่ถูกต้องคือ ${quiz.answer}`,
    });
  };

  const handleQuizReveal = () => {
    setQuizFeedback({
      status: 'wrong',
      message: `วิธีทำ: ${quiz.value} ÷ 2 จนกว่าจะได้ 0 แล้วอ่านเศษจากล่างขึ้นบน => ${quiz.answer}`,
    });
  };

  const renderContent = () => {
    switch (activeLesson) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-cyan-500/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.82))] p-6 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 01</p>
              <h2 className="mt-3 text-3xl font-black text-white">ทำไมคอมพิวเตอร์ใช้เลขฐาน 2</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
                คอมพิวเตอร์ทำงานกับสัญญาณแรงดันไฟฟ้า 2 สภาวะเท่านั้น: High (5V / 3.3V = บิต 1) และ Low (0V = บิต 0)
                ดังนั้นจึงใช้ระบบเลขฐาน 2 เพื่อแทนข้อมูลได้อย่างมีประสิทธิภาพและเสถียร
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
                <p className="text-lg font-bold text-white">ประเด็นหลัก</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">HIGH</span>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="mt-4 text-4xl font-black text-emerald-300">1</div>
                    <p className="mt-2 text-sm text-emerald-100">แรงดันสูง = สวิตช์เปิด = บิต 1</p>
                  </div>

                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-200">LOW</span>
                      <span className="text-2xl">🔌</span>
                    </div>
                    <div className="mt-4 text-4xl font-black text-rose-300">0</div>
                    <p className="mt-2 text-sm text-rose-100">แรงดันต่ำ = สวิตช์ปิด = บิต 0</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm leading-6 text-cyan-50">
                  <span className="font-bold text-cyan-100">Transistor และ Logic Switch</span> เป็นชิ้นส่วนฮาร์ดแวร์ที่เก็บสถานะเปิด/ปิด
                  ได้จริงในวงจรดิจิทัล เพื่อให้คอมพิวเตอร์แปลข้อมูลเป็นบิตและประมวลผลแบบไบนารี
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-slate-950 p-5 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">Comparison</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3">
                    <div className="text-sm font-semibold text-slate-200">ฐาน 10</div>
                    <div className="mt-2 text-3xl font-black text-white">0–9</div>
                  </div>
                  <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                    <div className="text-sm font-semibold text-cyan-100">ฐาน 2</div>
                    <div className="mt-2 text-3xl font-black text-cyan-300">0–1</div>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-100">
                  เสถียรกว่า และทนต่อสัญญาณรบกวน Noise Margin ได้ดีขึ้น เมื่อเทียบกับการใช้ 10 สภาวะในระบบแบบอนาล็อก
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-lg font-bold text-white">ตารางเปรียบเทียบสภาวะดิจิทัล</p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-300">
                      <th className="px-3 py-2">ความหมาย</th>
                      <th className="px-3 py-2">แรงดัน</th>
                      <th className="px-3 py-2">บิต</th>
                      <th className="px-3 py-2">ผลต่อวงจร</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700 text-slate-100">
                      <td className="px-3 py-2">High</td>
                      <td className="px-3 py-2">5V / 3.3V</td>
                      <td className="px-3 py-2">1</td>
                      <td className="px-3 py-2">สวิตช์เปิด, ไฟฟ้าผ่าน</td>
                    </tr>
                    <tr className="text-slate-100">
                      <td className="px-3 py-2">Low</td>
                      <td className="px-3 py-2">0V</td>
                      <td className="px-3 py-2">0</td>
                      <td className="px-3 py-2">สวิตช์ปิด, ไฟฟ้าไม่ผ่าน</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'objective':
        return (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 02</p>
              <h2 className="mt-3 text-3xl font-black text-white">จุดประสงค์การเรียนรู้</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
                <p className="text-lg font-bold text-white">เป้าหมาย</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li className="rounded-2xl border border-slate-700 bg-slate-800 p-3">เข้าใจว่าทำไมคอมพิวเตอร์ใช้ 0 และ 1</li>
                  <li className="rounded-2xl border border-slate-700 bg-slate-800 p-3">แปลงเลขฐานได้ระหว่าง 2 กับ 10 ได้ถูกต้อง</li>
                  <li className="rounded-2xl border border-slate-700 bg-slate-800 p-3">ใช้ทักษะการคิดเชิงตรรกะและอัลกอริทึม</li>
                  <li className="rounded-2xl border border-slate-700 bg-slate-800 p-3">วิเคราะห์ข้อมูลแบบดิจิทัลในระดับฮาร์ดแวร์</li>
                </ul>
              </div>

              <div className="rounded-[26px] border border-cyan-500/30 bg-cyan-500/5 p-6 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                <p className="text-lg font-bold text-cyan-100">ทักษะที่ได้รับ</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Logic Thinking', 'Positional Math', 'Binary Conversion', 'Digital Analysis'].map((skill) => (
                    <span key={skill} className="rounded-full border border-cyan-500/30 bg-slate-900 px-3 py-2 text-sm font-medium text-cyan-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'numberSystem':
        return (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 03</p>
              <h2 className="mt-3 text-3xl font-black text-white">ระบบเลขฐาน 2 และ 10</h2>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-300">
                      <th className="px-3 py-2">ฐาน</th>
                      <th className="px-3 py-2">ชุดค่าที่ใช้</th>
                      <th className="px-3 py-2">ตัวอย่าง</th>
                      <th className="px-3 py-2">การใช้งาน</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700 text-slate-100">
                      <td className="px-3 py-2 font-bold">2</td>
                      <td className="px-3 py-2">0, 1</td>
                      <td className="px-3 py-2">101101₂</td>
                      <td className="px-3 py-2">ดิจิทัล/ฮาร์ดแวร์</td>
                    </tr>
                    <tr className="border-b border-slate-700 text-slate-100">
                      <td className="px-3 py-2 font-bold">8</td>
                      <td className="px-3 py-2">0–7</td>
                      <td className="px-3 py-2">75₈</td>
                      <td className="px-3 py-2">ระบบแบบเก่า</td>
                    </tr>
                    <tr className="border-b border-slate-700 text-slate-100">
                      <td className="px-3 py-2 font-bold">10</td>
                      <td className="px-3 py-2">0–9</td>
                      <td className="px-3 py-2">45₁₀</td>
                      <td className="px-3 py-2">มนุษย์และชีวิตประจำวัน</td>
                    </tr>
                    <tr className="text-slate-100">
                      <td className="px-3 py-2 font-bold">16</td>
                      <td className="px-3 py-2">0–9, A–F</td>
                      <td className="px-3 py-2">2D₁₆</td>
                      <td className="px-3 py-2">สี, memory address</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
                <p className="text-lg font-bold text-white">Positional Notation System</p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  ในระบบเลขฐาน 2 แต่ละบิตมีค่าตามตำแหน่ง เช่น 2⁰, 2¹, 2², 2³ ...
                  หลักขวาสุดคือ 2⁰ แล้วเพิ่มขึ้นทีละ 1 เมื่อเลื่อนไปทางซ้าย
                </p>
                <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-800 p-4 text-base font-semibold text-cyan-100">
                  101101₂ = 1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 0×2¹ + 1×2⁰
                </div>
              </div>

              <div className="rounded-[26px] border border-cyan-500/30 bg-cyan-500/5 p-6 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                <p className="text-lg font-bold text-cyan-100">MSB / LSB</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-cyan-50">
                  <li className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-3"><span className="font-bold text-cyan-200">MSB</span> = Most Significant Bit, ค่าสูงสุดอยู่ทางซ้ายสุด</li>
                  <li className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-3"><span className="font-bold text-cyan-200">LSB</span> = Least Significant Bit, ค่าน้อยสุดอยู่ทางขวาสุด</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[26px] border border-cyan-500/30 bg-slate-950 p-5 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200">Power of 2</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {[
                  { power: '2⁰', value: '1' },
                  { power: '2¹', value: '2' },
                  { power: '2²', value: '4' },
                  { power: '2³', value: '8' },
                  { power: '2⁴', value: '16' },
                  { power: '2⁵', value: '32' },
                  { power: '2⁶', value: '64' },
                  { power: '2⁷', value: '128' },
                ].map((item) => (
                  <div key={item.power} className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-3 text-center">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">{item.power}</div>
                    <div className="mt-2 text-xl font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="rounded-[24px] border border-slate-700 bg-slate-900 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Bit</p>
                <p className="mt-3 text-3xl font-black text-white">1</p>
                <p className="mt-2 text-sm text-slate-300">หน่วยข้อมูลที่เล็กที่สุด</p>
              </div>
              <div className="rounded-[24px] border border-slate-700 bg-slate-900 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Nibble</p>
                <p className="mt-3 text-3xl font-black text-white">4 bits</p>
                <p className="mt-2 text-sm text-slate-300">เก็บค่าได้ 0–15</p>
              </div>
              <div className="rounded-[24px] border border-slate-700 bg-slate-900 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Byte</p>
                <p className="mt-3 text-3xl font-black text-white">8 bits</p>
                <p className="mt-2 text-sm text-slate-300">เก็บค่าได้ 0–255</p>
              </div>
            </div>
          </div>
        );

      case 'conversion':
        return (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 04</p>
              <h2 className="mt-3 text-3xl font-black text-white">หลักการแปลงเลข</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[26px] border border-cyan-500/30 bg-slate-950 p-6 text-slate-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                <p className="text-lg font-bold text-cyan-300">10 → 2 : Successive Division</p>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">1. หารเลขด้วย 2</li>
                  <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">2. เก็บเศษจากแต่ละรอบ</li>
                  <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">3. ทำซ้ำจนผลหารเป็น 0</li>
                  <li className="rounded-2xl border border-slate-800 bg-slate-900 p-3">4. อ่านเศษจากล่างขึ้นบน</li>
                </ol>
                <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-sm text-slate-100">
                  45 → 22 เศษ 1 → 11 เศษ 0 → 5 เศษ 1 → 2 เศษ 1 → 1 เศษ 0 → 0 เศษ 1
                  <div className="mt-3 text-base font-black text-emerald-300">= 101101₂</div>
                </div>
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-100">
                  Subtraction Method: ลบด้วยค่ากำลังของ 2 ที่ใหญ่ที่สุดที่ยังไม่เกินค่านั้น แล้วทำซ้ำจนเหลือ 0
                </div>
              </div>

              <div className="rounded-[26px] border border-cyan-500/30 bg-cyan-500/5 p-6 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                <p className="text-lg font-bold text-cyan-100">2 → 10 : Sum of Positional Weights</p>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  <li className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-3">1. เริ่มจากบิตซ้ายสุดไปทางขวา</li>
                  <li className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-3">2. นำบิตคูณด้วยค่าประจำตำแหน่ง 2ⁿ</li>
                  <li className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-3">3. รวมผลรวมทั้งหมด</li>
                </ol>
                <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-base font-semibold text-slate-100">
                  101101₂ = 1×32 + 0×16 + 1×8 + 1×4 + 0×2 + 1×1 = 45₁₀
                </div>
              </div>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 05</p>
              <h2 className="mt-3 text-3xl font-black text-white">ตัวอย่างวิธีทำอย่างละเอียด</h2>
            </div>

            <div className="rounded-[26px] border border-emerald-500/30 bg-slate-950 p-6 text-slate-100 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
              <p className="text-lg font-bold text-emerald-300">ตัวอย่างที่ 1: 156₁₀ → 10011100₂</p>
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-300">
                      <th className="px-3 py-2">ผลหาร</th>
                      <th className="px-3 py-2">เศษ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700"><td className="px-3 py-2">156 ÷ 2 = 78</td><td className="px-3 py-2">0</td></tr>
                    <tr className="border-b border-slate-700"><td className="px-3 py-2">78 ÷ 2 = 39</td><td className="px-3 py-2">0</td></tr>
                    <tr className="border-b border-slate-700"><td className="px-3 py-2">39 ÷ 2 = 19</td><td className="px-3 py-2">1</td></tr>
                    <tr className="border-b border-slate-700"><td className="px-3 py-2">19 ÷ 2 = 9</td><td className="px-3 py-2">1</td></tr>
                    <tr className="border-b border-slate-700"><td className="px-3 py-2">9 ÷ 2 = 4</td><td className="px-3 py-2">1</td></tr>
                    <tr className="border-b border-slate-700"><td className="px-3 py-2">4 ÷ 2 = 2</td><td className="px-3 py-2">0</td></tr>
                    <tr className="border-b border-slate-700"><td className="px-3 py-2">2 ÷ 2 = 1</td><td className="px-3 py-2">0</td></tr>
                    <tr><td className="px-3 py-2">1 ÷ 2 = 0</td><td className="px-3 py-2">1</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-100">
                อ่านเศษจากล่างขึ้นบน: 10011100₂
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-lg font-bold text-white">ตัวอย่างที่ 2: 11010110₂ → 214₁₀</p>
              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">1×2⁷ = 1×128 = 128</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">1×2⁶ = 1×64 = 64</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">0×2⁵ = 0</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">1×2⁴ = 1×16 = 16</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">0×2³ = 0</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">1×2² = 1×4 = 4</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">1×2¹ = 1×2 = 2</div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3">0×2⁰ = 0</div>
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-3 font-semibold text-cyan-100">
                  128 + 64 + 16 + 4 + 2 = 214
                </div>
              </div>
            </div>
          </div>
        );

      case 'tool':
        return (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 06</p>
              <h2 className="mt-3 text-3xl font-black text-white">เครื่องมือแปลงเลข Interactive</h2>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-[26px] border border-cyan-500/30 bg-slate-950/80 p-5 text-white shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                <p className="text-lg font-bold text-cyan-300">Bit Visualizer Engine</p>
                <div className="mt-5 grid grid-cols-8 gap-2">
                  {bits.map((bit, index) => {
                    const weight = 128 >> index;
                    const isOn = bit === 1;

                    return (
                      <div key={`bit-${index}`} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">2^{7 - index}</span>
                        <button
                          type="button"
                          onClick={() => toggleBit(index)}
                          className={`flex h-14 w-12 items-center justify-center rounded-xl border text-xl font-black transition ${
                            isOn
                              ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.55)]'
                              : 'border-slate-700 bg-slate-800 text-slate-500'
                          }`}
                        >
                          {bit}
                        </button>
                        <span className="text-[10px] text-slate-400">{weight}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 rounded-2xl bg-slate-900/80 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Binary Signal</div>
                  <div className="mt-2 text-2xl font-black text-cyan-300">{binaryFromBits}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">Decimal Result</div>
                  <div className="mt-2 text-3xl font-black text-emerald-300">{convertedDecimal}</div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
                  <p className="text-lg font-bold text-white">ฐาน 2 → ฐาน 10</p>
                  <input
                    type="text"
                    value={binaryInput}
                    onChange={(event) => setBinaryInput(event.target.value.replace(/[^01]/g, ''))}
                    className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-lg font-semibold text-white outline-none focus:border-cyan-500"
                    placeholder="เช่น 11010110"
                  />
                  <div className="mt-4 rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-100">
                    <div className="font-semibold">ผลลัพธ์</div>
                    <div className="mt-2 text-3xl font-black">{conversionFromBinary}</div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Live Breakdown</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      {binaryBreakdown.map((entry, index) => (
                        <div key={`${entry.position}-${index}`} className="rounded-xl bg-slate-900 p-2 ring-1 ring-slate-700">
                          {entry.digit} × 2^{entry.position} = {entry.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
                  <p className="text-lg font-bold text-white">ฐาน 10 → ฐาน 2</p>
                  <input
                    type="number"
                    min="0"
                    value={decimalInput}
                    onChange={(event) => setDecimalInput(event.target.value)}
                    className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-lg font-semibold text-white outline-none focus:border-cyan-500"
                    placeholder="เช่น 214"
                  />
                  <div className="mt-4 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-100">
                    <div className="font-semibold">ผลลัพธ์</div>
                    <div className="mt-2 text-3xl font-black">{conversionFromDecimal}</div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Live Breakdown</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      {decimalBreakdown.length > 0 ? (
                        decimalBreakdown.map((row, index) => (
                          <div key={`${row.step}-${index}`} className="rounded-xl bg-slate-900 p-2 ring-1 ring-slate-700">
                            {row.step}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl bg-slate-900 p-2 ring-1 ring-slate-700">กรอกเลขค่าแปลงเพื่อแสดงขั้นตอน</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="rounded-[26px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 07</p>
              <h2 className="mt-3 text-3xl font-black text-white">แบบฝึกหัดความเข้าใจ</h2>
            </div>

            <div className="rounded-[26px] border border-cyan-500/30 bg-slate-950 p-6 text-white shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <p className="text-lg font-bold text-cyan-300">โจทย์สุ่ม</p>
              <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-lg font-semibold text-cyan-100">
                {quiz.prompt}
              </div>

              <label className="mt-5 block text-sm font-semibold text-slate-300">กรอกคำตอบ</label>
              <input
                type="text"
                value={quizAnswer}
                onChange={(event) => setQuizAnswer(event.target.value.replace(/[^01]/g, ''))}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-lg font-semibold text-white outline-none focus:border-cyan-500"
                placeholder="ใส่เลขฐาน 2"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:bg-cyan-400"
                >
                  ตรวจคำตอบ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuiz(createQuizQuestion());
                    setQuizAnswer('');
                    setQuizFeedback({ status: 'idle', message: '' });
                  }}
                  className="rounded-full border border-slate-600 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-800"
                >
                  สุ่มโจทย์ใหม่
                </button>
                <button
                  type="button"
                  onClick={handleQuizReveal}
                  className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/15"
                >
                  ดูเฉลยวิธีทำ
                </button>
              </div>

              {quizFeedback.message ? (
                <div
                  className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                    quizFeedback.status === 'correct'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-100'
                  }`}
                >
                  {quizFeedback.message}
                </div>
              ) : null}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_35%,_#020817_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="rounded-[30px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(14,116,144,0.38),rgba(15,23,42,0.92),rgba(6,182,212,0.25))] p-6 shadow-[0_0_50px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-cyan-200">Binary & Decimal Interactive Studio</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Base Learning</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
                ระบบเลขฐานสำหรับคอมพิวเตอร์ — เรียนรู้จากสัญญาณดิจิทัล, อัลกอริทึมการแปลงเลข, และเครื่องมือประเมินผลแบบเรียลไทม์
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              LIVE SYSTEM
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/60 p-4 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Course Modules</p>
            <nav className="space-y-2">
              {lessons.map((lesson) => {
                const isActive = activeLesson === lesson.id;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLesson(lesson.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition-all ${
                      isActive
                        ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                        : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm font-semibold">{lesson.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{lesson.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-6">
            {renderContent()}
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Studio Status</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">System</div>
                  <div className="mt-2 text-2xl font-black text-emerald-300">Binary Ready</div>
                </div>
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Signal State</div>
                  <div className="mt-2 text-2xl font-black text-cyan-300">{binaryFromBits}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Logic Cards</p>
              <div className="mt-4 space-y-3">
                {[
                  { id: 'why-binary', title: 'ทำไมใช้เลขฐาน 2', body: 'คอมพิวเตอร์มีเพียงสองสถานะทางไฟฟ้า ดังนั้นระบบ 2-state จึงมีความเสถียรและง่ายต่อการประมวลผล' },
                  { id: 'sum-of-products', title: 'วิธีคูณกระจาย', body: 'แปลงเลขฐาน 2 เป็นฐาน 10 โดยนำบิตแต่ละตัวคูณด้วยค่าประจำตำแหน่ง 2^n และรวมผลลัพธ์' },
                  { id: 'division', title: 'วิธีหารสั้นเก็บเศษ', body: 'แปลงฐาน 10 เป็นฐาน 2 ได้จากการหารซ้ำด้วย 2 และอ่านเศษจากล่างขึ้นบน' },
                ].map((card) => {
                  const isOpen = expandedConcept === card.id;
                  return (
                    <div key={card.id} className="rounded-2xl border border-slate-700 bg-slate-800/70">
                      <button
                        type="button"
                        onClick={() => setExpandedConcept(isOpen ? '' : card.id)}
                        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm font-semibold text-slate-100"
                      >
                        <span>{card.title}</span>
                        <span>{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen ? <p className="px-3 pb-3 text-sm leading-6 text-slate-300">{card.body}</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
