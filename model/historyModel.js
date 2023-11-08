const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
const articleModel=require("./articleModel")
const  userModel=require('./userModel')
const historyModel = sequelize.define('history',
    {
      historyId: {
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
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'article',
          key: 'articleId'
        }
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: false,
          defaultValue:new Date()
      },
      finishAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: 'history',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "historyId" },
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
      ]
    });

userModel.hasMany(historyModel,{foreignKey:'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
historyModel.belongsTo(userModel,{foreignKey:'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

articleModel.hasMany(historyModel,{foreignKey:'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
historyModel.belongsTo(articleModel,{foreignKey:'articleId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

module.exports=historyModel;
