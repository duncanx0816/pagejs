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
// @match        http*://gw3.torlook.info/*
// @match        https://rargb.to/*
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

const jq = $
unsafeWindow.jq = unsafeWindow.jq ? unsafeWindow.jq : jq

const init = () => {
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

const juejin = () => {
    let flag = true
    let ntime = 100
    let timer = setInterval(() => {
        --ntime
        if (ntime < 0) {
            clearInterval(timer)
        }
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
        jq('div.guide-collect-popover').hide()
        jq('div.author-info-block').next('img').hide()
        jq('#comment-box > div.comment-list-wrapper').hide()
        jq('#comment-box > div.container.hot-list').hide()

        let btn_old = jq('button.btn.meiqia-btn')
        if (flag && btn_old.length) {
            let btn_new = btn_old.clone()
            btn_old.replaceWith(btn_new) // remove all listeners on btn_old
            btn_new.click((e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                jq('#comment-box > div.comment-list-wrapper').toggle()
                jq('#comment-box > div.container.hot-list').toggle()
            })
            flag = false
            console.log('done')
            // window.getEventListeners(btn).click.forEach((item) => {
            //     btn.removeEventListener('click', item.listener)
            // })  // getEventListeners is only available in console
        }
    }, 100)
}

const torlook = () => {
    let aa = jq("span.magnet > a")
    aa = [...aa]
    aa.forEach(
        a => {
            let url = `${location.origin}/${a.dataset.src}?fancybox=true`
            let options = {
                referrer: location.href,
                credentials: "include",
                headers: {}
            }
            fetch(url, options).then(response => response.text()).then(data => {
                jq(a).replaceWith(jq("<a/>", {
                    class: "dl magneto ut-download-url",
                    href: `magnet:${data.split("magnet:")[1].split("'")[0]}`
                }))
                console.log(`magnet:${data.split("magnet:")[1].split("'")[0]}`)
            })
        }
    )
}

const rargb_to=()=>{
    for(let a of document.querySelectorAll('.lista2t tr.lista2 td.lista:nth-child(2)>a')){
        parse_link(a.href).then(magnet=>{
            if(magnet){
                a.parentElement.innerHTML=`<a target="_blank" href="${magnet}" onclick="navigator.clipboard.writeText(event.target.href); return false">[Torrent]</a>  `+a.outerHTML
            }
        })
    }
}

const parse_link=async (url)=>{
    let res=await fetch(url).then(res=>res.text())
    let doc = new DOMParser().parseFromString(res, "text/html")
    for(let a of doc.querySelectorAll('.lista>a')){
        if(a.href && a.href.startsWith('magnet:')) return a.href
    }
}

(function () {
    'use strict';
    console.log('av2048')

    if (location.host == "juejin.cn") {
        juejin()
    } else if (location.host == 'gw3.torlook.info') {
        torlook()
    } else if (location.host == 'rargb.to') {
        rargb_to()
    } else {
        unsafeWindow.setpos = () => {}
        jq("div.tac").remove()
        jq(".tr3[align='middle']").remove()
        jq(".apd>a").remove()
        jq("#td_tpc font").remove()
        jq(".tr1.r_one").remove()
        jq("#td_3733").parent().remove()

        let ntime = 100
        let timer = setInterval(() => {
            --ntime
            if (ntime < 0) {
                clearInterval(timer)
            }
            jq("#td_3733").parent().remove()
        }, 100)

        let a=jq('#read_tpc > a[href*="?name="]')[0]
        let hash=a.href.match(/\?name=(\w{32})/)[1]
        let link=`${new URL(a.href).origin}/down.php/${hash}.torrent`
        let a_=jq('<a/>',{href:link,text:link})[0]
        jq(a).replaceWith(a_)

        let h=jq('#subject_tpc')[0]
        let h_=jq('<a/>',{href:link})[0]
        h_.innerHTML=h.outerHTML
        jq(h).replaceWith(h_)
    }
})();
