const AipContentCensorClient = require("baidu-aip-sdk").contentCensor;
const {APP_ID,API_KEY,SECRET_KEY,ACCESS_TOKEN}=require('../config/default')
const {HttpClient} = require("baidu-aip-sdk");

// 新建一个对象
const client = new AipContentCensorClient(APP_ID, API_KEY, SECRET_KEY);
// 设置access_token到HttpClient，以便自动添加到每次请求
HttpClient.setRequestInterceptor(function(requestOptions) {
    // 在这里添加access_token到请求参数中
    requestOptions.params = requestOptions.params || {};
    requestOptions.params.access_token = ACCESS_TOKEN;
    return requestOptions;
});

// 审核文本
function textAudit(text) {
    return new Promise((resolve, reject) => {
        client.textCensorUserDefined(text)
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// 审核图片
function imageAudit(imageUrl) {
    return new Promise((resolve, reject) => {
        client.imageCensorUserDefined(imageUrl, 'url')
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = {
    textAudit,
    imageAudit
};
