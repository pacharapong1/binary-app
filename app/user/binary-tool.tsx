"use client";

import { useMemo, useState } from "react";

function decimalToBinary(value: string): string {
  const input = value.trim();
  if (!input) return "0";
  if (!/^\d+$/.test(input)) return "กรอกเลขจำนวนเต็มบวกเท่านั้น";

  const number = Number(input);
  if (!Number.isSafeInteger(number) || number < 0) {
    return "เลขต้องเป็นจำนวนเต็มที่ปลอดภัย";
  }

  if (number === 0) return "0";

  let result = "";
  let current = number;
  while (current > 0) {
    result = `${current % 2}${result}`;
    current = Math.floor(current / 2);
  }

  return result;
}

export default function BinaryTool() {
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0, 1]);
  const [decimalInput, setDecimalInput] = useState("45");

  const binaryFromBits = bits.join("");
  const binaryBreakdown = useMemo(() => {
    const normalized = binaryFromBits.trim() || "0";
    return Array.from(normalized).map((digit, index) => {
      const position = normalized.length - index - 1;
      const weight = 2 ** position;
      return { digit, position, weight, value: Number(digit) * weight };
    });
  }, [binaryFromBits]);

  const decimalResult = useMemo(
    () =>
      binaryBreakdown
        .reduce((sum, entry) => sum + entry.value, 0)
        .toString(),
    [binaryBreakdown]
  );

  const toggleBit = (index: number) =>
    setBits((current) =>
      current.map((bit, bitIndex) =>
        bitIndex === index ? (bit === 1 ? 0 : 1) : bit
      )
    );

  return (
    <div className="space-y-5">
      <div className="rounded-[26px] border border-cyan-500/30 bg-slate-950/80 p-5 text-white shadow-[0_0_30px_rgba(34,211,238,0.12)]">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-cyan-300">Bit Explorer</p>
          <button
            type="button"
            onClick={() => setBits([1, 0, 1, 1, 0, 1])}
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
          >
            รีเซ็ต
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {bits.map((bit, index) => {
            const weight = 2 ** (bits.length - index - 1);
            const isOn = bit === 1;

            return (
              <div key={`bit-${index}`} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  2^{bits.length - index - 1}
                </span>
                <button
                  type="button"
                  onClick={() => toggleBit(index)}
                  className={`flex h-14 w-12 items-center justify-center rounded-xl border text-xl font-black transition ${
                    isOn
                      ? "border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                      : "border-slate-700 bg-slate-800 text-slate-500"
                  }`}
                >
                  {bit}
                </button>
                <span className="text-[10px] text-slate-400">{weight}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Binary</div>
            <div className="mt-2 text-2xl font-black text-cyan-300">{binaryFromBits}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Decimal</div>
            <div className="mt-2 text-2xl font-black text-emerald-300">{decimalResult}</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 p-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Live Breakdown</p>
          <div className="mt-2 space-y-1.5 text-sm text-slate-300">
            {binaryBreakdown.map((entry, index) => (
              <div key={`br-${index}`} className="rounded-lg bg-slate-950 p-2 ring-1 ring-slate-800">
                {entry.digit} × 2^{entry.position} = {entry.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[26px] border border-cyan-500/30 bg-slate-950/80 p-5 text-white shadow-[0_0_30px_rgba(34,211,238,0.12)]">
        <p className="text-lg font-bold text-cyan-300">ฐาน 10 → ฐาน 2</p>
        <input
          type="text"
          inputMode="numeric"
          value={decimalInput}
          onChange={(event) => setDecimalInput(event.target.value.replace(/\D/g, ""))}
          className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-lg font-semibold text-white outline-none transition focus:border-cyan-500"
          placeholder="เช่น 214"
        />
        <div className="mt-4 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <div className="font-semibold">ผลลัพธ์</div>
          <div className="mt-1 text-3xl font-black">{decimalToBinary(decimalInput)}</div>
        </div>
      </div>
    </div>
  );
}