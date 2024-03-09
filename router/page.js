const express = require('express');
const pageRouter = express.Router();
const {postData, getData} = require('../utils/index');

// 首页
pageRouter.get('/', function(req, res) {
    if (!req.session.user) {
        res.render('signin', {title: '登入'});
    }
    else {
        res.render('select', {title: '选择'});
    }
});

// 登入页面
pageRouter.get('/signin', function(req, res) {
    if (!req.session.user) {
        res.render('signin', {title: '登入'});
    }
    else {
        res.redirect('/');
    }
});

// github登入页面
pageRouter.get('/github_signin', async function(req, res) {
    const {code} = req.query;
    if (code) {
        const {access_token} = await postData({
            url: 'https://github.com/login/oauth/access_token',
            data: {
                client_id: 'f391bdfda18c5fdd0e8c',
                client_secret: 'ea20df43eb5eac78d2c9a89be3f40cf8b4708d5f',
                code
            }
        });
        console.log('access_token', access_token);

        if (access_token) {
            const {name, email, login, node_id} = await getData({
                url: 'https://api.github.com/user',
                headers: {
                    Authorization: 'token ' + access_token
                }
            });

            // 新注册用户
            // email可能为空 name login基本都有的
            const username = email || name || login;
            const signinData = {
                login_id: node_id,
                channel: 'github',
                login_info: JSON.stringify({
                    email: username,
                    // todo: 密码传啥?
                    password: '123456'
                })
            };
            console.log('data', signinData);

            console.time();
            const {uid} = await postData({
                url: 'https://sillywebmanagerdb.fucksillytavern.uk/user/login',
                data: signinData
            }).catch(err => {
                console.log('err', err);
            });
            console.timeEnd();

            // { uid: 'silly-zjK9YRaodCiFfQh52m8gHqOG1YAkoLUC0d46YYP9' }
            if (uid) {
                req.session.user = username;
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
pageRouter.get('/account', function(req, res) {
    // 如果没有登入需要redirec到登入页面
    if (!req.session.user) {
        res.redirect('/signin');
    }
    else {
        res.render('account', {title: '我的账户'});
    }
});

// 对话选择页面
pageRouter.get('/select', function(req, res) {
    if (!req.session.user) {
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