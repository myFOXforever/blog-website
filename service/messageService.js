const Message=require('../model/messageModel')
const ArticleModel=require('../model/articleModel')
const FileModel=require('../model/fileModel')
const {DATE} = require("sequelize");

const MessageService={
    getAllMessages:async ()=>{
        return await Message.findAll()
    },
    getMyAllMessages:async (userId)=>{
        return await Message.findAll(
            {
                where: {userId: userId},
                include:[
                    {
                        model:ArticleModel,
                        include:{
                            model:FileModel
                        }
                    }
                ]
        })
    },
    createMessage:async (userId,Data)=>{
        return Message.create({
            userId:userId,
            ...Data
        })
    },
    // 标记用户的所有消息为已读
    updateOwnAllMessageStatus: async (userId) => {
        // 查询用户的所有消息
        const messages = await Message.findAll({
            where: {
                userId,
            },
        });

        if (messages.length > 0) {
            const updateData = {
                status: 1, // 根据你的数据模型定义来设置已读状态的值
            };

            // 使用批量更新将所有消息标记为已读
            await Message.update(updateData, {
                where: {
                    userId,
                },
            });
            return "已成功标记所有消息为已读";
        } else {
            return "没有找到任何消息需要标记为已读";
        }
    },
    // 把信息标记为已读
    updateMessageStatus:async (id)=>{
        const MessageRes=await Message.findByPk(id)
        if (MessageRes){
            return await MessageRes.update({
                status:1
            })
        }
        return null;
    },
    deleteMessage:async (id)=>{
        const MessageRes=await Message.findByPk(id);
        if (MessageRes){
            return await MessageRes.destroy()
        }
        return null;
    },
    // 删除用户的所有信息
    deleteMessageByUserId:async (userId)=>{
        const Messages=await Message.findAll({where:{userId:userId}});

        if (Messages && Messages.length > 0) {
            // 获取消息记录的 id 数组
            const messageIds = Messages.map(message => message.id);

            // 执行批量删除操作
            await Message.destroy({ where: { id: messageIds } });

            return true; // 表示删除成功
        }else {
            return true; // 表示删除成功
        }

    },
    getMessageById:async (id)=>{
        return await Message.findByPk(id)
    }
}

module.exports=MessageService;
