const { body, check} = require("express-validator");
const validate = require("../middleware/validate");
const ArticleService=require('../service/articleService')

// 文件注册
exports.create=validate([
    body('option').notEmpty().withMessage('option不能为空')
        .bail()
        .custom(value => {
    if (Number(value) !== 0 &&Number(value) !== 1) {
        throw new Error('option参数必须是0或1。');
    }
    return true;
})
])
/** 申请重新审核文章
 * 传过来articleId
 * @type {(function(*, *, *): Promise<*|undefined>)|*}
 */
exports.check=validate([
    body('articleId').notEmpty().withMessage('文章id不能为空')
        .bail()
        .custom(async (value,{req})=>{
            const res=await ArticleService.getArticleById(value)
            if (res){
                req.article=res;
            }
            else {
                return Promise.reject('文章不存在')
            }
        })
])

/**
 * 增加文章浏览量，对文章是否存在和状态是否是已经发表
 */
exports.view=validate([
    body('articleId').notEmpty().withMessage('文章id不能为空')
        .bail()
        .custom(async (value)=>{
            const articleRes=await ArticleService.getArticleById(value)
            if (articleRes){
                if (articleRes.status===3){
                    return  true
                }else {
                    return Promise.reject('文章未发表')
                }
            }
            else {
                return Promise.reject('文章不存在')
            }
        })
])

/**
 * 获取所有文章 判断dataOrder和view Order的值
 */

exports.order=validate([
    check('dataOrder').optional()
        .notEmpty().withMessage('dataOrder不能为空')
        .bail()
        .custom(async (value,{req})=>{
            if (value!=='ASC'||value!=='DESC'){
                return Promise.reject('dataOrder的值只能为ASC或者DESC')
            }
}),
    check('viewOrder').optional()
        .notEmpty().withMessage('viewOrder不能为空')
        .bail()
        .custom(async (value,{req})=>{
            console.log('value', value,value!=='DESC',typeof value)
            if (value !== 'ASC' && value !== 'DESC'){
                return Promise.reject('viewOrder的值只能为ASC或者DESC')
            }
        })
])

//获取自己的文章被阅读数
exports.date=validate([
    check('start').optional()
        .notEmpty().withMessage('start不能为空')
        .custom(async (value)=>{
            // 定义时间格式的正则表达式
            const timeFormatRegex =  /^\d{4}-\d{2}-\d{2}$/;

            // 使用正则表达式进行验证
            if (!timeFormatRegex.test(value)) {
                return  Promise.reject('时间格式无效');
            }
        })
    ,
    check('num').optional()
        .notEmpty().withMessage('num不能为空')
        .bail()
        .custom(async (value)=>{
            const num=parseInt(value,10);
            if (num !== 0 && num !== 1&&num!==2){
                return Promise.reject('num的值只能为0,1,2')
            }
        })
])

exports.delete=validate([
    check('articleId').notEmpty().withMessage('articleId不能为空')
        .bail()
        .custom(async (value,{req})=>{
            const article =await ArticleService.getArticleByIdAndUserId(value,req.user.userId)
            if (article){
                req.article=article;
            }else {
                return Promise.reject('不存在改articleId')
            }
        })
])
