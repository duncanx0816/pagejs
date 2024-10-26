// ==UserScript==
// @name         pornobox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pornbox.com/application/watch-page/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornbox.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        window.close
// ==/UserScript==

const jq=$
unsafeWindow.jq=unsafeWindow.jq?unsafeWindow.jq:jq

let init=()=>{
    unsafeWindow.GM_setValue = GM_setValue
    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_addStyle = GM_addStyle
    unsafeWindow.GM_deleteValue = GM_deleteValue
    unsafeWindow.GM_listValues = GM_listValues
    unsafeWindow.GM_addValueChangeListener = GM_addValueChangeListener
    unsafeWindow.GM_removeValueChangeListener = GM_removeValueChangeListener
    unsafeWindow.GM_log = GM_log
    unsafeWindow.GM_getResourceText = GM_getResourceText
    unsafeWindow.GM_getResourceURL = GM_getResourceURL
    unsafeWindow.GM_registerMenuCommand = GM_registerMenuCommand
    unsafeWindow.GM_unregisterMenuCommand = GM_unregisterMenuCommand
    unsafeWindow.GM_openInTab = GM_openInTab
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    unsafeWindow.GM_download = GM_download
    unsafeWindow.GM_getTab = GM_getTab
    unsafeWindow.GM_saveTab = GM_saveTab
    unsafeWindow.GM_getTabs = GM_getTabs
    unsafeWindow.GM_notification = GM_notification
    unsafeWindow.GM_setClipboard = GM_setClipboard
    unsafeWindow.GM_info = GM_info
}

async function until(expr, ntime = 20, delta = 3000) {
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      if (eval(expr) || --ntime < 0) {
        clearInterval(timer);
        resolve(eval(expr));
      }
    }, delta);
  });
}

(async function() {
    'use strict';
    await until("document.querySelector('.video-page__title')");

    let title=document.querySelector('.video-page__title').innerText
    let studio=document.querySelector('.video-page__studio-row .tag-link').innerText
    let rdate=document.querySelector('.scene-data__release-date').innerText

    console.log({title, studio, rdate})

    let ea = document.createElement("a");
    ea.download = `${studio}.${rdate}.json`;
    ea.href = URL.createObjectURL(
        new Blob([JSON.stringify({title, studio, rdate})], {
            type: "application/json",
        })
    );
    ea.click();
    window.close();

})();
