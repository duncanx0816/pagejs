// ==UserScript==
// @name         pornobox
// @namespace    http://tampermonkey.net/
// @version      20241026
// @description  try to take over the world!
// @author       You
// @match        https://pornbox.com/application/watch-page/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornbox.com
// @grant        window.close
// ==/UserScript==

async function until(expr, ntime = 20, delta = 3000) {
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      if (eval(expr) || --ntime < 0) {
        clearInterval(timer);
        resolve(eval(expr));
      }
    }, delta);
  });
}

(async function() {
    'use strict';
    await until("document.querySelector('.video-page__title')");

    let title=document.querySelector('.video-page__title').innerText
    let studio=document.querySelector('.video-page__studio-row .tag-link').innerText
    let rdate=document.querySelector('.scene-data__release-date').innerText
    let link=location.href

    console.log({title, studio, rdate})

    let ea = document.createElement("a");
    ea.download = `${studio}.${rdate}.json`;
    ea.href = URL.createObjectURL(
        new Blob([JSON.stringify({studio, rdate, title, link})], {
            type: "application/json",
        })
    );
    ea.click();
    window.close();

})();
