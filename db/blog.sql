/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80017 (8.0.17)
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 80017 (8.0.17)
 File Encoding         : 65001

 Date: 06/09/2023 22:46:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `articleId` int(11) NOT NULL AUTO_INCREMENT,
  `authorId` int(11) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '未命名文章',
  `publishDate` datetime NOT NULL DEFAULT '2023-09-03 02:11:35',
  `contentFileId` int(11) NOT NULL,
  `coverImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '状态（0表示草稿，1表示审核中，2表示审核失败，3表示发布',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '失败原因',
  `viewCount` bigint(20) NOT NULL DEFAULT 0 COMMENT '文章浏览量',
  PRIMARY KEY (`articleId`) USING BTREE,
  INDEX `userId`(`authorId` ASC) USING BTREE,
  INDEX `contentFileId`(`contentFileId` ASC) USING BTREE,
  CONSTRAINT `article_ibfk_3` FOREIGN KEY (`authorId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_ibfk_4` FOREIGN KEY (`contentFileId`) REFERENCES `file` (`fileId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES (3, 4, 'sequelize', '2023-09-03 07:59:51', 3, '', 0, NULL, 0);
INSERT INTO `article` VALUES (4, 4, 'sequelize-发布版', '2023-09-03 07:59:51', 4, '', 2, '[{\"imgRes\":[]},{}]', 0);
INSERT INTO `article` VALUES (5, 4, 'sequelize-发布版', '2023-09-03 08:10:47', 5, '', 2, '[{\"imgRes\":[]},{}]', 0);
INSERT INTO `article` VALUES (6, 4, 'sequelize', '2023-09-03 08:10:47', 6, '', 0, NULL, 0);
INSERT INTO `article` VALUES (7, 4, 'vue', '2023-09-03 08:10:47', 7, '', 3, '', 0);
INSERT INTO `article` VALUES (8, 4, 'VUE', '2023-09-03 08:10:47', 8, '', 2, '[{\"imgRes\":[null]},{\"textRes\":[{\"msg\":\"存在恶意推广不合规\",\"conclusion\":\"不合规\",\"hits\":[{\"wordHitPositions\":[],\"probability\":1,\"datasetName\":\"百度默认文本反作弊库\",\"words\":[],\"details\":[\"联系方式-网址\"],\"modelHitPositions\":[[5,440,1]]}],\"subType\":4,\"conclusionType\":2,\"type\":12}]}]', 0);
INSERT INTO `article` VALUES (9, 4, 'VUE', '2023-09-03 09:00:07', 9, '', 3, '', 0);
INSERT INTO `article` VALUES (10, 4, '测试数据', '2023-09-04 01:05:03', 10, '', 3, '', 0);

-- ----------------------------
-- Table structure for article_comment
-- ----------------------------
DROP TABLE IF EXISTS `article_comment`;
CREATE TABLE `article_comment`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `commenterId` int(11) NOT NULL COMMENT '评论人的id',
  `articleId` int(11) NOT NULL COMMENT '文章id',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评论内容',
  `createDate` datetime NOT NULL COMMENT '评论时间',
  `parentId` bigint(20) NULL DEFAULT NULL COMMENT '回复评论的时候父评论id',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '评论的状态，0是带审核，1是审核通过，2审核失败',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '审核失败原因',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `commenterId`(`commenterId` ASC) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  INDEX `parentId`(`parentId` ASC) USING BTREE,
  CONSTRAINT `article_comment_ibfk_4` FOREIGN KEY (`commenterId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_comment_ibfk_5` FOREIGN KEY (`articleId`) REFERENCES `article` (`articleId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_comment_ibfk_6` FOREIGN KEY (`parentId`) REFERENCES `article_comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article_comment
-- ----------------------------
INSERT INTO `article_comment` VALUES (4, 4, 3, '很厉害', '2023-09-04 06:31:04', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (5, 4, 3, '测试评论写入', '2023-09-04 07:05:33', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (6, 4, 3, '测试评论写入2', '2023-09-04 07:08:11', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (7, 4, 3, '测试评论写入3', '2023-09-04 07:11:04', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (8, 4, 3, '测试orm监听', '2023-09-05 14:07:05', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (9, 4, 3, '测试orm监听234324424324', '2023-09-05 14:30:02', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (10, 4, 3, '测试orm监听第10086遍', '2023-09-05 14:38:37', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (11, 4, 3, '测试orm监听第10086+1遍', '2023-09-05 15:10:08', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (12, 4, 3, '测试orm监听第10086+2遍', '2023-09-05 15:23:16', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (13, 4, 3, '测试orm监听第10086+3遍', '2023-09-05 15:26:01', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (14, 4, 3, '测试orm监听第10086+4遍', '2023-09-05 15:34:12', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (15, 4, 3, '测试orm监听第10086+6遍', '2023-09-05 15:38:29', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (16, 4, 4, 'ceshi', '2023-09-05 15:40:21', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (17, 4, 4, '测试的第10000次', '2023-09-05 15:48:41', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (18, 4, 4, '测试的第100001次', '2023-09-05 15:52:28', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (19, 4, 4, '测试的第1000011次', '2023-09-05 15:53:37', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (20, 4, 4, '测试的第10000111次', '2023-09-05 15:56:03', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (21, 4, 4, '测试的第1000011111次', '2023-09-05 16:00:14', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (22, 4, 4, '测试的第101100011111次', '2023-09-05 16:03:16', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (23, 4, 4, '测试的第101100132132011111次', '2023-09-06 11:48:30', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (24, 4, 4, '测试的第101100132132011111次', '2023-09-06 11:51:25', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (25, 4, 4, '测试的第101100132132011111次', '2023-09-06 11:55:54', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (26, 4, 4, '测试的第101100132132011111次', '2023-09-06 11:56:35', NULL, 1, '审核成功');
INSERT INTO `article_comment` VALUES (27, 4, 4, '测试的第101100132132011111次', '2023-09-06 13:19:25', NULL, 1, '审核成功');

-- ----------------------------
-- Table structure for article_tag
-- ----------------------------
DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE `article_tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` int(11) NOT NULL,
  `tagId` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `article_tag_tagId_articleId_unique`(`articleId` ASC, `tagId` ASC) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  INDEX `tagId`(`tagId` ASC) USING BTREE,
  CONSTRAINT `article_tag_ibfk_3` FOREIGN KEY (`articleId`) REFERENCES `article` (`articleId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_tag_ibfk_4` FOREIGN KEY (`tagId`) REFERENCES `tag` (`tagId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article_tag
-- ----------------------------
INSERT INTO `article_tag` VALUES (1, 5, 4);
INSERT INTO `article_tag` VALUES (3, 5, 6);
INSERT INTO `article_tag` VALUES (2, 5, 8);
INSERT INTO `article_tag` VALUES (7, 7, 5);
INSERT INTO `article_tag` VALUES (8, 7, 8);
INSERT INTO `article_tag` VALUES (4, 8, 4);
INSERT INTO `article_tag` VALUES (6, 8, 6);
INSERT INTO `article_tag` VALUES (5, 8, 8);
INSERT INTO `article_tag` VALUES (9, 9, 4);
INSERT INTO `article_tag` VALUES (11, 9, 6);
INSERT INTO `article_tag` VALUES (10, 9, 8);
INSERT INTO `article_tag` VALUES (13, 10, 4);
INSERT INTO `article_tag` VALUES (15, 10, 6);
INSERT INTO `article_tag` VALUES (14, 10, 9);

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `fileId` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `filesize` double NOT NULL,
  `filepath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '0表示其他类型（默认），1表示md类型，2表示图片类型',
  PRIMARY KEY (`fileId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of file
-- ----------------------------
INSERT INTO `file` VALUES (1, '1-资料分析.md', 1131, 'E:/github/blog/back/upload/md/1693713029833-41-资料分析.md', 2);
INSERT INTO `file` VALUES (2, 'psw.txt', 30, 'E:/github/blog/back/upload/other/1693713765436-4psw.txt', 2);
INSERT INTO `file` VALUES (3, 'Sequelize.md', 23858, 'E:/github/blog/back/upload/md/1693728242542-4Sequelize.md', 2);
INSERT INTO `file` VALUES (4, 'Sequelize.md', 23858, 'E:/github/blog/back/upload/md/1693728359506-4Sequelize.md', 2);
INSERT INTO `file` VALUES (5, 'Sequelize.md', 23858, 'E:/github/blog/back/upload/md/1693728649466-4Sequelize.md', 2);
INSERT INTO `file` VALUES (6, 'vue01.md', 1599, 'E:/github/blog/back/upload/md/1693728929577-4vue01.md', 2);
INSERT INTO `file` VALUES (7, 'vue01.md', 1599, 'E:/github/blog/back/upload/md/1693728950201-4vue01.md', 2);
INSERT INTO `file` VALUES (8, 'vue-02.md', 535, 'E:/github/blog/back/upload/md/1693729011696-4vue-02.md', 2);
INSERT INTO `file` VALUES (9, 'todo.txt', 1321, 'E:/github/blog/back/upload/other/1693731994625-4todo.txt', 2);
INSERT INTO `file` VALUES (10, 'todo.txt', 1321, 'E:/github/blog/back/upload/other/1693789569676-4todo.txt', 2);

-- ----------------------------
-- Table structure for habit
-- ----------------------------
DROP TABLE IF EXISTS `habit`;
CREATE TABLE `habit`  (
  `habitId` int(11) NOT NULL AUTO_INCREMENT,
  `tagId` int(11) NOT NULL,
  `habitCollectionId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`habitId`) USING BTREE,
  INDEX `tagId`(`tagId` ASC) USING BTREE,
  INDEX `habitCollectionId`(`habitCollectionId` ASC) USING BTREE,
  CONSTRAINT `habit_ibfk_3` FOREIGN KEY (`tagId`) REFERENCES `tag` (`tagId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `habit_ibfk_4` FOREIGN KEY (`habitCollectionId`) REFERENCES `habit_collection` (`habitCollectionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of habit
-- ----------------------------
INSERT INTO `habit` VALUES (1, 4, NULL);
INSERT INTO `habit` VALUES (2, 4, NULL);
INSERT INTO `habit` VALUES (4, 5, 1);

-- ----------------------------
-- Table structure for habit_collection
-- ----------------------------
DROP TABLE IF EXISTS `habit_collection`;
CREATE TABLE `habit_collection`  (
  `habitCollectionId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`habitCollectionId`) USING BTREE,
  INDEX `userId`(`userId` ASC) USING BTREE,
  CONSTRAINT `habit_collection_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of habit_collection
-- ----------------------------
INSERT INTO `habit_collection` VALUES (1, 4);

-- ----------------------------
-- Table structure for history
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history`  (
  `historyId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `articleId` int(11) NOT NULL,
  `startAt` datetime NOT NULL DEFAULT '2023-09-03 02:11:35',
  `finishAt` date NULL DEFAULT NULL,
  PRIMARY KEY (`historyId`) USING BTREE,
  INDEX `userId`(`userId` ASC) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  CONSTRAINT `history_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `history_ibfk_4` FOREIGN KEY (`articleId`) REFERENCES `article` (`articleId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of history
-- ----------------------------

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '0表示审核信息，1表示文章评论信息，2表示其他',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '0表示未读，1表示已读',
  `createTime` datetime NOT NULL DEFAULT '2023-09-03 02:11:35' COMMENT '创建时间',
  `sendTime` datetime NULL DEFAULT NULL COMMENT '发送时间（因为可能是定时发送',
  `articleId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId` ASC) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  CONSTRAINT `message_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `message_ibfk_4` FOREIGN KEY (`articleId`) REFERENCES `article` (`articleId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (4, 4, 0, '文章审核失败', '1', '2023-09-03 08:10:47', NULL, 5);
INSERT INTO `message` VALUES (5, 4, 0, '文章审核成功', '1', '2023-09-03 08:22:52', NULL, 7);
INSERT INTO `message` VALUES (6, 4, 0, '文章审核失败', '1', '2023-09-03 08:22:52', NULL, 8);
INSERT INTO `message` VALUES (7, 4, 0, '文章审核成功', '1', '2023-09-03 09:15:45', NULL, 9);
INSERT INTO `message` VALUES (8, 4, 0, '文章审核成功', '1', '2023-09-04 01:05:03', NULL, 10);
INSERT INTO `message` VALUES (9, 4, 1, '评论审核成功', '1', '2023-09-04 07:08:55', NULL, 3);
INSERT INTO `message` VALUES (10, 4, 1, '评论审核成功', '1', '2023-09-04 07:11:04', NULL, 3);
INSERT INTO `message` VALUES (11, 4, 1, '评论审核成功', '0', '2023-09-05 14:17:11', NULL, 3);
INSERT INTO `message` VALUES (12, 4, 1, '评论审核成功', '0', '2023-09-05 14:30:02', NULL, 3);
INSERT INTO `message` VALUES (13, 4, 1, '评论审核成功', '0', '2023-09-05 15:09:26', NULL, 3);
INSERT INTO `message` VALUES (14, 4, 1, '评论审核成功', '0', '2023-09-05 15:10:08', NULL, 3);
INSERT INTO `message` VALUES (15, 4, 1, '评论审核成功', '0', '2023-09-05 15:23:16', NULL, 3);
INSERT INTO `message` VALUES (16, 4, 1, '评论审核成功', '0', '2023-09-05 15:26:01', NULL, 3);
INSERT INTO `message` VALUES (17, 4, 1, '评论审核成功', '0', '2023-09-05 15:34:12', NULL, 3);
INSERT INTO `message` VALUES (18, 4, 1, '评论审核成功', '0', '2023-09-05 15:38:29', NULL, 3);
INSERT INTO `message` VALUES (19, 4, 1, '评论审核成功', '0', '2023-09-05 15:46:01', NULL, 4);
INSERT INTO `message` VALUES (20, 4, 1, '评论审核成功', '0', '2023-09-05 15:48:41', NULL, 4);
INSERT INTO `message` VALUES (21, 4, 1, '评论审核成功', '0', '2023-09-05 15:52:28', NULL, 4);
INSERT INTO `message` VALUES (22, 4, 1, '评论审核成功', '0', '2023-09-05 15:53:37', NULL, 4);
INSERT INTO `message` VALUES (23, 4, 1, '评论审核成功', '0', '2023-09-05 15:56:03', NULL, 4);
INSERT INTO `message` VALUES (24, 4, 1, '评论审核成功', '0', '2023-09-05 16:00:14', NULL, 4);
INSERT INTO `message` VALUES (25, 4, 1, '评论审核成功', '0', '2023-09-05 16:03:16', NULL, 4);
INSERT INTO `message` VALUES (26, 4, 1, '评论审核成功', '0', '2023-09-06 11:48:30', NULL, 4);
INSERT INTO `message` VALUES (27, 4, 1, '评论审核成功', '0', '2023-09-06 11:51:25', NULL, 4);
INSERT INTO `message` VALUES (28, 4, 1, '评论审核成功', '0', '2023-09-06 11:56:35', NULL, 4);
INSERT INTO `message` VALUES (29, 4, 1, '评论审核成功', '0', '2023-09-06 13:18:58', NULL, 4);
INSERT INTO `message` VALUES (30, 4, 1, '评论审核成功', '0', '2023-09-06 13:19:25', NULL, 4);

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `tagId` int(11) NOT NULL AUTO_INCREMENT,
  `tagName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `parentTagId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`tagId`) USING BTREE,
  INDEX `parentTagId`(`parentTagId` ASC) USING BTREE,
  CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`parentTagId`) REFERENCES `tag` (`tagId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES (4, '前端', NULL);
INSERT INTO `tag` VALUES (5, '后端', NULL);
INSERT INTO `tag` VALUES (6, '人工智能', NULL);
INSERT INTO `tag` VALUES (7, '嵌入式开发', NULL);
INSERT INTO `tag` VALUES (8, '安卓开发', NULL);
INSERT INTO `tag` VALUES (9, 'html', 4);
INSERT INTO `tag` VALUES (10, 'CSS', 4);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userEmail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `intro` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ins` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `twitter` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `levelId` int(11) NULL DEFAULT 2,
  PRIMARY KEY (`userId`) USING BTREE,
  INDEX `levelId`(`levelId` ASC) USING BTREE,
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`levelId`) REFERENCES `user_level` (`levelId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (3, 'admin', 'admin@qq.com', '224442c26aea392b7bb682d4e128dc54', NULL, NULL, NULL, NULL, 1);
INSERT INTO `user` VALUES (4, 'wenyi', '2283479521@qq.com', '224442c26aea392b7bb682d4e128dc54', NULL, NULL, NULL, NULL, 4);

-- ----------------------------
-- Table structure for user_level
-- ----------------------------
DROP TABLE IF EXISTS `user_level`;
CREATE TABLE `user_level`  (
  `levelId` int(11) NOT NULL AUTO_INCREMENT COMMENT '1代表管理员，2代表游客，3代表新人作者，4代表人气作者，5代表热门作者，6代表高产作者',
  `levelName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`levelId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_level
-- ----------------------------
INSERT INTO `user_level` VALUES (1, '管理员', NULL);
INSERT INTO `user_level` VALUES (2, '游客', '登录了但未发表文章，未评论过的用户');
INSERT INTO `user_level` VALUES (3, '评论家', '只评论过的用户');
INSERT INTO `user_level` VALUES (4, '新人作者', '发表过文章的用户（未必评论过）');
INSERT INTO `user_level` VALUES (5, '人气作者', '所有文章总评论超过20条');
INSERT INTO `user_level` VALUES (6, '热门作者', '单篇文章浏览量超过200');
INSERT INTO `user_level` VALUES (7, '高产作者', '发表文章数超过20');
INSERT INTO `user_level` VALUES (8, '高质量作者', '每篇文章浏览量>200&&评论量>10');

SET FOREIGN_KEY_CHECKS = 1;
