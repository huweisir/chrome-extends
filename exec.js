
var timer = setInterval(() => {
    //有验证码的情况
    var code = document.querySelector('.vcode');
    //自动输入验证码
    if (code) {
        var test = /[^0-9]+/;
        str = code.innerText.replace(test, "");
        var inputModal = document.querySelector('.js-modal-prompt-input')
        inputModal.value = str;
        inputModal.focus();
        inputModal.blur();
        document.querySelector('.modal-button-confirm').className = "modal-button modal-button-confirm"
        document.querySelector('.modal-button-confirm').click()
        clearInterval(timer);
    }
    var btn = document.querySelector('.btn')
    btn ? btn.click() : null
    //点击
    var seledctPayBtn = document.querySelector('#seledctPayBtn')
    seledctPayBtn ? seledctPayBtn.click() : null
    //支付密码验证通过
    var password = '${_password}' || ''
    console.log('${_password}')
    var shortPassword = document.querySelector('#shortPassword')
    if (shortPassword && password.length === 6) {
        shortPassword.value = password
        var shortPasswordBtn = document.querySelector('#shortPasswordBtn')
        shortPasswordBtn.click();
        clearInterval(timer);
    }
}, 5);


//https://my.cbg.163.com/cgi/mweb/equip/66/201901230201716-66-A46ECSP5JSHHI?view_loc=all_list
//https://my.cbg.163.com/cgi/mweb/order/confirm/66/201901230201716-66-A46ECSP5JSHHI?view_loc=all_list

var time1 = setTimeout(() => {
    location.href = "${newHref}";
}, time)
