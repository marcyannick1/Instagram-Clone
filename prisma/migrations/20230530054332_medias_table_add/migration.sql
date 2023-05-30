/*
  Warnings:

  - You are about to drop the column `media` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "media";

-- CreateTable
CREATE TABLE "Medias" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Medias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medias" ADD CONSTRAINT "Medias_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
