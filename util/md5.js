const crypto = require("crypto");

module.exports = (str) => {
    return crypto
        .createHash("md5")
        .update("zcl" + str) //加了一个混淆字符串，安全性更好
        .digest("hex");
};
