// ==UserScript==
// @name         recaptcha
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.google.com/recaptcha/api2/anchor?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btdig.com
// @grant        none
// @run-at       document-start
// ==/UserScript==


(function () {
    'use strict';

    // set shadow-root open
    let script = document.createElement('script')
    script.innerHTML = `Element.prototype._attachShadow = Element.prototype.attachShadow; Element.prototype.attachShadow = function () { return this._attachShadow( { mode: "open" } ); };`
    document.documentElement.appendChild(script)

    let observer = new MutationObserver(async () => {
        // console.log(document.querySelector('body').shadowRoot.querySelector('#content'))
        let e = document.querySelector('#recaptcha-anchor .recaptcha-checkbox-border')
        if (e != null) { e.click() }
    })

    observer.observe(document.documentElement,{childList: true, subtree: true})

})();
