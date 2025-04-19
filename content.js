// Behavior implementations
const behaviors = {
  default: () => {
    // Default behavior - no modifications
    console.log('Default behavior active');
  },
  
  morph1: () => {
    // First polymorphic behavior - modify text colors
    document.body.style.color = '#FF0000';
    document.body.style.backgroundColor = '#F0F0F0';
    console.log('Morph 1 behavior active');
  },
  
  morph2: () => {
    // Second polymorphic behavior - add border to all elements
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      el.style.border = '1px solid #00FF00';
    });
    console.log('Morph 2 behavior active');
  },
  
  morph3: () => {
    // Third polymorphic behavior - rotate all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.style.transform = 'rotate(180deg)';
    });
    console.log('Morph 3 behavior active');
  }
};

// Apply the current behavior when the page loads
chrome.runtime.sendMessage({ action: 'getBehavior' }, function(response) {
  if (response && response.behavior && behaviors[response.behavior]) {
    behaviors[response.behavior]();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'applyBehavior' && behaviors[message.behavior]) {
    behaviors[message.behavior]();
  }
}); 