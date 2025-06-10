// ==UserScript==
// @name         Grok Quota Display
// @namespace    nisc
// @version      2025.06.08-A
// @description  Displays rate limits on grok.com
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @downloadURL  https://raw.githubusercontent.com/nisc/grok-userscripts/main/grok-quota-display.user.js
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
     * Organized into logical sections for different aspects of the application
     */
    const CONFIG = {
        MODEL: {
            name: 'grok-3'
        },
        REQUEST_TYPES: {
            DEFAULT: 'Default',
            REASONING: 'Reason',
            DEEPSEARCH: 'Deep',
            DEEPERSEARCH: 'Deeper'
        },
        API: {
            endpoint: 'https://grok.com/rest/rate-limits',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': '*/*',
                'Origin': 'https://grok.com',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://grok.com/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Priority': 'u=1, i'
            }
        },
        UI: {
            styles: `
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
            `,
            refreshInterval: 30000 // in milliseconds
        },
        TIME: {
            SECONDS_PER_HOUR: 3600,
            SECONDS_PER_DAY: 86400
        }
    };

    /**
     * Utility functions for common operations
     * - ID generation for API requests
     * - Element ID formatting
     * - Time window and value formatting
     */
    const utils = {
        // Generates a random ID for API request tracking
        generateId: () => Math.random().toString(16).slice(2),

        // Creates consistent element IDs for rate limit displays
        getLimitElementId: type => `rate_limit_${type.toLowerCase()}`,

        // Formats time windows into days or hours with appropriate units
        formatTimeWindow: seconds => {
            if (seconds >= CONFIG.TIME.SECONDS_PER_DAY) {
                const value = seconds / CONFIG.TIME.SECONDS_PER_DAY;
                return { value, unit: 'd' };
            }
            const value = seconds / CONFIG.TIME.SECONDS_PER_HOUR;
            return { value, unit: 'h' };
        },

        // Formats numeric values, rounding integers and fixing decimals to 1 place
        formatValue: value => Number.isInteger(value) ? Math.round(value) : value.toFixed(1)
    };

    /**
     * UI-related functions for creating and updating the display
     * Handles all DOM manipulation and styling
     */
    const ui = {
        // Injects custom styles into the document
        createStyles: () => {
            const style = document.createElement('style');
            style.textContent = CONFIG.UI.styles;
            document.head.appendChild(style);
        },

        // Creates the rate limit display menu structure
        createMenu: () => {
            const wrapper = document.createElement('div');
            wrapper.className = 'grok-rate-limit-wrapper';

            const menu = document.createElement('div');
            menu.id = 'grok-switcher-menu';
            menu.className = 'grok-menu';

            const column = document.createElement('div');
            column.className = 'grok-column';

            // Create display elements for each request type
            Object.entries(CONFIG.REQUEST_TYPES).forEach(([type, displayName]) => {
                const div = document.createElement('div');
                div.id = utils.getLimitElementId(type);
                div.className = 'grok-rate-limit';
                div.textContent = `${displayName}: N/A`;
                column.appendChild(div);
            });

            menu.appendChild(column);
            wrapper.appendChild(menu);
            return wrapper;
        },

        // Updates the display with new rate limit information
        updateRateLimits: limits => {
            Object.entries(CONFIG.REQUEST_TYPES).forEach(([type, displayName]) => {
                const elem = document.getElementById(utils.getLimitElementId(type));
                const limit = limits?.[type];

                if (limit?.windowSizeSeconds) {
                    const { value, unit } = utils.formatTimeWindow(limit.windowSizeSeconds);
                    const formattedValue = utils.formatValue(value);
                    const display =
                        `${displayName}: <b>${limit.remainingQueries}</b>/${limit.totalQueries} ` +
                        `(${formattedValue}${unit})`;
                    elem.innerHTML = display;
                } else {
                    elem.textContent = `${displayName}: N/A`;
                }
            });
        }
    };

    /**
     * API-related functions for fetching rate limits
     * Handles all server communication and error handling
     */
    const api = {
        // Fetches rate limits for all request types in parallel
        async fetchRateLimits() {
            try {
                const limits = {};
                // Create an array of promises for parallel execution
                const requests = Object.keys(CONFIG.REQUEST_TYPES).map(async type => {
                    const headers = {
                        ...CONFIG.API.headers,
                        'User-Agent': navigator.userAgent,
                        'X-Xai-Request-Id': utils.generateId()
                    };

                    const response = await fetch(CONFIG.API.endpoint, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            requestKind: type,
                            modelName: CONFIG.MODEL.name
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${CONFIG.MODEL.name} ${type} rate limits`);
                    }
                    limits[type] = await response.json();
                });

                // Wait for all requests to complete
                await Promise.all(requests);
                ui.updateRateLimits(limits);
            } catch (error) {
                ui.updateRateLimits(null);
                console.error('Failed to fetch rate limits. Please try again later.');
            }
        }
    };

    /**
     * Initializes the application:
     * 1. Creates and injects styles
     * 2. Creates and adds the display menu
     * 3. Fetches initial rate limits
     * 4. Sets up periodic updates
     */
    const init = () => {
        ui.createStyles();
        document.body.appendChild(ui.createMenu());
        api.fetchRateLimits();
        setInterval(api.fetchRateLimits, CONFIG.UI.refreshInterval);
    };

    // Initialize when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
