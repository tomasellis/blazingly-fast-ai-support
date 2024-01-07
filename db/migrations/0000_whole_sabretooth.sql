CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`content` text NOT NULL,
	`role` text,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `ticket`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket` (
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT false NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE INDEX `timestamp_idx` ON `message` (`timestamp`);--> statement-breakpoint
CREATE INDEX `ticket_id_idx` ON `message` (`ticket_id`);