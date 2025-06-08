// ==UserScript==
// @name         Grok Delete File Uploads
// @namespace    nisc
// @version      2025.06.08-A
// @description  Add a button to delete all uploaded files on grok.com/files
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/files
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        BUTTON_ID: 'delete-all-btn',
        BUTTON_TEXT: 'Delete all files',
        BUTTON_STYLES: {
            backgroundColor: 'white',
            color: 'black',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '30px'
        },
        CONTAINER_SELECTOR: '.max-w-\\[50rem\\]',
        DELETE_BUTTON_SELECTOR: 'button[aria-label="Delete"]',
        CONFIRM_BUTTON_SELECTOR: 'button[aria-label="Confirm"]',
        DELAYS: {
            DELETE_BUTTON: 200,    // Time to wait after clicking delete button
            CONFIRM_BUTTON: 200,   // Time to wait after clicking confirm button
            MODAL_RENDER: 500      // Time to wait for all modals to render
        }
    };

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    async function deleteAll() {
        const deleteButtons = Array.from(document.querySelectorAll(CONFIG.DELETE_BUTTON_SELECTOR));
        if (deleteButtons.length === 0) {
            return;
        }

        for (const btn of deleteButtons) {
            btn.click();
            await sleep(CONFIG.DELAYS.DELETE_BUTTON);
        }

        await sleep(CONFIG.DELAYS.MODAL_RENDER);

        const confirmButtons = Array.from(document.querySelectorAll(CONFIG.CONFIRM_BUTTON_SELECTOR));
        if (confirmButtons.length === 0) {
            return;
        }

        for (const conf of confirmButtons) {
            conf.click();
            await sleep(CONFIG.DELAYS.CONFIRM_BUTTON);
        }
    }

    function addButton() {
        const container = document.querySelector(CONFIG.CONTAINER_SELECTOR);
        if (container && !document.getElementById(CONFIG.BUTTON_ID)) {
            const btn = document.createElement('button');
            btn.id = CONFIG.BUTTON_ID;
            btn.textContent = CONFIG.BUTTON_TEXT;
            Object.assign(btn.style, CONFIG.BUTTON_STYLES);
            btn.addEventListener('click', deleteAll);
            container.insertBefore(btn, container.firstChild);
        }
    }

    new MutationObserver(addButton).observe(document.body, { childList: true, subtree: true });
    addButton();
})();
