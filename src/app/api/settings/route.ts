import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(settings);

    const result: Record<string, string> = {};

    for (const row of rows) {
      result[row.key] = row.value;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUBLIC SETTINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}
