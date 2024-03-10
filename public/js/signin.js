
const signinForm = document.querySelector('#sigin-form');
const githubBtn = document.querySelector('.btn.github');
const emailInput = document.querySelector('input[name="email"]');
const passwordInput = document.querySelector('.password');

// 邮箱验证码登入
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

// 输入完邮箱后，显示验证码输入框
emailInput.addEventListener('blur', this.handleBlur)
function handleBlur(e) {
    const emailData = e.target.value;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailReg.test(emailData)) {
        // TODO: 需要发送邮箱验证码

        // 显示出验证输入框
        passwordInput.classList.remove('hide');
    }
}

// github登入点击按钮跳转github登录授权页面
githubBtn.addEventListener('click', function(e) {
    // 需要在github新建github授权登入的app，才能获取到client_id https://github.com/settings/developers
    // 获取client_id教程 https://blog.csdn.net/xixihahalelehehe/article/details/125294535
    // 整体接入流程 https://juejin.cn/post/6998348587797053447#heading-1
    const client_id = 'f391bdfda18c5fdd0e8c';
    location.href = [
        `https://github.com/login/oauth/authorize?client_id=${client_id}`,
        'scope=user:email',
        // 上线后，回调地址需要同步更新
        'redirect_uri=' + encodeURIComponent('https://dianzimeimo-70138-4-1319072486.sh.run.tcloudbase.com/github_signin'),
    ].join('&');
});
