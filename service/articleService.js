const articleModel = require('../model/articleModel')
const fileModel=require('../model/fileModel')
const tagModel=require('../model/tagModel')
const commentModel=require('../model/articleCommentModel')
const {where, Op} = require("sequelize");
const {fn, col} = require("../config/connect");

const articleService = {

    /**按照文章状态获取所有文章
     * @param status 文章状态
     * @param tagId
     * @param keyword
     * @param dateOrder
     * @param viewOrder
     * @returns 包括文章的tag信息和评论信息
     */
    getAllArticlesByStatus: async (status,tagId,keyword,dateOrder=null,viewOrder=null) => {
        const whereCondition={status:status}
        let orderCondition=['publishDate','DESC'];
       if (keyword!=null){
           whereCondition.title={
               [Op.like]: `%${keyword}%`
           }
       }
      const sonWhereCondition={}
       if (tagId!=null){
           sonWhereCondition.tagId=tagId;
       }
       if (dateOrder!=null){
           orderCondition=['publishDate',dateOrder]
       }
       else if (viewOrder!=null){
           orderCondition=['viewCount',viewOrder]
       }else if (dateOrder!=null&&viewOrder!=null){
           orderCondition=['publishDate',dateOrder]
       }
        console.log('orderCondition', orderCondition)
        return await articleModel.findAndCountAll({where:whereCondition,
            include: {
                model: tagModel,
                where:sonWhereCondition,
                through: { attributes: [] } // 不包括中间表的字段
            },
            order: [orderCondition]
        });
    },

    // 获取未审核的文章
    getNotAuditedArticles: async () => {
        try {
            return await articleModel.findAll({
                where: {
                    status: 1 // 查询 status 为 1 (未审核)的文章
                },
                include: [
                    {
                        model: fileModel,
                    }
                ]
            });
        } catch (error) {
            // 在这里处理异常
            console.error("Error while fetching not audited articles:", error);
            throw error; // 可以选择继续抛出异常供调用者处理
        }
    },

    getArticleByIdAndUserId: async (articleId,userId) => {
        return await articleModel.findOne({
            where:{
                articleId,
                authorId:userId
            }
        });
    },
    getArticleByComment:async (userId,articleId)=>{
        return await articleModel.findAll({where:{
                authorId:userId,
                articleId:articleId
            }})
    },
    // 根据时间获取自己发表的文章数和被阅读数
    getOwnArticleByDate:async (userId,startDate,endDate,num)=>{
        const start=new Date(startDate)
        const end=new Date(endDate)
        // console.log('startDate', startDate)
        // console.log('endDate', endDate)
        const weeklyViews = [];

        while (start <= end) {
            const weekStartDate = new Date(start);
            const weekEndDate = new Date(start);

            if (num===0){//本周
                // 计算一伦的结束日期
                weekEndDate.setDate(weekEndDate.getDate() +1);
            }else if(num===1){//本月
                // 计算一伦的结束日期
                weekEndDate.setDate(weekEndDate.getDate() +7);
            }else if (num===2){//本年
                // 计算一伦的结束日期
                weekEndDate.setDate(weekEndDate.getMonth() +1);
            }


            // 查询该周内的文章阅读总量
            const result = await articleModel.findOne({
                attributes: [
                    [fn('SUM', col('viewCount')), 'weeklyViews'],
                ],
                where: {
                    authorId: userId,
                    status: 3,
                    publishDate: {
                        [Op.between]: [weekStartDate, weekEndDate],
                    },
                },
            });

            // 添加本周的阅读总量到数组
            weeklyViews.push({
                weekStartDate,
                weekEndDate,
                weeklyViews: result.dataValues.weeklyViews || 0,
            });
            // 移动到下一轮

            if (num===0){//本周
                // 计算一伦的结束日期
                start.setDate(start.getDate() + 1);
            }else if(num===1){//本月
                // 计算一伦的结束日期
                start.setDate(start.getDate() + 7);
            }else if (num===2){//本年
                // 计算一伦的结束日期
                start.setDate(start.getMonth() + 1);
            }

        }

        return weeklyViews;
        },
    getArticleCountAndTotalViewsInDateRange : async (userId, startDate, endDate) => {
         console.log('startDate', startDate)
         console.log('endDate', endDate)
        const articles = await articleModel.findAll({
            attributes: [
                [fn('COUNT', col('articleId')), 'articleCount'],
                [fn('SUM', col('viewCount')), 'totalViews'],
            ],
            where: {
                authorId: userId, // 你的用户ID
                publishDate: {
                    [Op.between]: [startDate, endDate], // 在指定时间范围内的文章
                },
            },
        });

        return articles[0]; // 直接返回第一个元素，它包含聚合的文章数和总阅读次数
    },

    createArticle: async (userData) => {
        return  articleModel.create(userData);
    },
    getOwnArticles:async (userId,status=null,keyword=null)=>{
        const whereCondition={
            authorId:userId,
        }
        if (status != null){
            whereCondition.status=status
        }
        if (keyword!==null&&keyword!==undefined){
            whereCondition.title={
                [Op.like]: `%${keyword}%`
            }
        }
        const articles=await articleModel.findAll({
            where:whereCondition,
            // attributes:[
            //     [fn('COUNT', col('articleId')), 'articleCount'],
            // ],
            include:[
                {
                    model: tagModel,
                    through: { attributes: [] } // 不包括中间表的字段
                },
                {
                    model:commentModel,
                }
            ]
        });
        // 计算每篇文章的评论总数
        const articlesWithCommentCount = articles.map((article) => ({
            ...article.toJSON(),
            commentCount: article.articleComments.length
        }));
        // console.log('articlesWithCommentCount', articlesWithCommentCount)
        return {articles:articlesWithCommentCount,count:(articles).length}
    },

    updateArticle: async (userId, userData) => {
        const user = await articleModel.findByPk(userId);
        if (user) {
            return await user.update(userData);
        }else {
        return null;
        }
    },
    // 更新文章浏览量// When a user views an article
     updateArticleViewCount : async (articleId) => {
       return  await articleModel.increment('viewCount', { by: 1, where: { articleId } });
    },

    // 修改审核状态
    updateArticleStatus: async (id, status,reason='') => {
        const user = await articleModel.findByPk(id);
        if (user) {
            return await user.update({status:status,reason:reason});
        }
        return null;
    },
    deleteArticle: async (articleId) => {
        console.log('articleId', articleId)
        const article = await articleModel.findByPk(articleId);
        if (article) {
            return await article.destroy();
        }
        return null;
    },
    deleteMyArticles: async (userId) => {
        const articles = await articleModel.findAll({where:{authorId:userId}});
        console.log('articles', articles)
        if (articles && articles.length > 0) {
            // 获取消息记录的 id 数组
            const articleIds = articles.map(message => message.articleId);
            console.log('articleIds', articleIds)
            // 执行批量删除操作
            await articleModel.destroy({ where: { articleId: articleIds } });

            return true; // 表示删除成功
        }else return articles.length === 0;

    }
};

module.exports = articleService;

