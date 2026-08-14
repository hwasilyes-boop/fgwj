import { db } from "@/db";
import { products, collections } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;

  const [collection] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.slug, slug), eq(collections.isActive, true)))
    .limit(1);

  if (!collection) notFound();

  const collectionProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      comparePrice: products.comparePrice,
      images: products.images,
      isBestSeller: products.isBestSeller,
      isFeatured: products.isFeatured,
    })
    .from(products)
    .where(
      and(eq(products.collectionId, collection.id), eq(products.isActive, true))
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden mb-10">
        {collection.image && (
          <img
            src={collection.image}
            alt={collection.name}
            className="w-full h-48 sm:h-64 object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent flex items-center">
          <div className="px-8">
            <Link href="/skins" className="text-xs text-brand mb-2 block">← All Skins</Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{collection.name}</h1>
            {collection.description && (
              <p className="text-sm text-gray-400 mt-2 max-w-lg">{collection.description}</p>
            )}
          </div>
        </div>
      </div>

      {collectionProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No products in this collection yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {collectionProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, collectionName: collection.name }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
