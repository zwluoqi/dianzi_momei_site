
const signinForm = document.querySelector('#select-form');

// 邮箱和密码登入
function handleSubmit(event) {
    event.preventDefault();
    const apiToken = signinForm.querySelector('[name="apiToken"]').value;
    const model = signinForm.querySelector('[name="model"]').value;
    const nickname = signinForm.querySelector('[name="name"]').value;

    const requestOptions = {
        method: 'POST',
        // credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            // channel: 'email',
            // login_info: {password, email}
            apiToken,model,nickname,
        })
    };
    console.log('requestOptions', requestOptions);
    fetch('./api/get_cloud_address', requestOptions)
    .then(response => response.json())
    .then(({msg, errno}) => {
        console.log('msg', msg);
        console.log('errno', errno);
        if (errno === 0) {
            // alert('进入成功');
            window.location.href = msg;
            // alert(['apiToken=', apiToken,  'model=', model, 'nickname=', nickname].join(' '));
            // window.location.href = 'http://baidu.com/';
        }
        else {
            alert('进入失败' + msg);
        }
    });


}

function handleSelect(e) {
    const select = e.target;
    const span = document.querySelector('#select-text');
    span.innerHTML = select.options[select.selectedIndex].value;
    console.log('eee', select.options[select.selectedIndex].value);
}
