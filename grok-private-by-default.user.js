// ==UserScript==
// @name         Grok Private By Default
// @namespace    nisc
// @version      0.2
// @description  Automatically redirects to private chat on grok.com when on '/' or '/chat' without '#private'
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/' || (path === '/chat' && hash !== '#private')) {
        window.location.href = 'https://grok.com/chat#private';
    }
})();
