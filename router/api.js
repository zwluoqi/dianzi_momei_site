const express = require('express');
const apiRouter = express.Router();
const {postData, API_MAP, parseJSONSafely} = require('../utils/index');

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


// 获取酒馆地址
apiRouter.post('/get_cloud_address', async function(req, res) {
    console.log('get_cloud_address', req.query);
    if (!req.session.uid) {
        res.redirect('/signin');
    }
    else {
        // res.render('select', {title: '选择'});
        // const {key, record} = req.body;
        let userData = await postData({
            url: API_MAP.GETDATA,
            data: {
                uid: req.session.uid,
                key: 'address'
            }
        });
        let addressJson = parseJSONSafely(userData.record);
        if(addressJson && addressJson.address){
            // res.redirect(addressJson.address);
            res.json({errno: 0, msg: addressJson.address});
        }else{
            // res.redirect('/');
            // res.json({errno: -1, msg: '获取地址失败'});

            //1.请求一个酒馆地址：




            //2.保存到用户数据中
            let userData = await postData({
                url: API_MAP.SETDATA,
                data: {
                    uid: req.session.uid,
                    key: 'address',
                    record: JSON.stringify({
                        address: 'http://127.0.0.1:8000'
                    })
                }
            });

            //返回新地址
            res.json({errno: 0, msg: 'http://127.0.0.1:8000'});
        }
    }
});


module.exports = apiRouter;