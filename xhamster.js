// ==UserScript==
// @name         xhamster
// @namespace    http://tampermonkey.net/
// @version      2026-05-19
// @description  try to take over the world!
// @author       You
// @match        https://xhamster.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xhamster.com
// @grant        none
// ==/UserScript==

const remoteDownload = (url) => {
  const baseUrl = "https://www.wdym9816.top/api/xhamster/";
  const params = { url: url };
  const urlWithParams = `${baseUrl}?${new URLSearchParams(params)}`;
  fetch(urlWithParams, { method: "POST" });
}

(function () {
  "use strict";
  let fullURL = document.location.href;

  // 监听全局点击事件，检查是否按下了 Alt 键
  document.addEventListener(
    "click",
    function (event) {
      if (event.altKey) {
        event.preventDefault();
        event.stopPropagation();

        const anchor = event.target.closest("a");
        if (anchor) {
          fullURL = anchor.href;
        }
        remoteDownload(fullURL);
      }
    },
    true,
  );

  // 1. 创建自定义菜单的 HTML 结构和样式
  const menu = document.createElement("div");
  menu.id = "custom-context-menu";
  menu.style.cssText = `
        display: none;
        position: absolute;
        background: #ffffff;
        border: 1px solid #cccccc;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        z-index: 10000;
        border-radius: 4px;
        padding: 5px 0;
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;

  // 2. 添加菜单项
  menu.innerHTML = `
        <div class="menu-item" data-action="action1" style="padding: 8px 15px; cursor: pointer;">远程下载</div>
        <div class="menu-item" data-action="action2" style="padding: 8px 15px; cursor: pointer;">菜单功能二</div>
    `;
  document.body.appendChild(menu);

  // 为菜单项添加悬浮变色效果
  const items = menu.querySelectorAll(".menu-item");
  items.forEach((item) => {
    item.addEventListener(
      "mouseenter",
      () => (item.style.backgroundColor = "#f0f0f0"),
    );
    item.addEventListener(
      "mouseleave",
      () => (item.style.backgroundColor = "transparent"),
    );
  });

  // 3. 监听全局右键点击事件
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();

    // 将自定义菜单移动到鼠标点击的位置并显示
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.display = "block";

    const anchor = e.target.closest("a");
    if (anchor) {
      fullURL = anchor.href;
    }
  });

  // 4. 监听菜单项的点击事件
  menu.addEventListener("click", function (e) {
    const action = e.target.getAttribute("data-action");
    if (action === "action1") {
      remoteDownload(fullURL);
    } else if (action === "action2") {
      alert("你点击了功能二");
    }
    menu.style.display = "none"; // 点击后隐藏菜单
  });

  // 5. 点击网页其他地方时隐藏菜单
  document.addEventListener("click", function () {
    menu.style.display = "none";
  });
})();


