// ==UserScript==
// @name         SJ0003
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://edcspm.bioknow.net/uiframe.firstpage.do?prjid=edc_sj0003*
// @match        https://edcspm.bioknow.net/dbplug_reportformedc.rfframe.do?prjid=edc_sj0003&tableid=subject*
// @match        https://edcspm.bioknow.net/tableapp.searchlist.do?name=*
// @match        https://edcspm.bioknow.net/tableapp.edit.do?prjid=edc_sj0003*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bioknow.net
// @grant        GM_openInTab
// @grant        window.close
// ==/UserScript==

async function until(expr, ntime = 20, delta = 5000) {
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      console.log(new Date().getTime());
      if (eval(expr) || --ntime < 0) {
        clearInterval(timer);
        resolve(eval(expr));
      }
    }, delta);
  });
}

const parse_vstInfo = async () => {
  await until(
    `document.getElementById('frm_right').contentWindow.document.querySelector('#field_subjid')`
  );
  console.log("done");
  let doc = document.getElementById("frm_right").contentWindow.document;
  let subID = doc.querySelector("#field_subjid").value.trim();
  let vstID = doc.querySelector("#field_visit option:checked").text.trim();
  let vstDate = doc.querySelector("#field_visdat").value.trim().split(" ")[0];
  console.log(subID);

  let blob = new Blob([JSON.stringify({ subID, vstID, vstDate })], {
    type: "application/json",
  });
  let a = document.createElement("a");
  a.download = `${subID}.${new Date().getTime()}.json`;
  a.href = URL.createObjectURL(blob);
  a.click();

  let doc_=document.getElementById("frm_left_edc").contentWindow.document;
  let link=[...doc_.querySelectorAll('.menu_content_menu_name>a')].find(el => el.textContent === '肿瘤诊断及TNM分期').href;
  GM_openInTab(link);
  window.close();
};

const parse_firstpage = async () => {
  await until(
    `document.getElementById('frm_content').contentWindow.document.querySelector('#tid_edc_check')`
  );
  let trs = document
    .getElementById("frm_content")
    .contentWindow.document.querySelectorAll('tr[class*="tr_record"]');
  console.log(trs.length);
  for (let tr of trs) {
    setTimeout(() => {
      tr.querySelectorAll('td[title*="0"]').forEach((td) => {
        let [, id1, , id2] = td.getAttribute("onclick").split("'");
        if (id2) {
          let url_ = `https://edcspm.bioknow.net/dbplug_reportformedc.rfframe.do?prjid=edc_sj0003&tableid=subject&id=${id1}&uuid=${id2}`;
          GM_openInTab(url_);
        }
      });
    }, 50000);
  }
};

const parse_firstPage_list = async () => {
  console.log("debug");
  await until(`document.getElementById('tid_edc_check')`);
  let doc = document;
  let headers = [...doc.querySelectorAll("#tid_edc_check>thead th")].map((th) =>
    th.textContent.trim()
  );
  let contents = [...doc.querySelectorAll('tr[class*="tr_record"]')].map((tr) =>
    [...tr.querySelectorAll("td")].map((td) => {
      let tt = td.getAttribute("onclick");
      if (tt) {
        let [, id1, , id2] = tt.split("'");
        return `https://edcspm.bioknow.net/dbplug_reportformedc.rfframe.do?prjid=edc_sj0003&tableid=subject&id=${id1}&uuid=${id2}`;
      } else {
        return td.textContent.trim();
      }
    })
  );
  console.log(contents.length);

  let blob = new Blob([JSON.stringify({ headers, contents })], {
    type: "application/json",
  });
  let a = document.createElement("a");
  a.download = `fistpage.${new Date().getTime()}.json`;
  a.href = URL.createObjectURL(blob);
  a.click();
  window.close();
};


const parse_tumorInfo = async () => {
  await until(
    `document.querySelector('#field_subjid')`
  );
  console.log("done");
  let doc = document
  let subID = doc.querySelector("#field_subjid").value;
  let tumor = doc.querySelector("#field_tumdot1").value;
  let el_sdhb=document.querySelector('#showdiv_tumsdhb input:checked')
  let sdhb=el_sdhb?el_sdhb.nextElementSibling.innerHTML:'';

  let blob = new Blob([JSON.stringify({ subID, tumor, sdhb })], {
    type: "application/json",
  });
  let a = document.createElement("a");
  a.download = `tumor.${new Date().getTime()}.json`;
  a.href = URL.createObjectURL(blob);
  a.click();
  window.close();
};

(function () {
  "use strict";
  if (location.pathname == "/dbplug_reportformedc.rfframe.do") {
    parse_vstInfo();
  } else if (location.pathname == "/tableapp.edit.do") {
    parse_tumorInfo();
  } else if (location.pathname == "/tableapp.searchlist.do") {
    parse_firstPage_list();
  } else if (location.pathname == "/uiframe.firstpage.do") {
    [1, 2, 3, 4, 5].forEach((idx) => {
      let url_ = `https://edcspm.bioknow.net/tableapp.searchlist.do?name=reportform_checkview&tableid=subject&where=&orderby=subjid%20desc&pagesize=20&pagesize_setup=&param=&currentpage=${idx}`;
      // GM_openInTab(url_);
    });
  }
})();
