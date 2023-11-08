const articleCommentModel=require('../model/articleCommentModel')
const {where} = require("sequelize");
const {fn, col} = require("../config/connect");

const articleCommentService={
   // 获得文章所有评论
    getArticleCommentsByArticleId:async (articleId)=>{
        return await articleCommentModel.findAll({
            where:{
                articleId,
                status:1
            }
        })
    },
    getAllCommentSbyStatus:async ()=>{
        return await articleCommentModel.findAll({where:{status:0}})
    },
    getCommentsByUserId:async (userId)=>{
     const comments= await articleCommentModel.findAll({
          attributes:[
              [fn('SUM', col('commenterId')), 'totalComments'],
          ],
          where:{
              commenterId:userId,
              status:1
          }
      })
        return comments[0]
    },
    createArticleComment:async (userId,articleId,content,parentId=null)=>{
        return articleCommentModel.create({
            commenterId:userId,
            articleId,
            content,
            parentId,
        })
    },

    updateArticleCommentStatus:async (id,status,reason='')=>{
        const articleComment=await articleCommentModel.findByPk(id)
        if (articleComment){
            return await articleComment.update({
                status,
                reason,
            })
        }
        return null;
    },
    deleteArticleComment:async (id)=>{
        console.log('id', id)
        const articleComment=await articleCommentModel.findByPk(id);
        // const articleComment=await articleCommentModel.findOne({where:{id:id}});
        console.log('articleComment', articleComment)
        if (articleComment){
            return await articleComment.destroy()
        }
        return null;
    },

    getArticleCommentById:async (id)=>{
        return await articleCommentModel.findByPk(id)
    }
}

module.exports=articleCommentService;
