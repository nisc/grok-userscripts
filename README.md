# Grok Userscripts

- [Introduction](#introduction)
- [Installation Instructions](#installation-instructions)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Additional Notes](#additional-notes)

## Introduction

Welcome to the Grok Userscripts repository! This collection includes various user scripts designed to enhance your experience with Grok, the AI assistant developed by xAI. For more information on Grok and its capabilities, visit the [official xAI website](https://x.ai). **Please note that I am in no way affiliated with xAI.**

⚠️ **DISCLAIMER**: These scripts are provided "AS IS" without warranty of any kind. Use them at your own risk. The authors are not responsible for any consequences of using these scripts, including but not limited to:
- Account-related issues
- Data loss or corruption
- Browser performance problems
- Any changes to Grok's functionality or behavior
- Terms of Service violations

## Installation Instructions

1. Install a userscript manager like [Violentmonkey](https://violentmonkey.github.io/)
2. Click on any script in the list below to install it, or manually add scripts using your userscript manager's "Install from URL" feature

These scripts have been tested with Firefox and Violentmonkey on macOS, but should work with other browsers and userscript managers as well.

## Available Scripts

| Script Name | Description |
|-------------|-------------|
| [`grok-delete-file-uploads.user.js`](grok-delete-file-uploads.user.js) | Adds a "Delete all files" button on the Grok files page (`https://grok.com/files`) to remove all uploaded files with a single click. |
| [`grok-easy-delete-chat.user.js`](grok-easy-delete-chat.user.js) | Enables quick deletion of chats on grok.com using Cmd/Ctrl+Shift+Delete, with automatic confirmation of the deletion prompt. |
| [`grok-fix-firefox-search-shortcut.user.js`](grok-fix-firefox-search-shortcut.user.js) | Disables the CMD+K shortcut in Grok to prevent conflicts with Firefox's own shortcuts, while still allowing SHIFT-CTRL-K as an alternative. |
| [`grok-hide-annoyances.user.js`](grok-hide-annoyances.user.js) | Hides the "Grok 3 Enabled" notification bubble for a cleaner interface on grok.com. |
| [`grok-private-by-default.user.js`](grok-private-by-default.user.js) | Automatically redirects to the private chat mode on grok.com when accessing the root path (`/`) or `/chat` without `#private`. |
| [`grok-quota-display.user.js`](grok-quota-display.user.js) | Displays the current rate limits for different request types (e.g., DEFAULT, REASONING) in Grok-3, shown in a menu at the bottom right of grok.com pages. |
| [`grok-return-from-files-view-shortcut.user.js`](grok-return-from-files-view-shortcut.user.js) | Allows returning from the files view (`https://grok.com/files`) to the previous page or main page (`https://grok.com`) using the ESC key. |
| [`grok-theme-toggle.user.js`](grok-theme-toggle.user.js) | Provides a draggable toggle button at the bottom left to switch between light and dark themes on grok.com, with theme persistence via local storage. |

## Contributing

Submit a pull request or open an issue to discuss your ideas for improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Additional Notes

1. **Security & Maintenance**:
   - Review script code before installation
   - Keep all components (scripts, userscript manager) updated
   - Report security concerns via issues

2. **Performance & Compatibility**:
   - Scripts may behave differently across browsers and systems
   - Scripts may conflict with each other or extensions
   - Report compatibility issues

3. **Future Changes**:
   - Scripts may need updates when Grok changes
   - Features may become officially supported
   - Consider contributing fixes

By installing and using these scripts, you acknowledge that you do so at your own risk. The authors and contributors cannot be held liable for any issues that may arise from their use.
