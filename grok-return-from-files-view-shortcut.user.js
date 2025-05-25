// ==UserScript==
// @name         Grok Return from Uploaded Files View via ESC
// @namespace    nisc
// @version      0.1
// @description  When on grok.com/files, ESC takes user back
// @author       nisc
// @match        https://grok.com/files
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            event.preventDefault(); // Prevent other ESC handlers
            if (window.history.length < 2) {
                window.open('https://grok.com', '_self');
            } else {
                window.history.back();
            }
        }
    });
})();
