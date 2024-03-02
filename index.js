// 导入 express 模块
const express = require('express');
const path = require('path');

// 创建 express 应用
const app = express();
const port = process.env.PORT || 8800;

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 登入页面
app.get('/signin', function(req, res) {
    res.render('signin', {title: 'Hey'});
});
// 账户页面
app.get('/account', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    res.render('account', {title: 'Hey'});
});
// 选择进入页面
app.get('/select', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    res.render('select', {title: 'Hey'});
});

// 启动服务，监听 3000 端口
app.listen(port, function() {
    console.log(`App listening on port ${port}!`);
});