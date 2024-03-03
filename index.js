// 导入 express 模块
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// 创建 express 应用
const app = express();
const port = process.env.PORT || 8800;
app.use(session({
    secret: 'XNMSADJK', // 用于签名会话ID的密钥
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

// 首页
app.get('/', function(req, res) {
    res.render('signin', {title: '登入'});
});

// 登入页面
app.get('/signin', function(req, res) {
    if (!req.session.user) {
        res.render('signin', {title: '登入'});
    }
    else {
        res.render('account', {title: '我的账户'});
    }
});
app.get('/github_signin', function(req, res) {
    const {code} = req.query;
    res.json({code});
});


// 账户页面
app.get('/account', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    if (!req.session.user) {
        res.redirect('/signin');
    }
    else {
        res.render('account', {title: '我的账户'});
    }
});

// 对话选择页面
app.get('/select', function(req, res) {
    if (!req.session.user) {
        res.redirect('/signin');
    }
    else {
        res.render('select', {title: '选择'});
    }
});

// 退出
app.get('/logout', function(req, res) {
    // 销毁 session 中的用户信息
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

// API处理接口
app.get('/api/*', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    res.json({
        type: 'this is get api'
    });
});
app.post('/api/*', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    if (req.path === '/api/signin') {
        const { login_id, channel, login_info } = req.body;
        // 简单的验证逻辑
        if (login_info.email && login_info.password) {
            // 登录成功，将用户信息保存到session中
            req.session.user = login_info.email;
            res.json({errno: 0, message: '登录成功'});
        } else {
            // 登录失败
            res.status(401).json({ message: '用户名或密码错误' });
        }
    }
});

// 启动服务，监听 3000 端口
app.listen(port, function() {
    console.log(`App listening on port ${port}!`);
});
