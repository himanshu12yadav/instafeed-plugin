/*
  Warnings:

  - Added the required column `shop` to the `InstagramAccount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstagramAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instagramId" TEXT,
    "instagramUsername" TEXT,
    "instagramToken" TEXT,
    "instagramTokenExpires" DATETIME,
    "accountType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "shop" TEXT NOT NULL
);
INSERT INTO "new_InstagramAccount" ("accountType", "createdAt", "id", "instagramId", "instagramToken", "instagramTokenExpires", "instagramUsername", "updatedAt") SELECT "accountType", "createdAt", "id", "instagramId", "instagramToken", "instagramTokenExpires", "instagramUsername", "updatedAt" FROM "InstagramAccount";
DROP TABLE "InstagramAccount";
ALTER TABLE "new_InstagramAccount" RENAME TO "InstagramAccount";
CREATE UNIQUE INDEX "InstagramAccount_instagramId_key" ON "InstagramAccount"("instagramId");
CREATE UNIQUE INDEX "InstagramAccount_instagramUsername_key" ON "InstagramAccount"("instagramUsername");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
