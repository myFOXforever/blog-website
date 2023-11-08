const express = require("express");
const router = express.Router();

// 用户相关路由
router.use('/user',require("./user"));

// 文章相关路由
router.use('/article',require('./article'))

// 文章评论相关路由
router.use('/comment',require('./articleComment'))

// tag相关路由
router.use('/tag',require('./tag'))

// 用户信息相关路由
router.use('/message',require('./message'))

// 通用操作相关路由
router.use('/common',require('./common'))



module.exports = router;
