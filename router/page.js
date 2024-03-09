const express = require('express');
const pageRouter = express.Router();
const {postData, getData, API_MAP} = require('../utils/index');

// 首页
pageRouter.get('/', function(req, res) {
    if (!req.session.uid) {
        res.render('signin', {title: '登入'});
    }
    else {
        res.render('select', {title: '选择'});
    }
});

// 登入页面
pageRouter.get('/signin', function(req, res) {
    if (!req.session.uid) {
        res.render('signin', {title: '登入'});
    }
    else {
        res.redirect('/');
    }
});

// github验证回调接口
pageRouter.get('/github_signin', async function(req, res) {
    const {code} = req.query;
    if (code) {
        const {access_token} = await postData({
            url: API_MAP.GITHUB_ACCESS_TOKEN,
            data: {
                client_id: 'f391bdfda18c5fdd0e8c',
                client_secret: 'ea20df43eb5eac78d2c9a89be3f40cf8b4708d5f',
                code
            }
        });
        console.log('access_token', access_token);

        if (access_token) {
            const githubUserData = await getData({
                url: API_MAP.GITHUB_USER,
                headers: {
                    Authorization: 'token ' + access_token
                }
            });
            const {login, id} = githubUserData;

            // 新注册用户
            const username = login + id;
            const signinData = {
                login_id: login + id,
                channel: 'github',
                login_info: JSON.stringify(githubUserData)
            };
            console.log('data', signinData);

            console.time();
            const {uid} = await postData({
                url: API_MAP.SIGININ,
                data: signinData
            }).catch(err => {
                console.log('err', err);
            });
            console.timeEnd();

            // { uid: 'silly-zjK9YRaodCiFfQh52m8gHqOG1YAkoLUC0d46YYP9' }
            if (uid) {
                req.session.uid = username;
                res.redirect('/select');
            }
            else {
                res.redirect('/signin');
            }
        }
        else {
            res.redirect('/');
        }
    }
    else {
        res.redirect('/');
    }
});

// 账户页面
pageRouter.get('/account', async function(req, res) {
    // 如果没有登入需要redirec到登入页面
    if (!req.session.uid) {
        res.redirect('/signin');
    }
    else {
        const userData = await postData({
            url: API_MAP.GETDATA,
            data: {
                uid: req.session.uid,
                key: 'name'
            }
        });
        console.log('userData', userData);
        
        res.render('account', {
            title: '我的账户',
            coins: 56,
            name: userData.record,
            email: 'test@gmail.com',
            apitoken: 'akakskskdkfakdjqe',
            userData
        });
    }
});

// 选择页面
pageRouter.get('/select', function(req, res) {
    if (!req.session.uid) {
        res.redirect('/signin');
    }
    else {
        res.render('select', {title: '选择'});
    }
});

// 退出
pageRouter.get('/logout', function(req, res) {
    // 销毁 session 中的用户信息
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

module.exports = pageRouter;