import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const GET = async () => {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("caregivers")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      {
        status: "degraded",
        supabase: error.message
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "healthy",
    supabase: "Connection established"
  });
};
