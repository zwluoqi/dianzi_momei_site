const wrapper = document.querySelector('.container');

// 点击事件委托
wrapper.addEventListener('click', function (e) {
    const target = e.target;
    const matchNames = ['username', 'email', 'apiToken'];
    if (target.name && target.tagName === 'BUTTON') {
        const name = target.name;
        const idx = name ? matchNames.indexOf(name) : false;
        const targetInputVal = wrapper.querySelector(`input[name="${name}"]`).value;
        console.log(idx, name, targetInputVal);

        if (idx > -1 && targetInputVal) {
            if (idx === 2) {

            }
            else {
                const options = {
                    method: 'POST',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        key: name,
                        record: targetInputVal
                    })
                };
                fetch('./api/setdata', options)
                    .then(response => response.json())
                    .then((data) => {
                        console.log('data', data);
                        // if (errno === 0) {
                        //     alert('登录成功');
                        //     window.location.href = './';
                        // }
                        // else {
                        //     alert('登录失败' + msg);
                        // }
                    });
            }
        }
    }
});