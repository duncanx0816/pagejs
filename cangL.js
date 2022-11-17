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
// @grant        GM_openInTab
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js
// @require file://C:\Users\lckfb-xdk\Desktop\Untitled-1.js
// ==/UserScript==


(function () {
    'use strict';

    switch (location.pathname.split('/')[1]) {
        case 'workflow': // http://116.62.194.237/workflow/request/ViewRequest.jsp?requestid=37563&isovertime=0
            parse_detail().then(data=>{console.log(data)})
        case 'wui': // http://116.62.194.237/wui/main.jsp?templateId=1
            parse_index();
        default:
            console.log()
    }
})();


async function parse_detail(){
    await until(`document.querySelector("iframe#bodyiframe")?.contentWindow?.document?.body?.querySelector('#field8714span')?.textContent`)
    let requestid = new URL(location).searchParams.get('requestid')
    let prefix = document.querySelector("iframe#bodyiframe").contentWindow.document.body.querySelector('#field8714span').textContent

    let infos = []
    let tds = document.querySelector("iframe#bodyiframe").contentWindow.document.body.querySelectorAll('.fieldvalueClass')
    for (let td of Array.from(tds)) {
        try {
            let filename = td.querySelector('span>a').text
            let fileid = td.querySelector('nobr>a').getAttribute('onclick').split("downloads('")[1].split("'")[0]
            let url = new URL(`/weaver/weaver.file.FileDownload?f_weaver_belongto_userid=61&f_weaver_belongto_usertype=0&fileid=${fileid}&download=1&requestid=${requestid}&fromrequest=1`, location)
            infos.push({ filename, url: url.href })
        } catch (error) {}
    }
    localStorage.setItem(requestid, JSON.stringify({prefix,infos}))
    return {prefix,infos}
}

async function parse_index() {
    for await (let info of pages()) {
        console.log(info)
    }

    let obj = {};
    for (let k of Object.keys(localStorage)) {
        obj[k] = unsafeWindow.JSON.decode(localStorage.getItem(k))
    }

    let blob = new Blob([unsafeWindow.JSON.encode(obj)], { type: 'text/html' });
    let a = document.createElement('a');
    a.download='info.json';
    a.href = URL.createObjectURL(blob);
    a.click()
}

async function* pages() {
    await until(`document.querySelector("iframe#mainFrame").contentWindow.document.body.querySelectorAll('td.reqdetail>a.ellipsis').length`)
    let aa = document.querySelector("iframe#mainFrame").contentWindow.document.body.querySelectorAll('td.reqdetail>a.ellipsis')
    for (let idx = 0; idx < aa.length; idx++) {
        await parse(aa[idx])
        yield `${idx+1} of ${aa.length}`
    }
}

async function parse(a) {
    let link = a.href.split("openFullWindowHaveBarForWF('")[1].split('%27,')[0]
    link = new URL(link, location).href
    let requestid = new URL(link, location).searchParams.get('requestid')

    if(localStorage.getItem(requestid)) return requestid
    let w = GM_openInTab(link,{active:false})
    await until(`localStorage.getItem(${requestid})`)
    w.close()
    return requestid
}

async function add_script(src,test){
    let tag=document.createElement('script')
    tag.setAttribute('type','text/javascript')
    tag.src =src;
    document.body.appendChild(tag)

    await until(test)
}


async function main(){
    // batch download base on localStorage.
    await add_script("https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js",`window.JSZip`);
    await add_script("https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js",`window.saveAs`);

    let tasks=[];
    for(let k of Object.keys(localStorage)){
        let obj=JSON.decode(localStorage.getItem(k))
        tasks.push(downloadPack(obj))
    }
    Promise.all(tasks).then(()=>{console.log('done')})
}


async function downloadPack({ prefix, infos }) {
    var zip = new JSZip();
    for (const info of infos) {
        // http://116.62.194.237/weaver/weaver.file.FileDownload?f_weaver_belongto_userid=61&f_weaver_belongto_usertype=0&fileid=56154&download=1&requestid=43582&fromrequest=1
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


async function until(expr,ntime=20,delta=3000){
    // expr=`document.querySelector("iframe#bodyiframe")?.contentWindow?.document?.body?.querySelector('#field8714span')?.textContent`
    return new Promise((resolve, reject)=>{
        let timer=setInterval(()=>{
            if(eval(expr) || --ntime<0){
                clearInterval(timer)
                resolve(eval(expr))
            }
        }, delta)
    })
}
