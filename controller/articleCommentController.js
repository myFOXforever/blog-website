const ArticleCommentService=require('../service/articleCommentService')
// 创建评论
exports.create=async (req,res,next)=>{
    try{
        const userId=req.user.userId;
        const {articleId,content,parentId}=req.body;
        const createRes=await  ArticleCommentService.createArticleComment(userId,articleId,content,parentId)
        console.log('createRes', createRes)
        if (createRes){
            res.status(200).json({
                code:200,
                msg:'评论成功，正在审核'
            })
        }else {
            res.status(500).json({
                code:500,
                msg:'评论失败'
            })
        }
    }catch (err){
        next(err)
    }
}

// 删除评论
exports.delete=async (req,res,next)=>{
    try{
        const {id}=req.query;
        console.log('id', id)
        const delRes=await ArticleCommentService.deleteArticleComment(id);
        console.log('delRes', delRes)
        if (delRes){
            res.status(200).json({
                code:200,
                msg:'删除成功'
            })
        }else {
            res.status(500).json({
                code:500,
                msg:'删除失败'
            })
        }
    }catch (err){
        next(err)
    }
}

//获取文章所有评论
exports.getAll=async (req,res,next)=>{
    try {
        const {articleId}=req.query
        const comments=await ArticleCommentService.getArticleCommentsByArticleId(articleId)
        if (comments){
            res.status(200).json({
                code:200,
                data:JSON.stringify(comments,null,4),
                msg:"查询成功"
            })
        }else {
            res.status(500).json({
                code:500,
                msg:'查询失败'
            })
        }
    }catch (err) {
        next(err)

    }
}
