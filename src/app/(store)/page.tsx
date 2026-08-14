import Link from "next/link";
import { db } from "@/db";
import { products, collections, reviews, settings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { Shield, Smartphone, Sparkles, Zap, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      comparePrice: products.comparePrice,
      images: products.images,
      isBestSeller: products.isBestSeller,
      isFeatured: products.isFeatured,
      collectionId: products.collectionId,
    })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.isFeatured))
    .limit(8);

  const allCollections = await db
    .select()
    .from(collections)
    .where(eq(collections.isActive, true))
    .orderBy(collections.name);

  const approvedReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.isApproved, true))
    .limit(6);

  const settingRows = await db.select().from(settings);

  const siteSettings: Record<string, string> = {};

  for (const setting of settingRows) {
    siteSettings[setting.key] = setting.value;
  }

  const heroImage =
    siteSettings.hero_image || "/hero-skin.jpg";

  const heroTitle =
    siteSettings.hero_title || "WRAP YOUR WORLD";

  const heroSubtitle =
    siteSettings.hero_subtitle ||
    "{heroSubtitle}";

  const heroButtonText =
    siteSettings.hero_button_text || "Shop Skins";

  const heroButtonLink =
    siteSettings.hero_button_link || "/skins";

  // Get collection names for products
  const collectionMap: Record<string, string> = {};
  for (const c of allCollections) {
    collectionMap[c.id] = c.name;
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Wrapy Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/80 to-dark" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs text-brand font-medium tracking-wider uppercase">New Collection 2025</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            WRAP YOUR<br />
            <span className="text-brand">WORLD</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/skins"
              className="bg-brand hover:bg-brand-dark text-black font-bold px-8 py-4 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider animate-pulse-glow"
            >
              Shop Skins
            </Link>
            <Link
              href="/skins?featured=true"
              className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-brand rounded-full" />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs text-brand font-medium tracking-wider uppercase mb-2">Curated Selection</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Featured Skins</h2>
          </div>
          <Link href="/skins" className="text-sm text-gray-400 hover:text-brand transition-colors hidden sm:block">
            View All â†’
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                ...p,
                collectionName: p.collectionId ? collectionMap[p.collectionId] : undefined,
              }}
            />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/skins" className="text-sm text-brand font-medium">
            View All Products â†’
          </Link>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="py-20 bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs text-brand font-medium tracking-wider uppercase mb-2">Collections</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Find Your Style</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {allCollections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-dark border border-dark-border hover:border-brand/30 transition-all duration-300"
              >
                {col.image && (
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{col.name}</h3>
                  {col.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{col.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WRAPY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs text-brand font-medium tracking-wider uppercase mb-2">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">The Wrapy Difference</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {[
            { icon: Sparkles, title: "Premium Materials", desc: "3Mâ„¢ quality vinyl that lasts" },
            { icon: Smartphone, title: "Precise Fit", desc: "Laser-cut for every device" },
            { icon: Zap, title: "Easy Install", desc: "Bubble-free application" },
            { icon: Shield, title: "Full Protection", desc: "Scratch & fingerprint resistant" },
            { icon: Palette, title: "Unique Designs", desc: "Exclusive artistic patterns" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/20 transition-colors">
                <Icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
              <p className="text-xs text-dark-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      {approvedReviews.length > 0 && (
        <section className="py-20 bg-dark-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs text-brand font-medium tracking-wider uppercase mb-2">Testimonials</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Loved by Thousands</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedReviews.map((rev) => (
                <div key={rev.id} className="bg-dark rounded-2xl p-6 border border-dark-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < rev.rating ? "text-brand" : "text-dark-border"}>â˜…</span>
                    ))}
                  </div>
                  {rev.comment && <p className="text-sm text-gray-300 mb-4 leading-relaxed">{rev.comment}</p>}
                  <p className="text-xs text-dark-muted font-medium">{rev.customerName || "Customer"}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Ready to <span className="text-brand">Wrap</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands who elevated their device with Wrapy premium skins.
          </p>
          <Link
            href="/skins"
            className="inline-flex bg-brand hover:bg-brand-dark text-black font-bold px-10 py-4 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}




