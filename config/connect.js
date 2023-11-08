const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('blog', 'root', 'X8neD6b3jCYAAHca', {
    host: '114.132.250.2',
    port: 3306,
    dialect: 'mysql',
});

// 导入您的 Sequelize 模型
// const Message = require('../model/messageModel'); // 请根据实际路径和文件名修改
// 添加监听器，监听用户创建事件

// 导入监听函数
// 连接数据库
sequelize
    .authenticate()
    .then(async () => {
        // 同步模型到数据库
//         // await sequelize.sync();
//         Message.addHook('afterCreate', (message) => {
//             console.log(`New user created: ${message.status} , ${message.content}`);
//         });
//
// // 添加监听器，监听用户修改事件
//         Message.addHook('afterUpdate', (message) => {
//             console.log(`User updated: ${message.status}, ${message.content}`);
//         });


        console.log('数据库连接成功');
    })
    .catch((err) => {
        console.error('连接失败：', err);
    });

module.exports = sequelize;
