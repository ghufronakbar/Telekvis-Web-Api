-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_engineerId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_engineerId_fkey` FOREIGN KEY (`engineerId`) REFERENCES `Engineer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
