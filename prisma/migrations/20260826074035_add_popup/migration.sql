-- CreateTable
CREATE TABLE "Popup" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "delaySeconds" INTEGER NOT NULL DEFAULT 3,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Popup_pkey" PRIMARY KEY ("id")
);
