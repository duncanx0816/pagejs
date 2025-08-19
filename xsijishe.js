// ==UserScript==
// @name         xsijishe
// @namespace    http://tampermonkey.net/
// @version      20250820
// @description  try to take over the world!
// @author       You
// @match        https://xsijishe.com/home.php?*do=favorite*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xsijishe.com
// @grant        unsafeWindow
// ==/UserScript==

const get_page = async (url) => {
    let res = await fetch(url).then((res) => res.text());
    return new DOMParser().parseFromString(res, "text/html");
};


const delFav = async (href) => {
    event.preventDefault();
    let res = await fetch(href).then((res) => res.text());
    let doc = new DOMParser().parseFromString(res, "text/html");
    console.log(doc.querySelector('input[name="formhash"]').value);

    const formData = new FormData();
    formData.append('referer', "https://xsijishe.com/home.php?mod=space&do=favorite&view=me");
    formData.append('formhash', doc.querySelector('input[name="formhash"]').value);
    formData.append('deletesubmit', true);
    formData.append('deletesubmitbtn', true);

    fetch(href, { method: 'POST', body: formData })
    return false
}


(function() {
    unsafeWindow.delFav=delFav;

    [...document.querySelectorAll('#favorite_ul>li')].forEach(async e => {
        e.querySelector('a').attributes.onclick.value = "delFav(this.href); this.parentNode?.remove();"

        let href = e.querySelector('a:last-of-type').href
        let doc = await get_page(href)
        let srt = "location2={href:''};location2.assign=function(val){this.href=val};location2.replace=function(val){this.href=val};" + doc.scripts[0].innerHTML.replaceAll('location', 'location2') + "location2;"

        try {
            let res = window.eval(srt)
            let newLink = res?.href || res
            console.log([res, newLink])

            // document.getElementById('test')?.remove();
            // script = document.createElement('script');
            // script.id = 'test';
            // script.textContent = srt;
            // document.body.appendChild(script);
            // console.log(location2);

            let doc2 = await get_page(newLink)
            let imgText = [...doc2.querySelectorAll('img.zoom')].map(e => { e.src = e.attributes.file.value; return e.outerHTML }).join('')
            e.insertAdjacentHTML('beforeend', `<div style="overflow:auto"><div style="display: flex; flex-wrap:no-wrap">${imgText}</div></div>`)
            e.querySelectorAll('img.zoom').forEach(e => { e.style.height = "200px"; e.style.width = "fit-content" })
        } catch (e) {
            console.log(href, e, srt)
        }
    })

})();
