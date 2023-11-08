const tagService=require('../service/tagService')
const {buildHierarchy}=require('../util/tagHierarchy')
const ArticleService=require('../service/articleService')

// 新增tag
exports.create=async (req,res,next)=>{
    try {
        const {tagName,faTagId}=req.body;
        // 有父级
        if (faTagId!==null||faTagId!==''){
            // const faTag=await tagService.getTagByName(faTagname);
            console.log("faTag",req.faTagId)
           await tagService.createTag({
                tagName: tagName,
                faTagId:faTagId
            })
            res.status(200).json({
                code:200,
                message:'新增成功'
            })
        }
    }catch (err){
        next(err)
    }
}

// 更新tag
exports.update=async (req,res,next)=>{
    try {
        const {tagName,tagId}=req.body;
        console.log(req.tagId)
       const updateRes= await tagService.updateTag(req.tagId,{
            tagName: tagName
        })
        if (updateRes===null){
            res.status(201).json({
                code:201,
                message:'更新失败'
            })
        }
        res.status(200).json({
            code:200,
            message:"更新成功"
        })
    }catch (err){
        next(err)
    }
}

// 查询所有tag和根据tagname模糊查询
exports.getAll=async (req,res,next)=>{
    try {
        const keyword=req.query.tagName||null;
        let result;
        result= await tagService.getAllTagsWithHierarchy(null,keyword);
        console.log('keyword-controller', keyword)
        console.log("result-controller",result)
        // 有关键词的时候就不按照层级返回了
        if (keyword===''){
            res.status(200).json({
                code:200,
                data:result
            })
        }else {
            const tagRes=await tagService.getAllTagByName(keyword);
            res.status(200).json({
                code:200,
                data:tagRes
            })
        }

    }catch (err){
        next(err)
    }
}

// 删除tag及其子标签包括habits
exports.delete=async (req,res,next)=>{
    try {
        // const {tagId}=req.body;
        console.log('req.tagId', req.tagId)
        const deleteRes=await tagService.deleteTagAndChildren(req.tagId)
        console.log('deleteRes',deleteRes,typeof deleteRes.success)
        if (!deleteRes.success){
            res.status(201).json({
                code:201,
                message:"删除失败"
            })
        }else if(deleteRes.success) {
            res.status(200).json({
                code:200,
                message:"删除成功"
            })
        }
    }catch (err){
        next(err)
    }
}
