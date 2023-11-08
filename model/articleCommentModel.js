const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
const articleCommentModel = sequelize.define('articleComment', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        commenterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "评论人的id",
            references: {
                model: 'user',
                key: 'userId'
            }
        },
        articleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "文章id",
            references: {
                model: 'article',
                key: 'articleId'
            }
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: "评论内容"
        },
        createDate: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "评论时间",
            defaultValue: new Date()
        },
        parentId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            comment: "回复评论的时候父评论id",
            references: {
                model: 'article_comment',
                key: 'id'
            }
        },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "评论的状态，0是带审核，1是审核通过，2审核失败"
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "失败原因"
    },
    }, {
        tableName: 'article_comment',
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
                name: "commenterId",
                using: "BTREE",
                fields: [
                    { name: "commenterId" },
                ]
            },
            {
                name: "parentId",
                using: "BTREE",
                fields: [
                    { name: "parentId" },
                ]
            },
        ]
    });

articleCommentModel.hasMany(articleCommentModel,
    {
        foreignKey: 'parentId',
        as: 'ChildComments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
);

articleCommentModel.belongsTo(articleCommentModel, {
    foreignKey: 'parentId',
    as: 'ParentComment',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = articleCommentModel;
