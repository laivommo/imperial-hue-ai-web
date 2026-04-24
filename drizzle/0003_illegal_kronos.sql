CREATE TABLE `loyaltyAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guestEmail` varchar(320) NOT NULL,
	`guestName` varchar(255) NOT NULL,
	`points` int NOT NULL DEFAULT 0,
	`totalEarned` int NOT NULL DEFAULT 0,
	`tier` enum('bronze','silver','gold','platinum') NOT NULL DEFAULT 'bronze',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyaltyAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyaltyAccounts_guestEmail_unique` UNIQUE(`guestEmail`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`type` enum('earn','redeem','bonus','expire') NOT NULL,
	`points` int NOT NULL,
	`description` varchar(512) NOT NULL,
	`bookingId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyaltyTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`ruleType` enum('seasonal','weekday','occupancy','lastminute','earlybird') NOT NULL,
	`roomId` int,
	`multiplier` int NOT NULL,
	`startDate` timestamp,
	`endDate` timestamp,
	`minOccupancy` int,
	`priority` int NOT NULL DEFAULT 1,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricingRules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upsellOffers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`serviceId` int NOT NULL,
	`status` enum('offered','accepted','declined') NOT NULL DEFAULT 'offered',
	`offeredAt` timestamp NOT NULL DEFAULT (now()),
	`respondedAt` timestamp,
	`aiReason` text,
	CONSTRAINT `upsellOffers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upsellServices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`category` enum('room_upgrade','food_beverage','spa','transport','activity','amenity') NOT NULL,
	`icon` varchar(64),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `upsellServices_id` PRIMARY KEY(`id`)
);
