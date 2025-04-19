// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with default behavior
  chrome.storage.local.set({ currentBehavior: 'default' }, function() {
    if (chrome.runtime.lastError) {
      console.error('Error setting default behavior:', chrome.runtime.lastError);
    }
  });
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

function cleanupMimicBehaviors() {
  // Remove any added styles
  const addedStyles = document.querySelectorAll('style[data-mimic]');
  addedStyles.forEach(style => style.remove());
  
  // Remove any added buttons
  const addedButtons = document.querySelectorAll('button[data-mimic]');
  addedButtons.forEach(button => button.remove());
  
  // Remove any added overlays
  const addedOverlays = document.querySelectorAll('div[data-mimic]');
  addedOverlays.forEach(overlay => overlay.remove());
}

function applyMimicBehavior(mode) {
  // Clean up previous behaviors
  cleanupMimicBehaviors();
  
  // Remove any existing mimic behaviors
  document.body.classList.remove(
    'mimic-adblock',
    'mimic-darkmode',
    'mimic-grammarly',
    'mimic-password',
    'mimic-translate'
  );
  
  // ... rest of the function
}

chrome.runtime.sendMessage({ action: 'getBehavior' }, function(response) {
  if (chrome.runtime.lastError) {
    console.error('Error getting behavior:', chrome.runtime.lastError);
    return;
  }
  
  if (response && response.behavior && behaviors[response.behavior]) {
    try {
      behaviors[response.behavior]();
    } catch (error) {
      console.error('Error applying behavior:', error);
    }
  }
}); 