// ==UserScript==
// @name         av2048
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://data.3lv2g.com/2048/*
// @match        http*://dp227.xyz/pw/*
// @match        http*://down.dataaps.com/list.php?name=*
// @match        http*://ww1.k00ppc.com/*
// @match        http*://juejin.cn/*
// @match        http*://gw3.torlook.info/*
// @match        http*://rargb.to/*
// @match        http*://1337x.to/*
// @match        http://146.19.24.47:8000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc1y.xyz
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/duncanx0816/pagejs/main/av2048.js
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// ==/UserScript==

const jq = $;
unsafeWindow.jq = unsafeWindow.jq ? unsafeWindow.jq : jq;

const get_page = async (url) => {
  let res = await fetch(url).then((res) => res.text());
  return new DOMParser().parseFromString(res, "text/html");
};

const yihuagong = () => {
  unsafeWindow.fn_click = () => {
    event.preventDefault();
    let a = document.createElement("a");
    a.download = `YHG.${new Date().getTime()}${location.search}.txt`;
    a.href = URL.createObjectURL(
      new Blob([event.target.href], { type: "text/html" })
    );
    a.click();
    window.close();
    return false;
  };
  [...document.querySelectorAll(".sbar a")]
    .filter((a) => a.innerText == "[磁力链接]")
    .forEach((a) => (a.onclick = fn_click));
};

const fn_1337x = () => {
  unsafeWindow.fn_click = () => {
    event.preventDefault();
    let a = document.createElement("a");
    a.download = `1337x.${new Date().getTime()}${location.search}.txt`;
    a.href = URL.createObjectURL(
      new Blob([event.target.dataset.link], { type: "text/html" })
    );
    a.click();
    window.close();
    return false;
  };
  [...document.querySelectorAll('td.coll-1.name a[href*="/torrent"]')].forEach(
    async (a) => {
      let res = await fetch(a.href).then((res) => res.text());
      let doc = new DOMParser().parseFromString(res, "text/html");
      a.dataset.link = doc.querySelector(".torrent-detail-page ul a").href;
      a.onclick = fn_click;
    }
  );
};

const rargb_to = () => {
  unsafeWindow.fn_click = () => {
    event.preventDefault();
    let a = document.createElement("a");
    a.download = `rargb.${new Date().getTime()}${location.search}.txt`;
    a.href = URL.createObjectURL(
      new Blob([event.target.dataset.link], { type: "text/html" })
    );
    a.click();
    window.close();
    return false;
  };
  [
    ...document.querySelectorAll(".lista2t tr.lista2 td.lista:nth-child(2)>a"),
  ].forEach(async (a) => {
    let res = await fetch(url).then((res) => res.text());
    let doc = new DOMParser().parseFromString(res, "text/html");
    let aa = [...doc.querySelectorAll(".lista>a")].filter(
      (a_) => a_.href && a_.href.startsWith("magnet:")
    );
    a.dataset.link = aa.length ? aa[0].href : "";
    a.onclick = fn_click;
  });
};

const torlook = () => {
  let aa = jq("span.magnet > a");
  aa = [...aa];
  aa.forEach((a) => {
    let url = `${location.origin}/${a.dataset.src}?fancybox=true`;
    let options = {
      referrer: location.href,
      credentials: "include",
      headers: {},
    };
    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        jq(a).replaceWith(
          jq("<a/>", {
            class: "dl magneto ut-download-url",
            href: `magnet:${data.split("magnet:")[1].split("'")[0]}`,
          })
        );
        console.log(`magnet:${data.split("magnet:")[1].split("'")[0]}`);
      });
  });
};

class AV2048 {
  constructor() {
    this.info = [];
    this.blockAD();
    this.run();
  }

  run = async () => {
    let url_index = "https://data.3lv2g.com/2048/";
    if (location.href == url_index && document.querySelector("#cate_1")) {
      let a = [...Array(10).keys()].map(async (idx) =>
        this.parse(`${url_index}thread.php?fid-13-page-${idx + 1}.html`)
      );
      let b = [...Array(10).keys()].map(async (idx) =>
        this.parse(`${url_index}thread.php?fid-3-page-${idx + 1}.html`)
      );
      let c = [...Array(10).keys()].map(async (idx) =>
        this.parse(`${url_index}thread.php?fid-4-page-${idx + 1}.html`)
      );
      let d = [...Array(10).keys()].map(async (idx) =>
        this.parse(`${url_index}thread.php?fid-16-page-${idx + 1}.html`)
      );
      let e = [...Array(10).keys()].map(async (idx) =>
        this.parse(`${url_index}thread.php?fid-18-page-${idx + 1}.html`)
      );
      Promise.all([...a, ...b, ...c, ...d, ...e]).then(() => {
        alert("done");
        window.close();
      });
    }
  };

  parse = async (url) => {
    let doc = await get_page(url);
    let avs = [...doc.querySelectorAll("#ajaxtable td.tal a.subject")]
      .map((a) => {
        let link = a.href;
        let flag = new URL(a.href).pathname.startsWith("/2048/state");
        let title = a.textContent.trim();
        let pub_date = a.parentElement.nextElementSibling
          .querySelector("div.f10.gray")
          .textContent.trim();
        return { title, pub_date, link, flag };
      })
      .filter((i) => i.flag);

    let url_ = "https://www.wdym9816.top:444/api/update/av2048/";
    return fetch(url_, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(avs),
    });
  };

  blockAD = () => {
    unsafeWindow.setpos = () => {};
    jq("div.tac").remove();
    jq(".tr3[align='middle']").remove();
    jq(".apd>a").remove();
    jq("#td_tpc font").remove();
    jq(".tr1.r_one").remove();
    jq("#td_3733").parent().remove();

    let ntime = 100;
    let timer = setInterval(() => {
      --ntime;
      if (ntime < 0) {
        clearInterval(timer);
      }
      jq("#td_3733").parent().remove();
    }, 100);

    let a = jq('#read_tpc > a[href*="?name="]')[0];

    if (a && a.href.match(/\?name=(\w{32})/)) {
      let hash = a.href.match(/\?name=(\w{32})/)[1];
      let link = `${new URL(a.href).origin}/down.php/${hash}.torrent`;
      let a_ = jq("<a/>", { href: link, text: link })[0];
      jq(a).replaceWith(a_);

      let h = jq("#subject_tpc")[0];
      let h_ = jq("<a/>", { href: link })[0];
      h_.innerHTML = h.outerHTML;
      jq(h).replaceWith(h_);
    }
  };
}

const juejin = () => {
  let flag = true;
  let ntime = 100;
  let timer = setInterval(() => {
    --ntime;
    if (ntime < 0) {
      clearInterval(timer);
    }
    jq(".wrap.category-course-recommend").remove();
    jq(".sidebar-block.author-block.pure").remove();
    jq(".recommend-box").remove();
    jq(".article-end").remove();
    jq(".sidebar-bd-entry").remove();
    jq(".sidebar-block.app-download-sidebar-block.shadow").remove();
    jq(".sidebar-block.shadow").remove();
    jq(".main-nav-list").remove();
    jq(".sidebar-block.sticky-block").remove();
    jq(".sidebar-block.banner-block").remove();
    jq("div.guide-collect-popover").hide();
    jq("div.author-info-block").next("img").hide();
    jq("#comment-box > div.comment-list-wrapper").hide();
    jq("#comment-box > div.container.hot-list").hide();

    let btn_old = jq("button.btn.meiqia-btn");
    if (flag && btn_old.length) {
      let btn_new = btn_old.clone();
      btn_old.replaceWith(btn_new); // remove all listeners on btn_old
      btn_new.click((e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        jq("#comment-box > div.comment-list-wrapper").toggle();
        jq("#comment-box > div.container.hot-list").toggle();
      });
      flag = false;
      console.log("done");
    }
  }, 100);
};

(function () {
  "use strict";
  console.log("av2048");

  if (location.host == "juejin.cn") {
    juejin();
  } else if (location.host == "gw3.torlook.info") {
    torlook();
  } else if (location.host == "rargb.to") {
    rargb_to();
  } else if (location.host == "146.19.24.47:8000") {
    yihuagong();
  } else if (location.host == "1337x.to") {
    fn_1337x();
  } else {
    new AV2048();
  }
})();
