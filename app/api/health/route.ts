import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.json({
    status: "healthy",
    supabase: "Static UI-only health for story 1.2 (no backend calls)"
  });
