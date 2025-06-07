# Grok Userscripts

- [Introduction](#introduction)
- [Installation Instructions](#installation-instructions)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Additional Notes](#additional-notes)

## Introduction

Welcome to the Grok Userscripts repository! This collection includes various user scripts designed to enhance your experience with Grok, the AI assistant developed by xAI. These scripts are mostly AI-generated and have been tested with Firefox and the Violentmonkey extension. For more information on Grok and its capabilities, visit the [official xAI website](https://x.ai). **Please note that I am in no way affiliated with xAI, and these scripts are created independently to enhance user experience.**

## Installation Instructions

To use these scripts, follow these steps:

1. **Install a Userscript Manager**: We recommend [Violentmonkey](https://violentmonkey.github.io/), available for Firefox, Chrome, and other browsers. Note that while these scripts have been tested with Firefox and Violentmonkey, they may also work with other browsers and userscript managers.
2. **Add or Update Scripts**: You can add or update scripts by:
   - Cloning this repository and loading the scripts manually into your userscript manager.
   - Using the "Install from URL" feature with the raw GitHub URL of the script file (e.g., `https://raw.githubusercontent.com/nisc/grok-userscripts/main/grok-private-by-default.user.js`).
   - If already installed, use your userscript manager's update feature to check for updates.

**Note on Compatibility**: These scripts have been tested on macOS with Firefox and Violentmonkey. While they should work on Linux and Windows as well, you may need to adjust some settings or configurations for your specific environment. If you encounter any issues, please report them in the repository's issue tracker.

## Available Scripts

Below is a list of scripts included in this repository, sorted alphabetically by script name, each with a brief description of its functionality:

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

**Note**: As these scripts are mostly AI-generated, they are provided as-is. Users are encouraged to review the code for security and functionality concerns. Please report any issues or suggestions in the repository's issue tracker.

## Contributing

If you have ideas for new scripts or improvements to existing ones, feel free to contribute! You can submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Additional Notes

When using these scripts, please keep the following important considerations in mind:

1. **Terms of Service & Security**:
   - Always review Grok's current Terms of Service before using any userscripts
   - Review script code before installation, especially from unofficial sources
   - Keep your userscript manager and scripts updated to latest versions
   - Be aware that website functionality may change, affecting script behavior

2. **Performance & Compatibility**:
   - Multiple active userscripts may affect website performance
   - Scripts may behave differently across browsers and operating systems
   - Some scripts may conflict with each other or with browser extensions
   - Report compatibility issues to help maintain script functionality

3. **Updates & Maintenance**:
   - Scripts may need updates when Grok's interface changes
   - Check the repository regularly for important updates and patches
   - Consider contributing fixes if you encounter issues
   - Some features might become officially supported by Grok, making scripts redundant

Remember that these scripts are community contributions and not officially supported by xAI. Use them responsibly and report any unexpected behavior through the appropriate channels.
