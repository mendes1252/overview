-- CreateEnum
CREATE TYPE "AffiliatePlatform" AS ENUM ('AMAZON', 'SHOPEE', 'MERCADO_LIVRE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "storefront" TEXT;

-- CreateTable
CREATE TABLE "AffiliateStorefront" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "customDomain" TEXT,
    "title" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "themeColor" TEXT NOT NULL DEFAULT '#6366f1',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateStorefront_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateProduct" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "affiliateUrl" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "category" TEXT,
    "platform" "AffiliatePlatform" NOT NULL DEFAULT 'OTHER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkClick" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateStorefront_userId_key" ON "AffiliateStorefront"("userId");
CREATE UNIQUE INDEX "AffiliateStorefront_username_key" ON "AffiliateStorefront"("username");
CREATE UNIQUE INDEX "AffiliateStorefront_customDomain_key" ON "AffiliateStorefront"("customDomain");

-- CreateIndex
CREATE INDEX "AffiliateProduct_userId_idx" ON "AffiliateProduct"("userId");
CREATE INDEX "AffiliateProduct_userId_active_idx" ON "AffiliateProduct"("userId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateLink_slug_key" ON "AffiliateLink"("slug");
CREATE INDEX "AffiliateLink_slug_idx" ON "AffiliateLink"("slug");
CREATE INDEX "AffiliateLink_userId_idx" ON "AffiliateLink"("userId");

-- CreateIndex
CREATE INDEX "LinkClick_linkId_idx" ON "LinkClick"("linkId");
CREATE INDEX "LinkClick_createdAt_idx" ON "LinkClick"("createdAt");

-- AddForeignKey
ALTER TABLE "AffiliateStorefront" ADD CONSTRAINT "AffiliateStorefront_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProduct" ADD CONSTRAINT "AffiliateProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "AffiliateProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkClick" ADD CONSTRAINT "LinkClick_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "AffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
