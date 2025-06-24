// ==UserScript==
// @name         Grok Delete Chat Shortcut
// @namespace    nisc
// @version      2025.06.24-A
// @description  Delete Grok chat with only Cmd/Ctrl+Shift+Delete, auto-confirms popup
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @downloadURL  https://raw.githubusercontent.com/nisc/grok-userscripts/main/grok-delete-chat-shortcut.user.js
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/favicon.ico
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Configuration object containing all adjustable settings and constants
  const CONFIG = {
    platform: {
      isMac: navigator.userAgent.includes('Mac')
    },
    shortcut: {
      key: navigator.userAgent.includes('Mac') ? 'Backspace' : 'Delete',
      modifier: navigator.userAgent.includes('Mac') ? 'metaKey' : 'ctrlKey',
      shift: true
    },
    // Timing delays (in ms) for various operations
    delays: {
      RETRY: 200,               // Delay between retries when finding chat element
      HOVER: 75,                // Delay after simulating hover events
      KEY_PRESS: 75,            // Delay between key press events
      MENU_OPEN: 125,           // Delay for menu to open after clicking history
      CLICK_TO_DELETE: 125,     // Delay between click and delete command
      DELETE_TO_ENTER: 125,     // Delay between delete and enter press
      FINAL_ESCAPE: 250,        // Final delay before pressing escape
    },
    // Key codes for special keys
    keyCodes: {
      Enter: {
        code: 'Enter',
        keyCode: 13
      },
      Escape: {
        code: 'Escape',
        keyCode: 27
      }
    },
    // DOM selectors used throughout the script
    selectors: {
      dialog: '[role="dialog"]',
      clickableArea: '.cursor-pointer',
      cmdkItem: '[cmdk-item]',
      queryBar: '.query-bar',
      privateClasses: ['bg-purple-50', 'dark:bg-purple-1000']
    },
    // Mouse event simulation coordinates
    mouse: {
      clientX: 100,
      clientY: 100
    },
    // Maximum retries for finding elements
    maxRetries: 5,
    // Text constants
    text: {
      current: 'Current'
    }
  };

  /**
   * Utility functions for common operations
   */
  const utils = {
    delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
    querySelector: (selector, context = document) => context.querySelector(selector),
    querySelectorAll: (selector, context = document) => Array.from(context.querySelectorAll(selector)),
    hasClass: (element, className) => {
      if (!element) return false;

      // Check the element itself
      if (element.classList.contains(className)) return true;

      // Check parent elements
      let parent = element;
      while (parent) {
        if (parent.classList && parent.classList.contains(className)) {
          return true;
        }
        parent = parent.parentElement;
      }

      return false;
    }
  };

  /**
   * DOM Cache for frequently accessed elements
   */
  const domCache = {
    _queryBar: null,
    get queryBar() {
      if (!this._queryBar) {
        this._queryBar = utils.querySelector(CONFIG.selectors.queryBar);
      }
      return this._queryBar;
    },
    clearCache() {
      this._queryBar = null;
    }
  };

  /**
   * Event simulation utilities
   */
  const eventSimulator = {
    createMouseEvent(eventType) {
      return new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: CONFIG.mouse.clientX,
        clientY: CONFIG.mouse.clientY
      });
    },

    createKeyEvent(key, options = {}, type = 'keydown') {
      return new KeyboardEvent(type, {
        key,
        code: this._getKeyCode(key),
        bubbles: true,
        cancelable: true,
        composed: true,
        keyCode: this._getKeyCodeNumber(key),
        which: this._getKeyCodeNumber(key),
        view: window,
        ...options
      });
    },

    _getKeyCode(key) {
      return CONFIG.keyCodes[key]?.code || `Key${key.toUpperCase()}`;
    },

    _getKeyCodeNumber(key) {
      return CONFIG.keyCodes[key]?.keyCode || key.toUpperCase().charCodeAt(0);
    },

    async simulateMouseEvent(element, eventType) {
      element.dispatchEvent(this.createMouseEvent(eventType));
    },

    async simulateHover(element) {
      const parent = element.parentElement;
      if (parent) {
        ['mouseover', 'mouseenter'].forEach(event => this.simulateMouseEvent(parent, event));
        await utils.delay(CONFIG.delays.HOVER);
      }

      ['mouseover', 'mouseenter'].forEach(event => this.simulateMouseEvent(element, event));
      await utils.delay(CONFIG.delays.HOVER);

      element.classList.add('hover');
    },

    async simulateKeyPress(element, key, options = {}) {
      element.focus();
      await utils.delay(CONFIG.delays.KEY_PRESS);

      // Create events for multiple targets to ensure capture
      const targets = [element, document.body, document, window];

      // Keydown
      const keydownEvent = this.createKeyEvent(key, options, 'keydown');
      for (const target of targets) {
        try {
          target.dispatchEvent(keydownEvent.constructor === KeyboardEvent ? keydownEvent : this.createKeyEvent(key, options, 'keydown'));
        } catch (e) {
          // Skip targets that can't receive events
        }
      }
      await utils.delay(CONFIG.delays.KEY_PRESS);

      // Keypress (for compatibility)
      const keypressEvent = this.createKeyEvent(key, options, 'keypress');
      for (const target of targets) {
        try {
          target.dispatchEvent(keypressEvent.constructor === KeyboardEvent ? keypressEvent : this.createKeyEvent(key, options, 'keypress'));
        } catch (e) {
          // Skip targets that can't receive events
        }
      }
      await utils.delay(CONFIG.delays.KEY_PRESS);

      // Keyup
      const keyupEvent = this.createKeyEvent(key, options, 'keyup');
      for (const target of targets) {
        try {
          target.dispatchEvent(keyupEvent.constructor === KeyboardEvent ? keyupEvent : this.createKeyEvent(key, options, 'keyup'));
        } catch (e) {
          // Skip targets that can't receive events
        }
      }
    },

    // Alternative method using more direct approach
    async simulateKeyPressAlternative(key, options = {}) {
      // Try a more direct simulation approach
      const event = new KeyboardEvent('keydown', {
        key: key,
        code: key === 'k' ? 'KeyK' : `Key${key.toUpperCase()}`,
        keyCode: key === 'k' ? 75 : key.toUpperCase().charCodeAt(0),
        which: key === 'k' ? 75 : key.toUpperCase().charCodeAt(0),
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window,
        ctrlKey: options.ctrlKey || false,
        shiftKey: options.shiftKey || false,
        altKey: options.altKey || false,
        metaKey: options.metaKey || false
      });

      // Dispatch to multiple elements
      document.dispatchEvent(event);
      document.body.dispatchEvent(event);
      if (document.activeElement) {
        document.activeElement.dispatchEvent(event);
      }

      return true;
    }
  };

  /**
   * Chat operations handling
   */
  const chatOperations = {
    isValidInput(target) {
      return target.tagName === 'TEXTAREA' ||
        (!['INPUT'].includes(target.tagName) && !target.isContentEditable);
    },

    isPrivateChat() {
      const queryBar = domCache.queryBar;
      if (!queryBar) return false;

      // Check for purple classes either directly on the query bar or in its parent containers
      return CONFIG.selectors.privateClasses.some(className => utils.hasClass(queryBar, className));
    },

    async openHistoryMenu() {
      // Trigger Shift+Ctrl+K only once using the most reliable method
      await eventSimulator.simulateKeyPressAlternative('k', {
        ctrlKey: true,
        shiftKey: true
      });

      return true;
    },

    findSelectedChat(retryCount = 0) {
      const findElement = () => {
        const dialog = utils.querySelector(CONFIG.selectors.dialog);
        if (!dialog) return null;

        const currentSpan = utils.querySelectorAll('span', dialog)
          .find(span => span.textContent.trim() === CONFIG.text.current);
        if (!currentSpan) return null;

        return currentSpan.closest(CONFIG.selectors.cmdkItem);
      };

      return new Promise((resolve, reject) => {
        const element = findElement();
        if (element) {
          resolve(element);
        } else if (retryCount < CONFIG.maxRetries) {
          setTimeout(() => this.findSelectedChat(retryCount + 1).then(resolve).catch(reject), CONFIG.delays.RETRY);
        } else {
          reject(new Error('Selected chat not found'));
        }
      });
    },

    simulatePrivateChatShortcut() {
      return eventSimulator.simulateKeyPress(document.body, 'j', {
        metaKey: CONFIG.platform.isMac,
        ctrlKey: !CONFIG.platform.isMac,
        shiftKey: true
      });
    },

    async triggerDeleteSequence() {
      try {
        const currentChat = await this.findSelectedChat();
        const clickableArea = currentChat.querySelector(CONFIG.selectors.clickableArea);
        if (!clickableArea) throw new Error('Clickable area not found');

        await eventSimulator.simulateHover(currentChat);
        await eventSimulator.simulateHover(clickableArea);

        ['mousedown', 'click'].forEach(event => eventSimulator.simulateMouseEvent(clickableArea, event));
        await utils.delay(CONFIG.delays.CLICK_TO_DELETE);

        await eventSimulator.simulateKeyPress(clickableArea, 'd', {
          metaKey: CONFIG.platform.isMac,
          shiftKey: true
        });

        await utils.delay(CONFIG.delays.DELETE_TO_ENTER);
        await eventSimulator.simulateKeyPress(clickableArea, 'Enter');

        await utils.delay(CONFIG.delays.FINAL_ESCAPE);
        await eventSimulator.simulateKeyPress(document.body, 'Escape');

        return true;
      } catch {
        return false;
      }
    }
  };

  /**
   * Main keyboard event handler
   */
  const handleKeyDown = (e) => {
    if (!chatOperations.isValidInput(document.activeElement)) return;

    if (e.key === CONFIG.shortcut.key &&
      e[CONFIG.shortcut.modifier] &&
      e.shiftKey &&
      !e.altKey) {
      e.preventDefault();
      e.stopPropagation();

      if (chatOperations.isPrivateChat()) {
        chatOperations.simulatePrivateChatShortcut();
      } else {
        chatOperations.openHistoryMenu().then(() => {
          setTimeout(chatOperations.triggerDeleteSequence.bind(chatOperations), CONFIG.delays.MENU_OPEN);
        });
      }
    }
  };

  /**
   * Initialize the script
   */
  const init = () => {
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', () => domCache.clearCache());
  };

  init();
})();