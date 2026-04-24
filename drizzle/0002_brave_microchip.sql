CREATE TABLE `behaviorEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`pageUrl` varchar(512),
	`roomId` int,
	`duration` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `behaviorEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guestProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`totalStays` int NOT NULL DEFAULT 0,
	`totalSpend` int NOT NULL DEFAULT 0,
	`tags` text,
	`notes` text,
	`firstVisit` timestamp NOT NULL DEFAULT (now()),
	`lastVisit` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guestProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `guestProfiles_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD `guestPhone` varchar(20);--> statement-breakpoint
ALTER TABLE `bookings` ADD `totalPrice` int;