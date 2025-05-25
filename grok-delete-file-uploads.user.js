// ==UserScript==
// @name         Grok Delete File Uploads
// @namespace    nisc
// @version      0.6
// @description  Deletes all uploaded files on Grok files page by pressing a button
// @author       nisc
// @match        https://grok.com/files
// @icon         https://grok.com/images/favicon-light.png
// @grant        none
// ==/UserScript==

(function(){
    'use strict';
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    async function deleteAll() {
        const deleteButtons = Array.from(document.querySelectorAll('button[aria-label="Delete"]'));
        if (deleteButtons.length === 0) {
            console.warn('GRK-USR: No delete buttons found');
            return;
        }

        for (const btn of deleteButtons) {
            btn.click();
            await sleep(200); // Allow modal to open
        }

        await sleep(500); // Wait for all confirm modals to render

        const confirmButtons = Array.from(document.querySelectorAll('button[aria-label="Confirm"]'));
        if (confirmButtons.length === 0) {
            console.warn('GRK-USR: No confirm buttons found');
            return;
        }

        for (const conf of confirmButtons) {
            conf.click();
            await sleep(200); // Allow each deletion to process
        }

        console.log('GRK-USR: Deletion sequence complete');
    }

    function addButton() {
        const container = document.querySelector('.max-w-\\[50rem\\]');
        if (container && !document.getElementById('delete-all-btn')) {
            const btn = document.createElement('button');
            btn.id = 'delete-all-btn';
            btn.textContent = 'Delete all files';
            Object.assign(btn.style, {
                backgroundColor: 'red', color: 'white', padding: '8px 12px',
                border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px'
            });
            btn.addEventListener('click', deleteAll);
            container.insertBefore(btn, container.firstChild);
            console.log('GRK-USR: Delete all files button added');
        }
    }

    new MutationObserver(addButton).observe(document.body, { childList: true, subtree: true });
    addButton();
})();
