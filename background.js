// Listener for when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  // Verify that the current tab has a URL
  if (!tab.url) {
    console.error('Could not get tab URL');
    return;
  }

  // Try to convert YouTube Short URL to normal URL
  const convertedUrl = convertShortToWatch(tab.url);

  // If the URL was converted, redirect to the new URL
  if (convertedUrl && convertedUrl !== tab.url) {
    chrome.tabs.update(tab.id, { url: convertedUrl });
    console.log(`URL converted: ${tab.url} -> ${convertedUrl}`);
  } else {
    console.log('Current URL is not a YouTube Short or already a normal URL');
    // Optionally, show a notification to the user
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: chrome.i18n.getMessage('notificationTitle'),
      message: chrome.i18n.getMessage('notificationNotAShort')
    });
  }
});

/**
 * Converts a YouTube Short URL to a normal watch URL
 * @param {string} url - The URL to convert
 * @returns {string|null} - The converted URL or null if not a Short
 */
function convertShortToWatch(url) {
  try {
    const urlObj = new URL(url);

    // Verify that it's a YouTube URL
    if (!urlObj.hostname.includes('youtube.com')) {
      return null;
    }

    // Check if it's a Short URL (format: /shorts/VIDEO_ID)
    const shortsPattern = /\/shorts\/([a-zA-Z0-9_-]+)/;
    const match = urlObj.pathname.match(shortsPattern);

    if (match && match[1]) {
      // Extract the video ID
      const videoId = match[1];

      // Build the normal watch URL
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Preserve any additional parameters from the original URL
      const searchParams = urlObj.searchParams;
      if (searchParams.toString()) {
        return `${watchUrl}&${searchParams.toString()}`;
      }

      return watchUrl;
    }

    return null;
  } catch (error) {
    console.error('Error converting URL:', error);
    return null;
  }
}

// Optional: Listener to show a different icon state based on the page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isShort = tab.url.includes('/shorts/');

    // Change the action title based on whether it's a Short or not
    if (isShort) {
      chrome.action.setTitle({
        tabId: tabId,
        title: chrome.i18n.getMessage('actionTitleConvert')
      });
    } else {
      chrome.action.setTitle({
        tabId: tabId,
        title: chrome.i18n.getMessage('actionTitleNotAShort')
      });
    }
  }
});
