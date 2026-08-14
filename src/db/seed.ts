import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { users, collections, products, coupons, settings, reviews } from "./schema";

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("🌱 Seeding database...");

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const [admin] = await db
    .insert(users)
    .values({
      name: "Admin",
      email: "admin@wrapy.com",
      passwordHash: adminHash,
      role: "admin",
    })
    .onConflictDoNothing()
    .returning();
  console.log("✅ Admin user created");

  // Create demo customer
  const customerHash = await bcrypt.hash("customer123", 12);
  const [customer] = await db
    .insert(users)
    .values({
      name: "Ahmed Ben Ali",
      email: "ahmed@example.com",
      phone: "+216 50 123 456",
      passwordHash: customerHash,
      role: "customer",
      loyaltyPoints: 250,
    })
    .onConflictDoNothing()
    .returning();
  console.log("✅ Demo customer created");

  // Create collections
  const collectionData = [
    {
      name: "Carbon",
      slug: "carbon",
      description: "Premium carbon fiber textures for a sleek, modern look",
      image: "/products/collections/carbon.jpg",
    },
    {
      name: "Minimal",
      slug: "minimal",
      description: "Clean, minimalist designs for understated elegance",
      image: "/products/collections/minimal.jpg",
    },
    {
      name: "Gaming",
      slug: "gaming",
      description: "Bold gaming-inspired designs for the competitive spirit",
      image: "/products/collections/gaming.jpg",
    },
    {
      name: "Luxury",
      slug: "luxury",
      description: "Opulent finishes and premium materials",
      image: "/products/collections/luxury.jpg",
    },
    {
      name: "Abstract",
      slug: "abstract",
      description: "Artistic abstract patterns that stand out",
      image: "/products/collections/abstract.jpg",
    },
    {
      name: "Neon",
      slug: "neon",
      description: "Vibrant neon accents for maximum impact",
      image: "/products/collections/neon.jpg",
    },
  ];

  const insertedCollections = await db
    .insert(collections)
    .values(collectionData)
    .onConflictDoNothing()
    .returning();
  console.log("✅ Collections created");

  const colMap: Record<string, string> = {};
  for (const c of insertedCollections) {
    colMap[c.slug] = c.id;
  }

  // All phone models
  const allModels = [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "Galaxy S25 Ultra",
    "Galaxy S25+",
    "Galaxy S25",
    "Galaxy S24 Ultra",
  ];

  // Create products
  const productData = [
    {
      name: "Carbon Black",
      slug: "carbon-black",
      description:
        "Premium black carbon fiber skin with a subtle 3D texture. Protects your device while adding a touch of sophistication.",
      price: 25000,
      comparePrice: 35000,
      images: ["/products/skins/carbon-black.jpg"],
      compatibleModels: allModels,
      stock: 150,
      collectionId: colMap["carbon"],
      tags: ["carbon", "black", "premium"],
      isBestSeller: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Carbon Silver",
      slug: "carbon-silver",
      description:
        "Sleek silver carbon fiber finish. A modern classic for those who appreciate understated luxury.",
      price: 25000,
      comparePrice: 35000,
      images: ["/products/skins/carbon-silver.jpg"],
      compatibleModels: allModels,
      stock: 100,
      collectionId: colMap["carbon"],
      tags: ["carbon", "silver"],
      isBestSeller: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Matte Midnight",
      slug: "matte-midnight",
      description:
        "Deep midnight matte finish. Smooth texture with superior grip and scratch resistance.",
      price: 22000,
      comparePrice: 30000,
      images: ["/products/skins/matte-midnight.jpg"],
      compatibleModels: allModels,
      stock: 200,
      collectionId: colMap["minimal"],
      tags: ["matte", "dark", "minimal"],
      isBestSeller: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Pure White",
      slug: "pure-white",
      description:
        "Crisp, clean white matte finish. Perfect minimalism for the modern user.",
      price: 22000,
      comparePrice: null,
      images: ["/products/skins/pure-white.jpg"],
      compatibleModels: allModels,
      stock: 180,
      collectionId: colMap["minimal"],
      tags: ["white", "minimal", "clean"],
      isBestSeller: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Neon Surge",
      slug: "neon-surge",
      description:
        "Electric neon green accents on a dark base. For those who want to stand out.",
      price: 28000,
      comparePrice: 38000,
      images: ["/products/skins/neon-surge.jpg"],
      compatibleModels: allModels,
      stock: 80,
      collectionId: colMap["neon"],
      tags: ["neon", "green", "gaming"],
      isBestSeller: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Cyber Grid",
      slug: "cyber-grid",
      description:
        "Futuristic grid pattern with neon highlights. Inspired by cyberpunk aesthetics.",
      price: 28000,
      comparePrice: 35000,
      images: ["/products/skins/cyber-grid.jpg"],
      compatibleModels: allModels,
      stock: 90,
      collectionId: colMap["gaming"],
      tags: ["gaming", "cyber", "grid"],
      isBestSeller: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Dragon Scale",
      slug: "dragon-scale",
      description:
        "Textured dragon scale pattern in dark tones. A bold statement for gamers.",
      price: 30000,
      comparePrice: 40000,
      images: ["/products/skins/dragon-scale.jpg"],
      compatibleModels: allModels,
      stock: 60,
      collectionId: colMap["gaming"],
      tags: ["gaming", "dragon", "texture"],
      isBestSeller: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Gold Marble",
      slug: "gold-marble",
      description:
        "Luxurious gold marble pattern. Premium feel with elegant veining details.",
      price: 35000,
      comparePrice: 45000,
      images: ["/products/skins/gold-marble.jpg"],
      compatibleModels: allModels,
      stock: 40,
      collectionId: colMap["luxury"],
      tags: ["luxury", "gold", "marble"],
      isBestSeller: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Obsidian",
      slug: "obsidian",
      description:
        "Deep black with subtle shimmer. The ultimate dark luxury experience.",
      price: 32000,
      comparePrice: null,
      images: ["/products/skins/obsidian.jpg"],
      compatibleModels: allModels,
      stock: 70,
      collectionId: colMap["luxury"],
      tags: ["luxury", "black", "premium"],
      isBestSeller: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Fluid Wave",
      slug: "fluid-wave",
      description:
        "Abstract fluid art pattern with dynamic color transitions. Each skin is unique.",
      price: 26000,
      comparePrice: 34000,
      images: ["/products/skins/fluid-wave.jpg"],
      compatibleModels: allModels,
      stock: 110,
      collectionId: colMap["abstract"],
      tags: ["abstract", "colorful", "art"],
      isBestSeller: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Glitch Art",
      slug: "glitch-art",
      description:
        "Digital glitch-inspired design. Perfect for the tech-savvy creative.",
      price: 26000,
      comparePrice: 32000,
      images: ["/products/skins/glitch-art.jpg"],
      compatibleModels: allModels,
      stock: 95,
      collectionId: colMap["abstract"],
      tags: ["abstract", "glitch", "digital"],
      isBestSeller: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Neon Pulse",
      slug: "neon-pulse",
      description:
        "Pulsating neon lines on a jet-black background. The ultimate gaming accessory.",
      price: 28000,
      comparePrice: 36000,
      images: ["/products/skins/neon-pulse.jpg"],
      compatibleModels: allModels,
      stock: 75,
      collectionId: colMap["neon"],
      tags: ["neon", "pulse", "gaming"],
      isBestSeller: false,
      isFeatured: true,
      isActive: true,
    },
  ];

  await db.insert(products).values(productData).onConflictDoNothing();
  console.log("✅ Products created");

  // Create coupons
  await db
    .insert(coupons)
    .values([
      {
        code: "WRAPY10",
        type: "percentage",
        value: 10,
        maxUses: 100,
        usedCount: 0,
        isActive: true,
      },
      {
        code: "FIRST5",
        type: "fixed",
        value: 5000,
        maxUses: 50,
        usedCount: 0,
        isActive: true,
      },
    ])
    .onConflictDoNothing();
  console.log("✅ Coupons created");

  // Create settings
  await db
    .insert(settings)
    .values([
      { key: "shipping_price", value: "8000" },
      { key: "points_per_dinar", value: "10" },
      { key: "store_name", value: "Wrapy" },
      { key: "store_currency", value: "DT" },
    ])
    .onConflictDoNothing();
  console.log("✅ Settings created");

  // Create some reviews
  if (customer) {
    await db
      .insert(reviews)
      .values([
        {
          productId: (await db.select().from(products).limit(1))[0]?.id,
          userId: customer.id,
          customerName: "Ahmed",
          rating: 5,
          comment: "Amazing quality! The carbon fiber texture feels incredible.",
          isApproved: true,
        },
      ])
      .onConflictDoNothing();
    console.log("✅ Reviews created");
  }

  await pool.end();
  console.log("🎉 Seed complete!");
}

seed().catch(console.error);
