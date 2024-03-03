const wrapper = document.querySelector('.container');
// 点击事件委托
wrapper.addEventListener('click', function(e){
    const target = e.target;
    const matchNames = ['username', 'email', 'api'];
    const name = target.name;
    const idx = name ? matchNames.indexOf(name) : false;
    console.log(name, 'idx', idx);
    if (idx > -1) {
        // update api
        if (idx === 2) {
            
        }
        else {
            // update name email
        }
    }
});