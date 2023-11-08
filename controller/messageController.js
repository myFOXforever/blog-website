const messageService=require('../service/messageService')

// 获取用户所有信息
exports.getAll=async (req,res,next)=>{
    try{
        const userId=req.user.userId;
        const messagesRes=await messageService.getMyAllMessages(userId)
        console.log('messagesRes', messagesRes)
        if (messagesRes){
            res.status(200).json({
                code:200,
                msg:'查询成功',
                data:messagesRes
            })
        }
    }catch (err){
        next(err)
    }
}

// 全部已读
exports.readAll=async (req,res,next)=>{
    try{
        const userId=req.user.userId;
        const updateRes=await messageService.updateOwnAllMessageStatus(userId);
        if (updateRes){
            res.status(200).json({
                code:200,
                msg:'更新成功'
            })
        }else {
            res.status(500).json({
                code:500,
                msg:'更新失败'
            })
        }
    }catch (err){
        next(err)
    }
}

// 单条已读,传消息的id
exports.readOne=async (req,res,next)=>{
    try{
        const {id}=req.query;
        const updateRes=await messageService.updateMessageStatus(id);
        if (updateRes){
            res.status(200).json({
                code:200,
                msg:'更新成功'
            })
        }else {
            res.status(500).json({
                code:500,
                msg:'更新失败'
            })
        }
    }catch (err){
        next(err)
    }
}

// 删除单条消息
exports.deleteOne=async (req,res,next)=>{
    try{
        // const userId=req.user.userId;
        const {id}=req.query;
        const deleteRes=await messageService.deleteMessage(id);
        if (deleteRes){
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

// 即时推送消息
exports.immediate=async (req,res,next)=>{
    try {

    }catch (e) {
        next(e)
    }
}
