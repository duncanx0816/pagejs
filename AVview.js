// ==UserScript==
// @name         AVview
// @namespace    http://tampermonkey.net/
// @version      2024-05-25
// @description  try to take over the world!
// @author       You
// @match        http*://q0519.cc/pw/*
// @match        http*://thza.cc/*
// @match        http*://www.b23dowx.*/link.aspx?hash=*
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

(function() {
    'use strict';
    [
        ["#threadlisttableid th.common a.s.xst", "td.t_f img"],
        ["#main tr.tr3.t_one td h3>a", "div.tpc_content img"],
    ].map(async item=>{
        let [css1, css2]=item
        console.log([css1, css2])
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
