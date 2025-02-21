/*
  Warnings:

  - You are about to drop the column `age` on the `PersonalDetails` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProjectPreferences` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectPreferences" DROP CONSTRAINT "ProjectPreferences_userId_fkey";

-- AlterTable
ALTER TABLE "PersonalDetails" DROP COLUMN "age";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "bio" VARCHAR(200),
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "profilePictureURL" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "image" SET DEFAULT '';

-- DropTable
DROP TABLE "ProjectPreferences";
