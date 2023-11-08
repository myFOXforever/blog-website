const express=require('express')
const router=express.Router()
const UserController=require('../controller/userControlller')
const UserValidator=require('../validator/userValidator')
const auth=require('../middleware/auth')

// 用户登录
router.post('/login',UserValidator.login,UserController.login)

// 发送注册邮箱验证码
router.get('/registerCode',UserValidator.registerCode,UserController.registerCode)

// 发送修改密码邮箱验证码
router.get('/changePwdCode',auth,UserController.changePwdCode)

// 用户注册
router.post('/register',UserValidator.register,UserController.register)

// 用户修改基本信息
router.put('/update',auth,UserValidator.update,UserController.update)

// 用户修改密码
router.put('/changePwd',auth,UserValidator.changePwd,UserController.changePwd)

// 用户添加habits
router.post('/createHabit',auth,UserValidator.createHabit,UserController.createHabit)

// 用户删除habits
router.delete('/deleteHabit',auth,UserValidator.deleteHabit,UserController.deleteHabit)

// 用户注销
router.delete('/destroy',auth,UserController.destroy)

// 查询用户
router.get('/getUser',auth,UserController.getInfo)

// 获取用户信息
router.get('/getInfo',auth,UserController.getInfo)

// （根据username模糊查询）获取所有用户
router.get('/getAll',auth,UserController.getAll)

module.exports = router;

