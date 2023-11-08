// 通用接口
/*文件上传
**图片上传
 */
const express=require('express')
const router=express.Router()

const upload=require('../middleware/file-upload')
const CommonController=require('../controller/commonController')
const auth=require('../middleware/auth')

router.post('/uploadFile',auth,upload.single('file'),CommonController.uploadFile)
module.exports = router;
