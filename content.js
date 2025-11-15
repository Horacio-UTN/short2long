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

// Log that the content script has been loaded
console.log('Short2Long content script loaded on YouTube page');

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
