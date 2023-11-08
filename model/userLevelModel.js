const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
module.exports = sequelize.define('userLevel',
    {
      levelId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
          comment:'1代表管理员，2代表游客，3代表新人作者，4代表人气作者，5代表热门作者，6代表高产作者'
      },
      levelName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
        remark: {
            type: DataTypes.STRING(50),
            allowNull: true,
        }
    },
    {
      tableName: 'user_level',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "levelId" },
          ]
        },
      ]
    });
