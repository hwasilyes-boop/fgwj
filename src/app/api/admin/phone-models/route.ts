import { NextResponse } from "next/server";
import { db } from "@/db";
import { phoneModels } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const models = await db
      .select()
      .from(phoneModels)
      .where(eq(phoneModels.isActive, true))
      .orderBy(asc(phoneModels.brand), asc(phoneModels.name));

    return NextResponse.json(models);
  } catch (error) {
    console.error("Get phone models error:", error);
    return NextResponse.json(
      { error: "Failed to load phone models" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const brand = String(body.brand || "").trim();
    const name = String(body.name || "").trim();

    if (!brand || !name) {
      return NextResponse.json(
        { error: "Brand and name are required" },
        { status: 400 }
      );
    }

    const [model] = await db
      .insert(phoneModels)
      .values({
        brand,
        name,
        isActive: true,
      })
      .returning();

    return NextResponse.json(model, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("unique")) {
      return NextResponse.json(
        { error: "This phone model already exists" },
        { status: 400 }
      );
    }

    console.error("Create phone model error:", error);

    return NextResponse.json(
  {
    error: "Failed to create phone model",
    details: message,
  },
  { status: 500 }
);
  }
}