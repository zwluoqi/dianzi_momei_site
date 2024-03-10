const express = require('express');
const apiRouter = express.Router();
const {postData, API_MAP} = require('../utils/index');

// API处理接口(实际匹配到/api/test)
apiRouter.get('/test', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    res.json({
        type: 'this is get api'
    });
});

// 登入接口
apiRouter.post('/signin', async function(req, res) {
    const {channel = 'email', login_info} = req.body;
    // 采用email验证码登入, 需要重新实现sigin逻辑
    if (login_info.email && login_info.password) {
        const signinData = await postData({
            url: API_MAP.SIGININ,
            data: {
                // TODO: login_id使用github的默认id信息
                login_id: login_info.email,
                channel,
                // 这个里面存储
                login_info: JSON.stringify({
                    password: login_info.password,
                    email: login_info.email
                })
            }
        });

        // 登录成功，将用户信息保存到session中
        req.session.uid = signinData.uid;
        res.json({errno: 0, message: '登入成功'});

    } else {
        // 登录失败
        res.json({errno: -1, message: '登入失败'});
    }
});

// 更新账户数据
apiRouter.post('/setdata', async function(req, res) {
    const {key, record} = req.body;
    const setDataRes = await postData({
        url: API_MAP.SETDATA,
        data: {
            uid: req.session.uid,
            key,
            record: JSON.stringify(record)
        }
    });

    res.status(200).json({errno: 0, message: '更新成功'});
});

module.exports = apiRouter;