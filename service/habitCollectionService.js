const HabitCollection=require('../model/habitCollectionModel')
const Habit = require("../model/habitModel");
const Tag=require('../model/tagModel')

const HabitCollectionService={
    getAllHabitCollections:async ()=>{
        return await HabitCollection.findAll()
    },
    getAllHabitCollectionByUserId:async (userId)=>{
        return await HabitCollection.findAll({where:{userId}})
    },
    createHabitCollection:async (userId)=>{
        return HabitCollection.create({
            userId,
        })
    },

    updateHabitCollection:async (id,Data)=>{
        const HabitCollection=await HabitCollection.findByPk(id)
        if (HabitCollection){
            return await HabitCollection.update(Data)
        }
        return null;
    },
    deleteHabitCollection:async (id)=>{
        const HabitCollectionRes=await HabitCollection.findByPk(id);
        if (HabitCollectionRes){
            return await HabitCollectionRes.destroy()
        }
        return null;
    },
    deleteHabitCollectionByUserId:async (userId)=>{
        console.log('userId', userId)
        const HbtCol= await HabitCollection.findOne({where:{userId:userId}})
        console.log('HbtCol', HbtCol)
        if (HbtCol){
            const habitColId=HbtCol.habitcollectionId;
            if (habitColId){
                return await HabitCollectionService.deleteHabitCollection(habitColId)
            }
        }else {
            return true
        }

    },
    getAllHabitsByHbtColId:async (userId)=>{
        return HabitCollection.findOne({where:{userId:userId}})
    },
    getHabitCollectionByUserId:async (userId)=>{
        const HbtCol= await HabitCollection.findOne({where:{userId:userId}})
        console.log('service里面HbtCol', HbtCol)
        if (HbtCol){
           return HbtCol
        }else {
            return  true
        }
        // const HbtColId= (await HabitCollection.findOne({where:{userId:userId}})).habitcollectionId;
        // return await HabitService.getAllHabitsByHbtColId(HbtColId)

    }
}

module.exports=HabitCollectionService;
