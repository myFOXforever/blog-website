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

 Date: 01/09/2023 16:58:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_level
-- ----------------------------
DROP TABLE IF EXISTS `user_level`;
CREATE TABLE `user_level`  (
  `levelId` int(11) NOT NULL AUTO_INCREMENT COMMENT '1代表管理员，2代表游客，3代表新人作者，4代表人气作者，5代表热门作者，6代表高产作者',
  `levelName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`levelId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

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
