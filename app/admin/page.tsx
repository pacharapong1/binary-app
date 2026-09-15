import Link from "next/link";
import { requireRole } from "@/lib/supabase/requireRole";
import { signOut } from "@/lib/supabase/signOut";

const stats = [
  { label: "ผู้ใช้ทั้งหมด", value: "128", delta: "+12%" },
  { label: "ผู้ใช้ที่ใช้งานวันนี้", value: "34", delta: "+5%" },
  { label: "บทบาท admin", value: "3", delta: "คงที่" },
  { label: "บทบาท teacher", value: "8", delta: "+2" },
];

const tools = [
  "จัดการผู้ใช้งาน และกำหนดบทบาท",
  "จัดการระบบการเรียนรู้",
  "ดูรายงานผลการเรียน",
  "ตั้งค่าระบบและสิทธิ์เข้าใช้งาน",
];

export default async function AdminDashboard() {
  const { user, role } = await requireRole("admin");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#022c22,_#064e3b_35%,_#020817_100%)] px-4 py-6 text-emerald-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="rounded-[30px] border border-emerald-400/30 bg-[linear-gradient(135deg,rgba(6,78,59,0.6),rgba(2,6,23,0.92),rgba(16,185,129,0.28))] p-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-emerald-200">Base Learning Admin Console</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Admin Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-100 sm:text-base">
                จัดการผู้ใช้งาน, ระบบเรียน Binary &amp; Decimal, และสถิติการใช้งานทั้งระบบ
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              ROLE: {role}
            </div>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[26px] border border-emerald-400/20 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">{stat.label}</div>
              <div className="mt-3 text-3xl font-black text-white">{stat.value}</div>
              <div className="mt-2 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-100">
                {stat.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:p-6">
            <p className="text-lg font-bold text-emerald-300">จัดการผู้ใช้งาน</p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-emerald-400/20 text-emerald-200">
                    <th className="px-3 py-2">ผู้ใช้</th>
                    <th className="px-3 py-2">อีเมล</th>
                    <th className="px-3 py-2">บทบาท</th>
                    <th className="px-3 py-2">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "ผู้ดูแลระบบ", email: user.email, role, status: "Active" },
                    { name: "อาจารย์ A", email: "teacher@demo.com", role: "teacher", status: "Active" },
                    { name: "ผู้ใช้ B", email: "user@demo.com", role: "user", status: "Active" },
                    { name: "ผู้ใช้ C", email: "pending@demo.com", role: "user", status: "Pending" },
                  ].map((row) => (
                    <tr key={row.email} className="border-b border-slate-800 text-emerald-50">
                      <td className="px-3 py-3 font-semibold">{row.name}</td>
                      <td className="px-3 py-3 text-emerald-100">{row.email}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-100">
                          {row.role}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            row.status === "Active"
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

            <div className="mt-6 rounded-[26px] border border-cyan-500/30 bg-slate-950/60 p-5">
              <p className="text-lg font-bold text-cyan-300">ระบบเรียน Binary &amp; Decimal</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["ระบบเลขฐาน 2", "การแปลงเลข", "แบบฝึกหัดทดสอบ", "Interactive Studio"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-500/30 bg-slate-900 px-3 py-2 text-sm font-medium text-cyan-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Account</p>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-xl font-black text-emerald-100">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
              <div className="mt-1 break-all text-base font-bold text-white">{user.email}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Role</div>
              <div className="mt-1 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-100">
                {role}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-[0_0_30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Management Tools</p>
              <div className="mt-4 space-y-3">
                {tools.map((tool) => (
                  <Link
                    key={tool}
                    href="/admin"
                    className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3 text-left text-sm font-semibold text-emerald-100 transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <span>{tool}</span>
                    <span className="text-emerald-300">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="w-full rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-500/20"
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