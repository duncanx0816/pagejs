// ==UserScript==
// @name         vixen
// @namespace    http://tampermonkey.net/
// @version      2025-09-06
// @description  try to take over the world!
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vixen.com
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
// @run-at       document-start
// @grant        none
// ==/UserScript==

const get_page = async (url) => {
  let res = await fetch(url).then((res) => res.text());
  return new DOMParser().parseFromString(res, "text/html");
};

const until = async (expr, ntime = 20, delta = 3000) => {
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      if (eval(expr) || --ntime < 0) {
        clearInterval(timer);
        resolve(eval(expr));
      }
    }, delta);
  });
};

const main = async () => {
  until(`document.body`).then(() => {
    let script = document.createElement("script");
    script.src = "https://kit.fontawesome.com/0f14166b22.js";
    document.body.appendChild(script);
  });

  await until(`document.querySelector('script#__NEXT_DATA__')`);

  document
    .querySelector('[data-test-component="AgeVerificationOverlay"]')
    ?.remove();

  document
    .querySelector(".AgeVerificationModal__EnterButton-sc-578udq-11")
    ?.click();

  document.querySelector('[data-test-component="Sidebar"]')?.remove();

  let info = JSON.parse(
    document.querySelector("script#__NEXT_DATA__").innerHTML
  );

  let videos = [];
  if (info.page == "/videos/[slug]") {
    let { id, title, slug, releaseDate, modelsSlugged } =
      info.props.pageProps.video;
    let cover =
      info.props.pageProps.video.images.poster.at(-1).webp.highdpi.double;
    cover = cover.split("_")[0] + "_3840x2160.jpeg";
    let site = location.host.split(".")[1];
    videos = [
      { id, title, slug, site, releaseDate, cover, models: modelsSlugged },
    ];
  } else {
    let props = await fetch(
      `${location.origin}/_next/data/${info.buildId}/videos.json${location.search}`
    ).then((res) => res.json());
    videos = props.pageProps.edges.map((edge) => {
      let { id, title, slug, site, releaseDate, modelsSlugged } = edge.node;
      let cover = edge.node.images.listing.at(-1).webp.highdpi.double;
      cover = cover.split("_")[0] + "_3840x2160.jpeg";
      return {
        id,
        title,
        slug,
        site,
        releaseDate,
        cover,
        models: modelsSlugged,
      };
    });
  }

  let videoStatus = await fetch("https://www.wdym9816.top/api/vixen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(videos),
  }).then((res) => res.json());

  document
    .querySelectorAll('[data-test-component="VideoThumbnailContainer"]')
    .forEach(async (div) => {
      let a = div.querySelector("a");
      let slug = a.href.split("/").at(-1);
      let { status, link } = videoStatus[slug];
      a.href = `potplayer://${link}`;
      if (status != "found") {
        a.href = link;
        a.innerHTML = `<i class="fa-solid fa-magnet" style="font-size: 18px;color: blue;"></i> ${a.innerText}`;
      } else if (link.endsWith(".mkv")) {
        a.innerHTML = `<i class="fa-solid fa-video" style="font-size: 18px;color: green;"></i> ${a.innerText}`;
      } else {
        a.innerHTML = `<i class="fa-solid fa-video" style="font-size: 18px;color: blue;"></i> ${a.innerText}`;
      }
      a.onclick = (e) => {
        window.open(e.target.href, "_blank");
        return false;
      };
    });
};

(function () {
  main().then(() => {
    let observer = new MutationObserver(async () => {
      console.log(`changed: ${new Date().getTime()}`);
      main();
    });
    if (document.querySelector('[data-test-component="Pagination"]')) {
      observer.observe(
        document.querySelector('[data-test-component="Pagination"]'),
        { childList: true }
      );
    }
  });
})();
