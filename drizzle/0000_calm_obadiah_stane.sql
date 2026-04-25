CREATE TYPE "public"."status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."tier" AS ENUM('bronze', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('earn', 'redeem', 'bonus', 'expire');--> statement-breakpoint
CREATE TYPE "public"."ruleType" AS ENUM('seasonal', 'weekday', 'occupancy', 'lastminute', 'earlybird');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('room_upgrade', 'food_beverage', 'spa', 'transport', 'activity', 'amenity');--> statement-breakpoint
CREATE TYPE "public"."upsellStatus" AS ENUM('offered', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "behaviorEvents" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(128) NOT NULL,
	"eventType" varchar(64) NOT NULL,
	"pageUrl" varchar(512),
	"roomId" integer,
	"duration" integer,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"roomId" integer NOT NULL,
	"guestName" varchar(255) NOT NULL,
	"guestEmail" varchar(320) NOT NULL,
	"guestPhone" varchar(20),
	"checkIn" timestamp NOT NULL,
	"checkOut" timestamp NOT NULL,
	"guests" integer NOT NULL,
	"totalPrice" integer,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guestProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"totalStays" integer DEFAULT 0 NOT NULL,
	"totalSpend" integer DEFAULT 0 NOT NULL,
	"tags" text,
	"notes" text,
	"firstVisit" timestamp DEFAULT now() NOT NULL,
	"lastVisit" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "guestProfiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "loyaltyAccounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"guestEmail" varchar(320) NOT NULL,
	"guestName" varchar(255) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"totalEarned" integer DEFAULT 0 NOT NULL,
	"tier" "tier" DEFAULT 'bronze' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "loyaltyAccounts_guestEmail_unique" UNIQUE("guestEmail")
);
--> statement-breakpoint
CREATE TABLE "loyaltyTransactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"accountId" integer NOT NULL,
	"type" "type" NOT NULL,
	"points" integer NOT NULL,
	"description" varchar(512) NOT NULL,
	"bookingId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricingRules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"ruleType" "ruleType" NOT NULL,
	"roomId" integer,
	"multiplier" integer NOT NULL,
	"startDate" timestamp,
	"endDate" timestamp,
	"minOccupancy" integer,
	"priority" integer DEFAULT 1 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"capacity" integer NOT NULL,
	"image" varchar(512),
	"amenities" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "siteSettings" (
	"key" varchar(128) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upsellOffers" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookingId" integer NOT NULL,
	"serviceId" integer NOT NULL,
	"status" "upsellStatus" DEFAULT 'offered' NOT NULL,
	"offeredAt" timestamp DEFAULT now() NOT NULL,
	"respondedAt" timestamp,
	"aiReason" text
);
--> statement-breakpoint
CREATE TABLE "upsellServices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"category" "category" NOT NULL,
	"icon" varchar(64),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
