// ==UserScript==
// @name         APG115XC102
// @namespace    http://tampermonkey.net/
// @version      20250703
// @description  try to take over the world!
// @author       You
// @match        https://ascentage.mdsol.com/MedidataRave/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mdsol.com
// @grant        window.close
// @grant        GM_openInTab
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
    constructor() {
        this.fstDrug;
        this.vstInfo = [];
        this.efficacy = [];
        this.screen=[];
        this.disease=[];

        this.subID = document
            .querySelector("#_ctl0_PgHeader_TabTextHyperlink3")
            .textContent.trim();
        this.run();
    }

    run = async () => {
        document.title=document.querySelector('#_ctl0_PgHeader_TabTextHyperlink3').title;
        
        await this.parse_vstInfo();
        await this.parse_efficacy();
        await this.parse_screen();

        let blob = new Blob(
            [
                JSON.stringify({
                    subID: this.subID,
                    vstInfo: this.vstInfo,
                    efficacy: this.efficacy,
                    screen: this.screen,
                    disease: this.disease,
                }),
            ],
            {
                type: "application/json",
            }
        );
        let a = document.createElement("a");
        a.download = `${this.subID}.${new Date().getTime()}.json`;
        a.href = URL.createObjectURL(blob);
        a.click();
        window.close();
    }

    parse_vstInfo = async () => {
        this.vstInfo = [...document.querySelectorAll('#GRID tr')].map(tr => {
            return [...tr.querySelectorAll('td')].map(td => td.innerText)
        });
        await Promise.all([...document.querySelectorAll('#GRID tr:last-of-type a')].map(a => {
            get_sub_page(document, a.href.split("'")[1]).then(doc => {
                let vstInfo = [...doc.querySelectorAll('#_ctl0_Content__ctl0_GRID tr')].map(tr => {
                    return [...tr.querySelectorAll('td')].map(td => td.innerText)
                })
                console.log(vstInfo)
                this.vstInfo = [...this.vstInfo, ...vstInfo]
            })
        }))
    }

    parse_efficacy = async () => {
        let href = document.querySelector('#_ctl0_LeftNav_EDCTaskList_TblTaskItems a[title="肿瘤评估"]')?.href;
        if (href) {
            let doc = await get_page(href);
            href = doc.querySelector('#_ctl0_LeftNav_EDCTaskList_TblTaskItems a[title^="肿瘤评估-靶病灶"]')?.href;
            if (!href) { href = doc.querySelector('#_ctl0_LeftNav_EDCTaskList_TblTaskItems a[title^="非靶病灶"]')?.href }
            if (href) {
                doc = await get_page(href);
                this.efficacy = [...doc.querySelectorAll('#_ctl0_Content_R > table > tbody > tr')].map(tr => {
                    return [...tr.querySelectorAll(':scope > td')].map(td => td.innerText)
                }).filter(e => e[0])
            }
        }
    }

    parse_screen = async () => {
        let href = document.querySelector('#_ctl0_LeftNav_EDCTaskList_TblTaskItems a[title="筛选期"]')?.href;
        if (href) {
            let doc = await get_page(href);
            let doc_;

            href = doc.querySelector('#_ctl0_LeftNav_EDCTaskList_TblTaskItems a[title^="疾病诊断和分期"]')?.href;
            if (href) {
                doc_ = await get_page(href);
                this.disease = [...doc_.querySelectorAll('#_ctl0_Content_R > table > tbody > tr')].map(tr => {
                    return [...tr.querySelectorAll(':scope > td')].map(td => td.innerText)
                }).filter(e => e[0])
            }

            href = doc.querySelector('#_ctl0_LeftNav_EDCTaskList_TblTaskItems a[title^="受试者合格性"]')?.href;
            if (href) {
                doc_ = await get_page(href);
                this.screen = [...doc_.querySelectorAll('#_ctl0_Content_R > table > tbody > tr')].map(tr => {
                    return [...tr.querySelectorAll(':scope > td')].map(td => td.innerText)
                }).filter(e => e[0])
            }
        }
    }
}

class SubjectList {
    constructor() {
        this.info = [];
        [...document.querySelectorAll('#_ctl0_Content_ListDisplayNavigation_dgObjects > tbody > tr >td > a[href]')].forEach(a => {
            GM_openInTab(a.href);
            window.close();
        })
    }
}

(function () {
    'use strict';

    if (location.pathname.endsWith('HomePage.aspx') && location.search.startsWith('?LD_StudySiteID=')) {
        let ss = new SubjectList(document);
        console.log(ss.info)
    } else if (location.pathname.endsWith('SubjectPage.aspx')) {
        new Subject(document);
    }
})();

