const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const ArticleCommentController=require('../controller/articleCommentController')
const ArticleCommentValidator=require('../validator/commentValidator')
// 创建评论
router.post('/create',auth,ArticleCommentController.create)

// 删除评论
router.delete('/delete',auth,ArticleCommentValidator.delete,ArticleCommentController.delete)

// 获取文章所有评论
router.get('/getAll',auth,ArticleCommentController.getAll);

module.exports = router;
