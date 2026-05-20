// ==UserScript==
// @name         m3u8plus
// @namespace    http://tampermonkey.net/
// @version      2026-05-21
// @description  try to take over the world!
// @author       You
// @match        https://xhamster.com/*
// @match        https://*.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xhamster.com
// @grant        none
// ==/UserScript==

const remoteDownload = (event) => {
  const anchor = event.target.closest("a");
  const url= anchor?.href || document.location.href;
  
  const baseUrl = "https://www.wdym9816.top/track/m3u8";
  const params = { url };
  const urlWithParams = `${baseUrl}?${new URLSearchParams(params)}`;
  fetch(urlWithParams);
}

(function () {
  "use strict";

  // 监听全局右键点击事件
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    remoteDownload(e);
  });
  
  // 监听全局点击事件，检查是否按下了 Alt 键
  document.addEventListener(
    "click",
    function (e) {
      if (e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        remoteDownload(e);
      }
    },
    true, // 在“捕获阶段”（Capture Phase）触发
  );
  
})();

