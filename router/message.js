const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const messageController=require('../controller/messageController')

// 获取用户所有信息
router.get('/getAll',auth,messageController.getAll)

// 已读单条信息
router.put('/readOne',auth,messageController.readOne)

// 已读所有信息
router.put('/readAll',auth,messageController.readAll)

// 删除单条消息
router.delete('/deleteOne',auth,messageController.deleteOne)

// 实时推送消息
router.get('/immediate',auth,messageController.immediate)
module.exports = router;
