// 工具函数
const axios = require('axios');

const postConf = {
    method: 'post',
    maxBodyLength: Infinity,
    headers: { 
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    data
};

const getConf = {
    method: 'get',
    maxBodyLength: Infinity
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

module.exports = {
    getData,
    postData
}
