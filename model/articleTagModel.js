const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
const articleModel = require("./articleModel");
const tagModel=require('./tagModel')
const articleTagModel= sequelize.define('articleTag', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        articleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'article',
                key: 'articleId'
            }
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tag',
                key: 'tagId'
            }
        }
    }, {
        tableName: 'article_tag',
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
                name: "articleId",
                using: "BTREE",
                fields: [
                    { name: "articleId" },
                ]
            },
            {
                name: "tagId",
                using: "BTREE",
                fields: [
                    { name: "tagId" },
                ]
            },
        ]
    });
// articleTagModel.belongsTo(articleModel,{foreignKey:'articleId'})
// 文章和tag 多对多
articleModel.belongsToMany(tagModel, { through: articleTagModel, foreignKey: 'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
tagModel.belongsToMany(articleModel, { through: articleTagModel, foreignKey: 'tagId' , onDelete: 'CASCADE', onUpdate: 'CASCADE'});

module.exports=articleTagModel
