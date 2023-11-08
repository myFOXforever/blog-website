const { body, check} = require("express-validator");
const validate = require("../middleware/validate");
const ArticleCommentService=require('../service/articleCommentService')
const ArticleService=require('../service/articleService')
/** 评论删除
 * 判断是否是用户自己的评论或者是自己的文章下的评论
 * @type {(function(*, *, *): Promise<*|undefined>)|*}
 */
exports.delete=validate([
    check('id').notEmpty().withMessage('评论id不能为空')
        .bail()
        .custom(async (id,{req})=>{
            const userId=req.user.userId;
            const comment=await ArticleCommentService.getArticleCommentById(id);
            const articleId=comment.articleId;
            const article=await ArticleService.getArticleByComment(userId,articleId)
            console.log('article', article)
            if (comment.commenterId===userId||(article.length===1&&article[0].authorId===userId)){
                return true
            }else {
                return Promise.reject('不是您的所属评论')
            }
        })
])
