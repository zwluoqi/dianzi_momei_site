
const signinForm = document.querySelector('#sigin-form');

function handleSubmit(event) {
    event.preventDefault(); // 阻止默认提交事件
    // 在这里可以执行自定义的提交逻辑
    const username = signinForm.querySelector('[name="email"]').value;
    const password = signinForm.querySelector('[name="password"]').value;
    
    
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            login_id: 'login_id_123123123',
            channel: 'email',
            login_info: {
                password: '123456',
                email: 'test@163.com'
            }
        })
    };
    fetch('./api/signin', requestOptions)
    .then(response => response.json())
    .then(({msg, errno}) => {
        if (errno === 0) {
            alert('登录成功');
            window.location.href = './select';
        }
        else {
            alert('登录失败' + msg);
        }
    });

}
