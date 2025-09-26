# Grok Userscripts

- [Introduction](#introduction)
- [Installation Instructions](#installation-instructions)
- [Available Scripts](#available-scripts)

## Introduction

This collection includes various user scripts designed to enhance your experience with Grok, the AI assistant developed by xAI. For more information on Grok and its capabilities, visit the [official xAI website](https://x.ai). **Please note that I am in no way affiliated with xAI.**

## Installation Instructions

1. Install a userscript manager like [Violentmonkey](https://violentmonkey.github.io/)
2. Click on any script in the list below to install it, or manually add scripts using your userscript manager's "Install from URL" feature

These scripts have been tested with Firefox and Violentmonkey on macOS, but should work with other browsers and userscript managers as well.

## Available Scripts

| Script Name | Description |
|-------------|-------------|
| [`grok-delete-chat-shortcut.user.js`](grok-delete-chat-shortcut.user.js) | Enables quick deletion of chats on grok.com using Cmd/Ctrl+Shift+Delete, with automatic confirmation of the deletion prompt. |
| [`grok-delete-file-uploads.user.js`](grok-delete-file-uploads.user.js) | Adds a "Delete all files" button on the Grok files page (`https://grok.com/files`) to batch delete all uploaded files. |
| [`grok-fix-firefox-search-shortcut.user.js`](grok-fix-firefox-search-shortcut.user.js) | Disables the CMD+K shortcut in Grok to prevent conflicts with Firefox's own shortcuts, while still allowing SHIFT-CTRL-K as an alternative. |
| [`grok-private-by-default.user.js`](grok-private-by-default.user.js) | Automatically redirects to the private chat mode on grok.com when accessing the root path (`/`) or `/chat` without `#private`. |
| [`grok-quota-display.user.js`](grok-quota-display.user.js) | Displays current rate limits for different request types in a fixed menu at the bottom right of grok.com pages. |
| [`grok-return-from-files-view-shortcut.user.js`](grok-return-from-files-view-shortcut.user.js) | Allows returning from the files view (`https://grok.com/files`) to the previous page or main page (`https://grok.com`) using the ESC key. |
| [`grok-theme-toggle.user.js`](grok-theme-toggle.user.js) | Adds a toggle button at the bottom left to switch between light and dark themes on grok.com, with theme persistence. |
| [`grok-think-shortcut.user.js`](grok-think-shortcut.user.js) | Adds keyboard shortcut (Ctrl+Cmd+T on macOS, Ctrl+Alt+T on Windows/Linux) to quickly toggle Grok's "Think" mode without using the mouse. |