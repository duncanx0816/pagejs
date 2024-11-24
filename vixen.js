// ==UserScript==
// @name         vixen
// @namespace    http://tampermonkey.net/
// @version      2024-11-25
// @description  try to take over the world!
// @author       You
// @updateURL    https://raw.githubusercontent.com/duncanx0816/pagejs/main/vixen.js
// @downloadURL  https://raw.githubusercontent.com/duncanx0816/pagejs/main/vixen.js
// @match        https://www.vixen.com/*
// @match        https://www.blacked.com/*
// @match        https://www.blackedraw.com/*
// @match        https://www.tushy.com/*
// @match        https://www.tushyraw.com/*
// @match        https://www.deeper.com/*
// @match        https://www.slayed.com/*
// @match        https://www.milfy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vixen.com
// @grant        GM_openInTab
// ==/UserScript==

const get_page = async (url) => {
  let res = await fetch(url).then((res) => res.text());
  return new DOMParser().parseFromString(res, "text/html");
};

class Vixen {
  constructor() {
    let script = document.createElement("script");
    script.src = "https://kit.fontawesome.com/0f14166b22.js";
    document.body.appendChild(script);

    this.studio = location.host.split(".")[1];
    this.videos = JSON.parse(localStorage.getItem("videos") || "{}");
    this.info = JSON.parse(
      document.querySelector("script#__NEXT_DATA__").innerHTML
    );
    this.buildId = this.info.buildId;
    if (this.info.page == "/videos/[slug]") {
      this.run_detail();
    }
    if (this.info.page == "/videos") {
      this.run();
    }
  }

  run_detail = async () => {
    let img_url =
      this.info.props.pageProps.video.images.poster.slice(-1)[0].webp.highdpi
        .double;
    img_url = new URL(img_url, location);
    console.log(img_url.href);
    GM_openInTab(img_url.href);
    await this.update();
  };

  run = async () => {
    if (document.querySelector("div.VideosSidebar__Main-sc-11jbuek-1.AJrQs")){
      document.querySelector(
        "div.VideosSidebar__Main-sc-11jbuek-1.AJrQs"
      ).style.display = "none";
    }
    this.changeLink();
    await Promise.all(this.info.props.pageProps.edges.map(this.parseVideo));
    let nVideo = Object.keys(this.videos).length;
    localStorage.setItem("videos", JSON.stringify(this.videos));

    await this.update();

    let blob = new Blob([JSON.stringify(this.info)], {
      type: "application/json",
    });
    let a = document.createElement("a");
    a.download = `${this.studio}.${new Date().getTime()}.${nVideo}.json`;
    a.href = URL.createObjectURL(blob);
    // a.click();

    console.log(`done: ${nVideo}`);
    // confirm(`done: ${nVideo}`)
  };

  changeLink = async () => {
    [
      ...document.querySelectorAll(
        '[data-test-component="VideoThumbnailContainer"]'
      ),
    ].map(async (div) => {
      let a = div.querySelector("a");
      let { status, link } = await fetch(
        "https://www.wdym9816.top:444/api/vixen/video/?" +
          new URLSearchParams({
            title: a.title,
          }).toString()
      ).then((res) => res.json());
      a.href = `potplayer://${link}`;
      if (status != "done") {
        a.href=link;
        a.innerHTML = `<i class="fa-solid fa-magnet" style="font-size: 18px;color: blue;"></i> ${a.innerText}`;
      } else if (link.endsWith('.mkv')){
        a.innerHTML = `<i class="fa-solid fa-video" style="font-size: 18px;color: green;"></i> ${a.innerText}`;
      }else{
        a.innerHTML = `<i class="fa-solid fa-video" style="font-size: 18px;color: blue;"></i> ${a.innerText}`;
      }
      a.onclick = (e) => {
        window.open(e.target.href, "_blank").focus();
        return false;
      };
    });
  };

  parseVideo = async (elm) => {
    let slug = elm.node.slug;
    let doc = await get_page(`/videos/${slug}`);
    let img_url = new URL(
      doc.querySelector("picture>source").srcset.split(" ")[0]
    );
    img_url.pathname = img_url.pathname.split("_")[0] + "_3840x2160.jpeg";

    if (!(slug in this.videos)) {
      setTimeout(() => {
        GM_openInTab(img_url.href);
      }, parseInt(Math.random() * 1000));
    }
    this.videos[slug] = img_url;
  };

  parseVideo2 = async (elm) => {
    let slug = elm
      .querySelector(
        ".VideoThumbnailPreview__VideoThumbnailLink-sc-1l0c3o7-8.cuAzUN"
      )
      .href.split("/")
      .slice(-1)[0];
    let url_detail = `/_next/data/${this.buildId}/videos/${slug}.json?slug=${slug}`;
    let detail = await fetch(url_detail).then((resp) => resp.json());
    let { title, videoId, uuid, releaseDate, modelsSlugged } =
      detail.pageProps.video;
    releaseDate = releaseDate.split("T")[0];

    let img_url =
      detail.pageProps.video.images.poster.slice(-1)[0].webp.highdpi.double;
    img_url = new URL(img_url, location);
    let poster = img_url.pathname.split("/").slice(-1)[0];

    if (!(uuid in this.videos)) {
      setTimeout(() => {
        GM_openInTab(img_url.href);
      }, parseInt(Math.random() * 1000));
    }
    this.videos[uuid] = {
      title,
      slug,
      videoId,
      releaseDate,
      poster,
      modelsSlugged,
    };
  };

  update = () => {
    console.log(this.info);
    let url = "https://www.wdym9816.top:444/api/update/vixen/";
    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.info),
    }).then((res) => {
      if (res.ok) {
        this.info = [];
      }
    });
  };
}

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

(async function () {
  "use strict";
  let el = document.querySelector(
    ".AgeVerificationModal__EnterButton-sc-578udq-11"
  );
  if (el) {
    el.click();
  }
  await until(`document.querySelector('script#__NEXT_DATA__')`);
  console.log(
    JSON.parse(document.querySelector("script#__NEXT_DATA__").innerHTML).buildId
  );
  new Vixen();

  if (location.pathname == "/videos") {
    let observer = new MutationObserver(async () => {
      console.log(`changed: ${new Date().getTime()}`);
      console.log(
        JSON.parse(document.querySelector("script#__NEXT_DATA__").innerHTML)
          .buildId
      );
      await until(
        `document.querySelector('div.SharedPagination__PaginationContainer-sc-1t976vd-0.ferMtn')`
      );
      new Vixen();
    });
    observer.observe(
      document.querySelector(
        "div.SharedPagination__PaginationContainer-sc-1t976vd-0.ferMtn"
      ),
      {
        childList: true,
      }
    );
  }
})();
