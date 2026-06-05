import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function copyCookies(source: NextResponse, target: NextResponse) {
	source.cookies.getAll().forEach((cookie) => {
		target.cookies.set(cookie.name, cookie.value);
	});
}

function redirectTo(
	url: string,
	request: NextRequest,
	response: NextResponse,
	searchParams?: Record<string, string>
) {
	const redirectResponse = NextResponse.redirect(new URL(url, request.url));

	if (searchParams) {
		const redirectUrl = new URL(url, request.url);
		Object.entries(searchParams).forEach(([key, value]) => {
			redirectUrl.searchParams.set(key, value);
		});
		const redirectResponse = NextResponse.redirect(redirectUrl);
		copyCookies(response, redirectResponse);
		return redirectResponse;
	}

	copyCookies(response, redirectResponse);
	return redirectResponse;
}

export async function proxy(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						request.cookies.set(name, value);
						response.cookies.set(name, value, options);
					});
				},
			},
		}
	);

	const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

	if (isAdminRoute) {
		// Step 1: confirm the user is signed in.
		const { data: userData, error: userError } = await supabase.auth.getUser();
		const user = userError ? null : userData.user;

		if (!user) {
			return redirectTo("/login", request, response, {
				next: request.nextUrl.pathname,
			});
		}

		// Step 2: confirm the user is an admin in public.profiles.
		const { data: profile, error: profileError } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.maybeSingle();

		if (profileError || profile?.role !== "admin") {
			return redirectTo("/", request, response);
		}
	}

	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};