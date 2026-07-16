-- CreateEnum
CREATE TYPE "SeasonalOfferType" AS ENUM ('OBOZ', 'POLKOLONIA');

-- CreateTable
CREATE TABLE "SeasonalOffer" (
    "id" TEXT NOT NULL,
    "type" "SeasonalOfferType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "locationAddress" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "ageRange" TEXT,
    "price" TEXT,
    "priceNote" TEXT,
    "accommodation" TEXT,
    "meals" TEXT,
    "transport" TEXT,
    "program" TEXT NOT NULL,
    "included" TEXT,
    "signupInfo" TEXT,
    "images" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeasonalOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeasonalOffer_slug_key" ON "SeasonalOffer"("slug");

-- CreateIndex
CREATE INDEX "SeasonalOffer_type_published_sortOrder_idx" ON "SeasonalOffer"("type", "published", "sortOrder");
