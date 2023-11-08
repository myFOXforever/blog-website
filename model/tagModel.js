const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect');

const tagModel = sequelize.define('tag',
    {
        tagId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tagName: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        parentTagId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue:null,
            references: {
                model: "tag",
                key: 'tagId'
            }
        }
    },
    {
        tableName: 'tag',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "tagId" },
                ]
            },
            {
                name: "parentTagId",
                using: "BTREE",
                fields: [
                    { name: "parentTagId" },
                ]
            },
        ]
    });

tagModel.hasMany(tagModel, { foreignKey: 'parentTagId', as: 'ChildTags' , onDelete: 'CASCADE', onUpdate: 'CASCADE'});

tagModel.belongsTo(tagModel, { foreignKey: 'parentTagId', as: 'ParentTag' , onDelete: 'CASCADE', onUpdate: 'CASCADE'});

module.exports=tagModel;
