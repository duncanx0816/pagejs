// ==UserScript==
// @name         EDC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ascentage.mdsol.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mdsol.com
// @grant        none
// @require      file://C:\Users\Administrator\Desktop\edc.js
// @updateURL    https://raw.githubusercontent.com/duncanx0816/pagejs/main/edc.js
// ==/UserScript==


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
        this.info = []
        this.doc = doc
        this.subID = this.doc.querySelector('#_ctl0_PgHeader_TabTextHyperlink3').textContent.trim()
        // this.run()
    }

    run = async () => {
        let trs = this.doc.querySelectorAll("#GRID tr")
        this.parse_vst_date(this.doc)

        let aa = trs[trs.length - 1].querySelectorAll('a')
        aa = [...aa]
        let res = aa.map(async a => get_sub_page(this.doc, a.href.split("'")[1]).then(doc => this.parse_vst_date(doc, true)))
        await Promise.all(res)

        let blob = new Blob(
            [JSON.stringify({
                subID: this.subID,
                href: location.href,
                info: this.info
            })], {
                type: "application/json"
            }
        );
        let a = this.doc.createElement('a')
        a.download = `${this.subID}.${(new Date()).getTime()}.json`
        a.href = URL.createObjectURL(blob)
        a.click()
        window.close()
    }

    parse_eot = async () => {
        let link = this.doc.querySelector(
            'a.leftNaveTableRowLink[title^="治疗终止"]'
        ).href;
        let doc = await fetch(link)
            .then((res) => res.text())
            .then((res) => new DOMParser().parseFromString(res, "text/html"));

        let k1 = doc_
            .querySelectorAll("#_ctl0_Content_R>table")[1]
            .querySelector("tbody>tr>td")
            .textContent.trim();
        let v1 = doc_
            .querySelectorAll("#_ctl0_Content_R>table")[1]
            .querySelector("tbody>tr>td:nth-child(3)")
            .textContent.trim();
        let k2 = doc_
            .querySelectorAll("#_ctl0_Content_R>table")[2]
            .querySelector("tbody>tr>td")
            .textContent.trim();
        let v2 = doc_
            .querySelectorAll("#_ctl0_Content_R>table")[2]
            .querySelector("tbody>tr>td:nth-child(3)")
            .textContent.trim();

        let res = {}
        res[k1] = v1
        res[k2] = v2
        return res
    }

    parse_vst_date = (doc, sub = false) => {
        let trs = sub ? doc.querySelectorAll("#_ctl0_Content__ctl0_GRID tr") : doc.querySelectorAll("#GRID tr")
        let trs_ = [...trs]
        trs_ = trs_.slice(0, trs_.length - 1)
        let res = trs_.map(
            tr => {
                let tds = tr.querySelectorAll("td")
                let td_vst = tds[1]
                let td_dt = tds[2]
                try {
                    return [
                        td_vst.textContent.trim(),
                        td_dt.textContent.trim(),
                        td_vst.querySelector("a") && td_vst.querySelector("a").href,
                    ]
                } catch {
                    return ['e', 'e', 'e']
                }
            }
        )
        this.info = [...this.info, ...res]
    }

}

class SubjectList {
    constructor(doc) {
        this.info = []
        this.doc = doc
        this.run()
    }

    run = async () => {
        let aa = this.doc.querySelectorAll("#_ctl0_Content_ListDisplayNavigation_DlPagination td>a")
        aa = [...aa]
        let res = aa.map(async a => get_sub_page(this.doc, a.href.split("'")[1]).then(doc => this.parse_table(doc)))
        await Promise.all(res)

        this.info.forEach((item) => window.open(item[1]));
        window.close()
    }

    parse_table = (doc) => {
        let aa = doc.querySelectorAll("#_ctl0_Content_ListDisplayNavigation_dgObjects tr>td:nth-child(2)>a")
        aa = [...aa]
        let res = aa.map(a => [a.textContent.trim(), a.href])
        this.info = [...this.info, ...res]
    }
}


(function () {
    'use strict';

    if (location.pathname.endsWith('HomePage.aspx') & location.search.startsWith('?LD_StudySiteID=')) {
        console.log('run')
        // new SubjectList(document);
    } else if (location.pathname.endsWith('SubjectPage.aspx')) {
        new Subject(document);
    }
})();
