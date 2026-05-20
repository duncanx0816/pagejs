// ==UserScript==
// @name         m3u8plus
// @namespace    http://tampermonkey.net/
// @version      2026-05-20
// @description  try to take over the world!
// @author       You
// @match        https://xhamster.com/*
// @match        https://*.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xhamster.com
// @grant        none
// ==/UserScript==

const remoteDownload = (url) => {
  const baseUrl = "https://www.wdym9816.top/track/m3u8";
  const params = { url: url};
  const urlWithParams = `${baseUrl}?${new URLSearchParams(params)}`;
  fetch(urlWithParams);
}

const sendTargetLink = (event)=>{
    const anchor = event.target.closest("a");
    const link= anchor?.href || document.location.href;
    remoteDownload(link);
}

(function () {
  "use strict";

  // 监听全局点击事件，检查是否按下了 Alt 键
  document.addEventListener(
    "click",
    function (event) {
      if (event.altKey) {
        event.preventDefault();
        event.stopPropagation();
        sendTargetLink(event);
      }
    },
    true,
  );

  // 监听全局右键点击事件
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    sendTargetLink(e);
  });

})();

