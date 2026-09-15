import Link from "next/link";
import { requireRole } from "@/lib/supabase/requireRole";
import { signOut } from "@/lib/supabase/signOut";

const classes = [
  { name: "ห้อง ม.3/1", students: "42", done: "38" },
  { name: "ห้อง ม.3/2", students: "38", done: "30" },
  { name: "ห้อง ม.3/3", students: "40", done: "40" },
];

const scores = [
  { name: "นักเรียน 1", score: "9/10", grade: "A", status: "ส่งแล้ว" },
  { name: "นักเรียน 2", score: "7/10", grade: "B+", status: "ส่งแล้ว" },
  { name: "นักเรียน 3", score: "", grade: "-", status: "ยังไม่ส่ง" },
  { name: "นักเรียน 4", score: "3/10", grade: "D", status: "ส่งแล้ว" },
];

export default async function TeacherDashboard() {
  const { user, role } = await requireRole("teacher");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#4c0519,_#9f1239_35%,_#020817_100%)] px-4 py-6 text-rose-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="rounded-[30px] border border-rose-400/30 bg-[linear-gradient(135deg,rgba(159,18,57,0.6),rgba(2,6,23,0.92),rgba(244,63,94,0.3))] p-6 shadow-[0_0_50px_rgba(244,63,94,0.2)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-rose-200">Base Learning Instructor Hub</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Teacher Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-rose-100 sm:text-base">
                ตรวจการบ้าน, จัดการบทเรียนเลขฐาน, และติดตามคะแนนนักเรียนตามห้องเรียน
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.9)]" />
              ROLE: {role}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-5">
            <div className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-6">
              <p className="text-lg font-bold text-rose-300">ภาพรวมห้องเรียน</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {classes.map((cls) => (
                  <div key={cls.name} className="rounded-2xl border border-rose-400/20 bg-rose-500/5 p-4">
                    <div className="text-sm font-bold text-rose-100">{cls.name}</div>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-rose-200">ส่งงาน</div>
                        <div className="text-2xl font-black text-white">
                          {cls.done}/{cls.students}
                        </div>
                      </div>
                      <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-100">
                        {Math.round((Number(cls.done) / Number(cls.students)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-6">
              <p className="text-lg font-bold text-rose-300">ตรวจการบ้าน / คะแนนนักเรียน</p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-rose-400/20 text-rose-200">
                      <th className="px-3 py-2">นักเรียน</th>
                      <th className="px-3 py-2">คะแนน</th>
                      <th className="px-3 py-2">เกรด</th>
                      <th className="px-3 py-2">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((row) => (
                      <tr key={row.name} className="border-b border-slate-800 text-rose-50">
                        <td className="px-3 py-3 font-semibold">{row.name}</td>
                        <td className="px-3 py-3">{row.score || "—"}</td>
                        <td className="px-3 py-3">
                          <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-100">
                            {row.grade}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              row.status === "ส่งแล้ว"
                                ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                                : "border border-amber-400/30 bg-amber-500/10 text-amber-100"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[30px] border border-cyan-500/30 bg-slate-950/60 p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <p className="text-lg font-bold text-cyan-300">จัดการบทเรียนเลขฐาน</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                ใช้สื่อแนะนำจาก Studio หลัก เพื่อเปิดบทเรียนเรื่องระบบเลขฐาน 2 และ 10 พร้อมตัวอย่างวิธีทำและแบบฝึกหัด
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["บทนำ", "ระบบเลขฐาน", "หลักการแปลงเลข", "ตัวอย่างวิธีทำ", "แบบฝึกหัด"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-500/30 bg-slate-900 px-3 py-2 text-sm font-medium text-cyan-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Link
                href="/studio"
                className="mt-4 inline-flex rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                เปิด Studio ฉบับเต็ม →
              </Link>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Account</p>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/10 text-xl font-black text-rose-100">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
              <div className="mt-1 break-all text-base font-bold text-white">{user.email}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Role</div>
              <div className="mt-1 inline-flex rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-sm font-bold text-rose-100">
                {role}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Course Tools</p>
              <div className="mt-4 space-y-3">
                {["สร้างบทเรียนใหม่", "จัดการแบบฝึกหัดเลขฐาน", "ประกาศผลคะแนน"].map((label) => (
                  <Link
                    key={label}
                    href="/teacher"
                    className="flex items-center justify-between rounded-2xl border border-rose-400/20 bg-rose-500/5 px-4 py-3 text-left text-sm font-semibold text-rose-100 transition hover:border-rose-400/40 hover:bg-rose-500/10"
                  >
                    <span>{label}</span>
                    <span className="text-rose-300">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="w-full rounded-full border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-100 transition hover:bg-rose-500/20"
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