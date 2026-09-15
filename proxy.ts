import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "@/lib/supabase/roles";
import { resolveRole } from "@/lib/supabase/resolveRole";

const ROLE_PATHS = ["/user", "/admin", "/teacher"];

const rolePathFor = (role: Role) => `/${role}`;

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const redirectTo = (path: string, search?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    if (search) url.search = search;
    return NextResponse.redirect(url);
  };

  const visitedRolePath = ROLE_PATHS.find(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (visitedRolePath) {
    if (!user) {
      return redirectTo("/login");
    }

    const role = await resolveRole(supabase, user.id);

    if (!role) {
      return redirectTo(
        "/login",
        `?error=${encodeURIComponent(
          "ไม่พบบทบาทของคุณในตาราง profiles กรุณาติดต่อผู้ดูแลระบบ"
        )}`
      );
    }

    if (visitedRolePath !== rolePathFor(role)) {
      return redirectTo(rolePathFor(role));
    }
  }

  if (pathname === "/login") {
    return redirectTo("/");
  }

  if (pathname === "/" && user) {
    const role = await resolveRole(supabase, user.id);

    if (!role) {
      if (request.nextUrl.searchParams.has("error")) {
        return response;
      }

      return redirectTo(
        "/",
        `?error=${encodeURIComponent(
          "ไม่พบบทบาทของคุณในตาราง profiles กรุณาติดต่อผู้ดูแลระบบ"
        )}`
      );
    }

    return redirectTo(rolePathFor(role));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/user",
    "/user/:path*",
    "/admin",
    "/admin/:path*",
    "/teacher",
    "/teacher/:path*",
  ],
};