ALTER TABLE "transactions" ALTER COLUMN "date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."categories" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."transaction_type";--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense');--> statement-breakpoint
ALTER TABLE "public"."categories" ALTER COLUMN "type" SET DATA TYPE "public"."transaction_type" USING "type"::"public"."transaction_type";--> statement-breakpoint
ALTER TABLE "public"."transactions" ALTER COLUMN "type" SET DATA TYPE "public"."transaction_type" USING "type"::"public"."transaction_type";