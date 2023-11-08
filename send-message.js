// sendMessage.js
// 创建 HTTP 服务器
const {createServer} = require("http");
const createWebSocketServer = require('./websocket');
const app=require('./app')
// const UserService = require("./service/userService");
const jwt = require("./util/jwt");
const {jwtSecret} = require("./config/default");

const server = createServer(app);

// 创建 WebSocket 服务器并传递 HTTP 服务器实例
// 导入 WebSocket 服务器实例和用户连接映射
const { wss, connections } =createWebSocketServer(server);
server.listen(9010, () => {
    console.log('Server is listening on port 9010');
});

wss.on('connection',async (ws, req) => {
    console.log('Client connected');
    let token = req.headers["authorization"]
    token = token ? token.split('Bearer ')[1] : null
    const decode = await jwt.verify(token, jwtSecret);
    // const user=UserService.getUserByUserId(decode.userId)
    console.log('decode.userId', decode.userId, typeof decode.userId)
    connections.set(decode.userId, ws);

    // if (user){
    // connections.set(decode.userId, ws);
    // }else{
    //     // ws.on('off',)
    // }
    // 接收前端发来的消息
    ws.on('message', async (message) => {
        console.log('message', message)
    });

    // 当前端断开连接时执行
    ws.on('close', () => {
        console.log(`Client ${userId} disconnected`);
        // 在连接关闭时，从映射中删除连接
        connections.delete(userId);
    });
});


// 发送消息给特定用户
function sendMessageToUser(userId, message) {
    console.log('sendmessage-connections', connections)
    console.log('sendmessage-userId', userId,typeof  userId)
    // console.log('wss', wss)
    const userWebSocket = connections.get(userId); // 获取特定用户的 WebSocket 连接
    console.log('sendmessage-userWebSocket', userWebSocket)
    if (userWebSocket) {
        userWebSocket.send(message); // 发送消息给用户
        console.log(`Message sent to user ${userId}: ${message}`);
    } else {
        console.log(`User ${userId} not found or disconnected.`);
    }
}

module.exports = sendMessageToUser;
