const Tag=require('../model/tagModel')
const {QueryTypes} = require("sequelize");
const sequelize=require('../config/connect')
const { Op } = require('sequelize');
const HabitService=require('../service/habitService')

const TagService={

    getAllTags:async (tagNamePattern)=>{
        // 使用 SQL 的 WITH RECURSIVE 子句查询所有 tag 数据
        const keyword=`%${tagNamePattern}%`
        const query = `
                 WITH RECURSIVE tag_cte AS (
                  SELECT tagId, tagName, faTagId, 0 AS depth
                  FROM Tag
                  WHERE faTagId IS NULL

                  UNION ALL

                  SELECT t.tagId, t.tagName, t.faTagId, th.depth + 1
                  FROM Tag AS t
                  JOIN tag_cte AS th ON t.faTagId = th.tagId)
               SELECT * FROM tag_cte WHERE tagName LIKE :keyword;
    `;

        return  await sequelize.query(query, {
            replacements: { keyword },
            type: QueryTypes.SELECT ,
            raw: true
        });

        // console.log('tags1111', tags)
    },
// 递归查询所有标签及其子标签
    getAllTagsWithHierarchy: async (parentTagId=null ,keyword=null) => {
        console.log('keywordRes--service', keyword)
        const whereCondition = parentTagId !== null ? { parentTagId: parentTagId } : { parentTagId: null };
        if (keyword!=null){
            whereCondition.tagName={
                [Op.like]:`%${keyword}%`
            };
        }
        console.log('whereCondition--service', whereCondition)
        const tags = await Tag.findAll({
            where: whereCondition,
            attributes: ['tagId', 'tagName'],
            include: [
                {
                    model: Tag,
                    as: 'ChildTags',
                    attributes: ['tagId', 'tagName'],
                    required: false,
                },
            ],
        });
        console.log('tags-service', JSON.stringify(tags, null, 4))
        // 构建层级关系
        const hierarchicalTags = await Promise.all(tags.map(async (tag) => {
            const hierarchicalTag = tag.toJSON();
            if (tag.ChildTags && tag.ChildTags.length > 0) {
                hierarchicalTag.ChildTags = await TagService.getAllTagsWithHierarchy(tag.tagId); // 使用 await 等待子标签的查询结果
            }
            return hierarchicalTag;
        }));
        console.log('hierarchicalTags-service', hierarchicalTags)
        return hierarchicalTags;
    },
    createTag:async (tagData)=>{
        return Tag.create(tagData)
    },

    updateTag:async (tagId,tagData)=>{
        const tag=await Tag.findByPk(tagId)
        if (tag){
            return await tag.update(tagData)
        }
        return null;
    },
    // 删除标签及其子标签和关联的habits
    deleteTagAndChildren: async (tagId) => {
        const t = await sequelize.transaction(); // 创建一个事务

        try {
            console.log('tagId', tagId);
            // 查询当前标签的子标签
            const children = await sequelize.query(
                'SELECT tagId FROM tag WHERE faTagId = :tagId',
                {
                    replacements: { tagId },
                    type: QueryTypes.SELECT,
                    transaction: t, // 将事务传递给查询
                }
            );
            console.log('children', children);

            // 更新所有引用当前标签为父标签的行，将它们的 faTagId 设置为 null
            const fatagRes = await sequelize.query(
                'UPDATE Tag SET faTagId = NULL WHERE faTagId = :tagId',
                {
                    replacements: { tagId },
                    type: QueryTypes.UPDATE,
                    transaction: t, // 将事务传递给更新操作
                }
            );
            console.log('fatagRes', fatagRes);

            // 递归删除与标签相关的 habit 表数据
            const deletedHabit = await HabitService.deleteHabitByTagId(tagId, t); // 将事务传递给 habit 删除操作
            console.log('deletedHabit', deletedHabit);

            // 递归删除子标签及其子标签的子标签...
            for (const child of children) {
                console.log('child', child);
                await TagService.deleteTagAndChildren(child.tagId, t); // 将事务传递给递归删除操作
            }

            // 删除当前标签
            const deletedTag = await sequelize.query(
                'DELETE FROM tag WHERE tagId = :tagId',
                {
                    replacements: { tagId },
                    type: QueryTypes.DELETE,
                    transaction: t, // 将事务传递给删除操作
                }
            );
            console.log('deletedTag', deletedTag);

            await t.commit(); // 提交事务
            return { success: true, deletedTag, deletedHabit };
        } catch (error) {
            await t.rollback(); // 回滚事务
            return { success: false, error: 'An error occurred while deleting tag and associated data.' };
        }
    },
    // 精确查询
    getTagByName:async (tagName)=>{
        return await Tag.findOne({where:{tagName:tagName}})
    },
    // 模糊查询
    getAllTagByName:async (tagName)=>{
        return await Tag.findAll({
            where: {
                tagName: {
                    [Op.like]: `%${tagName}%`
                }
            }
        });
    },
    getTagById:async (tagId)=>{
        return await Tag.findByPk(tagId)
    },
    // 查询相同父id下tagname是否相同
    getTagOne:async (tagName,faTagId)=>{
        return await Tag.findOne({where:{
            tagName:tagName,
                faTagId:faTagId
            }})
    }
}

module.exports=TagService;

