// ==UserScript==
// @name         Grok Theme Toggle
// @namespace    nisc
// @version      0.6
// @description  Adds a Light/Dark mode toggle at the bottom left
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const THEME_KEY = 'forcedTheme';
    const DEFAULT_THEME = 'dark';
    const COLORS = {
        dark: { bg: '#333', text: '#fff', border: '#333' },
        light: { bg: '#fff', text: '#000', border: '#333' }
    };
    const POSITION_MARGIN = 20;
    const BUTTON_STYLES = {
        position: 'fixed',
        zIndex: '10000',
        padding: '8px 12px',
        border: '0.25px solid',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    };

    let currentTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;

    // Apply theme only if it differs from the current state
    function applyTheme(theme) {
        const htmlElement = document.documentElement;
        const isDark = htmlElement.classList.contains('dark');
        const isLight = htmlElement.classList.contains('light');

        if (theme === 'dark' && !isDark) {
            htmlElement.classList.add('dark');
            htmlElement.classList.remove('light');
            htmlElement.style.setProperty('color-scheme', 'dark', 'important');
        } else if (theme === 'light' && !isLight) {
            htmlElement.classList.add('light');
            htmlElement.classList.remove('dark');
            htmlElement.style.setProperty('color-scheme', 'light', 'important');
        }
    }

    // Toggle between light and dark themes
    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, currentTheme);
        applyTheme(currentTheme);
        updateButtonAppearance();
    }

    // Update button text and styles based on current theme
    function updateButtonAppearance() {
        const themeColors = COLORS[currentTheme];
        toggleButton.textContent = currentTheme === 'light' ? '🌑' : '🌕';
        toggleButton.style.backgroundColor = themeColors.bg;
        toggleButton.style.color = themeColors.text;
        toggleButton.style.borderColor = themeColors.border;
    }

    // Create and style the toggle button
    const toggleButton = document.createElement('button');
    Object.assign(toggleButton.style, BUTTON_STYLES);
    updateButtonAppearance();

    toggleButton.addEventListener('click', toggleTheme);

    // Dragging functionality
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    function onMouseDown(e) {
        isDragging = true;
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            toggleButton.style.left = `${currentX}px`;
            toggleButton.style.top = `${currentY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    toggleButton.addEventListener('mousedown', onMouseDown);

    // Append button to DOM first, then set position
    document.body.appendChild(toggleButton);

    // Set initial position at bottom left
    const buttonHeight = toggleButton.offsetHeight;
    const initialLeft = POSITION_MARGIN;
    const initialTop = Math.max(0, window.innerHeight - buttonHeight - POSITION_MARGIN);
    toggleButton.style.left = `${initialLeft}px`;
    toggleButton.style.top = `${initialTop}px`;
    currentX = initialLeft;
    currentY = initialTop;

    // Add resize handler
    window.addEventListener('resize', () => {
        const buttonHeight = toggleButton.offsetHeight;
        const maxTop = window.innerHeight - buttonHeight - POSITION_MARGIN;
        if (currentY > maxTop) {
            currentY = maxTop;
            toggleButton.style.top = `${currentY}px`;
        }
    });

    // Apply initial theme
    applyTheme(currentTheme);

    // Observe DOM changes to maintain theme
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                applyTheme(currentTheme);
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });
})();
