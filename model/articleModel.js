const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
const fileModel=require('./fileModel')
const userModel=require('./userModel')
const articleCommentModel = require("./articleCommentModel");

const articleModel = sequelize.define('article',
    {
        articleId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user',
                key: 'userId'
            }
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: '未命名文章',
        },
        publishDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
        },
        contentFileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'file',
                key: 'fileId'
            }
        },
        coverImg: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "状态（0表示草稿，1表示审核中，2表示审核失败，3表示发布"
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "失败原因"
        },
        viewCount:{
            type:DataTypes.BIGINT,
            allowNull:false,
            defaultValue:0,
            comment:'文章浏览量'
        }
    },
    {
        tableName: 'article',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "articleId" },
                ]
            },
            {
                name: "userId",
                using: "BTREE",
                fields: [
                    { name: "authorId" },
                ]
            },
            {
                name: "contentFileId",
                using: "BTREE",
                fields: [
                    { name: "contentFileId" },
                ]
            },
        ]
    })
//文章和file一对一
fileModel.hasOne(articleModel, {foreignKey: 'contentFileId',onDelete: 'CASCADE', onUpdate: 'CASCADE'})
articleModel.belongsTo(fileModel, {foreignKey: 'contentFileId', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

//文章和作者多对一
userModel.hasMany(articleModel, {foreignKey: 'authorId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
articleModel.belongsTo(userModel, {foreignKey: 'authorId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

// 文章和评论一对多
articleModel.hasMany(articleCommentModel, {foreignKey: 'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
articleCommentModel.belongsTo(articleModel, {foreignKey: 'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

module.exports=articleModel;
