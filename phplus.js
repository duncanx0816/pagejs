// ==UserScript==
// @name         pornhub+
// @namespace    http://tampermonkey.net/
// @version      20250815
// @description  try to take over the world!
// @author       You
// @match        https://cn.pornhub.com/playlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// ==/UserScript==

const addToFav=()=>{
    const formData = new FormData();
    formData.append('toggle', 1);
    formData.append('id', document.querySelector('#player').dataset.videoId);
    formData.append('token', token);

    fetch('https://cn.pornhub.com/video/favourite', {
        method: 'POST',
        body: formData
    })
}

(function() {
    'use strict';

    [...document.querySelectorAll('div.add-to-playlist-icon > button')].map(btn=>{
        btn.onclick=()=>{
            const formData = new FormData();
            formData.append('vid', btn.dataset.videoId);
            formData.append('token', token);
            fetch('https://cn.pornhub.com/api/v1/playlist/video_add_watchlater', {
                method: 'POST',
                body: formData
            })
        }
    })
})();
