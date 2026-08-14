import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const all = await db.select().from(settings);

    const map: Record<string, string> = {};

    for (const setting of all) {
      map[setting.key] = setting.value;
    }

    return NextResponse.json(map);
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);

    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    for (const [key, value] of Object.entries(body)) {
      const stringValue =
        value === null || value === undefined
          ? ""
          : String(value);

      const [existing] = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1);

      if (existing) {
        await db
          .update(settings)
          .set({
            value: stringValue,
            updatedAt: new Date(),
          })
          .where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({
          key,
          value: stringValue,
        });
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);

    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}