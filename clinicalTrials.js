// ==UserScript==
// @name         ClinicalTrials
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add clinical trial reports link.
// @author       You
// @match        https://clinicaltrials.gov/ct2/show/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clinicaltrials.gov
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let el=jQuery('#main-content > div.tr-indent2 > div.w3-row > div.w3-col.m5 > table > tbody > tr:nth-child(1) > td')[0]
    let trial_id=el.innerHTML.split('ClinicalTrials.gov Identifier: ')[1]
    let link=`https://clin.larvol.com/trial/${trial_id}`
    let el_=jQuery(`<td>ClinicalTrials.gov Identifier: <a href="https://clin.larvol.com/trial/${trial_id}">${trial_id}</a></td>`)[0]
    jQuery(el).replaceWith(el_)

})();
