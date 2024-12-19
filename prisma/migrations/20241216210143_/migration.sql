/*
  Warnings:

  - Added the required column `phone` to the `Engineer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_engineerId_fkey`;

-- AlterTable
ALTER TABLE `Engineer` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `engineerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_engineerId_fkey` FOREIGN KEY (`engineerId`) REFERENCES `Engineer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
