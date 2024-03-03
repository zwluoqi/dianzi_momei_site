
const signinForm = document.querySelector('#select-form');

// 邮箱和密码登入
function handleSubmit(event) {
    event.preventDefault();
    // 表单提交数据
    const email = signinForm.querySelector('[name="email"]').value;
    const password = signinForm.querySelector('[name="password"]').value;
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            login_id: 'login_id_123123123',
            channel: 'email',
            login_info: {password, email}
        })
    };
    fetch('./api/signin', requestOptions)
    .then(response => response.json())
    .then(({msg, errno}) => {
        if (errno === 0) {
            alert('登录成功');
            window.location.href = './';
        }
        else {
            alert('登录失败' + msg);
        }
    });
}

function handleSelect(e) {
    const select = e.target;
    const span = document.querySelector('#select-text');
    span.innerHTML = select.options[select.selectedIndex].value;
    console.log('eee', select.options[select.selectedIndex].value);
}
