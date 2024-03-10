const emailBtn = document.querySelector('.container button[name="email"]');
const usernameBtn = document.querySelector('.container button[name="username"]');
const copyBtn = document.querySelector('.container .suffix-copy');

emailBtn.addEventListener('click', () => setUsernameEmail('email'));
usernameBtn.addEventListener('click', () => setUsernameEmail('username'));
copyBtn.addEventListener('click', handleCopy);

// 点击事件委托
// 复制文本到剪贴板
async function handleCopy() {
    try {
        const textToCopy = document.querySelector(`input[name="apiToken"]`).value;
        const el = document.createElement('textarea');
        el.value = textToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('复制成功');
    }
    catch (err) {
        console.log('err', err);
        alert('无法复制');
    }
}

function setUsernameEmail(name) {
    const targetInputVal = document.querySelector(`input[name="${name}"]`).value;
    const options = {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            key: 'main',
            record: {
                ...userData,
                [name]: targetInputVal
            }
        })
    };
    fetch('./api/setdata', options)
        .then(response => response.json())
        .then((data) => {
            alert('修改成功,请刷新页面预览');
        });
}
