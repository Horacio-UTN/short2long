/**
 * Content Script for YouTube pages
 * This script reads the title and description of YouTube videos
 * and communicates with the background script for further processing
 */

/**
 * Extracts the video title from the YouTube page
 * @returns {string|null} The video title or null if not found
 */
function getVideoTitle() {
  // Try multiple selectors to ensure compatibility with different YouTube layouts
  const selectors = [
    'h1.ytd-watch-metadata yt-formatted-string',
    'h1.ytd-video-primary-info-renderer yt-formatted-string',
    'h1.title yt-formatted-string',
    '#title h1 yt-formatted-string',
    'h1[class*="title"]'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent) {
      return element.textContent.trim();
    }
  }

  console.warn('Could not find video title on the page');
  return null;
}

/**
 * Extracts the video description from the YouTube page
 * @returns {string|null} The video description or null if not found
 */
function getVideoDescription() {
  // Try multiple selectors for the description
  const selectors = [
    'ytd-text-inline-expander#description-inline-expander yt-attributed-string',
    'ytd-expandable-video-description-body-renderer #description-inner',
    '#description yt-attributed-string',
    '.ytd-expandable-video-description-body-renderer span[class*="content"]',
    '#description-text'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent) {
      return element.textContent.trim();
    }
  }

  console.warn('Could not find video description on the page');
  return null;
}

/**
 * Gets the current video URL
 * @returns {string} The current page URL
 */
function getVideoUrl() {
  return window.location.href;
}

/**
 * Extracts video ID from the current URL
 * @returns {string|null} The video ID or null if not found
 */
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');

  // Also check for shorts format
  if (!videoId) {
    const shortsMatch = window.location.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    return shortsMatch ? shortsMatch[1] : null;
  }

  return videoId;
}

/**
 * Collects all video information
 * @returns {Object} Object containing video title, description, URL, and ID
 */
function getVideoInfo() {
  return {
    title: getVideoTitle(),
    description: getVideoDescription(),
    url: getVideoUrl(),
    videoId: getVideoId(),
    timestamp: new Date().toISOString()
  };
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoInfo') {
    const videoInfo = getVideoInfo();
    console.log('Video info collected:', videoInfo);
    sendResponse(videoInfo);
  } else if (request.action === 'getVideoDetails') {
    const title = getVideoTitle();
    const description = getVideoDescription();
    const videoDetails = {
      title: title,
      description: description
    };
    console.log('Video details collected:', videoDetails);
    sendResponse(videoDetails);
  }
  return true; // Keep the message channel open for async response
});

/**
 * Creates the save button for the YouTube UI
 * @returns {HTMLButtonElement} The created save button element
 */
function createSaveButton() {
  const button = document.createElement('button');
  button.id = 'short2long-save-button';
  button.className = 'short2long-save-btn';
  button.textContent = '💾 Save to Short2Long';
  button.title = 'Save this video using Short2Long extension';

  // Apply styles to the button
  button.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 18px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    font-family: "Roboto", "Arial", sans-serif;
    margin-left: 8px;
  `;

  // Add hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
  });

  // Add active/click effect
  button.addEventListener('mousedown', () => {
    button.style.transform = 'scale(0.95)';
  });

  button.addEventListener('mouseup', () => {
    button.style.transform = 'scale(1)';
  });

  return button;
}

/**
 * Injects the save button into the YouTube UI
 * Tries multiple selectors to find the correct container
 */
function injectSaveButton() {
  // Check if button already exists
  if (document.getElementById('short2long-save-button')) {
    console.log('Save button already exists, skipping injection');
    return;
  }

  // Try multiple selectors to find the actions container (like/dislike/share buttons)
  const selectors = [
    '#actions ytd-menu-renderer',
    '#top-level-buttons-computed',
    'ytd-menu-renderer.ytd-watch-metadata',
    '#actions-inner',
    'ytd-video-primary-info-renderer #menu-container'
  ];

  for (const selector of selectors) {
    const container = document.querySelector(selector);
    if (container) {
      const button = createSaveButton();

      // Add click listener to send message to background script
      button.addEventListener('click', handleSaveButtonClick);

      // Insert the button into the container
      container.appendChild(button);
      console.log('Save button injected successfully using selector:', selector);
      return;
    }
  }

  console.warn('Could not find suitable container for save button');
}

/**
 * Handles the click event on the save button
 * Sends a message to the background script to process the video
 */
function handleSaveButtonClick() {
  const button = document.getElementById('short2long-save-button');

  // Disable button temporarily to prevent multiple clicks
  button.disabled = true;
  button.style.opacity = '0.6';
  button.style.cursor = 'not-allowed';
  const originalText = button.textContent;
  button.textContent = '⏳ Saving...';

  // Get current video details
  const videoDetails = {
    title: getVideoTitle(),
    description: getVideoDescription()
  };

  // Send message to background script
  chrome.runtime.sendMessage({
    action: 'saveVideo',
    videoDetails: videoDetails,
    url: getVideoUrl()
  }, (response) => {
    // Re-enable button after response
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';

    if (chrome.runtime.lastError) {
      console.error('Error sending message to background:', chrome.runtime.lastError);
      button.textContent = '❌ Error';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    } else {
      console.log('Save request sent successfully');
      button.textContent = '✅ Saved!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  });
}

/**
 * Observes changes in the DOM to re-inject button when navigating between videos
 */
function observePageChanges() {
  // YouTube is a Single Page Application, so we need to watch for navigation
  let lastUrl = location.href;

  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log('URL changed, attempting to re-inject button');

      // Wait a bit for the page to load
      setTimeout(() => {
        injectSaveButton();
      }, 1000);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Log that the content script has been loaded
console.log('Short2Long content script loaded on YouTube page');

// Inject the save button when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectSaveButton, 1500);
  });
} else {
  // Page already loaded
  setTimeout(injectSaveButton, 1500);
}

// Start observing for page changes (YouTube SPA navigation)
observePageChanges();

// Optional: Notify background script that content script is ready
chrome.runtime.sendMessage({
  action: 'contentScriptReady',
  url: window.location.href
}, (response) => {
  if (chrome.runtime.lastError) {
    // Background script might not be listening, which is fine
    console.log('Background script not listening (expected on initial load)');
  }
});
