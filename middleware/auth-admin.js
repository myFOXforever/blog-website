const jwt=require('../util/jwt')
const {jwtSecret}=require('../config/default')
const UserService=require('../service/userService')
module.exports = async (req, res, next) => {
    let token = req.headers["authorization"];
    token = token ? token.split('Bearer ')[1] : null;

    if (!token) {
        return res.status(401).end();
    }

    try {
        const decode = await jwt.verify(token, jwtSecret);
        console.log("decodeToken", decode);

        const user = await UserService.getUserById(decode.userId);
        if (user.levelId !== 1) {
            return res.status(403).json({ error: "用户权限不是管理员" });
        }else {
            console.log('user.levelId，用户是管理员', user.levelId,)
        }

        req.user = user;
        console.log('auth req.user userid', req.user.userId);
        next();
    } catch (err) {
        res.status(401).end();
    }
};
