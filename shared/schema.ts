import { pgTable, text, integer, serial, json, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  type: text("type").notNull(),
  images: json("images").$type<string[]>().notNull().default([]),
  description: text("description").notNull(),
  horsepower: integer("horsepower").notNull(),
  topSpeedMph: integer("top_speed_mph").notNull(),
  zeroToSixty: text("zero_to_sixty").notNull(),
  engine: text("engine").notNull(),
  mpgCity: integer("mpg_city"),
  mpgHwy: integer("mpg_hwy"),
  mileage: integer("mileage").notNull(),
  features: json("features").$type<string[]>().notNull().default([]),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
});

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  carId: integer("car_id"),
  selectedImageIndex: integer("selected_image_index").notNull().default(0),
  image: text("image").notNull().default(''),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: json("value").notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  password: true,
});

export const insertCarSchema = createInsertSchema(cars).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({ id: true });
export const insertSiteContentSchema = createInsertSchema(siteContent).omit({ id: true });

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type Car = typeof cars.$inferSelect;
export type InsertCar = typeof cars.$inferInsert;
export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = typeof heroSlides.$inferInsert;
export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;
