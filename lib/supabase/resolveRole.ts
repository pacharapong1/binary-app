import type { SupabaseClient } from "@supabase/supabase-js";
import { isRole, type Role } from "./roles";

export async function resolveRole(
  supabase: SupabaseClient,
  userId: string
): Promise<Role | null> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return isRole(data?.role) ? data.role : null;
}