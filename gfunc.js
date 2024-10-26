// ==UserScript==
// @name         gfuncs
// @namespace    http://tampermonkey.net/
// @version      20241026
// @description  try to take over the world!
// @author       You
// @match        https://pornbox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornbox.com
// @grant        unsafeWindow
// ==/UserScript==

unsafeWindow.pornobox=()=>{
    return [...document.querySelectorAll('#items-mosaic a.item__tabs-content')].map(a=>a.href)
}

(function() {
    'use strict';

    // Your code here...
})();
