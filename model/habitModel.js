const {DataTypes} = require('sequelize');
const sequelize = require('../config/connect');

const habitCollectionModel = require('./habitCollectionModel');
const tagModel = require('./tagModel');
const habitModel = sequelize.define('habit',
    {
        habitId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tag',
                key: 'tagId'
            }
        },
        habitCollectionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'habit_collection',
                key: 'habitCollectionId'
            }
        }
    },
    {
        tableName: 'habit',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "habitId"},
                ]
            },
            {
                name: "habitCollectionId",
                using: "BTREE",
                fields: [
                    {name: "habitCollectionId"},
                ]
            },
            {
                name: "tagId",
                using: "BTREE",
                fields: [
                    {name: "tagId"},
                ]
            },
        ]
    });

habitCollectionModel.hasMany(habitModel, {
    foreignKey: "habitCollectionId",
    as: 'habits',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
habitModel.belongsTo(habitCollectionModel, {
    foreignKey: "habitCollectionId",
    as: 'habitCol',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


tagModel.hasOne(habitModel, {foreignKey: 'tagId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
habitModel.belongsTo(tagModel, {foreignKey: 'tagId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

module.exports = habitModel;
