// ==UserScript==
// @name         Grok Hide Annoyances
// @namespace    nisc
// @version      0.3
// @description  Hides the "Grok 3 Enabled" bubble/box
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function hideGrokPopper() {
        const popperDivs = document.querySelectorAll('div[data-radix-popper-content-wrapper]');
        popperDivs.forEach(popperDiv => {
            const pElements = popperDiv.querySelectorAll('p');
            for (const p of pElements) {
                if (p.textContent.trim() === 'Grok 3 Enabled') {
                    popperDiv.style.display = 'none';
                    break;
                }
            }
        });
    }

    // Hide any existing poppers
    hideGrokPopper();

    // Set up observer for future poppers and changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        let popperDiv = node.closest('div[data-radix-popper-content-wrapper]');
                        if (popperDiv) {
                            const pElements = popperDiv.querySelectorAll('p');
                            for (const p of pElements) {
                                if (p.textContent.trim() === 'Grok 3 Enabled') {
                                    popperDiv.style.display = 'none';
                                    break;
                                }
                            }
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Periodically check for the popper every second
    setInterval(hideGrokPopper, 1000);
})();
