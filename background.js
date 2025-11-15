// Listener for when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  // Verify that the current tab has a URL
  if (!tab.url) {
    console.error('Could not get tab URL');
    return;
  }

  // Send message to content script to get video details
  chrome.tabs.sendMessage(tab.id, { action: 'getVideoDetails' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error communicating with content script:', chrome.runtime.lastError);
    } else if (response) {
      console.log('Video details received:', response);
      // TODO: Process video details for classification (future milestone)
    }
  });

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

/**
 * Finds or creates a bookmark folder with the specified name
 * @param {string} folderName - The name of the folder to find or create
 * @param {function} callback - Callback function that receives the folder node
 */
function findOrCreateBookmarkFolder(folderName, callback) {
  // Search for existing folder
  chrome.bookmarks.search({ title: folderName }, (results) => {
    if (chrome.runtime.lastError) {
      console.error('Error searching bookmarks:', chrome.runtime.lastError);
      callback(null);
      return;
    }

    // Find a folder (not a bookmark) with the exact name
    const existingFolder = results.find(node =>
      node.title === folderName && !node.url
    );

    if (existingFolder) {
      // Folder exists, return it
      console.log('Bookmark folder found:', existingFolder);
      callback(existingFolder);
    } else {
      // Folder doesn't exist, create it in the "Other Bookmarks" folder
      chrome.bookmarks.create({
        parentId: '2', // '2' is typically the "Other Bookmarks" folder
        title: folderName
      }, (newFolder) => {
        if (chrome.runtime.lastError) {
          console.error('Error creating bookmark folder:', chrome.runtime.lastError);
          callback(null);
        } else {
          console.log('Bookmark folder created:', newFolder);
          callback(newFolder);
        }
      });
    }
  });
}

/**
 * Saves a bookmark with the specified details
 * @param {Object} bookmarkDetails - Details for the bookmark
 * @param {string} bookmarkDetails.title - Title of the bookmark
 * @param {string} bookmarkDetails.url - URL of the bookmark
 * @param {string} [bookmarkDetails.parentId] - Optional parent folder ID
 * @param {function} callback - Callback function that receives the created bookmark
 */
function saveBookmark(bookmarkDetails, callback) {
  // Validate required fields
  if (!bookmarkDetails.title || !bookmarkDetails.url) {
    console.error('Title and URL are required for saving a bookmark');
    if (callback) callback(null);
    return;
  }

  // Create the bookmark
  chrome.bookmarks.create({
    parentId: bookmarkDetails.parentId || '2', // Default to "Other Bookmarks"
    title: bookmarkDetails.title,
    url: bookmarkDetails.url
  }, (bookmark) => {
    if (chrome.runtime.lastError) {
      console.error('Error saving bookmark:', chrome.runtime.lastError);
      if (callback) callback(null);
    } else {
      console.log('Bookmark saved successfully:', bookmark);
      if (callback) callback(bookmark);
    }
  });
}
