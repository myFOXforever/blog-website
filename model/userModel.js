const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
const md5=require('../util/md5')
const userLevelModel=require('./userLevelModel')
const articleCommentModel = require("./articleCommentModel");
const userModel = sequelize.define('user',
    {
        userId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        userEmail: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'password',
            set: function(value) { // 使用普通的函数表达式
                this.setDataValue('password', md5(value)); // 使用setDataValue方法来更新密码字段的值
            }
        },
        intro: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        ins: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        twitter: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        levelId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue:2,//默认是游客
            references: {
                model: 'user_level',
                key: 'levelId'
            }
        }
    },
    {
        tableName: 'user',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "userId" },
                ]
            },
            {
                name: "levelId",
                using: "BTREE",
                fields: [
                    { name: "levelId" },
                ]
            },
        ]
    });

// 在模型定义后，添加关联关系
userLevelModel.hasMany(userModel,{foreignKey:'levelId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
userModel.belongsTo(userLevelModel,{foreignKey:'levelId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

// 用户和评论一对多
userModel.hasMany(articleCommentModel,{foreignKey:'commenterId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
articleCommentModel.belongsTo(userModel,{foreignKey:'commenterId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

module.exports=userModel;
