const articleService=require('../service/articleService' )
const FileService=require('../service/fileService')
const ArticleTagService=require('../service/articletagService')
const ArticleService=require('../service/articleService')
const HistoryService=require('../service/userarticlehistoryService')

const { dirname} = require("path");
const currentDir = __dirname;
const parentDir = dirname(currentDir);

/** 新增文章(文件上传方式）
**  tagArr是tagId组成的数组(选填）
 * option 表示是立即发布还是暂存（必填）
 * 0表示暂存，1表示立即发布（即提交审核）
 * */
exports.createByFile=async (req,res,next)=>{
    try {
        const {img,title,tagArr,option}=req.body;
        console.log('req.file', req.file)
        console.log('title', title)
        console.log('tagArr', tagArr,typeof tagArr)
        // 存储文件
        // const url = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        //TODO 存的本地地址
        console.log('parentDir', parentDir)
        const url=`${parentDir}/${req.file.path}`

        const resUrl=url.replace(/\\/g, '/');
        console.log('resUrl', resUrl)
        const fileRes=await FileService.createFile({
            filename:req.file.originalname,
            filesize:req.file.size,
            filepath:resUrl,
            type:2
        })
        if (fileRes.fileId) {
            const articleRes = await articleService.createArticle({
                authorId: req.user.userId,
                title: title||req.mark.slice(0,20), // 截取前20个字符作为标题
                contentFileId: fileRes.fileId,
                coverImg: img || '',
                status: option
            })

            if (articleRes) {

                // 存储tag
                if (tagArr&&tagArr.length>0){
                    let insertArr=[];
                    tagArr.forEach(item=>{
                        insertArr.push({tagId:item,articleId:articleRes.articleId})
                    })
                    console.log('insertArr', insertArr)
                    const tagRes=await ArticleTagService.createArticleTags(insertArr)
                    console.log('tagRes', tagRes)
                    if (tagRes){
                        res.status(200).json({
                            code: 200,
                            msg: "上传成功"
                        })
                    }else {
                        res.status(500).json({
                            code: 500,
                            msg: 'tag写入失败'
                        })
                    }
                }
                else {
                    res.status(200).json({
                        code:200,
                        msg:'上传成功'
                    })
                }
                // 触发审核文章
            } else {

                res.status(500).json({
                    code: 500,
                    msg: '上传失败'
                })
            }
        }else {
                res.status(500).json({
                    code:500,
                    msg:'文件上传失败'
                })
        }
    }catch (e) {
        next(e)
    }
}

/**
 * 新增文章（手动传md文本
 */
exports.create=async (req,res,next)=>{
    try{

    }catch (err){
        next(err)
    }
}


/**
 * 重新审核文章
 */
exports.check=async (req,res,next)=>{
    try {
        const article=req.article;
        console.log('article', article)
        const isAdmin=Number(req.user.levelId) === 1;
        if (isAdmin){
            const checkRes=await ArticleService.updateArticleStatus(article.articleId,1)
            console.log('checkRes', checkRes)
            if (checkRes){
                res.status(200).json({
                    code:200,
                    msg:'提交成功'
                })
            }
        }else {
            // 判断是不是自己的文章
            if (article.authorId===req.user.userId){
                const checkRes=await ArticleService.updateArticleStatus(article.articleId,1)
                console.log('checkRes', checkRes)
                if (checkRes){
                    res.status(200).json({
                        code:200,
                        msg:'提交成功'
                    })
                }
            }else {
                res.status(401).json({
                    code:401,
                    msg:'选中文章不是当前登录用户的'
                })
            }
        }

    }catch (err){
        next(err)
    }
}

/**更新文章浏览量
 * 只需要传文章id
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.updateArticleViewCount=async (req,res,next)=>{
    try {
        const {articleId}=req.body;
        const historyRes=await HistoryService.createHistory(req.user.userId,articleId)
        const viewRes=await ArticleService.updateArticleViewCount(articleId)
        if (historyRes&&viewRes){
            res.status(200).json({
                code:200,
                msg:'更新成功'
            })
        }else {
            res.status(500).json({
                code:500,
                msg:'插入失败'
            })
        }
    }catch (err){
        next(err)
    }
}
// 修改文章
exports.update=async (req,res,next)=>{
    try {

    }catch (e) {
        next(e)
    }
}

// 删除文章

exports.delete=async (req,res,next)=>{
    try {
        const articleId=req.article.articleId
        const deleteRes=await ArticleService.deleteArticle(articleId)
        if (deleteRes){
            res.status(200).json({
                code:200,
                msg:"删除成功"
            })
        }else {
            res.status(500).json({
                code:500,
                msg:"删除失败"
            })
        }
    }catch (e){
        next(e)
    }
}

/** 获取所有已经发布的文章
 * ,dateOrder,viewOrder二选一
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getAll=async (req,res,next)=>{
    try {
        const {tagId,keyword,dateOrder,viewOrder}=req.query;
        const {count, rows }=await articleService.getAllArticlesByStatus(3,tagId,keyword,dateOrder,viewOrder)
        res.status(200).json({
            code:200,
            data:[...rows],
            total:count
        })
    }catch (err){
        next(err)
    }
}

// 获取自己的所有文章,可以根据状态或title名字获取，
exports.getOwnArticles=async (req, res, next)=>{
    try {
        const userId=req.user.userId;
        const {status,keyword}=req.query;
        const  articleRes=await articleService.getOwnArticles(userId,status,keyword)
       if (articleRes){
           res.status(200).json({
               code:200,
               data:articleRes
           })
       }
    }catch (err){
        next(err)
    }
}

/** 获取自己的文章总数和阅读数
 * num 0 本周
 *     1  本月
 *     3  本年
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getOwnArticleViewCount=async (req,res,next)=>{
    const userId=req.user.userId;
    const {start,num}=req.query;
    let endQuery,startQuery;
    let startDate = new Date(start);
    // console.log('start', start)
    // console.log('startDate', startDate)
    if (parseInt(num,10)===0){
        const dayOfWeek=startDate.getDay()//获取今天是周几
        startQuery=new Date(startDate)
        if (dayOfWeek!==1){
            startQuery.setDate(startDate.getDate()-dayOfWeek+1)

        }
         endQuery=new Date(startDate);
        endQuery.setDate(startDate.getDate()+6)
    }else if (parseInt(num,10)===1){
        // 获取当前月份的第一天
         startQuery = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        // 获取下个月的第一天，然后回退一天即可获取当前月份的最后一天
        const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
         endQuery = new Date(nextMonth - 1);
    }else if(parseInt(num,10)===2){
        // 获取今年的第一天
         startQuery = new Date(startDate.getFullYear(), 0, 1);
        // 获取今年的最后一天，即12月31日
         endQuery = new Date(startDate.getFullYear(), 11, 31);
    }

    const getRes=await ArticleService.getOwnArticleByDate(userId,startQuery,endQuery,parseInt(num,10));
    console.log('endQuery', endQuery);
    console.log('startQuery', startQuery);
    const viewRes=await  ArticleService.getArticleCountAndTotalViewsInDateRange(userId,startQuery,endQuery)
    console.log('getRes', getRes)
    console.log('viewRes', viewRes)
    if (getRes){
        res.status(200).json({
            code:200,
            data:[{
                total:viewRes,
                getRes
            }],
            msg:'查询成功'
        })
    }else {
        res.status(500).json({
            code:500,
            msg:'查询失败'
        })
    }
}
