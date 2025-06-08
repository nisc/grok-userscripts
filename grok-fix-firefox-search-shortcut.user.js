// ==UserScript==
// @name         Grok Fix Firefox Search Shortcut
// @namespace    nisc
// @version      2025.06.08-A
// @description  Disable CMD+K shortcut in Grok due to overlap with Firefox (still available via SHIFT-CTRL-K)
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @downloadURL  https://raw.githubusercontent.com/nisc/grok-userscripts/main/grok-fix-firefox-search-shortcut.user.js
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration object containing keyboard shortcut settings
     * Defines the key combination that needs to be intercepted
     */
    const CONFIG = {
        KEYS: {
            TRIGGER: 'k',           // The key that triggers the shortcut
            MODIFIER: 'metaKey'     // The modifier key (Cmd/Meta) that must be pressed
        }
    };

    /**
     * Event handler for keyboard shortcuts
     *
     * Purpose:
     * - Prevents conflict between Grok's CMD+K and Firefox's CMD+K shortcuts
     * - Firefox uses CMD+K for focusing the search bar
     * - Grok uses CMD+K for its command palette
     * - This script gives priority to Firefox's shortcut
     *
     * Behavior:
     * 1. Listens for keydown events with true in the capture phase
     * 2. If CMD+K is pressed, stops event propagation
     * 3. This prevents Grok from handling the shortcut
     * 4. Users can still access Grok's command palette via SHIFT-CTRL-K
     *
     * @param {KeyboardEvent} event - The keyboard event to handle
     */
    document.addEventListener('keydown', function(event) {
        if (event[CONFIG.KEYS.MODIFIER] && event.key === CONFIG.KEYS.TRIGGER) {
            event.stopPropagation();
        }
    }, true);
})();