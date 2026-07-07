import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, bypass authentication check to allow reviewing the frontend prototype/foundation.
  const isMockBypass = !supabaseUrl || supabaseUrl.includes("placeholder-project") || request.cookies.get("relay-studio-mock-auth")?.value === "true";

  const path = request.nextUrl.pathname;

  if (isMockBypass) {
    // If user is at root / and mock-auth exists, let them proceed or redirect to dashboard
    const hasMockSession = request.cookies.get("relay-studio-mock-auth")?.value === "true";
    if (!hasMockSession && (path.startsWith("/dashboard") || path.startsWith("/workspace") || path.startsWith("/settings"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
    if (hasMockSession && (path === "/auth" || path === "/")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey || "",
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && (path.startsWith("/dashboard") || path.startsWith("/workspace") || path.startsWith("/settings"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    if (user && (path === "/auth" || path === "/")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (e) {
    console.error("Supabase middleware error:", e);
  }

  return supabaseResponse;
}
