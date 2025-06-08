// ==UserScript==
// @name         Grok Hide Annoyances
// @namespace    nisc
// @version      2025.06.08-A
// @description  Hides the "Grok 3 Enabled" bubble/box
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @downloadURL  https://raw.githubusercontent.com/nisc/grok-userscripts/main/grok-hide-annoyances.user.js
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration object containing all constants used in the script
     * - DOM selectors for finding elements
     * - Text content to match
     * - Timing intervals
     */
    const CONFIG = {
        POPPER: {
            WRAPPER_SELECTOR: 'div[data-radix-popper-content-wrapper]',
            TARGET_TEXT: 'Grok 3 Enabled',
            HIDE_STYLE: 'none'
        },
        OBSERVER: {
            CONFIG: { childList: true, subtree: true }
        },
        INTERVALS: {
            CHECK_FREQUENCY: 1000 // In milliseconds
        }
    };

    /**
     * Hides any popper elements containing the target text
     * Searches through all popper wrappers and their paragraph elements
     */
    function hideGrokPopper() {
        const popperDivs = document.querySelectorAll(CONFIG.POPPER.WRAPPER_SELECTOR);
        popperDivs.forEach(popperDiv => {
            const pElements = popperDiv.querySelectorAll('p');
            for (const p of pElements) {
                if (p.textContent.trim() === CONFIG.POPPER.TARGET_TEXT) {
                    popperDiv.style.display = CONFIG.POPPER.HIDE_STYLE;
                    break;
                }
            }
        });
    }

    // Initial hide for any existing poppers
    hideGrokPopper();

    /**
     * MutationObserver to watch for dynamically added elements
     * Checks new elements and their children for the target text
     */
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        let popperDiv = node.closest(CONFIG.POPPER.WRAPPER_SELECTOR);
                        if (popperDiv) {
                            const pElements = popperDiv.querySelectorAll('p');
                            for (const p of pElements) {
                                if (p.textContent.trim() === CONFIG.POPPER.TARGET_TEXT) {
                                    popperDiv.style.display = CONFIG.POPPER.HIDE_STYLE;
                                    break;
                                }
                            }
                        }
                    }
                });
            }
        });
    });

    // Start observing DOM changes
    observer.observe(document.body, CONFIG.OBSERVER.CONFIG);

    // Fallback: periodically check for new poppers
    // This catches any elements that might have been missed by the observer
    setInterval(hideGrokPopper, CONFIG.INTERVALS.CHECK_FREQUENCY);
})();