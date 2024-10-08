// ==UserScript==
// @name         EDC-CU01
// @namespace    http://tampermonkey.net/
// @version      20240725
// @description  try to take over the world!
// @author       You
// @match        https://ascentage.mdsol.com/*
// @match        https://ascentage-klserv.mdsol.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mdsol.com
// @grant        GM_openInTab
// @grant        window.close
// @require2      file://C:\Users\lckfb-xdk\Desktop\edc.js
// ==/UserScript==

const get_page = async (url) => {
    let res = await fetch(url).then((res) => res.text());
    return new DOMParser().parseFromString(res, "text/html");
};

const get_sub_page = async (doc, target) => {
    let formdata = new FormData();
    formdata.append('__EVENTTARGET', target)
    formdata.append('__EVENTARGUMENT', '')
    formdata.append('__VIEWSTATE', doc.querySelector('#__VIEWSTATE').value)
    formdata.append('__VIEWSTATEGENERATOR', doc.querySelector('#__VIEWSTATEGENERATOR').value)
    formdata.append('_ctl0:Content:TsBox:CBoxC:_ctl1', 1)
    formdata.append('_ctl0:Content:TsBox:CBoxC:SubjectTaskSummary:cBox0:TSCAjaxBox0:_ctl0', 0)
    formdata.append('_ctl0:Content:TsBox:CBoxC:SubjectTaskSummary:cBox0:IsCollapsedInput', 0)
    formdata.append('_ctl0:Content:TsBox:IsCollapsedInput', 1)

    let doc_ = await fetch(location.href, {
            method: "POST",
            body: formdata
        })
        .then((res) => res.text())
        .then((res) => new DOMParser().parseFromString(res, "text/html"));
    return doc_
}


class Subject {
  constructor(doc) {
    this.fstDrug;
    this.eotInfo = {};
    this.vstInfo = [];
    this.pdInfo = {};
    this.molecular = {};
    this.cytogenetic = {};
    this.mutation = {};
    this.therapies = {};
    this.diagnosis = {};
    this.randomization = {};

    this.doc = doc;
    this.subID = this.doc
      .querySelector("#_ctl0_PgHeader_TabTextHyperlink3")
      .textContent.trim();
    this.run();
  }

  run = async () => {
    let trs = this.doc.querySelectorAll("#GRID tr");
    this.parse_vst_date(this.doc);

    let aa = trs[trs.length - 1].querySelectorAll("a");
    aa = [...aa];
    let res = aa.map(async (a) =>
      get_sub_page(this.doc, a.href.split("'")[1]).then((doc) =>
        this.parse_vst_date(doc, true)
      )
    );
    await Promise.all(res);

    await Promise.all(
      this.vstInfo.map(async (vst) => this.parse_vst_detail(vst[2]))
    );

    await this.parse_diagnosis();
    await this.parse_randomization();

    // await this.parse_1st_drug();
    // await this.parse_eot();

    let blob = new Blob(
      [
        JSON.stringify({
          subID: this.subID,
          href: location.href,
          fstDrug: this.fstDrug,
          vstInfo: this.vstInfo,
          eotInfo: this.eotInfo,
          pdInfo: this.pdInfo,
          therapies: this.therapies,
          molecular: this.molecular,
          cytogenetic: this.cytogenetic,
          mutation: this.mutation,
          diagnosis: this.diagnosis,
          randomization: this.randomization,
        }),
      ],
      {
        type: "application/json",
      }
    );
    let a = this.doc.createElement("a");
    a.download = `${this.subID}.${new Date().getTime()}.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
    window.close();
  };

  parse_diagnosis = async () => {
    let res = this.vstInfo.filter((item) => item[0] == "Screening");
    if(res.length){
      let doc = await get_page(res[0][2]);
      this.diagnosis = await this._parse_vst_detail(doc, "CML History");
    }
  };

  parse_randomization = async () => {
    let res = this.vstInfo.filter((item) => item[0] == ".Cycle 1 Day 1");
    if(res.length > 0) {
      let url=res[0][2];
      let doc = await get_page(url);
      this.randomization = await this._parse_vst_detail(doc, "Randomization");
    }
  };

  parse_eot = async () => {
    if (
      this.doc.querySelector('a.leftNaveTableRowLink[title^="End of Study"]')
    ) {
      let link = this.doc.querySelector(
        'a.leftNaveTableRowLink[title^="End of Study"]'
      ).href;
      let doc = await fetch(link)
        .then((res) => res.text())
        .then((res) => new DOMParser().parseFromString(res, "text/html"));

      let k1 = doc
        .querySelectorAll("#_ctl0_Content_R>table")[1]
        .querySelector("tbody>tr>td")
        .textContent.trim();
      let v1 = doc
        .querySelectorAll("#_ctl0_Content_R>table")[1]
        .querySelector("tbody>tr>td:nth-child(3)")
        .textContent.trim();
      let k2 = doc
        .querySelectorAll("#_ctl0_Content_R>table")[2]
        .querySelector("tbody>tr>td")
        .textContent.trim();
      let v2 = doc
        .querySelectorAll("#_ctl0_Content_R>table")[2]
        .querySelector("tbody>tr>td:nth-child(3)")
        .textContent.trim();

      let res = {};
      res[k1] = v1;
      res[k2] = v2;
      this.eotInfo = res;
    }
  };

  parse_vst_date = (doc, sub = false) => {
    let trs = sub
      ? doc.querySelectorAll("#_ctl0_Content__ctl0_GRID tr")
      : doc.querySelectorAll("#GRID tr");
    let trs_ = [...trs];
    let res = trs_
      .slice(0, trs_.length - 1)
      .map((tr) => {
        let [, td_vst, td_dt] = tr.querySelectorAll("td");
        try {
          let visit = td_vst.textContent.trim();
          let date = td_dt.textContent.trim();
          let href =
            td_vst.querySelector("a") && td_vst.querySelector("a").href;
          if (date && href && href.startsWith("http")) {
            return [visit, date, href];
          }
        } catch {
          return;
        }
      })
      .filter((i) => i);
    this.vstInfo = [...this.vstInfo, ...res];
  };

  parse_vst_detail = async (url) => {
    let doc = await get_page(url);
    await this.parse_vst_PD(doc, url);

    let therapies = await this._parse_vst_detail(doc, "Systemic Therapies");
    if (therapies.length) {
      this.therapies[url] = therapies;
    }

    let molecular = await this._parse_vst_detail(doc, "Molecular");
    if (molecular.length) {
      this.molecular[url] = molecular;
    }

    let cytogenetic = await this._parse_vst_detail(doc, "Cytogenetic");
    if (cytogenetic.length) {
      this.cytogenetic[url] = cytogenetic;
    }

    let mutation = await this._parse_vst_detail(doc, "Mutation");
    if (mutation.length) {
      this.mutation[url] = mutation;
    }
  };

  _parse_vst_detail = async (doc, kw) => {
    let links = [
      ...doc.querySelectorAll(
        "#_ctl0_LeftNav_EDCTaskList_TblTaskItems a.leftNaveTableRowLink"
      ),
    ]
      .filter((a) => a.textContent.includes(kw))
      .map((a) => a.href);

    if (links.length) {
      let doc_ = await get_page(links[0]);
      return [...doc_.querySelectorAll("#_ctl0_Content_R>table>tbody>tr")]
        .map((tr) => [...tr.childNodes].map((td) => td.textContent.trim()))
        .filter((i) => !i[0].startsWith("Printable"));
    } else {
      return [];
    }
  };

  parse_vst_PD = async (doc, url) => {
    let links = [
      ...doc.querySelectorAll(
        "#_ctl0_LeftNav_EDCTaskList_TblTaskItems a.leftNaveTableRowLink"
      ),
    ]
      .filter((a) => a.textContent.includes("Pharmacodynamic"))
      .map((a) => a.href);

    if (links.length) {
      this.pdInfo[url] = await Promise.all(
        links.map(async (link) => await this._parse_vst_PD(link))
      );
    }
  };

  _parse_vst_PD = async (link) => {
    let doc_ = await get_page(link);
    let pd_samples = [...doc_.querySelectorAll("#log>tbody>tr")].map((tr) =>
      [...tr.childNodes].map((td) => td.textContent.trim())
    );
    let header = [...doc_.querySelectorAll(".crf_preText")].map((a) =>
      a.textContent.trim()
    );
    let content = [...doc_.querySelectorAll(".crf_dataPoint")].map((a) =>
      a.textContent.trim()
    );
    return { header, content, pd_samples };
  };

  parse_1st_drug = async () => {
    let url_prefix = location.href.split("/SubjectPage.aspx")[0];
    let el = this.doc.querySelector(
      "#_ctl0_LeftNav_EDCTaskList_TblTaskItems tr:nth-child(3)>td:nth-child(2)>a"
    );
    let link = new URL(el.href);
    link = `${url_prefix}/InstancePage.aspx${link.search}`;
    let res = await fetch(link).then((res) => res.text());
    let doc = new DOMParser().parseFromString(res, "text/html");
    let trs = doc.querySelectorAll(
      "#_ctl0_LeftNav_EDCTaskList_TblTaskItems>tbody>tr"
    );
    let a = trs[trs.length - 1].querySelector("td:nth-child(2)>a");

    let link_;
    if (a.text.trim() == "第1周期服药记录") {
      link_ = new URL(a.href);
      link_ = `${url_prefix}/InstancePage.aspx${link_.search}`;
    }

    if (link_) {
      let res = await fetch(link_).then((res) => res.text());
      let doc = new DOMParser().parseFromString(res, "text/html");
      this.fstDrug = doc
        .querySelector("#log tr:nth-child(2)>td:nth-child(2)>a")
        .text.trim();
    }
  };
}


class SubjectList {
    constructor(doc) {
        this.info = []
        this.doc = doc
        this.run()
    }

    run = async () => {
        this.parse_table(this.doc);

        let aa = this.doc.querySelectorAll("#_ctl0_Content_ListDisplayNavigation_DlPagination td>a")
        let res = [...aa].slice(1,aa.length).map(async a => get_sub_page(this.doc, a.href.split("'")[1]).then(doc => this.parse_table(doc)))
        await Promise.all(res)

        this.info.forEach((item) => GM_openInTab(item[1]));
        window.close()
    }

    parse_table = (doc) => {
        let aa = doc.querySelectorAll("#_ctl0_Content_ListDisplayNavigation_dgObjects tr>td:nth-child(2)>a")
        let res = [...aa].map(a => [a.textContent.trim(), a.href])
        this.info = [...this.info, ...res]
    }
}


(function () {
    'use strict';

    if (location.pathname.endsWith('HomePage.aspx') && location.search.startsWith('?LD_StudySiteID=')) {
        let ss= new SubjectList(document);
        console.log(ss.info)
    } else if (location.pathname.endsWith('SubjectPage.aspx')) {
        new Subject(document);
    }
})();
