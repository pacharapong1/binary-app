import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { Role } from "./roles";
import { resolveRole } from "./resolveRole";

const getUserProfile = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const role = await resolveRole(supabase, user.id);

  return { user, role, supabase };
});

export async function requireRole(expected: Role) {
  const auth = await getUserProfile();

  if (!auth) {
    redirect(`/?error=${encodeURIComponent("กรุณาเข้าสู่ระบบก่อนใช้งาน")}`);
  }

  if (!auth.role) {
    redirect(
      `/?error=${encodeURIComponent(
        "ไม่พบบทบาทของคุณในตาราง profiles กรุณาติดต่อผู้ดูแลระบบ"
      )}`
    );
  }

  if (auth.role !== expected) {
    redirect(`/${auth.role}`);
  }

  return auth;
}