# YouTube Shorts to Watch Converter

![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome%20Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*[Read this in Spanish / Leer en español](README.es.md)*

A simple Chrome extension designed to solve a common problem on the desktop version of YouTube: the Shorts interface.

## The Problem

When browsing YouTube Shorts on a PC, the interface hides key features such as:
* The comments section.
* The "Save to playlist" option (or save to "Watch later").
* The full video description.

## The Solution

This extension detects if you're on a YouTube Short video (`youtube.com/shorts/...`) and adds a button to the page (or activates when you click the extension icon) that instantly redirects you to the standard video interface (`youtube.com/watch?v=...`).

**With a single click, you get back the comments, save option, and description!**

## How to Use

1. Navigate to any YouTube Short video (e.g., `https://www.youtube.com/shorts/VIDEO_ID`).
2. Click the extension icon in your browser toolbar.
3. The tab will automatically reload with the standard video URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`).

## Project Structure

```
short2long/
├── manifest.json       # Extension configuration
├── background.js       # Main conversion logic
├── _locales/           # i18n translation files
│   ├── en/
│   │   └── messages.json  # English translations
│   └── es/
│       └── messages.json  # Spanish translations
├── icons/              # Extension icons
│   ├── icon.svg       # Base icon in SVG format
│   ├── icon16.png     # 16x16 icon (must be generated)
│   ├── icon48.png     # 48x48 icon (must be generated)
│   └── icon128.png    # 128x128 icon (must be generated)
└── README.md
```

## Installation (Manual)

Since this extension is not (yet) on the Chrome Web Store, you can load it manually:

### 1. Prepare the Icons

PNG icons must be generated from the included SVG file. You can do this in several ways:

**Option A: Use an online converter**
- Upload `icons/icon.svg` to https://cloudconvert.com/svg-to-png
- Generate versions of 16x16, 48x48, and 128x128 pixels
- Save them in the `icons/` folder with the corresponding names

**Option B: Use ImageMagick (if installed)**
```bash
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

**Option C: Use your own icons**
- Simply place your PNG images in the `icons/` folder with the correct sizes

### 2. Load the Extension in Chrome

1. Clone or download this repository to your computer.
2. Make sure you have the PNG icons in the `icons/` folder (see previous step).
3. Open Google Chrome and go to `chrome://extensions/`.
4. Enable **"Developer mode"** (usually a toggle in the top right corner).
5. Click **"Load unpacked"**.
6. Select the folder where you downloaded (or cloned) this project.
7. Done! The extension icon should appear in your toolbar.

## Technical Features

- **Manifest V3**: Uses the latest version of Chrome's manifest
- **Service Worker**: Optimized background script for better performance
- **Notifications**: Visual feedback when the extension is used on non-Short pages
- **Dynamic Title**: The extension icon changes its tooltip based on the page type
- **Parameter Preservation**: Maintains any additional parameters from the original URL
- **i18n Support**: Multilingual support (English and Spanish)

## How It Works

The extension:

1. Listens for clicks on the extension icon (`chrome.action.onClicked`)
2. Verifies if the current URL is a YouTube Short (format: `/shorts/VIDEO_ID`)
3. Extracts the video ID from the URL
4. Builds the standard watch URL (`/watch?v=VIDEO_ID`)
5. Redirects the current tab to the new URL

## Privacy

This extension:
- ✅ Does NOT collect any data
- ✅ Does NOT require access to your browsing history
- ✅ Only works when you click the icon
- ✅ Only has permissions for youtube.com

## Supported Languages

- 🇬🇧 English
- 🇪🇸 Spanish

The extension automatically detects your browser's language and displays the appropriate content.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is open source and available for free use.
