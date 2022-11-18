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

        this.infos = JSON.parse(document.querySelector('script#__NEXT_DATA__').innerHTML)
        this.buildId = this.infos.buildId

        this.run()
    }

    run = async () => {
        document.querySelector('div.VideosSidebar__Main-sc-11jbuek-1.AJrQs').style.display='none';
        await Promise.all(this.infos.props.pageProps.edges.map(this.parseVideo))
        let nVideo=Object.keys(this.videos).length
        localStorage.setItem('videos', JSON.stringify(this.videos))
        
        let blob = new Blob([JSON.stringify(this.videos)], {
            type: "application/json"
        });
        let a = document.createElement('a')
        a.download = `${this.studio}.${(new Date()).getTime()}.${nVideo}.json`
        a.href = URL.createObjectURL(blob)
        a.click()

        alert(`done: ${nVideo}`)
        console.log(`done: ${nVideo}`)
    }

    parseVideo = async (video) => {
        let {
            title,
            slug,
            videoId,
            releaseDate
        } = video.node
        releaseDate = releaseDate.split('T')[0]
        let uuid=`${this.studio}.${releaseDate}`
        let url_detail = `/_next/data/${this.buildId}/videos/${slug}.json?slug=${slug}`
        let detail = await fetch(url_detail).then(resp => resp.json())
        let img_url = detail.pageProps.video.images.poster.slice(-1)[0].webp.highdpi.double
        img_url = new URL(img_url, location)
        let poster = img_url.pathname.split('/').slice(-1)[0]

        if (!(uuid in this.videos)) GM_openInTab(img_url.href) 
        this.videos[uuid] = {
            title,
            slug,
            videoId,
            releaseDate,
            poster
        }
    }
}


(function () {
    'use strict';

    new Vixen()
    let observer = new MutationObserver(() => {
        new Vixen()
    });
    observer.observe(
        document.querySelector('div.SharedPagination__PaginationContainer-sc-1t976vd-0.ferMtn'), {
            childList: true
        })
})();
