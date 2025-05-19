// ==UserScript==
// @name         Grok Fix Firefox Search Shortcut
// @namespace    nisc
// @version      0.2
// @description  Disable CMD+K shortcut in Grok due to overlap with Firefox (still available via SHIFT-CTRL-K)
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.metaKey && event.key === 'k') {
            event.stopPropagation();
        }
    }, true);
})();
