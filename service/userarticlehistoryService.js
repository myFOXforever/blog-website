const History=require('../model/historyModel')

const HistoryService={
    getAllHistorys:async ()=>{
        return await History.findAll()
    },

    createHistory:async (userId,articleId)=>{
        return History.create({
            userId:userId,
            articleId:articleId
        })
    },

    updateHistory:async (id,Data)=>{
        const History=await History.findByPk(id)
        if (History){
            return await History.update(Data)
        }
        return null;
    },
    deleteHistory:async (id)=>{
        const History=await History.findByPk(id);
        if (History){
            return await History.destroy()
        }
        return null;
    },

    getHistoryById:async (id)=>{
        return await History.findByPk(id)
    }
}

module.exports=HistoryService;
