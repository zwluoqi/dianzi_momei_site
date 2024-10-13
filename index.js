// http服务入口
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const apiRouter = require('./router/api');
const pageRouter = require('./router/page');

// 创建express应用
const app = express();
const {PORT = 8800, SECRET = 'ABCEDFG'} = process.env;
app.use(session({
    secret: SECRET, // 用于签名会话ID的密钥
    resave: true, // 强制将会话保存到会话存储中，即使在请求期间会话没有被修改
    saveUninitialized: false, // 强制将未初始化的会话保存到存储中。新的未修改的会话被视为未初始化。
    cookie: { secure: false } // 如果设置为true，则仅在HTTPS连接上发送cookie
}));

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// 解析application/json 类型的请求体
app.use(bodyParser.json());

// 页面路由
const pagePath = ['/', '/github_signin', '/signin', '/account', '/select', '/logout'];
pagePath.forEach(path => app.get(path, pageRouter));

// API路由处理
app.use('/api', apiRouter);

// 启动服务，监听端口
app.listen(PORT, function() {
    console.log(`${new Date} App listening on port ${PORT}!`);
});
