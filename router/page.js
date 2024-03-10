const express = require('express');
const pageRouter = express.Router();
const {postData, getData, API_MAP, DEF_USER_DATA, parseJSONSafely} = require('../utils/index');

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
            }).catch(err => {
                res.status(500).send('github user data error');
                return;
            });
            const {login, id, name, email} = githubUserData;

            // 1.注册接口调用
            console.log('data', githubUserData);
            const username = login + '-' + id;
            const signinData = {
                login_id: login + id,
                channel: 'github',
                login_info: JSON.stringify(githubUserData)
            };
            console.time();
            const signinRes = await postData({
                url: API_MAP.SIGININ,
                data: signinData
            }).catch(err => {
                res.status(500).send('/user/login error');
                return;
            });
            console.timeEnd();

            // 2.setdata接口调用,记录用户信息
            const setRes = await postData({
                url: API_MAP.SETDATA,
                data: {
                    uid: username,
                    record: JSON.stringify({
                        coins: 0,
                        username: name || login,
                        email,
                        apitoken: '0000-0000-0000-0000'
                    }),
                    key: 'main'
                }
            }).catch(err => {
                res.status(500).send('/record/setdata error');
                return;
            });

            console.log('setRes', setRes);
            
            if (setRes) {
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
        let userData = await postData({
            url: API_MAP.GETDATA,
            data: {
                uid: req.session.uid,
                key: 'main'
            }
        });

        res.render('account', {
            title: '我的账户',
            userData: parseJSONSafely(userData.record),
            ...DEF_USER_DATA,
            ...parseJSONSafely(userData.record)
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