ALTER TABLE "v3"."categories" ADD COLUMN "titleColor" TEXT NOT NULL DEFAULT '#EFEFEB';

UPDATE "v3"."categories" AS c
SET "titleColor" = p."titleColor"
FROM (
    SELECT DISTINCT ON ("categoryId") "categoryId", "titleColor"
    FROM "v3"."posts"
    ORDER BY "categoryId", "publishedAt" DESC
) AS p
WHERE p."categoryId" = c."id";

ALTER TABLE "v3"."posts" DROP COLUMN "titleColor";
