/*
  Warnings:

  - Added the required column `type` to the `Medias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medias" ADD COLUMN     "type" TEXT NOT NULL;
