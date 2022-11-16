// ==UserScript==
// @name         canglang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://116.62.194.237/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=194.237
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_info
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

const jq = $
unsafeWindow.jq = unsafeWindow.jq ? unsafeWindow.jq : jq

let init=()=>{
    unsafeWindow.GM_setValue = GM_setValue
    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_addStyle = GM_addStyle
    unsafeWindow.GM_deleteValue = GM_deleteValue
    unsafeWindow.GM_listValues = GM_listValues
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    unsafeWindow.GM_download = GM_download
    unsafeWindow.GM_openInTab = GM_openInTab
    unsafeWindow.GM_getTab = GM_getTab
    unsafeWindow.GM_saveTab = GM_saveTab
    unsafeWindow.GM_getTabs = GM_getTabs
    unsafeWindow.GM_setClipboard = GM_setClipboard
    unsafeWindow.GM_log = GM_log
    unsafeWindow.GM_notification = GM_notification
    unsafeWindow.GM_addValueChangeListener = GM_addValueChangeListener
    unsafeWindow.GM_removeValueChangeListener = GM_removeValueChangeListener
    unsafeWindow.GM_getResourceText = GM_getResourceText
    unsafeWindow.GM_getResourceURL = GM_getResourceURL
    unsafeWindow.GM_registerMenuCommand = GM_registerMenuCommand
    unsafeWindow.GM_unregisterMenuCommand = GM_unregisterMenuCommand
    unsafeWindow.GM_info = GM_info
}


(function() {
    'use strict';
    init();
    GM_log('test')
    unsafeWindow.parse_detail=parse_detail
    unsafeWindow.parse_index=parse_index


    $(document).ready(function(){
        console.log('begin')
        switch(location.pathname.split('/')[1]){
            case 'workflow': unsafeWindow.parse_detail(); break;
            // case 'wui': unsafeWindow.parse_index(); break;
            default: console.log(location.pathname.split('/')[1])
        }
        console.log('end')
    })
})();


function parse_index(){
    async function parse(a){
        return new Promise((resolve, reject)=>{
            let link=a.href.split("openFullWindowHaveBarForWF('")[1].split('%27,')[0]
            link=new URL(link, location).href
            let requestid=new URL(link,location).searchParams.get('requestid')
            let w=GM_openInTab(link)

            let timer=setInterval(() =>{
                if(localStorage[requestid]){
                    w.close()
                    clearInterval(timer)
                    resolve(requestid)
                }
            },1000)
            })
    }


    async function* pages(){
        let aa=jQuery("iframe#mainFrame").contents().find('td.reqdetail>a.ellipsis')
        for(let idx in Array.from(aa)){
            await parse(aa[idx])
            yield `${idx+1} of ${aa.length}`
        }
    }

    let obj={};
    (async ()=>{
        for await (let info of pages()){
            console.log(info)
        }
    })().then(()=>{
        for(let k of Object.keys(localStorage)){
            obj[k]=JSON.decode(localStorage.getItem(k))
        }
        let blob = new Blob([JSON.encode(obj)], {type: 'text/html'});
        let a=jq('<a/>',{download:'info.json'})[0]
        a.href = URL.createObjectURL(blob);
        a.click()
    })
}


function parse_detail(){
    let ntime=10
    let timer=setInterval(() => {
        if(--ntime<0)clearInterval(timer)
        try {
            let obj={links:[]}
            obj.title=jQuery("iframe#bodyiframe").contents().find('#field8714span')[0].textContent
            let requestid=new URL(location).searchParams.get('requestid')
            let aa=jQuery("iframe#bodyiframe").contents().find('nobr > a')
            for(let a of Array.from(aa)){
                let fileid=a.getAttribute('onclick').split("downloads('")[1].split("'")[0]
                let link= new URL(`/weaver/weaver.file.FileDownload?f_weaver_belongto_userid=61&f_weaver_belongto_usertype=0&fileid=${fileid}&download=1&requestid=${requestid}&fromrequest=1`,location)
                obj.links.push(link.href)
            }

            localStorage.setItem(requestid,JSON.stringify(obj))
            clearInterval(timer)
        } catch (error) {
        }
    }, 1000)
}

