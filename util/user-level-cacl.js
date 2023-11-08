const articleService=require('../service/articleService')
const commentService=require('../service/articleCommentService')
const userService=require('../service/userService')


module.exports=async (userId)=>{
    // 获取现在的userLevel
    const user=await userService.getUserById(userId);
    const levelId=user.levelId;
    let levelRes=levelId;
    // 处于2到8级的用户才进行更新
    if (levelId>1&&levelId<8){
        const articles=await articleService.getOwnArticles(userId,3,null);
        if (levelId===2){
            // const articles=await articleService.getOwnArticles(userId,3,null);
            const articleSum=articles.count;
            if (articleSum>1){
                levelRes=4
            }
            const commentSum=commentService.getCommentsByUserId(userId)
            console.log('commentSum', commentSum)
            if (commentSum.totalComments>1){
                levelRes=3
            }
        }
        else if (levelRes===3){
            // const articles=await articleService.getOwnArticles(userId,3,null);
            const articleSum=articles.count;
            if (articleSum>1){
                levelRes=4
            }
        }else if(levelRes===4){
            // const articles=await articleService.getOwnArticles(userId,3,null);
            let maxComment=0;
            articles.articles.map(item=>{
                if (item.commentCount>maxComment){
                    maxComment=item.commentCount
                }
            })
            if (maxComment>=20){
                levelRes=5
            }
        }else if (levelRes===5){
            // const articles=await articleService.getOwnArticles(userId,3,null);
            let maxViewCount=0;
            articles.articles.map(item=>{
                if (item.viewCount>maxViewCount){
                    maxViewCount=item.viewCount
                }
            })
            if (maxViewCount>200){
                levelRes=6
            }
        }else if (levelRes===6){
            // const articles=await articleService.getOwnArticles(userId,3,null);
            const articleSum=articles.count;
            if (articleSum>20){
                levelRes=7
            }
        }else if (levelRes===7){
            // const articles=await articleService.getOwnArticles(userId,3,null);
            const  isTure=
                articles.articles.every(item=>item.commentCount>=10&&item.viewCount>=200)
            if (isTure){
                levelRes=8
            }
        }
    }
    return levelRes
}
