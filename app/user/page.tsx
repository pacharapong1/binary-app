import Link from "next/link";
import { requireRole } from "@/lib/supabase/requireRole";
import { signOut } from "@/lib/supabase/signOut";
import BinaryTool from "./binary-tool";

const modules = [
  { num: "01", label: "บทนำ", desc: "ทำไมคอมพิวเตอร์ใช้เลขฐาน 2", path: "/studio" },
  { num: "02", label: "จุดประสงค์", desc: "เป้าหมายการเรียนรู้ของบทเรียน", path: "/studio" },
  { num: "03", label: "ระบบเลขฐาน", desc: "เลขฐาน 2 และ 10 ขั้นพื้นฐาน", path: "/studio" },
  { num: "04", label: "หลักการแปลงเลข", desc: "อัลกอริทึมการแปลงระหว่างฐาน", path: "/studio" },
  { num: "05", label: "ตัวอย่างวิธีทำ", desc: "โจทย์ตัวอย่างพร้อมวิธีทำละเอียด", path: "/studio" },
  { num: "06", label: "เครื่องมือคำนวณ", desc: "Interactive Studio ขนาดเต็ม", path: "/studio" },
  { num: "07", label: "แบบฝึกหัด", desc: "ทดสอบความเข้าใจด้วยโจทย์สุ่ม", path: "/studio" },
];

export default async function UserDashboard() {
  const { user, role } = await requireRole("user");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_35%,_#020817_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="rounded-[30px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(14,116,144,0.38),rgba(15,23,42,0.92),rgba(6,182,212,0.25))] p-6 shadow-[0_0_50px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-cyan-200">Base Learning Portal</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">User Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
                ศูนย์กลางการเรียนรู้ระบบเลขฐานสำหรับผู้ใช้ — บทเรียน, เครื่องมือแปลงเลข, และแบบฝึกหัด
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              ROLE: {role}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-900/60 p-4 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Course Modules</p>
            <nav className="space-y-2">
              {modules.map((module) => (
                <Link
                  key={module.num}
                  href={module.path}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/60 px-3 py-3 text-left transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10"
                >
                  <span className="text-xs font-black text-cyan-300">{module.num}</span>
                  <span className="flex-1 px-3 text-sm font-semibold text-slate-300">{module.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">→</span>
                </Link>
              ))}
            </nav>
            <Link
              href="/studio"
              className="mt-4 flex w-full items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              เปิด Studio ฉบับเต็ม
            </Link>
          </aside>

          <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-6">
            <div className="rounded-[26px] border border-cyan-500/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.82))] p-6 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">Module 01</p>
              <h2 className="mt-3 text-2xl font-black text-white">ทำไมคอมพิวเตอร์ใช้เลขฐาน 2</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
                คอมพิวเตอร์ทำงานกับสัญญาณแรงดันไฟฟ้า 2 สภาวะเท่านั้น: High = บิต 1 และ Low = บิต 0
                จึงใช้ระบบเลขฐาน 2 เพื่อแทนข้อมูลได้อย่างมีประสิทธิภาพและเสถียร
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-200">LOW</div>
                <div className="mt-2 text-4xl font-black text-rose-300">0</div>
                <p className="mt-2 text-sm text-rose-100">แรงดันต่ำ = สวิตช์ปิด = บิต 0</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">HIGH</div>
                <div className="mt-2 text-4xl font-black text-emerald-300">1</div>
                <p className="mt-2 text-sm text-emerald-100">แรงดันสูง = สวิตช์เปิด = บิต 1</p>
              </div>
            </div>

            <div className="mt-5 rounded-[26px] border border-cyan-500/30 bg-slate-950/60 p-5">
              <p className="text-lg font-bold text-cyan-300">เครื่องมือคำนวณ Interactive</p>
              <div className="mt-4">
                <BinaryTool />
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Account</p>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-xl font-black text-cyan-100">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
              <div className="mt-1 break-all text-base font-bold text-white">{user.email}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Role</div>
              <div className="mt-1 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-100">
                {role}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Progress</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">บทเรียนที่เปิด</div>
                  <div className="mt-2 text-2xl font-black text-cyan-300">7 / 7</div>
                </div>
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">แบบฝึกหัดผ่าน</div>
                  <div className="mt-2 text-2xl font-black text-emerald-300">12</div>
                </div>
              </div>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="w-full rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                ออกจากระบบ
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}