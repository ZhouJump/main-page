-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "v3";

-- CreateTable
CREATE TABLE "v3"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v3"."categories" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descZh" TEXT NOT NULL DEFAULT '',
    "descEn" TEXT NOT NULL DEFAULT '',
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v3"."posts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleColor" TEXT NOT NULL DEFAULT '#EFEFEB',
    "excerpt" TEXT NOT NULL DEFAULT '',
    "contentMd" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v3"."tags" (
    "id" SERIAL NOT NULL,
    "slugZh" TEXT NOT NULL,
    "slugEn" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v3"."post_tags" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "v3"."comments" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "emailHash" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'visible',
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v3"."media" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "v3"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "v3"."categories"("slug");

-- CreateIndex
CREATE INDEX "posts_lang_status_publishedAt_idx" ON "v3"."posts"("lang", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "posts_categoryId_idx" ON "v3"."posts"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "posts_lang_slug_key" ON "v3"."posts"("lang", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slugZh_key" ON "v3"."tags"("slugZh");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slugEn_key" ON "v3"."tags"("slugEn");

-- CreateIndex
CREATE INDEX "post_tags_tagId_idx" ON "v3"."post_tags"("tagId");

-- CreateIndex
CREATE INDEX "comments_postId_status_createdAt_idx" ON "v3"."comments"("postId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "media_path_key" ON "v3"."media"("path");

-- AddForeignKey
ALTER TABLE "v3"."posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "v3"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v3"."post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "v3"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v3"."post_tags" ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "v3"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "v3"."comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "v3"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
