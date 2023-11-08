const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');
module.exports = sequelize.define('file', {
        fileId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        filesize: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        filepath: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "0表示其他类型（默认），1表示md类型，2表示图片类型"
        }
        }, {
        tableName: 'file',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "fileId" },
                ]
            },
        ]
    });
