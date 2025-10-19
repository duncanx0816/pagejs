// ==UserScript==
// @name         rargb
// @namespace    http://tampermonkey.net/
// @version      2025-10-19
// @description  try to take over the world!
// @author       You
// @match        https://rargb.to/search/?search=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rargb.to
// @grant        none
// ==/UserScript==

const get_realLink = async (url) => {
  let res = await fetch(url).then((res) => res.text());
  let doc = new DOMParser().parseFromString(res, "text/html");
  return doc.querySelector("td.lista a")?.href;
};

(function () {
  "use strict";

  // Your code here...
  Promise.all(
    [...document.querySelectorAll(".lista2 .lista:nth-child(2) >a")].map(
      async (a) => {
        let realLink = await get_realLink(a.href);
        if (realLink) {
          a.href = realLink;
        }
      }
    )
  );
})();
