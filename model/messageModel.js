const { DataTypes, DATE} = require('sequelize');
const sequelize = require('../config/connect');
const articleModel=require("./articleModel")
const  userModel=require('./userModel')
const sendMessageToUser=require('../send-message')

const messageModel = sequelize.define('message', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'userId'
            }
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "0表示审核信息，1表示文章评论信息，2表示其他"
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "0",
            comment: "0表示未读，1表示已读"
        },
        createTime: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "创建时间",
            defaultValue:new Date()
        },
        sendTime: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "发送时间（因为可能是定时发送"
        },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "article",
            key: 'articleId'
        }
    },
    }, {
        tableName: 'message',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "userId",
                using: "BTREE",
                fields: [
                    { name: "userId" },
                ]
            },
            {
                name: "articleId",
                using: "BTREE",
                fields: [
                    { name: "articleId" },
                ]
            },
        ],
        hooks: {
           afterCreate: async (message, options) => {
               console.log('afterCreate- message.content ', message.toJSON(), JSON.stringify(message.toJSON()))
               // 查询文章，以获取作者的 userId
               const article = await articleModel.findByPk(message.articleId);
               if (article) {
                   const authorId = article.authorId;
                   sendMessageToUser(authorId, JSON.stringify(message.toJSON()));
                   // sendMessageToUser(message.commenterId, JSON.stringify(message.toJSON()));
               }
           },
           afterUpdate: (message, options) => {
               // sendMessageToUser(2,message.content)
               console.log('afterUpdate- message.content ',  message.content )
               // wss.send('新消息',message)
           },
            afterBulkCreate: (message, options) => {
                console.log('afterBulkCreate- message.content ',  message )
                // wss.send('新消息',message)
            },
            afterBulkUpdate: (message, options) => {
                console.log('afterBulkUpdate- message.content ',  message)
                // wss.send('新消息',message)

            },
            beforeDestroy: (message, options) => {
                console.log('beforeDestroy- message.content ',  message.content )
                // sendMessageToUser(2,message.content)
                // wss.send('新消息',message)
            }
    },
    });

articleModel.hasMany(messageModel,{foreignKey:'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
messageModel.belongsTo(articleModel,{foreignKey:'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

userModel.hasMany(messageModel,{foreignKey:'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
messageModel.belongsTo(userModel,{foreignKey:'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

// 添加钩子


module.exports=messageModel
