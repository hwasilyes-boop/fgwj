import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, collections } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      comparePrice: products.comparePrice,
      images: products.images,
      stock: products.stock,
      collectionId: products.collectionId,
      isBestSeller: products.isBestSeller,
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      createdAt: products.createdAt,
    })
    .from(products)
    .orderBy(desc(products.createdAt));

  // Get collections for names
  const allCollections = await db.select({ id: collections.id, name: collections.name }).from(collections);
  const colMap: Record<string, string> = {};
  for (const c of allCollections) {
    colMap[c.id] = c.name;
  }

  const result = allProducts.map((p) => ({
    ...p,
    collectionName: p.collectionId ? colMap[p.collectionId] || null : null,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const [product] = await db
      .insert(products)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        comparePrice: data.comparePrice || null,
        images: data.images,
        compatibleModels: data.compatibleModels,
        stock: data.stock,
        collectionId: data.collectionId || null,
        tags: data.tags,
        isBestSeller: data.isBestSeller,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("unique")) {
      return NextResponse.json({ error: "Product slug already exists" }, { status: 400 });
    }
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
