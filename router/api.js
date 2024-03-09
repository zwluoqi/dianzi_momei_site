const express = require('express');
const apiRouter = express.Router();

// API处理接口
apiRouter.get('/test', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    res.json({
        type: 'this is get api'
    });
});

apiRouter.post('/signin', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    const { login_id, channel, login_info } = req.body;
    // 简单的验证逻辑
    if (login_info.email && login_info.password) {
        // 登录成功，将用户信息保存到session中
        req.session.user = login_info.email;
        res.json({errno: 0, message: '登录成功'});

        // 需要调用后端接口了
    } else {
        // 登录失败
        res.status(401).json({ message: '用户名或密码错误' });
    }
});

module.exports = apiRouter;