const http = require('http');

// 创建一个HTTP服务器
const server = http.createServer((req, res) => {
    // 设置响应头
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200; // 设置状态码为200（成功）

    // 处理GET请求
    if (req.method === 'GET') {
        // 返回一些信息
        res.end('Hello, this is a simple Node.js server!');
    } else {
        // 处理其他HTTP方法（如POST、PUT、DELETE等）
        res.statusCode = 405; // 方法不被允许
        res.end('Method Not Allowed');
    }
});

// 监听端口
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
