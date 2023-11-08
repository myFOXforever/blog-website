const express=require('express')
const morgan=require('morgan')
const cors=require('cors')


const app=new express()
const errorHandler = require("./middleware/error-handler");
const {urlencoded, json} = require("body-parser");
const router=require('./router')//导入路由部分
const scheduler = require("./scheduler");// 导入定时任务模块

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())
app.use(cors())
// 使用 bodyParser 处理表单数据
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/api',router)
// 挂载统一处理服务端错误中间件
app.use(errorHandler());





app.listen(3000,()=> {
    console.log('服务启动在端口9090');
    console.log([
        "                   _ooOoo_",
        "                  o8888888o",
        "                  88\" . \"88",
        "                  (| -_- |)",
        "                  O\\  =  /O",
        "               ____/`---'\\____",
        "             .'  \\\\|     |//  `.",
        "            /  \\\\|||  :  |||//  \\",
        "           /  _||||| -:- |||||-  \\",
        "           |   | \\\\\\  -  /// |   |",
        "           | \\_|  ''\\---/''  |   |",
        "           \\  .-\\__  `-`  ___/-. /",
        "         ___`. .'  /--.--\\  `. . __",
        "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".",
        "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
        "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
        "======`-.____`-.___\\_____/___.-`____.-'======",
        "                   `=---='",
        "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "         佛祖保佑       永无BUG"
    ].join('\n'))
})

// 导出 HTTP 服务器实例
module.exports = app;
