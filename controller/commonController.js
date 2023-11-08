const FileService=require('../service/fileService')
// 上传文件
exports.uploadFile=async (req,res,next)=>{
    try {
        const url = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        const resUrl=url.replace(/\\/g, '/');
        const uploadRes=FileService.createFile({
            filename:req.file.originalname,
            filesize:req.file.size,
            filepath:resUrl
        })
        if (uploadRes){
            res.status(200).json({
                code:200,
                msg:'上传成功',
                data:[{url:resUrl}]
            })
        }else {
            console.log('上传文件失败：res',res)
        }

    }catch (err){
        next(err)
    }
}
