const express = require('express');
const apiRouter = express.Router();
const {postData} = require('../utils/index');

// API处理接口(实际匹配到/api/test)
apiRouter.get('/test', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    res.json({
        type: 'this is get api'
    });
});

apiRouter.post('/signin', async function(req, res) {
    // 如果没有登入需要redirec到登入页面
    const {channel = 'email', login_info} = req.body;
    // 简单的验证逻辑
    if (login_info.email && login_info.password) {
        const signinData = await postData({
            url: 'https://sillywebmanagerdb.fucksillytavern.uk/user/login',
            data: {
                // TODO: login_id具体生成逻辑是啥
                login_id: login_info.email,
                channel,
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

apiRouter.post('/setdata', async function(req, res) {
    const {key, record} = req.body;
    const setDataRes = await postData({
        url: 'https://sillywebmanagerdb.fucksillytavern.uk/record/setdata',
        data: {uid: req.session.uid, record, key}
    });

    res.status(200).json({errno: 0, message: '更新成功'});
});

module.exports = apiRouter;