// ==UserScript==
// @name         Grok Theme Toggle
// @namespace    nisc
// @version      2025.06.08-A
// @description  Adds a Light/Dark mode toggle at the bottom left
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        THEME: {
            KEY: 'forcedTheme',
            MODES: {
                DARK: 'dark',
                LIGHT: 'light'
            },
            DEFAULT: 'dark',
            COLORS: {
                dark: { bg: '#333', text: '#fff', border: '#333' },
                light: { bg: '#fff', text: '#000', border: '#333' }
            },
            ICONS: {
                dark: '🌕',
                light: '🌑'
            }
        },
        UI: {
            POSITION_MARGIN: 20,
            BUTTON_STYLES: {
                position: 'fixed',
                zIndex: '10000',
                padding: '8px 12px',
                border: '0.25px solid #333',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            },
            LIGHT_MODE_STYLES: `
                .light .text-xs.font-semibold {
                    color: #000 !important;
                }
            `
        }
    };

    // Track current theme state
    let currentTheme = localStorage.getItem(CONFIG.THEME.KEY) || CONFIG.THEME.DEFAULT;

    /**
     * Applies theme to document root only if it differs from current state
     * Handles both class names and color-scheme property
     */
    function applyTheme(theme) {
        const htmlElement = document.documentElement;
        const isDark = htmlElement.classList.contains(CONFIG.THEME.MODES.DARK);
        const isLight = htmlElement.classList.contains(CONFIG.THEME.MODES.LIGHT);

        if (theme === CONFIG.THEME.MODES.DARK && !isDark) {
            htmlElement.classList.add(CONFIG.THEME.MODES.DARK);
            htmlElement.classList.remove(CONFIG.THEME.MODES.LIGHT);
            htmlElement.style.setProperty('color-scheme', CONFIG.THEME.MODES.DARK, 'important');
        } else if (theme === CONFIG.THEME.MODES.LIGHT && !isLight) {
            htmlElement.classList.add(CONFIG.THEME.MODES.LIGHT);
            htmlElement.classList.remove(CONFIG.THEME.MODES.DARK);
            htmlElement.style.setProperty('color-scheme', CONFIG.THEME.MODES.LIGHT, 'important');
        }
    }

    // Create and inject custom style element
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    /**
     * Updates custom styles based on current theme
     * Primarily handles special cases for light mode
     */
    function updateStyles(theme) {
        styleElement.textContent = theme === CONFIG.THEME.MODES.LIGHT ? CONFIG.UI.LIGHT_MODE_STYLES : '';
    }

    /**
     * Toggles between light and dark themes
     * Updates localStorage, applies theme, and updates UI
     */
    function toggleTheme() {
        currentTheme = currentTheme === CONFIG.THEME.MODES.DARK ? 
            CONFIG.THEME.MODES.LIGHT : CONFIG.THEME.MODES.DARK;
        localStorage.setItem(CONFIG.THEME.KEY, currentTheme);
        applyTheme(currentTheme);
        updateStyles(currentTheme);
        updateButtonAppearance();
    }

    /**
     * Updates toggle button appearance based on current theme
     * Changes icon, background, text, and border colors
     */
    function updateButtonAppearance() {
        const themeColors = CONFIG.THEME.COLORS[currentTheme];
        toggleButton.textContent = CONFIG.THEME.ICONS[currentTheme];
        toggleButton.style.backgroundColor = themeColors.bg;
        toggleButton.style.color = themeColors.text;
        toggleButton.style.borderColor = themeColors.border;
    }

    // Create and configure theme toggle button
    const toggleButton = document.createElement('button');
    Object.assign(toggleButton.style, CONFIG.UI.BUTTON_STYLES);
    updateButtonAppearance();
    toggleButton.addEventListener('click', toggleTheme);
    document.body.appendChild(toggleButton);

    // Position button at bottom left
    const buttonHeight = toggleButton.offsetHeight;
    const initialLeft = CONFIG.UI.POSITION_MARGIN;
    const initialTop = Math.max(0, window.innerHeight - buttonHeight - CONFIG.UI.POSITION_MARGIN);
    toggleButton.style.left = `${initialLeft}px`;
    toggleButton.style.top = `${initialTop}px`;

    // Always maintain bottom left position on window resize
    window.addEventListener('resize', () => {
        const buttonHeight = toggleButton.offsetHeight;
        const newTop = Math.max(0, window.innerHeight - buttonHeight - CONFIG.UI.POSITION_MARGIN);
        toggleButton.style.top = `${newTop}px`;
    });

    // Initialize theme
    applyTheme(currentTheme);
    updateStyles(currentTheme);

    // Watch for external theme changes and maintain chosen theme
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                applyTheme(currentTheme);
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });
})();
