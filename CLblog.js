// ==UserScript==
// @name         CLblog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://t66y.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc1y.xyz
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        unsafeWndiow
// ==/UserScript==

const jq=$
unsafeWindow.jq=unsafeWindow.jq?unsafeWindow.jq:jq

async function until(expr,ntime=20,delta=1000){
    return new Promise((resolve, reject)=>{
        let timer=setInterval(()=>{
            if(eval(expr) || --ntime<0){
                clearInterval(timer)
                resolve(eval(expr))
            }
        }, delta)
    })
}

(async function() {
    'use strict';
    if(jq("a[href*='viidii']").length) alert(jq("a[href*='viidii']").length)

    if (location.host == "t66y.com" && location.pathname.includes('/htm_data/')) {
        var html = jq('.tpc_content:eq(0)').html();
        var openblcokv = setInterval(() => {
            var temp = jq('.tpc_content:eq(0)').html();
            if (temp.length <= 100) {
                jq('.tpc_content:eq(0)').html(html);
                clearInterval(openblcokv)

            }
        }, 100);

        until(`jq("a[href*='hash=']").length`).then(()=>{
            let linkNode = jq("a[href*='hash=']");
            for(let el of linkNode) {
                var orginLink = jq(el).attr('href');
                if (orginLink) {
                    var tempLink = orginLink.split('hash=');
                    var hrefMagnet = 'magnet:?xt=urn:btih:' + tempLink[1].substring(3);
                    jq(el).parent().addClass('link-braces');

                    let el_=jq(el).clone()[0];
                    jq(el_).attr('href', hrefMagnet).text(hrefMagnet);
                    el_.style.fontSize="18px";
                    el_=jq(el_.outerHTML+'<br/>')
                    jq('#conttpc').after(el_.clone());

                    jq(el).remove();
                    jq('.t_like').remove();
                    jq('img[src*=".gif"]').remove();
                }
            }

            if(jq('h4.f16').length){
                let h4=jq('h4.f16');
                let a=jq('<a/>',{href:hrefMagnet})[0];
                a.innerHTML=h4[0].outerHTML
                h4.replaceWith(a);
            }
            
            let aa=jq('.t.t2');
            for(let i=1;i<aa.length;i++)jq(aa[i]).hide()
        })

        let observer = new MutationObserver(async () => {
            setTimeout(() => {
                jq("a[href*='hash=']").remove();
                jq('.t_like').remove();
                jq('img[src*=".gif"]').remove();
                jq('img[src="https://img.10d2.xyz/images/2022/11/16/photo_2022-11-16_20-55-37.jpg"]').remove();
            }, 500);
        });
        observer.observe(
            jq('#conttpc')[0], {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            })

    }

})();
