const {Op} = require("sequelize");

const userModel = require('../model/userModel');
const userLevelModel=require('../model/userLevelModel')
const habitColModel=require('../model/habitCollectionModel')
const habitModel=require('../model/habitModel')
const tagModel=require('../model/tagModel')

const HabitColService=require('../service/habitCollectionService')
const MessageService=require('../service/messageService')
const ArticleService=require('../service/articleService')

const UserService = {
    /**
     * 查询所有用户，普通用户只能查到普通用户，管理员可以查到所有
     * @param username 根据名字模糊查询
     * @param isAdmin 是否是管理员 0/1
     * @returns
     */
    getAllUsers: async (username, isAdmin) => {
        const whereCondition = {
            username: {
                [Op.like]: `%${username}%`
            }
        };

        if (isAdmin === 0) {
            whereCondition.levelId = {
                [Op.not]: 1  //除去管理员
            };
        }

        return await userModel.findAndCountAll({
            where: whereCondition,
            include:[
                {
                    model:habitColModel,
                    as: 'userHabitCol',
                    attributes:['habitCollectionId'],
                    include:{
                        model: habitModel,
                        as:'habits',
                        attributes:['habitId'],
                        include: [
                            {
                                model: tagModel,
                                attributes: ['tagName','tagId'],
                            },
                        ],
                    }
                }
            ]
        });
    },
    getUserByUserId:async (userId)=>{
        return userModel.findByPk(userId)
    },
    getUserById: async (userId) => {
        try {
            return  await userModel.findOne({
                where: { userId: userId },
                include:[
                    {
                        model:habitColModel,
                        as: 'userHabitCol',
                        attributes:['habitCollectionId'],
                        include:{
                            model: habitModel,
                            as:'habits',
                            attributes:['habitId'],
                            include: [
                                {
                                    model: tagModel,
                                    attributes: ['tagName','tagId'],
                                },
                            ],
                        }
                    },
                    {
                        model:userLevelModel,
                    }
                ]
            });

        } catch (error) {
            console.error('service--getUserById--Error:', error);
        }
    },

    createUser: async (userData) => {
        return  userModel.create(userData);
    },

    updateUser: async (userId, userData) => {
        const user = await userModel.findByPk(userId);
        if (user) {
            return await user.update(userData);
        }
        return null;
    },
    updateUserLevel: async (userId, levelId) => {
        const user = await userModel.findByPk(userId);
        if (user) {
            return await user.update({levelId});
        }
        return null;
    },
    deleteUser: async (userId) => {
        const user = await userModel.findByPk(userId);
        const habitCol=await HabitColService.deleteHabitCollectionByUserId(userId)
        if (habitCol){
            console.log('删除用户habits成功')
        }else {
            console.log('删除用户habits失败',habitCol)
            return Promise.reject('删除用户habits失败')
        }
        const MesRes=await MessageService.deleteMessageByUserId(userId)
        if (MesRes){
            console.log('删除用户message成功')
        }else {
            console.log('删除用户message失败')
            return Promise.reject('删除用户message失败')
        }
        const ArticleRes=await  ArticleService.deleteMyArticles(userId)
        console.log('ArticleRes', ArticleRes)
        if (ArticleRes){
            console.log('删除用户article成功')
        }else {
            console.log('删除用户article失败')
            return Promise.reject('删除用户habits失败')
        }
        if (user) {
            return await user.destroy();
        }
        return null;
    }
};

module.exports = UserService;

