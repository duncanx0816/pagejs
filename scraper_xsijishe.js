// ==UserScript==
// @name         xsijishe
// @namespace    http://tampermonkey.net/
// @version      2026-11-15
// @description  try to take over the world!
// @author       You
// @match        https://xsijishe.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sehuatang.net
// @grant        none
// ==/UserScript==

const upload = async (url, content) => {
    await fetch('https://www.wdym9816.top/track/scraper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, content })
    })
}

const main = async () => {
    urls = [
        "https://xsijishe.net/forum-48-1.html",
        "https://xsijishe.net/forum-49-1.html",
        "https://xsijishe.net/forum-51-1.html",
    ]
    for (url of urls) {
        console.log(url)
        content = await fetch(url).then(res => res.text())
        await upload(url, content)
    }
}


(async function () {
    'use strict';
    const REFRESH_INTERVAL = 60 * 1000;
    await main();
    setInterval(async function () {
        await main();
        location.reload();

    }, REFRESH_INTERVAL);
})();
