// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url || "";

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function Savedpassedword(callback) {
  var items = {};
  var password = document.querySelector('#password').value || ''
  if (password.length !== 6) {
    alert('请输入6位密码')
    return
  }
  items["password"] = password;
  chrome.storage.sync.set(items, function () {
    console.log('Savedpassedword===>', items)
    alert('保存成功');
  });
  callback(password)
}

function SavedTimes(callback) {
  var items = {};
  var times = document.querySelector('#times').value || ''
  items["times"] = times;
  chrome.storage.sync.set(items, function () {
    console.log('SavedTimes===>', items)
    // alert('保存成功');
  });
  callback(times)
}

function SavedStopKey(_key, callback) {
  var items = {};
  var stopKey = !_key
  items["stopKey"] = stopKey;
  showStartStop(stopKey);
  chrome.storage.sync.set(items, function () {
    console.log('SavedStopKey===>', items)
  });
  callback(times)
}

//显示开始和停下按钮
function showStartStop(_stopKey) {
  if (_stopKey) {
    document.querySelector('#stop').className = "hidden";
    document.querySelector('#start').className = "";
  } else {
    document.querySelector('#start').className = "hidden";
    document.querySelector('#stop').className = "";
  }
}


// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  // return
  getCurrentTabUrl((_url) => {
    var password = '';
    var times = 0;
    var stopKey = false;
    getSavedpassed((items) => {
      password = items["password"] || "";
      times = items["times"] || 0;
      stopKey = items["stopKey"] || false;
      showStartStop(stopKey);
      //刷新频率
      document.getElementById('times').value = times;
      chrome.tabs.executeScript({
        code: stopkey(stopKey) + gotoHref(_url, times) + executeScript(password) + '}()) '
        //file: './exec.js'
      });
    });
    //保存时间
    document.getElementById('save').addEventListener('click', () => {
      Savedpassedword((_password) => {
        password = _password;
      });
      reloadTabs();
    });
    //保存时间
    document.getElementById('timessave').addEventListener('click', () => {
      SavedTimes((_times) => {
        times = _times;
      });
      reloadTabs();
    });
    //点击停止
    document.getElementById('stop').addEventListener('click', () => {
      SavedStopKey(stopKey, (_stopKey) => {
        stopKey = _stopKey;
      });
      reloadTabs();
    });
    //点击开始
    document.getElementById('start').addEventListener('click', () => {
      SavedStopKey(stopKey, (_stopKey) => {
        stopKey = _stopKey;
      });
      reloadTabs();
    });
  });
}

const reloadTabs = () => {
  chrome.tabs.executeScript({
    code: `location.href=location.href;`
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    init();
  }
})



function getSavedpassed(callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get((items) => {
    callback(chrome.runtime.lastError ? null : items);
  });
}

function stop() {
  src = `window.stopflag=!window.stopflag;`;
  return src;
}


function stopkey(_key) {
  src = `(function(){
    window.stopflag=${_key || false};
    console.log('stopflag===>',${_key});
    if (window.stopflag) {return false};
    // return false;
    `;
  return src;
}

//页面刷新
function gotoHref(href, _times) {
  var reg = /https:\/\/my.cbg.163.com\/cgi\/mweb+/;
  var reg2 = /\/equip\//;
  var src = '';
  var times = _times || 10;
  if (reg.test(href)) {
    var newHref = href;
    var test2 = reg2.test(href);
    var reg3 = /search/;
    if (test2) {
      //抢票页面直接跳到支付页面
      newHref = href.replace(reg2, '/order/confirm/');
      newHref = newHref.replace(reg3, 'all_list');
    }
    src = `
    if(!${test2}){
      let btn = document.querySelector('.btn');
      let reloadFunc=()=>{
          let time1 = setTimeout(() => {
            location.href = "${newHref}";
            clearTimeout(time1);
        }, ${times});
        return false;
      }
      if(!btn){
        //没有找到按钮说明是失败的页面
        reloadFunc();
      }else{
        var isDisable=btn.className.includes('disabled');
        if(isDisable){
          reloadFunc();
        }
      }
    }else{
      location.href = "${newHref}";
    }
    `;
  }

  return src;
}

function executeScript(_password) {
  console.log("executeScript===>", _password);
  return src = `
  var timer = setInterval(() => {
    if (window.stopflag) {clearInterval(timer);return false};
      //有验证码的情况
      var code = document.querySelector('.vcode');
      console.log("code===>",code);
      //自动输入验证码
      if (code) {
        // debugger;
        //var test = /[^0-9]+/;
        //str = code.innerText.replace(test, "");
        //var inputModal = document.querySelector('.js-modal-prompt-input');
        //inputModal.value = str;
        //inputModal.focus();
        //inputModal.blur();
        var modalBtnConfirm = document.querySelector('.modal-button-confirm');
        modalBtnConfirm.className = "modal-button modal-button-confirm";
        modalBtnConfirm.click();
        clearInterval(timer);
        return false;
      };
      var btn = document.querySelector('.btn');
      btn ? btn.click() : null;
      //点击
      var seledctPayBtn = document.querySelector('#seledctPayBtn');
      seledctPayBtn ? seledctPayBtn.click() : null;
      //支付密码验证通过
      var password = '${_password}' || '';
      console.log('${_password}');
      var shortPassword = document.querySelector('#shortPassword');
      if (shortPassword && password.length === 6) {
          shortPassword.value = password;
          var shortPasswordBtn = document.querySelector('#shortPasswordBtn');
          shortPasswordBtn.click();
          clearInterval(timer);
      }
  }, 5);
  `
}





