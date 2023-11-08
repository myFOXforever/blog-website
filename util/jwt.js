const jwt = require('jsonwebtoken');
const jwtConst = require('../config/default');
const { promisify } = require('util');

// 封装 sign 方法
exports.sign = function () {
    // 将 jwt.sign 方法转换为 Promise 风格
    const sign = promisify(jwt.sign);

    // 返回一个闭包函数，用于生成自定义的 token 签名函数
    return async function (payload, secretKey = jwtConst.jwtSecret, options = {}) {
        // 合并默认选项和传入的选项
        const combinedOptions = {
            // ...jwtConst.jwtDefaultOptions,
            ...options,
        };

        // 调用 jwt.sign 方法来生成 token
        return sign(payload, secretKey, combinedOptions);
    };
};

exports.verify = promisify(jwt.verify);
exports.decode = promisify(jwt.decode);
