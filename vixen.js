// ==UserScript==
// @name         vixen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.vixen.com/*
// @match        https://www.blacked.com/*
// @match        https://www.blackedraw.com/*
// @match        https://www.tushy.com/*
// @match        https://www.tushyraw.com/*
// @match        https://www.deeper.com/*
// @match        https://www.slayed.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vixen.com
// @grant        GM_openInTab
// ==/UserScript==

class Vixen {
    constructor() {
        this.studio = location.host.split('.')[1]
        this.videos = JSON.parse(localStorage.getItem('videos') || '{}')
        this.info=JSON.parse(document.querySelector('script#__NEXT_DATA__').innerHTML)
        this.buildId = this.info.buildId
        this.run()
    }

  update = () => {
    console.log(this.info.length);
    let url = "https://www.wdym9816.top:444/api/update/vixen/";
    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.info),
    }).then((res) => {if(res.ok){this.info=[]}});
  };

    run = async ()=>{
        if(document.querySelector('div.VideosSidebar__Main-sc-11jbuek-1.AJrQs')) document.querySelector('div.VideosSidebar__Main-sc-11jbuek-1.AJrQs').style.display='none';
        let divs=document.querySelectorAll('.Grid__GridContainer-f0cb34-0.bUAzPt.VideoList__VideoListContainer-sc-1u75cgc-0.eliAOo.videos__StyledVideoList-sc-1u2b7uh-3.dTsEcV>div.Grid__Item-f0cb34-1.dSIsBc')
        await Promise.all(Array.from(divs).map(this.parseVideo))
        let nVideo=Object.keys(this.videos).length
        localStorage.setItem('videos', JSON.stringify(this.videos))

        await this.update();

        let blob = new Blob([JSON.stringify(this.info)], {
            type: "application/json"
        });
        let a = document.createElement('a')
        a.download = `${this.studio}.${(new Date()).getTime()}.${nVideo}.json`
        a.href = URL.createObjectURL(blob)
        a.click()
        
        console.log(`done: ${nVideo}`)
        // confirm(`done: ${nVideo}`)
    }

    parseVideo=async (elm)=>{
        let slug=elm.querySelector('.VideoThumbnailPreview__VideoThumbnailLink-sc-1l0c3o7-8.cuAzUN').href.split('/').slice(-1)[0]
        let url_detail = `/_next/data/${this.buildId}/videos/${slug}.json?slug=${slug}`
        let detail = await fetch(url_detail).then(resp => resp.json())
        let {title,videoId,uuid,releaseDate,modelsSlugged}=detail.pageProps.video
        releaseDate = releaseDate.split('T')[0]

        let img_url = detail.pageProps.video.images.poster.slice(-1)[0].webp.highdpi.double
        img_url = new URL(img_url, location)
        let poster = img_url.pathname.split('/').slice(-1)[0]

        if (!(uuid in this.videos)){
            setTimeout(() => {
                GM_openInTab(img_url.href)
            }, parseInt(Math.random() * 1000));
        }
        this.videos[uuid] = { title, slug, videoId, releaseDate, poster, modelsSlugged }
    }

}

async function until(expr,ntime=20,delta=3000){
    return new Promise((resolve, reject)=>{
        let timer=setInterval(()=>{
            if(eval(expr) || --ntime<0){
                clearInterval(timer)
                resolve(eval(expr))
            }
        }, delta)
    })
}

(async function () {
    'use strict';
    await until(`document.querySelector('div.SharedPagination__PaginationContainer-sc-1t976vd-0.ferMtn')`);
    console.log(JSON.parse(document.querySelector('script#__NEXT_DATA__').innerHTML).buildId)
    new Vixen()

    let observer = new MutationObserver(async () => {
        console.log(`changed: ${(new Date()).getTime()}`)
        console.log(JSON.parse(document.querySelector('script#__NEXT_DATA__').innerHTML).buildId)
        await until(`document.querySelector('div.SharedPagination__PaginationContainer-sc-1t976vd-0.ferMtn')`);
        new Vixen()
    });
    observer.observe(
        document.querySelector('div.SharedPagination__PaginationContainer-sc-1t976vd-0.ferMtn'), {
            childList: true
        })

})();
