import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  // Optional security: verify authorization header if CRON_SECRET is set in Vercel
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const startTime = Date.now();

    // Lightweight query to keep the Supabase database instance active
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("id")
      .limit(1);

    if (error) {
      console.error("[CRON_KEEP_ALIVE_ERROR]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "Database pinged successfully. Supabase will stay active!",
      timestamp: new Date().toISOString(),
      durationMs: duration,
      rowCount: data?.length ?? 0,
    });
  } catch (err: any) {
    console.error("[CRON_KEEP_ALIVE_EXCEPTION]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
