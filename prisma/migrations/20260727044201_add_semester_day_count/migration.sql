-- CreateTable
CREATE TABLE "SemesterDayCount" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "mon" INTEGER NOT NULL DEFAULT 0,
    "tue" INTEGER NOT NULL DEFAULT 0,
    "wed" INTEGER NOT NULL DEFAULT 0,
    "thu" INTEGER NOT NULL DEFAULT 0,
    "fri" INTEGER NOT NULL DEFAULT 0,
    "sun" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SemesterDayCount_pkey" PRIMARY KEY ("id")
);
