// ==UserScript==
// @name         xsijishe
// @namespace    http://tampermonkey.net/
// @version      20250823
// @description  try to take over the world!
// @author       You
// @match        https://xsijishe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xsijishe.com
// ==/UserScript==

const get_page = async (url) => {
  let res = await fetch(url).then((res) => res.text());
  return new DOMParser().parseFromString(res, "text/html");
};

const get_formhash = async (href) => {
  let doc = await get_page(href);
  return doc.querySelector('input[name="formhash"]').value;
};

const addFav = async (href, referer = location.href) => {
  event?.preventDefault();
  let formhash = await get_formhash(href);

  const formData = new FormData();
  formData.append("referer", referer);
  formData.append("formhash", formhash);
  formData.append("handlekey", "k_favorite");
  formData.append("favoritesubmit", true);

  fetch(href, { method: "POST", body: formData });
  return false;
};

const delFav = async (href, referer = location.href) => {
  event?.preventDefault();
  let formhash = await get_formhash(href);

  const formData = new FormData();
  formData.append("referer", referer);
  formData.append("formhash", formhash);
  formData.append("deletesubmit", true);
  formData.append("deletesubmitbtn", true);

  fetch(href, { method: "POST", body: formData });
  return false;
};

const getRealLink = async (href) => {
  //return href;
  let doc = await get_page(href);
  let srt =
    "location2={href:''};location2.assign=function(val){this.href=val};location2.replace=function(val){this.href=val};" +
    doc.scripts[0].innerHTML.replaceAll("location", "location2") +
    "location2;";
  try {
    let res = window.eval(srt);
    let newLink = res?.href || res;
    return newLink;
  } catch (e) {
    console.log(href, e, srt);
    return "";
  }
};

const imgCenter = (cssSeletor) => {
  document.querySelectorAll(cssSeletor).forEach((div) => {
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.querySelectorAll("img").forEach((img) => {
      img.style.objectFit = "cover";
    });
  });
};

const getPageInfo = async (url) => {
  let key = location.host.split(".")[0];
  let res = await fetch(
    `https://www.wdym9816.top/track/${key}/page?url=${encodeURIComponent(url)}`
  );
  if (res.ok) {
    return res.json();
  } else {
    console.error("Failed to fetch page info:", res.statusText);
    return null;
  }
};

const postPageInfo = async (url, imgs, realLink = null) => {
  let key = location.host.split(".")[0];
  return fetch(`https://www.wdym9816.top/track/${key}/page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: url,
      realLink: realLink,
      imgs: imgs.join(";"),
    }),
  });
};

const getReadedLink = async () => {
  let key = location.host.split(".")[0];
  return fetch(`https://www.wdym9816.top/track/${key}`).then((res) => {
    return res?.json();
  });
};

const postReadedLink = async (urls) => {
  let key = location.host.split(".")[0];
  return fetch(`https://www.wdym9816.top/track/${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ links: urls }),
  });
};

(function () {
  getReadedLink().then((readedURLs) => {
    readedURLs = new Set(readedURLs || []);
    let urls = [...document.querySelectorAll(".nex_forumtit_top>a.s.xst")].map(
      (a) => {
        let href = a.href;
        if (readedURLs.has(href)) {
          a.style.color = "#999";
        }
        return href;
      }
    );
    if (urls.length) {
      postReadedLink(urls);
    }
  });

  document.querySelector(".nex_Product_unextend")?.remove();
  document.querySelector(".ct2>.sd")?.remove();
  document.querySelector(".ct2>.mn>.drag")?.remove();
  document.querySelector(".nex_junctionport")?.remove();
  document.querySelector("#hornbox")?.remove();
  document
    .querySelectorAll(".nex_forum_lists:has(a.showhide.y)")
    .forEach((e) => e.remove());
  document
    .querySelectorAll(".nex_top_bg")
    .forEach((e) => (e.style.height = "50px"));
  document
    .querySelectorAll(".ct2>.mn")
    .forEach((e) => e.style.setProperty("width", "1150px", "important"));
  document.querySelectorAll(".nex_forumlist_pics>ul").forEach((ul) => {
    let url = ul.parentElement.parentElement.querySelector("a").href;
    ul.parentElement.style.width = "100%";
    ul.style.display = "flex";
    ul.style.overflow = "auto";
    ul.style.width = "100%";
    ul.querySelectorAll("li").forEach((li) => {
      li.style.display = "block";
      li.style.overflow = "unset";
      li.style.height = "300px";
      li.style.width = "400px";
    });
    let imgs = [...ul.querySelectorAll(".nex_thread_pics")].map((div) => {
      div.style.height = "300px";
      div.style.width = "400px";
      div.style.display = "flex";
      div.style.alignItems = "center";
      let src = div.querySelector("a").style.background.split('"')[1];
      div.innerHTML = `<img src="${src}" class="zoom" onclick="zoom(this, this.src, 0, 0, 0)" width="400" style=" object-fit: cover; height: 300px; " initialized="true">`;
      return src;
    });
    postPageInfo(url, imgs);
  });

  document.querySelectorAll("#k_favorite").forEach((a) => {
    a.onclick = () => addFav(a.href).then(() => a.remove());
  });

  [...document.querySelectorAll("#favorite_ul>li")].forEach(async (li) => {
    let a = li.querySelector("a");
    a.onclick = () => {
      delFav(a.href).then(() => li.remove());
    };

    let href = li.querySelector("a:last-of-type").href;
    let imgs = (await getPageInfo(href)).imgs;
    if (imgs.length > 0) {
      let imgText = imgs
        .split(";")
        .map(
          (src) =>
            `<img src="${src}" class="zoom" onclick="zoom(this, this.src, 0, 0, 0)" style="height:300px;width:fit-content">`
        )
        .join("");
      li.insertAdjacentHTML(
        "beforeend",
        `<div style="overflow:auto"><div style="display: flex; flex-wrap:no-wrap">${imgText}</div></div>`
      );
      li.querySelectorAll("img.zoom").forEach((e) => {
        e.style.height = "300px";
        e.style.width = "fit-content";
      });
    } else {
      let realLink = await getRealLink(href);
      if (realLink) {
        let doc2 = await get_page(realLink);
        let imgs = [...doc2.querySelectorAll("img.zoom")].map(
          (e) => e.attributes.file?.value
        );
        postPageInfo(href, imgs, realLink);
        let imgText = [...doc2.querySelectorAll("img.zoom")]
          .map((e) => {
            e.src = e.attributes.file?.value;
            return e.outerHTML;
          })
          .join("");
        li.insertAdjacentHTML(
          "beforeend",
          `<div style="overflow:auto"><div style="display: flex; flex-wrap:no-wrap">${imgText}</div></div>`
        );
        li.querySelectorAll("img.zoom").forEach((e) => {
          e.style.height = "300px";
          e.style.width = "fit-content";
        });
      }
    }
  });

  let html = `<a style=" margin: 0 25px; background: #00B295"><span class="nex_reply">收藏</span></a>  `;
  document.querySelectorAll(".z.nex_list_infos").forEach((div) => {
    div.insertAdjacentHTML("beforeend", html);
    div.querySelector("a").onclick = async (event) => {
      let href = div.parentElement.parentElement.querySelector("a").href;
      let realLink = await getRealLink(href);
      if (realLink) {
        let doc = await get_page(realLink);
        let url = doc.querySelector("#k_favorite")?.href;
        addFav(url, realLink).then(() => {
          div.querySelector("a").remove();
        });
      }
      event.preventDefault();
      return false;
    };
  });

  [
    ".nex_acgcommon_img",
    ".nex_newrecos_img",
    ".nex_ctbpic",
    ".nexproul>li",
  ].forEach(imgCenter);
})();
