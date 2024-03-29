// ==UserScript==
// @name         ClinicalTrials
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add and fix clinical trial report links.
// @author       You
// @match        https://clinicaltrials.gov/ct2/show/*
// @match        https://clin.larvol.com/trial/*
// @match        https://www.scmp.com/*
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clinicaltrials.gov
// @grant        none
// ==/UserScript==


function clinical_trials(){
    let el = jQuery(
        "#main-content > div.tr-indent2 > div.w3-row > div.w3-col.m5 > table > tbody > tr:nth-child(1) > td"
    )[0];
    let trial_id = el.innerHTML.split("ClinicalTrials.gov Identifier: ")[1];
    let link = `https://clin.larvol.com/trial/${trial_id}`;
    let el_ = jQuery(
      `<td>ClinicalTrials.gov Identifier: <a target="_blank" href="https://clin.larvol.com/trial/${trial_id}">${trial_id}</a></td>`
    )[0];
    jQuery(el).replaceWith(el_);
}

async function clin_larvol(){
    let recs = {};
    let trl_id = location.href.match(/NCT\d{8}/)[0];
    let url = `https://clinapi.larvol.com/api/trials/detail?source_id=${trl_id}`;
    let resp = await fetch(url).then((resp) => resp.json());
    console.log(resp.data.clindata.length);
    for (let rec of resp.data.clindata) {
      recs[rec.news_title] = rec.news_source_url;
    }

    await until(`document.querySelector("h5.news-source")`);

    let count = document.querySelectorAll("h5.news-source").length || 0;
    if (count) {
      updatePage(recs);
    }
    setInterval(() => {
      if (document.querySelectorAll("h5.news-source").length > count) {
        count = document.querySelectorAll("h5.news-source").length;
        console.log(count);
        updatePage(recs);
      }
    }, 3000);
}

async function until(expr, ntime = 20, delta = 1000) {
    return new Promise((resolve, reject) => {
        let timer = setInterval(() => {
            if (eval(expr) || --ntime < 0) {
                clearInterval(timer);
                resolve(eval(expr));
            }
        }, delta);
    });
}

function updatePage(recs){
    for (let h5 of document.querySelectorAll("h5.news-source")) {
      let spans = h5.querySelectorAll("span");
      let span = spans[spans.length - 1];
      let title = span.innerHTML;
      let link = recs[title];
      span.innerHTML = `<a href="${link}">${title}</a>`;
    }

    for (let img of document.querySelectorAll("img")) {
      if (img.src.match(/resize_/)) {
        let src = img.src.replace("resize_", "");
        img.parentElement.innerHTML = `<a target="_blank" href="${src}">${img.outerHTML}</a>`;
      }
    }

    for (let el of document.querySelectorAll(".block-7.ng-star-inserted")) {
        el.removeAllListeners();
    }
}

function scmp(){
    setInterval(() => {
        document.querySelectorAll('.paywalled-content>div>div').forEach(e=>e.remove())
        document.querySelectorAll('.main__header-video').forEach(e=>e.remove())
        document.querySelectorAll('.paywalled-content>div>h3').forEach(e=>e.remove())
        document.querySelectorAll('.main-images').forEach(e=>e.remove())
        document.querySelectorAll('.generic-article__body.article-details-type--h3.content--h3').forEach(e=>e.remove())
        document.querySelectorAll('.generic-article__body.article-details-type--newsletter.content--newsletter').forEach(e=>e.remove())
        document.querySelectorAll('.generic-article__body.article-details-type--div.content--div.methode-html-wrapper.oembed-wrapper').forEach(e=>e.remove())
        document.querySelectorAll('.generic-article__body.article-details-type--div.content--div.image-inline-container').forEach(e=>e.remove())
        document.querySelectorAll('.opinion-article__body.article-details-type--div.content--div.methode-html-wrapper.oembed-wrapper').forEach(e=>e.remove())
        document.querySelectorAll('.opinion-article__body.article-details-type--newsletter.content--newsletter').forEach(e=>e.remove())
        document.querySelectorAll('[data-qa*=VideoContainer]').forEach(e=>e.remove())
        document.querySelectorAll('[data-qa*=AdSlot-Container]').forEach(e=>e.remove())
    }, 1000);
}

function weibo(){
    setInterval(() => {
      if (document.querySelectorAll(".woo-modal-wrap").length > 1) {
        document.querySelector(".woo-modal-wrap .woo-font").click();
      }
    }, 100);
}

(function () {
    if(location.host=="clin.larvol.com"){
        clin_larvol();
    }else if (location.host == "clinicaltrials.gov") {
      clinical_trials();
    }else if (location.host == "www.scmp.com") {
      scmp();
    }else if (location.host == "weibo.com") {
      weibo();
    }
})();
