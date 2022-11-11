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
// @match        http*://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc1y.xyz
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        unsafeWndiow
// @grant        window.close
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
// ==/UserScript==

const jq=$
// unsafeWindow.jq=unsafeWindow.jq?unsafeWindow.jq:jq

const init=()=>{
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
    unsafeWindow.GM_on = GM_notification
    unsafeWindow.GM_setClipboard = GM_setClipboard
    unsafeWindow.GM_info = GM_info
}

const juejin=()=>{
    let ntime=100
    let timer=setInterval(()=>{
        --ntime
        if(ntime<0){clearInterval(timer)}
        jq('.wrap.category-course-recommend').remove()
        jq('.sidebar-block.author-block.pure').remove()
        jq('.recommend-box').remove()
        jq('.article-end').remove()
        jq('.sidebar-bd-entry').remove()
        jq('.sidebar-block.app-download-sidebar-block.shadow').remove()
        jq('.sidebar-block.shadow').remove()
        jq('.main-nav-list').remove()
        jq('.sidebar-block.sticky-block').remove()
        jq('.sidebar-block.banner-block').remove()
    },100)
}

(function() {
    'use strict';
    console.log('test')

    if(location.host=="juejin.cn"){
        juejin()
    }else{
        unsafeWindow.setpos=()=>{}
        jq("div.tac").remove()
        jq(".tr3[align='middle']").remove()
        jq(".apd>a").remove()
        jq("#td_tpc font").remove()
        jq(".tr1.r_one").remove()
        jq("#td_3733").parent().remove()
        
        let ntime=100
        let timer=setInterval(()=>{
            --ntime
            if(ntime<0){clearInterval(timer)}
            jq("#td_3733").parent().remove()
        },100)
    }
})();
