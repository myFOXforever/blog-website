const schedule = require("node-schedule");
const ArticleService=require('./service/articleService')
const ArticleCommentService=require('./service/articleCommentService')
const MessageService=require('./service/messageService')
const UserService=require('./service/userService')
const {checkFile,checkComment}=require('./util/censor')
const {scheduleJobTime}=require('./config/default')


let isProcessing = false;

const articleJob= schedule.scheduleJob(scheduleJobTime, async () => {
    if (isProcessing) {
        console.log("上一次处理还未完成，本次文章定时任务被跳过");
        return;
    }

    isProcessing = true;
    try {
        console.log('定时审核文章任务开始执行', new Date())
        // 查询状态为 "未审核" 的文章
        const unreviewedArticles = await ArticleService.getNotAuditedArticles();
        if (unreviewedArticles&&unreviewedArticles.length>0){
            for (const article of unreviewedArticles) {
                const filePath = article.file.filepath;
                const articleId=article.articleId
                const authorId=article.authorId;
                console.log(filePath);
                console.log('articleId', articleId)
                // 审核文章
                const checkRes = await checkFile(filePath);
                console.log('checkRes', checkRes)
                if (checkRes.isPassed){
                    const updateRes=await ArticleService.updateArticleStatus(articleId,3)
                    const Message=await MessageService.createMessage(authorId,{type:0,content:'文章审核成功',articleId:articleId})
                    if (!updateRes||!Message){
                        console.log('Message', Message)
                        console.log('updateRes', updateRes)
                        console.log('审核成功后改变文章状态失败')
                    }
                }else {
                    const updateRes=await ArticleService.updateArticleStatus(articleId,2,JSON.stringify(checkRes.data))
                    const MessageRes=await MessageService.createMessage(authorId,{type:0,content:'文章审核失败',articleId:articleId})
                    if (!updateRes||!MessageRes){
                        console.log('Message', MessageRes)
                        console.log('updateRes', updateRes)
                        console.log('审核失败后改变文章状态失败')
                    }
                }

            }
        }else {
            //没有待审核文章就退出轮询
            console.log('没有待审核文章，审核退出')
            articleJob.cancel(); // 取消当前的定时任务
        }

    } catch (error) {
        console.error("定时审核文章任务出错：", error);
    } finally {
        isProcessing = false;
    }
});
const contentJob= schedule.scheduleJob(scheduleJobTime, async () => {
    if (isProcessing) {
        console.log("上一次处理还未完成，本次评论定时任务被跳过");
        return;
    }

    isProcessing = true;
    try {
        console.log('定时审核评论任务开始执行', new Date())
        // 查询状态为 "未审核" 的评论
        const unreviewedComments = await ArticleCommentService.getAllCommentSbyStatus();
        if (unreviewedComments&&unreviewedComments.length>0){
            for (const comment of unreviewedComments) {
                // const id = comment.id;
                // const content=comment.content;
                // const userId=comment.userId;
                // const articleId=comment.articleId;
                const {id,content, commenterId,articleId}=comment;
                // console.log('userId', userId)
                // 审核评论
                const checkRes = await checkComment(content);
                console.log('checkRes', checkRes)
                if (checkRes.isPassed){
                    const updateRes=await ArticleCommentService.updateArticleCommentStatus(id,1,'审核成功')
                    const MessageRes=await MessageService.createMessage(commenterId,{type:1,content:'评论审核成功',articleId:articleId})
                    // const Message=true;
                    if (!updateRes||!MessageRes){
                        console.log('Message', MessageRes)
                        console.log('updateRes', updateRes)
                        console.log('审核成功后改变评论状态失败')
                    }

                }else {
                    const updateRes=await ArticleCommentService.updateArticleCommentStatus(id,2,JSON.stringify(checkRes.data))
                    const MessageRes=await MessageService.createMessage(commenterId,{type:1,content:'评论审核失败',articleId:articleId})
                    if (!updateRes||MessageRes){
                        console.log('审核失败后改变评论状态失败')
                    }
                }

            }
        }else {
            //没有待审核文章就退出轮询
            console.log('没有待审核评论，审核退出')
            contentJob.cancel(); // 取消当前的定时任务
        }

    } catch (error) {
        console.error("定时审核评论任务出错：", error);
    } finally {
        isProcessing = false;
    }
});
