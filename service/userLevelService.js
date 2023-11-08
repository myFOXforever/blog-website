const UserLevel=require('../model/userLevelModel')

const UserLevelService={
    getAllUserLevels:async ()=>{
        return await UserLevel.findAll()
    },

    createUserLevel:async (Data)=>{
        return UserLevel.create(Data)
    },

    updateUserLevel:async (id,Data)=>{
        const UserLevel=await UserLevel.findByPk(id)
        if (UserLevel){
            return await UserLevel.update(Data)
        }
        return null;
    },
    deleteUserLevel:async (id)=>{
        const UserLevel=await UserLevel.findByPk(id);
        if (UserLevel){
            return await UserLevel.destroy()
        }
        return null;
    },

    getUserLevelById:async (id)=>{
        return await UserLevel.findByPk(id)
    }
}

module.exports=UserLevelService;
