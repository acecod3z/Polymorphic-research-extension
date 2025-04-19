// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with default behavior
  chrome.storage.local.set({ currentBehavior: 'default' });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getBehavior') {
    chrome.storage.local.get(['currentBehavior'], function(result) {
      sendResponse({ behavior: result.currentBehavior });
    });
    return true; // Required for async response
  }
}); 