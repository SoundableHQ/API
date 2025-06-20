CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text(30) NOT NULL,
	`display_name` text(200),
	`password` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `username_idx` ON `users` (`username`);