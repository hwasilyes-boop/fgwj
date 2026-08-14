import { relations } from "drizzle-orm/relations";
import { collections, products, users, orders, orderItems, reviews, wishlist } from "./schema";

export const productsRelations = relations(products, ({one, many}) => ({
	collection: one(collections, {
		fields: [products.collectionId],
		references: [collections.id]
	}),
	orderItems: many(orderItems),
	reviews: many(reviews),
	wishlists: many(wishlist),
}));

export const collectionsRelations = relations(collections, ({many}) => ({
	products: many(products),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	orderItems: many(orderItems),
}));

export const usersRelations = relations(users, ({many}) => ({
	orders: many(orders),
	reviews: many(reviews),
	wishlists: many(wishlist),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
}));

export const wishlistRelations = relations(wishlist, ({one}) => ({
	product: one(products, {
		fields: [wishlist.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [wishlist.userId],
		references: [users.id]
	}),
}));