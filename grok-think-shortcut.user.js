// ==UserScript==
// @name         Grok Think Shortcut
// @namespace    nisc
// @version      2026.06.07-A
// @description  Activate Grok Thinking mode with Cmd/Ctrl+Shift+D.
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/favicon.ico
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
      shortcut: {
        key: 'd',
        requireShift: true
      },
      text: 'Think'
    };

    document.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === CONFIG.shortcut.key &&
          (navigator.userAgent.includes('Mac') ? e.metaKey : e.ctrlKey) &&
          e.shiftKey === CONFIG.shortcut.requireShift &&
          !e.altKey) {
        e.preventDefault();
        e.stopPropagation();

        const thinkButton = Array.from(document.querySelectorAll('button'))
          .find(button => button.textContent.trim() === CONFIG.text);

        if (thinkButton) thinkButton.click();
      }
    });
})();
