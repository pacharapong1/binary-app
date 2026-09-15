import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isRole } from "@/lib/supabase/roles";
import { signOut } from "@/lib/supabase/signOut";
import SubmitButton from "./submit-button";

type SearchParams = Promise<{ error?: string; email?: string }>;

async function signIn(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(`/?error=${encodeURIComponent("กรอกอีเมลและรหัสผ่านให้ครบถ้วน")}`);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}&email=${encodeURIComponent(email)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!isRole(profile?.role)) {
    redirect(
      `/?error=${encodeURIComponent(
        "ไม่พบข้อมูลบทบาทของคุณในตาราง profiles กรุณาติดต่อผู้ดูแลระบบ"
      )}&email=${encodeURIComponent(email)}`
    );
  }

  redirect(`/${profile!.role}`);
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { error, email } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_35%,_#020817_100%)] px-4 py-10 text-slate-100">
      <div className="w-full max-w-md">
        <div className="rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(14,116,144,0.38),rgba(15,23,42,0.92),rgba(6,182,212,0.25))] p-8 shadow-[0_0_50px_rgba(34,211,238,0.14)] backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-200">
            Binary &amp; Decimal Interactive Studio
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
            เข้าสู่ระบบ
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            ล็อกอินด้วยบัญชี Supabase Auth แล้วระบบจะนำคุณไปยัง
            Dashboard ตามบทบาทที่กำหนดไว้ในตาราง profiles
          </p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
              {error}
            </div>
          ) : null}

          <form action={signIn} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">อีเมล</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                defaultValue={email ?? ""}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">รหัสผ่าน</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
                placeholder="••••••••"
              />
            </label>

            <SubmitButton />
          </form>

          <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-xs leading-6 text-cyan-100">
            บทบาทที่รองรับ: <span className="font-bold">user</span> → /user ·{" "}
            <span className="font-bold">admin</span> → /admin ·{" "}
            <span className="font-bold">teacher</span> → /teacher
          </div>

          {user ? (
            <form action={signOut} className="mt-4">
              <button
                type="submit"
                className="w-full rounded-full border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-100 transition hover:bg-rose-500/20"
              >
                ออกจากระบบชั่วคราว (บัญชีนี้ยังไม่มีบทบาทใน profiles)
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </main>
  );
}