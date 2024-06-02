// ==UserScript==
// @name         AVview
// @namespace    http://tampermonkey.net/
// @version      2024-06-02
// @description  try to take over the world!
// @author       You
// @match        http*://q0519.cc/pw/*
// @match        http*://thza.cc/*
// @match        http://777630.xyz/*
// @match        http*://z2311k.xyz/pw/*
// @match        http*://g8b1.com/*
// @match        http://www.99ybbc.com/*
// @match        https://np2f.kum1.net/*
// @match        http*://*/link.aspx?hash=*
// @match        https://*/list.php?name=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=q0519.cc
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
// ==/UserScript==

unsafeWindow.setpos=()=>{};

const get_page = async (url) => {
  let res = await fetch(url).then((res) => res.text());
  return new DOMParser().parseFromString(res, "text/html");
};

const parse = async (css) => {
    let avs = [...document.querySelectorAll(css)]
        .map((a) => {
            let link = a.href;
            let title = a.textContent.trim();
            let pub_date = null;

            let el=a.offsetParent.parentElement
            if(el.tagName=="TR"){
                pub_date=el.textContent.match(/\d{4}-\d{2}-\d{2}/);
                pub_date=pub_date && pub_date[0];
            }

            return { title, pub_date, link };
        });

    let url_ = "https://www.wdym9816.top:444/api/update/av2048/";
    return fetch(url_, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(avs),
    });
};

(function() {
    'use strict';
    [
        ["#threadlisttableid th.common a.s.xst", "td.t_f img"],
        ["#main tr.tr3.t_one td h3>a", "div.tpc_content img"],
        ["#ajaxtable tr.tr3.t_one a.subject", "div.tpc_content img"],
        [".titletablerow a", ".titletablerow img"],
    ].map(async item=>{
        let [css1, css2]=item
        console.log([css1, css2])
        parse(css1);
        Promise.all(
            [...document.querySelectorAll(css1)].map(
                async (a) => {
                    let el = a.parentElement;
                    let doc = await get_page(a.href);
                    let img = doc.querySelector(css2);
                    let src=img.attributes.file && img.attributes.file.value || img.src;
                    //img.style.width = "100%";

                    let div = document.createElement("div");
                    div.style.textAlign = "center";
                    div.style.maxWidth = "600px";
                    div.innerHTML = `<a href="${a.href}"><img src="${src}" width="100%"></a>`;

                    el.appendChild(div);
                }
            )
        );
    });

})();
