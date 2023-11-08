const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
const articleModel=require('./articleModel')
const userModel=require('./userModel')
const articleModelModModel =sequelize.define('articleMod',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'article',
          key: 'articleId'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'userId'
        }
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'article_Mod',
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
          name: "userId",
          using: "BTREE",
          fields: [
            { name: "userId" },
          ]
        },
      ]
    });
// 文章和文章修改一对多
articleModel.hasMany(articleModelModModel,{foreignKey:'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
articleModelModModel.belongsTo(articleModel,{foreignKey:'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

// 用户和文章修改一对多
userModel.hasMany(articleModelModModel,{foreignKey:'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
articleModelModModel.belongsTo(userModel,{foreignKey:'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

module.exports=articleModelModModel;
