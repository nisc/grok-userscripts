// ==UserScript==
// @name         Grok Delete File Uploads
// @namespace    nisc
// @version      0.5
// @description  Deletes all uploaded files on Grok files page by pressing a button
// @author       nisc
// @match        https://grok.com/files
// @icon         https://grok.com/images/favicon-light.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('Script running');

    function deleteFile(deleteButton) {
        return new Promise((resolve) => {
            deleteButton.click();
            const startTime = Date.now();
            const interval = setInterval(() => {
                const confirmButton = document.querySelector('button[aria-label="Confirm"]');
                if (confirmButton && confirmButton.offsetParent !== null) {  // Ensure it's visible
                    clearInterval(interval);
                    confirmButton.click();
                    resolve();
                } else if (Date.now() - startTime > 5000) {
                    clearInterval(interval);
                    console.error('Timeout waiting for "Delete all files" confirm button');
                    resolve();
                }
            }, 100);
        });
    }

    async function deleteAllFiles() {
        while (true) {
            const deleteButton = document.querySelector('button[aria-label="Delete"]');
            if (!deleteButton) {
                break;
            }
            await deleteFile(deleteButton);
            await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for page update
        }
    }

    function addButton() {
        const container = document.querySelector('.max-w-\\[50rem\\]');
        if (container) {
            const triggerButton = document.createElement('button');
            triggerButton.textContent = 'Delete all files';
            triggerButton.style.backgroundColor = 'red';
            triggerButton.style.color = 'white';
            triggerButton.style.padding = '8px 12px';
            triggerButton.style.border = 'none';
            triggerButton.style.borderRadius = '8px';
            triggerButton.style.cursor = 'pointer';
            triggerButton.style.zIndex = '1000';
            triggerButton.style.marginBottom = '10px';
            triggerButton.addEventListener('click', deleteAllFiles);
            container.insertBefore(triggerButton, container.firstChild);
            console.log('"Delete all files" button added to container');
        } else {
            console.error('Container .max-w-[50rem] not found (required to add "Delete all files" button)');
        }
    }

    const retryAddingButton = setInterval(() => {
        if (document.querySelector('.max-w-\\[50rem\\]')) {
            addButton();
            clearInterval(retryAddingButton);
        }
    }, 500);

    setTimeout(() => clearInterval(retryAddingButton), 10000);
})();
