// 工具函数
const axios = require('axios');
require('dotenv').config();

const postConf = {
    method: 'post',
    maxBodyLength: Infinity,
    headers: { 
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
};

const getConf = {
    method: 'get',
    maxBodyLength: Infinity
};

const API_MAP = {
    SILLY_NGINX_SERVER:process.env['SILLY_NGINX_SERVER'],
    SILLY_SERVER:process.env['SILLY_SERVER'],
    SIGININ: process.env['SIGININ'],
    GETDATA: process.env['GETDATA'],
    SETDATA: process.env['SETDATA'],
    GITHUB_ACCESS_TOKEN: process.env['GITHUB_ACCESS_TOKEN'],
    GITHUB_USER: process.env['GITHUB_USER'],
};

const DEF_USER_DATA = {
    coins: 0,
    username: 'test',
    email: 'test@gmail.com',
    apitoken: '0000-0000-0000-0000'
};

const getData = data => {
    return new Promise((resolve, reject) => {
        const option = {...getConf, ...data};
        console.log('option', option);
        axios.request(option).then(response => {
            console.log('response.data', response.data);
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    });
};

const postData = data => {
    return new Promise((resolve, reject) => {
        const option = {...postConf, ...data};
        axios.request(option).then(response => {
            console.log('response.data', response.data);
            resolve(response.data);
        }).catch(err => {
            reject(err);
        });
    })
};

const parseJSONSafely = str => {
    try {
        return JSON.parse(str);
    }
    catch (err) {
        return {};
    }
};


module.exports = {
    getData,
    postData,
    API_MAP,
    DEF_USER_DATA,
    parseJSONSafely
}
