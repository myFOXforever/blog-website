const jwt=require('../util/jwt')
const {jwtSecret}=require('../config/default')
const UserService=require('../service/userService')

module.exports=async (req,res,next)=>{
    let token=req.headers["authorization"]
    token=token?token.split('Bearer ')[1]:null
    // console.log(token)
    if (!token){
        res.status(401).json({
            code:401,
            msg:'token不存在'
        }).end()
    }
    try {
        const decode= await jwt.verify(token,jwtSecret);
        console.log("decodeToken",decode)
        req.user=await UserService.getUserById(decode.userId);
        if (req.user){
            console.log('auth req.user userid',req.user.userId)
            next()
        }else {
            res.status(401).json({
                code:401,
                msg:'用户不存在'
            }).end()
        }
        // console.log('req.user', req.user)

    }catch (err){
        res.status(401).end()
    }
}
