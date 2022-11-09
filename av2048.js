// ==UserScript==
// @name         av2048
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://bbs6.fc1y.xyz/2048/*
// @match        http*://dp227.xyz/pw/*
// @match        http*://down.dataaps.com/list.php?name=*
// @match        http*://ww1.k00ppc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc1y.xyz
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


(function() {
    'use strict';
    console.log('test')
    unsafeWindow.setpos=()=>{}
    document.querySelectorAll('div.tac').forEach((el)=>{el.parentNode.removeChild(el)})
    document.querySelectorAll('#td_3733').forEach((el)=>{el.parentElement.hidden=true})
    document.querySelectorAll(".tr3[align='middle']").forEach((el)=>{el.parentNode.removeChild(el)})
    document.querySelectorAll('.apd>a').forEach((el)=>{el.parentNode.removeChild(el)})
    document.querySelectorAll('#td_tpc font').forEach((el)=>{el.parentNode.removeChild(el)})
    document.querySelectorAll('.tr1.r_one').forEach((el)=>{el.parentNode.removeChild(el)})
})();
