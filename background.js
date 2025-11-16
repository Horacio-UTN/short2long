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
      // Process video details using the heuristics matcher
      processVideoWithMatcher(response, tab.url);
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

/**
 * Matches a video title against the user's interest map using heuristics
 * @param {string} title - The video title to match
 * @param {string} interestMap - The user's interest map (newline or comma-separated)
 * @returns {string|null} - The matched interest or null if no match found
 */
function matchTitleWithInterests(title, interestMap) {
  if (!title || !interestMap) {
    return null;
  }

  // Parse the interest map - support both newline and comma-separated formats
  const interests = interestMap
    .split(/[\n,]/)
    .map(interest => interest.trim())
    .filter(interest => interest.length > 0);

  if (interests.length === 0) {
    return null;
  }

  // Convert title to lowercase for case-insensitive matching
  const titleLower = title.toLowerCase();

  // Find the first interest that matches (case-insensitive substring search)
  for (const interest of interests) {
    const interestLower = interest.toLowerCase();
    if (titleLower.includes(interestLower)) {
      console.log(`Match found: "${interest}" in title "${title}"`);
      return interest;
    }
  }

  console.log(`No match found for title: "${title}"`);
  return null;
}

/**
 * Processes video details using the heuristics matcher
 * Reads the interest map, matches the title, and saves bookmark if match found
 * @param {Object} videoDetails - Video details from content script
 * @param {string} videoDetails.title - Video title
 * @param {string} videoDetails.description - Video description
 * @param {string} videoUrl - The URL of the video
 * @param {function} sendResponse - Callback function to send response back to content script
 */
function processVideoWithMatcher(videoDetails, videoUrl, sendResponse) {
  if (!videoDetails || !videoDetails.title) {
    console.error('Invalid video details received');
    sendResponse({ success: false, error: 'Invalid video details' });
    return;
  }

  // Read the Interest Map from chrome.storage.sync
  chrome.storage.sync.get(['interestMap'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error reading interest map:', chrome.runtime.lastError);
      sendResponse({ success: false, error: 'Error reading interest map' });
      return;
    }

    const interestMap = result.interestMap;

    if (!interestMap || interestMap.trim().length === 0) {
      console.log('Interest map is empty. Please configure your interests in the options page.');
      sendResponse({ success: false, error: 'Interest map is empty. Please configure your interests in the extension options.' });
      return;
    }

    // Match the video title with interests
    const matchedInterest = matchTitleWithInterests(videoDetails.title, interestMap);

    if (matchedInterest) {
      // Match found! Create/find bookmark folder and save the bookmark
      findOrCreateBookmarkFolder(matchedInterest, (folder) => {
        if (!folder) {
          console.error('Failed to create or find bookmark folder');
          sendResponse({ success: false, error: 'Failed to create bookmark folder' });
          return;
        }

        // Save the bookmark in the matched interest folder
        saveBookmark({
          title: videoDetails.title,
          url: videoUrl,
          parentId: folder.id
        }, (bookmark) => {
          if (bookmark) {
            // Success! Send response to content script
            sendResponse({ success: true, message: `Video saved to "${matchedInterest}"` });
          } else {
            sendResponse({ success: false, error: 'Error saving bookmark' });
          }
        });
      });
    } else {
      // No match found
      console.log('No matching interest found for this video');
      sendResponse({ success: false, error: 'No matching interest found' });
    }
  });
}

// Listen for messages from content script (e.g., from the save button)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveVideo') {
    console.log('Save video request received from content script');

    // ¡ARREGLO! Pasamos `sendResponse` a la función asíncrona.
    processVideoWithMatcher(request.videoDetails, request.url, sendResponse);

    return true; // ¡Ahora SÍ esperamos una respuesta asíncrona!
  }
  return false; // Buena práctica
});
