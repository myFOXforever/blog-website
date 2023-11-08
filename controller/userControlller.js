const jwt=require('../util/jwt')
const code=require('../util/code')
const caclLevel=require('../util/user-level-cacl')

const nodemail=require('../config/nodemailer')
const {jwtSecret}=require('../config/default')

const UserService=require('../service/userService')
const HabitCollectionService=require('../service/habitCollectionService')
const HabitService=require('../service/habitService')

const generateToken = jwt.sign(); // 获取返回的函

// 用户注册
exports.register=async (req,res,next)=> {
    try {
        const {username,userEmail,password}=req.body;
        console.log(req.body)
        await UserService.createUser(
            {
                username: username,
                userEmail: userEmail,
                password: password
            }
        )
        res.status(200).json({
           code:200,
            message:'注册成功'
        })
    } catch (err) {
        // 处理错误
        next(err)
    }
}

// 发送登录验证码
exports.registerCode=async (req,res,next)=>{
    try {
        const userEmail=req.body.userEmail;
        const randomCode=code();
        const mail = {
            // 发件人
            from: '3384577917@qq.com',
            // 主题
            subject: '接受凭证',//邮箱主题
            // 收件人
            to: userEmail,//前台传过来的邮箱
            // 邮件内容，HTML格式
            text: '你好，你的验证码是' + randomCode//发送验证码
        };
        console.log('mail', mail,randomCode)
        const sendRes=await nodemail(mail)
        console.log('发送邮箱成功', sendRes)
        // 验证码token
        const currentTime = Date.now(); // 记录当前时间
        const expiresIn = 5 * 60 * 1000; // 验证码有效期为5分钟

        const codeToken =await generateToken({email:userEmail,code:randomCode,exp: currentTime + expiresIn},"randomCode")
        console.log('codeToken', codeToken)
        if (sendRes){
            res.send({
                code: 200,
                data:codeToken,
                message: "发送成功"
            })
        }
    }catch (err){
        next(err)
    }
}

// 发送修改密码验证码
exports.changePwdCode=async (req,res,next)=>{
    try {
        const userEmail=req.user.useremail;
        const randomCode=code();
        const mail = {
            // 发件人
            from: '3384577917@qq.com',
            // 主题
            subject: '接受凭证',//邮箱主题
            // 收件人
            to: userEmail,//前台传过来的邮箱
            // 邮件内容，HTML格式
            text: '你好，你的修改密码验证码是' + randomCode//发送验证码
        };
        console.log('修改密码mail', mail)
        const sendRes=await nodemail(mail)
        // 验证码token
        const currentTime = Date.now(); // 记录当前时间
        const expiresIn = 15 * 60 * 1000; // 验证码有效期为5分钟

        const codeToken =await generateToken({email:userEmail,code:randomCode,exp: currentTime + expiresIn},"changePwdCode")
        console.log('codeToken', codeToken)
        if (sendRes){
            res.send({
                code: 200,
                data:codeToken,
                message: "发送成功"
            })
        }
    }catch (err){
        next(err)
    }
}

// 用户登录(邮箱+密码）
exports.login=async (req,res,next)=>{
    try {
        const user = req.user.toJSON();
        // console.log('找到的user',user)
        const token=await generateToken({userId:user.userId,expiresIn: 60 * 60 * 24,},jwtSecret)
        console.log('token', token)
        // 登录成功更新用户等级
        const levelId=await caclLevel(req.user.userId)
        console.log('levelId', levelId)
        const UpdateLevel=await UserService.updateUserLevel(req.user.userId,levelId)
        if (UpdateLevel){
            console.log('更新用户等级成功')
            user.levelId=levelId;
            console.log('user', user)
        }
        res.status(200).json({
            code:200,
            msg:'登录成功',
            token,
        })
        // res.send('登录成功')
    }catch (err){
        next(err)
    }
}

// 用户更新名字或邮箱,头像，简介,ins.Twitter（都是选填）
exports.update=async (req,res,next)=>{
    try {
        const {userId}=req.user;
        const {username,intro,avatar,ins,twitter}=req.body;
        const updateFields = {};
        if (username) updateFields.username = username;
        if (intro) updateFields.intro = intro;
        if (avatar) updateFields.avatar = avatar;
        if (ins) updateFields.ins = ins;
        if (twitter) updateFields.twitter = twitter;
       const updateRes= await UserService.updateUser(userId,updateFields)
        console.log('updateRes:',updateRes)
        if (updateRes===null){
            res.send('用户不存在')
        }
        res.status(200).json({
           message:'更新成功'
        })
    }catch (err){
        next(err)
    }
}

// 用户添加用户habits 传tagId
exports.createHabit=async (req,res,next)=>{
    try {
        const {tagId}=req.body;
        const userId=req.user.userId
        const habitCollectionId=req.habitCollectionId;
        const createRes=await HabitService.createHabit(tagId,habitCollectionId);
        if (createRes){
            res.status(200).json({
                code:200,
                msg:'创建成功'
            })
        }else {
            res.status(500).json({
                code:500,
                msg:'失败成功'
            })
        }
    }catch (err){
        next(err)
    }
}

// 用户删除用户habits 传tagId
exports.deleteHabit=async (req,res,next)=>{
    try {
        const {tagId}=req.query;
        const habitCollectionId=req.habitCollectionId;
        console.log('tagId', tagId)
        console.log('habitCollectionId', habitCollectionId)
        const deleteRes=await HabitService.deleteHabitByTagId(tagId,habitCollectionId);
            if (deleteRes){
                res.status(200).json({
                    code:200,
                    msg:'删除成功'
                })
            }else {
                res.status(500).json({
                    code:500,
                    msg:'删除成功'
                })
            }
    }catch (err){
        next(err)
    }
}

// 用户注销
exports.destroy=async (req,res,next)=>{
    try {
        const {userId}=req.user;
       const delRes= await UserService.deleteUser(userId)
        if (delRes===null){
            res.status(401).json({
                message:'用户不存在'
            })
        }
        res.status(200).json({
            code:200,
            message:'注销成功'
        })
    }catch (err){
        next(err)
    }
}

// 获取用户信息
exports.getInfo=async (req,res,next)=>{
    try {
        const user = req.user.toJSON();
        // const habitCollection=(await HabitCollectionService.getHabitCollectionByUserId(user.userId))
        // const responseData = habitCollection.map(tag => ({
        //     habitId: tag.tagId,
        //     habitName: tag.tagname,
        // }));
        // const userInfoRes=await UserService.getUserById()
        res.status(200).json({
            code:200,
            msg:'查询成功！',
            data: {...user}
        })
    }catch (err){
        next(err)
    }
}

// 修改密码
exports.changePwd=async (req,res,next)=>{
    try {
        const userId=req.user.userId;
        const {newPwd}=req.body;
        const UpdateRes=await UserService.updateUser(userId,{
            password:newPwd
            // username:'wenyiiiii'
        })
        console.log('UpdateRes', UpdateRes)
        if (UpdateRes===null){
           res.status(401).json({
               code:401,
               msg:"修改失败"
           })
       }else {
           res.status(200).json({
               code:200,
               msg:'修改成功'
           })
       }
    }catch (err){
        next(err)
    }
}

/**（根据username模糊查询）获取所有用户
 * 平台普通用户获得普通用户，管理员获得所有
 * @param req username
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getAll=async (req,res,next)=>{
    try {
        const username=req.query.username||'';
        console.log('req.user.levelId', req.user.levelId,typeof req.user.levelId)
        const isAdmin=Number(req.user.levelId)===1?1:0;
        console.log('userLevel', isAdmin)
        const {count, rows }=await UserService.getAllUsers(username,isAdmin);
        res.status(200).json({
            code:200,
            data:[...rows],
            total:count
        })
    }catch (err){
        next(err)
    }
}
