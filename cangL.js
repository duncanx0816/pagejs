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
// @require      https://cdnjs.cloudflare.com/ajax/libs/jq/3.4.1/jq.min.js
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js
// @require file://C:\Users\lckfb-xdk\Desktop\Untitled-1.js
// ==/UserScript==


(function () {
    'use strict';
    GM_log('cangL')
    init();
    unsafeWindow.jq = unsafeWindow.jq ? unsafeWindow.jq : unsafeWindow.jQuery
    unsafeWindow.parse_index = parse_index
    unsafeWindow.parse_detail = parse_detail

    switch (location.pathname.split('/')[1]) {
        case 'workflow':
            parse_detail().then(data=>{console.log(data)})
        // case 'wui':
        //     parse_index();
        default:
            console.log()
    }
})();


async function parse_detail() {
    // location="http://116.62.194.237/workflow/request/ViewRequest.jsp?requestid=37563&isovertime=0"
    return new Promise((resolve, reject) => {
        let ntime = 10
        let timer = setInterval(() => {
            if (--ntime < 0) clearInterval(timer)
            try {
                let requestid = new URL(location).searchParams.get('requestid')
                let prefix = document.querySelector("iframe#bodyiframe").contentWindow.document.body.querySelector('#field8714span').textContent
        
                let infos = []
                let tds = document.querySelector("iframe#bodyiframe").contentWindow.document.body.querySelectorAll('.fieldvalueClass')
                for (let td of Array.from(tds)) {
                    try {
                        let filename = td.querySelector('span>a').text
                        let fileid = td.querySelector('nobr>a').getAttribute('onclick').split("downloads('")[1].split("'")[0]
                        let url = new URL(`/weaver/weaver.file.FileDownload?f_weaver_belongto_userid=61&f_weaver_belongto_usertype=0&fileid=${fileid}&download=1&requestid=${requestid}&fromrequest=1`, location)
                        infos.push({
                            filename,
                            url: url.href
                        })
                    } catch (error) {}
                }
                localStorage.setItem(requestid, JSON.stringify({prefix,infos}))
                clearInterval(timer)
                resolve({
                    prefix,
                    infos
                })
            } catch (error) { }
        }, 1000)
    })
}


function parse_index() {
    let obj = {};
    (async () => {
        for await (let info of pages()) {
            console.log(info)
        }
    })().then(() => {
        for (let k of Object.keys(localStorage)) {
            obj[k] = JSON.decode(localStorage.getItem(k))
        }
        let blob = new Blob([JSON.encode(obj)], {
            type: 'text/html'
        });
        let a = document.createElement('a');
        a.download='info.json';
        a.href = URL.createObjectURL(blob);
        a.click()
    })
}

async function* pages() {
    let aa = await parse_links()
    for (let idx = 0; idx < aa.length; idx++) {
        await parse(aa[idx])
        yield `${idx+1} of ${aa.length}`
    }
}

async function parse_links(){
    let aa;
    return new Promise((resolve,reject)=>{
        let ntime=10
        let timer=setInterval(() => {
            if(--ntime<0){clearInterval(timer)}
            aa = document.querySelector("iframe#mainFrame").contentWindow.document.body.querySelectorAll('td.reqdetail>a.ellipsis')
            if(aa.length >0){
                console.log(aa.length)
                resolve(Array.from(aa))
                clearInterval(timer)
            }
        }, 1000);
    })
}

async function parse(a) {
    return new Promise((resolve, reject) => {
        let link = a.href.split("openFullWindowHaveBarForWF('")[1].split('%27,')[0]
        link = new URL(link, location).href
        let requestid = new URL(link, location).searchParams.get('requestid')
        if(localStorage.getItem(requestid)){
            resolve(requestid)
        }else{
            let w = GM_openInTab(link,{active:false})
    
            let ntime=100
            let timer = setInterval(() => {
                if(--ntime<0)clearInterval(timer)
                if (localStorage[requestid]) {
                    w.close()
                    clearInterval(timer)
                    resolve(requestid)
                }
            }, 1000)
        }
    })
}


async function downloadPack({ prefix, infos }) {
    var zip = new JSZip();
    for (const info of infos) {
        zip.file(info.filename, fetch(info.url).then(
            response => response.blob()).then(
            data => {
                console.log(data);
                return data
            }
        ));
    }

    zip.generateAsync({
        type: 'blob'
    }).then(function (content) {
        saveAs(content, `${prefix}.zip`);
        let requestid = new URL(location).searchParams.get('requestid')
        localStorage.setItem(requestid, 1)
    });
}

function add_script(src){
    let tag=document.createElement('script')
    tag.setAttribute('type','text/javascript')
    tag.src =src;
    document.body.appendChild(tag)
}


function main(){
    // batch download base on localStorage.
    add_script("https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js");
    add_script("https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js");
    let tasks=[];
    for(let k of Object.keys(localStorage)){
        let obj=JSON.decode(localStorage.getItem(k))
        tasks.push(downloadPack(obj))
    }
    Promise.all(tasks).then(()=>{console.log('done')})
}


function init() {
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
