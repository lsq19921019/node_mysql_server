let Sequelize = require('sequelize');

let connection = new Sequelize(
    'test', // 数据库名
    'root',   // 用户名
    '123456',   // 用户密码
    {
        'dialect': 'mysql',  // 数据库使用mysql
        'host': 'localhost', // 数据库服务器ip
        'port': 3306,        // 数据库服务器端口
        // 'define': {
        //     // 字段以下划线（_）来分割（默认是驼峰命名风格）
        //     'underscored': true
        // }
    }
);

module.exports = {connection,Sequelize};