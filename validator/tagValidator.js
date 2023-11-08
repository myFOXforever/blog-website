const { body } = require("express-validator");
const validate = require("../middleware/validate");
const User  = require('../model/userModel');
const tagService=require('../service/tagService')

exports.create=validate([
    body('tagname').notEmpty().withMessage('tagname不能为空'),
    body('faTagId').optional()
        .notEmpty().withMessage('父tagId不能为空')
        .custom(async (value,{req})=>{
        if (value!==null||value!==''){
            const faTag=await tagService.getTagById(value);
            if (faTag){
                const existence=await tagService.getTagOne(req.body.tagname,value)
                if (existence){
                    return  Promise.reject(`相同父级下已经有${req.body.tagname}这个tag`)
                }
            }else {
                return Promise.reject('父tag不存在')
            }
        }
})
])

exports.update=validate([
    body('tagname').notEmpty().withMessage('tagname不能为空'),

    body('tagId').notEmpty().withMessage('tagId不能为空')
        .bail()
        .custom(async (value,{req})=>{
            const tag=await tagService.getTagById(value)
            if (tag){
                req.tagId=tag.tagId;
            }else {
                return Promise.reject('tagId不存在')
            }
        })
])

exports.delete=validate([
    body('tagId').notEmpty().withMessage('tagId不能为空')
        .bail()
        .custom(async (value,{req})=>{
            const tag=await tagService.getTagById(value)
            if (tag){
                req.tagId=tag.tagId;
            }else {
                return Promise.reject('tag不存在')
            }
        })
])
