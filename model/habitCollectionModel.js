const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
const userModel=require('./userModel')

const habitCollectionModel = sequelize.define('habitCollection',
    {
      habitCollectionId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model:"user",
          key: 'userId'
        }
      }
    },
    {
      tableName: 'habit_collection',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "habitCollectionId" },
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



userModel.hasOne(habitCollectionModel,{foreignKey:'userId',as:'userHabitCol', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
habitCollectionModel.belongsTo(userModel,{foreignKey:'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

// // 添加 beforeDestroy 钩子
// habitCollectionModel.beforeDestroy(async (instance, options) => {
//   // 在删除 habitCollection 之前，查找与之关联的 habitModel 记录并删除
//   const habits = await habitModel.findAll({ where: { habitCollectionId: instance.habitCollectionId } });
//   for (const habit of habits) {
//     await habit.destroy();
//   }
// });

module.exports=habitCollectionModel
