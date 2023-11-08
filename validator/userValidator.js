const { body, check} = require("express-validator");
const validate = require("../middleware/validate");
const User  = require('../model/userModel');
const habitService=require('../service/habitService')
const habitColService=require('../service/habitCollectionService')
// const {where} = require("sequelize");
// const md5==require('../util/md5');
const md5=require('../util/md5')
const jwt = require("../util/jwt");
const HabitCollectionService = require("../service/habitCollectionService");

// 注册验证
exports.register = validate([
    // 1. 配置验证规则
    body("username")
        .notEmpty().withMessage("用户名不能为空")
        .custom(async (value) => {
            // 查询数据库查看数据是否存在
            // console.log(value)
            const user = await User.findOne({where:{ username: value }});
            // console.log(user)
            if (user) {
                return Promise.reject("用户已存在");
            }
        }),

    body("password").notEmpty().withMessage("密码不能为空"),

    body("userEmail")
        .notEmpty().withMessage("邮箱不能为空")
        .isEmail().withMessage("邮箱格式不正确")
        .bail() // 如果错误就不向下执行
        .custom(async (value) => {
            // console.log(value)
            // 查询数据库查看数据是否存在
            const user = await User.findOne({where:{ userEmail: value }});
            // console.log(user)
            if (user) {
                return Promise.reject("邮箱已存在");
            }
        }),
    // 验证码验证
    body('codeToken').notEmpty().withMessage('验证码不能为空')
        .bail()
        .custom(async (value,{req,res})=>{
            // 解析 JWT
                const decodedToken = await jwt.verify(value, 'randomCode');
                console.log('decodedToken', decodedToken)
                console.log('req.body', req.body)
            if (decodedToken.email === req.body.userEmail && decodedToken.code === req.body.code) {

                    const currentTime = Date.now();
                    if (!(currentTime <= decodedToken.exp)) {
                        return Promise.reject("验证码过期");
                    }
                }else {
                    return Promise.reject('验证码错误')
                }

        })
]);

// 发送登录验证码验证
exports.registerCode=validate([
    body("userEmail")
        .notEmpty().withMessage("邮箱不能为空")
        .isEmail().withMessage("邮箱格式不正确")
        .bail() // 如果错误就不向下执行
        .custom(async (value) => {
            // console.log(value)
            // 查询数据库查看数据是否存在
            const user = await User.findOne({where:{ userEmail: value }});
            // console.log(user)
            if (user) {
                return Promise.reject("邮箱已存在");
            }
        }),
])

// 登录验证
exports.login = [
    validate([
        body("userEmail").notEmpty().withMessage("邮箱不能为空"),
        body("password").notEmpty().withMessage("密码不能为空"),
    ]),
    // 验证用户是否存在
    validate([
        body("userEmail").custom(async (email, { req }) => {
            // console.log(email)
            const user = await User.findOne({where:{userEmail:email}});
            // 查询数据库查看数据是否存在
            if (!user) {
                return Promise.reject("用户不存在");
            }
            // 将数据挂载到请求对象中，后续的中间件也可以直接使用，就不需要重复查询了
            // console.log(user)
            req.user = user;
        }),
    ]),
    // 验证密码是否正确
    validate([
        body("password").custom(async (password, { req }) => {
            // console.log(password)
            console.log(md5(password))
            console.log(req.user.password)
            if (md5(password) !== req.user.password) {
                return Promise.reject("密码错误");
            }
        }),
    ]),
];

// 修改基本信息验证
exports.update= [validate([
        body('username')
            .optional() // 标记为可选字段
            .notEmpty()
            .withMessage('用户名不能为空')
            .custom(async (value)=>{
                const user=await User.findOne({where:{username:value}});
                // console.log(user)
                if (user){
                    return Promise.reject('名字已被使用')
                }
            }),
        body('useremail')
            .optional() // 标记为可选字段
            .notEmpty().withMessage('用户邮箱不能为空')
            .isEmail().withMessage('无效的邮箱地址')
            .bail()
            .custom(async (value)=>{
                const user=await User.findOne({where:{useremail:value}})
                if (user){
                    return Promise.reject('邮箱已被使用')
                }
            }),
    body('intro')
        .optional() // 标记为可选字段
        .notEmpty().withMessage('简介不能为空'),
    body('avatar')
        .optional() // 标记为可选字段
        .notEmpty().withMessage('未选择头像')
        .isURL({ protocols: ['http', 'https'] })
        .withMessage('无效的图片地址')
        .custom((value) => {
            const imageFormats = ['.jpg', '.png', '.jpeg'];
            const isValidFormat = imageFormats.some(format => value.endsWith(format));

            if (!isValidFormat) {
                throw new Error('图片地址必须以 .jpg、.png 或 .jpeg 结尾');
            }

            return true;
        }),
    body('ins')
        .optional() // 标记为可选字段
        .notEmpty().withMessage('ins账号不能为空')
        .bail()
        .custom(async (value)=>{
            const user=await User.findOne({where:{ins:value}})
            if (user){
                return Promise.reject('ins账号已被使用')
            }
        }),
    body('twitter')
        .optional() // 标记为可选字段
        .notEmpty().withMessage('twitter账号不能为空')
        .bail()
        .custom(async (value)=>{
            const user=await User.findOne({where:{twitter:value}})
            if (user){
                return Promise.reject('twitter账号已被使用')
            }
        }),
    ])]

// 修改密码验证
exports.changePwd=[
  validate([  body('oldPwd').notEmpty().withMessage('旧密码不能为空')
      .custom(async (password, { req }) => {
          if (md5(password) !== req.user.password) {
              return Promise.reject("旧密码错误");
          }
      }),
      body('newPwd').notEmpty().withMessage('新密码不能为空')
          .custom((newPassword, { req }) => {
              if (md5(newPassword) === req.user.password) {
                  throw new Error('新密码不能与旧密码相同');
              }
              return true;
          }),
      // 验证码验证
      body('codeToken').notEmpty().withMessage('验证码不能为空')
          .bail()
          .custom(async (value,{req,res})=>{
              // 解析 JWT
              const decodedToken = await jwt.verify(value, 'changePwdCode');
              console.log('decodedToken', decodedToken)
              console.log('req.body.code', req.body.code)
              console.log('decodedToken.email === req.user.useremail && decodedToken.code === req.body.code', decodedToken.email === req.user.useremail && decodedToken.code === req.body.code)
              console.log('decodedToken.code === req.body.code',  decodedToken.code === req.body.code)
              console.log('decodedToken.email === req.user.useremail ', decodedToken.email === req.user.useremail)
              if (decodedToken.email === req.user.useremail && decodedToken.code === req.body.code) {
                  const currentTime = Date.now();
                  if (!(currentTime <= decodedToken.exp)) {
                      return Promise.reject("验证码过期");
                  }
              }else {
                  return Promise.reject('验证码错误')
              }

          })])
]

// 增加habits,判断是不是已经有这个habit了
exports.createHabit=validate([
    body('tagId').notEmpty().withMessage('tagId不能为空')
        .bail()
        .custom(async (value,{req})=>{
            // 如果用户没有habitCollection就新建
            const habitColRes=await HabitCollectionService.getHabitCollectionByUserId(req.user.userId)
            console.log('habitColRes', habitColRes.habitCollectionId)
            if (habitColRes){
            const habit=await habitService.getHabitsByTagIdAndHabitCollectionId(value,habitColRes.habitCollectionId)
                console.log('habit', habit)
                if (habit.length===1){
                    return Promise.reject('已经存在这个habit')
                }else{
                    req.habitCollectionId=habitColRes.habitCollectionId;
                    return true
                }
            }else {
                const habitCol=await habitColService.createHabitCollection(req.user.userId)
                if (habitCol){
                    req.habitCollectionId=habitCol.habitCollectionId;
                }
            }
        })
])

exports.deleteHabit=validate([
    check('tagId').notEmpty().withMessage('tagId不能为空')
        .bail()
        .custom(async (value,{req})=>{
            const habitColRes=await HabitCollectionService.getHabitCollectionByUserId(req.user.userId)
            console.log('habitColRes', habitColRes.habitCollectionId)
            if (habitColRes){
                const habit=await habitService.getHabitsByTagIdAndHabitCollectionId(value,habitColRes.habitCollectionId)
                console.log('habit', habit)
                if (habit.length!==1){
                    return Promise.reject('不存在这个habit')
                }else{
                    req.habitCollectionId=habitColRes.habitCollectionId;
                    return true
                }
            }
        })
])
