const express = require('express');
const apiRouter = express.Router();
const { postData, API_MAP, parseJSONSafely } = require('../utils/index');
const { v4: uuidv4 } = require('uuid');


// API处理接口(实际匹配到/api/test)
apiRouter.get('/test', function (req, res) {
    // 如果没有登入需要redirec到登入页面
    res.json({
        type: 'this is get api'
    });
});

// 登入接口
apiRouter.post('/signin', async function (req, res) {
    const { channel = 'email', login_info } = req.body;

    try {
        // TODO: 采用email + 验证码登入, 需要重新实现sigin逻辑
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
            res.json({ errno: 0, message: '登入成功' });

        } else {
            // 登录失败
            res.json({ errno: -1, message: '登入失败' });
        }
    } catch (e) {
        console.log('error', e);
        res.json({ errno: -1, message: '登入失败' });
    }
});

// 更新账户数据
apiRouter.post('/setdata', async function (req, res) {
    const { key, record } = req.body;
    try {
        const setDataRes = await postData({
            url: API_MAP.SETDATA,
            data: {
                uid: req.session.uid,
                key,
                record: JSON.stringify(record)
            }
        });

        res.status(200).json({ errno: 0, message: '更新成功' });
    } catch (e) {
        console.log('error', e);
        res.json({ errno: -1, message: '更新失败' });
    }
});


// 获取酒馆地址
apiRouter.post('/get_cloud_address', async function (req, res) {
    console.log('get_cloud_address', req.query);
    if (!req.session.uid) {
        res.redirect('/signin');
    }
    else {
        try {
            let userData = await postData({
                url: API_MAP.GETDATA,
                data: {
                    uid: req.session.uid,
                    key: 'address'
                }
            });
            let addressJson = parseJSONSafely(userData.record);
            if (addressJson && addressJson.address) {
                console.log('return silly address', addressJson.address);
                res.json({ errno: 0, msg: addressJson.address });
            } else {

                const newUuid = uuidv4();
                //1.去远程服务器创建酒馆：
                console.log('create silly address', newUuid);
                let requestSillyData = await postData({
                    url: API_MAP.SILLY_NGINX_SERVER + '/create-silly',
                    data: {
                        uid: req.session.uid,
                        address: newUuid
                    }
                });

                //2.存一个酒馆地址
                console.log('save silly address', newUuid);
                let userData = await postData({
                    url: API_MAP.SETDATA,
                    data: {
                        uid: req.session.uid,
                        key: 'address',
                        record: JSON.stringify({
                            address: `https://${newUuid}.${API_MAP.SILLY_SERVER}`,
                        })
                    }
                });

                //返回新地址
                console.log('return silly address', newUuid);
                res.json({ errno: 0, msg: `https://${newUuid}.${API_MAP.SILLY_SERVER}` });
            }
        } catch (e) {
            console.log('error', e);
            res.json({ errno: -1, msg: '获取地址失败' });
        }
    }
});


module.exports = apiRouter;