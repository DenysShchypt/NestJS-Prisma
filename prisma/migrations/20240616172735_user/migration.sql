/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(45)`.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roles" "Role"[],
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(45);

-- CreateTable
CREATE TABLE "Token" (
    "token" TEXT NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
