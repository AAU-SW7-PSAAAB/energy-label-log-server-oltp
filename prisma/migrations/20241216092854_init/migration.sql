-- CreateTable
CREATE TABLE `Fact` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `score` INTEGER UNSIGNED NOT NULL,
    `status_code` INTEGER UNSIGNED NOT NULL,
    `error_message` TINYTEXT NULL,
    `extension_version` TINYTEXT NOT NULL,
    `plugin_name` TINYTEXT NOT NULL,
    `plugin_version` TINYTEXT NOT NULL,
    `browser_name` TINYTEXT NOT NULL,
    `browser_version` TINYTEXT NOT NULL,
    `domain` TINYTEXT NOT NULL,
    `path` TINYTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
