const Habit=require('../model/habitModel')
const TagService=require('../service/tagService')


const HabitService={
    getAllHabitsByHbtColId:async (HbtColId)=>{
        const habits= await Habit.findAll({where:{habitcollectionId:HbtColId}})
        let res=habits;
        // console.log('habits', habits)
        habits.map(async (item,index) => {
            const tag = await TagService.getTagById(item.tagId)
            res[index].tagn=tag;
        })
        console.log('res结果', res)
        return res
    },

    createHabit:async (tagId,habitColId)=>{
        return Habit.create({
            tagId,
            habitCollectionId:habitColId
        })
    },

    updateHabit:async (id,Data)=>{
        const habit=await Habit.findByPk(id)
        if (habit){
            return await habit.update(Data)
        }
        return null;
    },
    deleteHabit:async (id)=>{
        const habit=await Habit.findByPk(id);
        if (habit){
            return await habit.destroy()
        }
        return null;
    },
    deleteHabitByTagId:async (tagId,habitCollectionId)=>{
        return await Habit.destroy({ where: { tagId ,habitCollectionId} });
    },
    getHabitById:async (id)=>{
        return await Habit.findByPk(id)
    },
    getHabitsByTagIdAndHabitCollectionId:async (tagId,habitCollectionId)=>{
        return await Habit.findAll({
            where:{
                tagId,
                habitCollectionId
            }
        })
    }
}

module.exports=HabitService;
