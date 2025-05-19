// ==UserScript==
// @name         Grok Quota Display
// @namespace    nisc
// @description  Displays rate limits for Grok-3 on grok.com
// @author       nisc
// @version      2.4
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Utility to generate a random ID
    const generateId = () => Math.random().toString(16).slice(2);

    // Constants
    const modelName = 'grok-3';
    const requestKinds = ['DEFAULT', 'REASONING', 'DEEPSEARCH', 'DEEPERSEARCH'];
    const displayNames = {
        'DEFAULT': 'Default',
        'REASONING': 'Reason',
        'DEEPSEARCH': 'Deep',
        'DEEPERSEARCH': 'Deeper'
    };

    // Helper functions
    const getId = (requestKind) => `rate_limit_${requestKind.toLowerCase()}`;

    // Add CSS styles
    const createStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .grok-rate-limit-wrapper {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                padding: 0.5rem;
                position: fixed;
                bottom: 1rem;
                right: 1rem;
                z-index: 0.25rem;
            }
            .grok-rate-limit-wrapper .grok-menu {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            .grok-rate-limit-wrapper .grok-column {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            .grok-rate-limit-wrapper .grok-rate-limit {
                font-size: 0.75rem;
                color: inherit;
                font-family: inherit;
                line-height: inherit;
            }
        `;
        document.head.appendChild(style);
    };

    // Create the rate limit menu
    const createMenu = () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'grok-rate-limit-wrapper';

        const menu = document.createElement('div');
        menu.id = 'grok-switcher-menu';
        menu.className = 'grok-menu';

        const column = document.createElement('div');
        column.className = 'grok-column';
        for (const kind of requestKinds) {
            const id = getId(kind);
            const div = document.createElement('div');
            div.id = id;
            div.className = 'grok-rate-limit';
            div.textContent = `${displayNames[kind]}: N/A`;
            column.appendChild(div);
        }
        menu.appendChild(column);

        wrapper.appendChild(menu);
        return wrapper;
    };

    // Update the displayed rate limits with window size
    const updateRateLimits = (limits) => {
        for (const kind of requestKinds) {
            const id = getId(kind);
            const elem = document.getElementById(id);
            const limit = limits?.[kind];
            if (limit && limit.windowSizeSeconds) {
                const secondsPerHour = 3600;
                const secondsPerDay = 86400;
                let value, unit;
                if (limit.windowSizeSeconds >= secondsPerDay) {
                    value = limit.windowSizeSeconds / secondsPerDay;
                    unit = 'd';
                } else {
                    value = limit.windowSizeSeconds / secondsPerHour;
                    unit = 'h';
                }
                const formattedValue = Number.isInteger(value) ? Math.round(value) : value.toFixed(1);
                // Use innerHTML to bold the remaining queries (X)
                elem.innerHTML = `${displayNames[kind]}: <b>${limit.remainingQueries}</b>/${limit.totalQueries} (${formattedValue}${unit})`;
            } else {
                elem.textContent = `${displayNames[kind]}: N/A`;
            }
        }
    };

    // Fetch rate limits from the server
    const fetchRateLimits = async () => {
        try {
            const commonHeaders = {
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': navigator.userAgent,
                'Accept': '*/*',
                'Origin': 'https://grok.com',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://grok.com/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Priority': 'u=1, i'
            };

            const limits = {};
            for (const kind of requestKinds) {
                const headers = {
                    ...commonHeaders,
                    'X-Xai-Request-Id': generateId()
                };
                const response = await fetch('https://grok.com/rest/rate-limits', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ requestKind: kind, modelName })
                });
                if (!response.ok) throw new Error(`Failed to fetch ${modelName} ${kind} rate limits`);
                limits[kind] = await response.json();
            }
            updateRateLimits(limits);
        } catch (error) {
            updateRateLimits(null);
            console.error('Failed to fetch rate limits. Please try again later.');
        }
    };

    // Start refreshing rate limits periodically
    const startRateLimitRefresh = () => {
        fetchRateLimits();
        setInterval(fetchRateLimits, 30000);
    };

    // Initialize the script
    const init = () => {
        createStyles();
        const wrapper = createMenu();
        document.body.appendChild(wrapper);
        startRateLimitRefresh();
    };

    // Run init when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
