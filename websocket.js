// websocketServer.js

const WebSocket = require('ws');
const jwt = require("./util/jwt");
const {jwtSecret} = require("./config/default");
// const UserService = require("./service/userService");
const connections = new Map();
// const auth=require('./middleware/auth')

// 创建 WebSocket 服务器
function createWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });
    // 导出 WebSocket 服务器实例
    return  { wss, connections };
}

module.exports = createWebSocketServer;
