const express=require('express')
const router=express.Router()
const authAdmin=require('../middleware/auth-admin')
const tagController=require('../controller/tagController')
const tagValidator=require('../validator/tagValidator')
// tag新增
router.post('/create',authAdmin,tagValidator.create,tagController.create)

// tag查询
router.get('/getAll',tagController.getAll)

// tag分页获取
router.get('/getPage')
// tag删除
router.delete('/delete',authAdmin,tagValidator.delete,tagController.delete)

// tag更新
router.put('/update',authAdmin,tagValidator.update,tagController.update)

module.exports = router;

