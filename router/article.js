const express=require('express')
const router=express.Router()
const articleController=require('../controller/articleController')
const auth=require('../middleware/auth')
const upload=require('../middleware/file-upload')
const articleValidator=require('../validator/articleValidator')

// 获取所有发布的文章（分页）
router.get('/getAll',articleValidator.order,articleController.getAll)

// 获取自己的所有文章
router.get('/getOwn',auth,articleController.getOwnArticles)

// 创建文章(文件上传方式）
router.post('/createByFile',auth,upload.single('file'),articleValidator.create,articleController.createByFile)

router.post('/create',auth,articleValidator.create)

// 申请重新审核文章
router.post('/check',auth,articleValidator.check,articleController.check)

// 更新文章浏览量
router.post('/view',auth,articleValidator.view,articleController.updateArticleViewCount)

// 根据时间查询文章发表数和浏览量
router.get('/count',auth,articleValidator.date,articleController.getOwnArticleViewCount)
// 更新文章
router.put('/update')

// 删除文章
router.delete('/delete',auth,articleValidator.delete,articleController.delete)

module.exports = router;

