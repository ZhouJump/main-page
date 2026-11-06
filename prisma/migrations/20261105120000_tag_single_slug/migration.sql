-- AlterTable
ALTER TABLE "v3"."tags" ADD COLUMN "slug" TEXT;

-- Backfill: 旧站中文 slug 作为统一 slug
UPDATE "v3"."tags" SET "slug" = "slugZh";

ALTER TABLE "v3"."tags" ALTER COLUMN "slug" SET NOT NULL;

-- DropIndex
DROP INDEX IF EXISTS "v3"."tags_slugZh_key";
DROP INDEX IF EXISTS "v3"."tags_slugEn_key";

-- DropColumn
ALTER TABLE "v3"."tags" DROP COLUMN "slugZh", DROP COLUMN "slugEn";

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "v3"."tags"("slug");
