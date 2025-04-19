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
  } else if (message.action === 'applyMimicMode') {
    applyMimicBehavior(message.mode);
  }
});

// Mimic behaviors implementation
function applyMimicBehavior(mode) {
  // Remove any existing mimic behaviors
  document.body.classList.remove(
    'mimic-adblock',
    'mimic-darkmode',
    'mimic-grammarly',
    'mimic-password',
    'mimic-translate'
  );

  // Apply selected mimic behavior
  switch(mode) {
    case 'adblock':
      mimicAdBlock();
      break;
    case 'darkmode':
      mimicDarkMode();
      break;
    case 'grammarly':
      mimicGrammarly();
      break;
    case 'password':
      mimicPasswordManager();
      break;
    case 'translate':
      mimicTranslator();
      break;
  }
}

function mimicAdBlock() {
  document.body.classList.add('mimic-adblock');
  
  // Block common ad elements
  const adSelectors = [
    '[class*="ad-"]',
    '[class*="banner"]',
    '[class*="sponsored"]',
    'iframe[src*="ads"]',
    'div[data-ad]'
  ];
  
  adSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
    });
  });
}

function mimicDarkMode() {
  document.body.classList.add('mimic-darkmode');
  
  // Apply dark mode styles
  const darkModeStyles = `
    body {
      background-color: #1a1a1a !important;
      color: #ffffff !important;
    }
    * {
      background-color: #1a1a1a !important;
      color: #ffffff !important;
      border-color: #333 !important;
    }
    a {
      color: #4CAF50 !important;
    }
    input, textarea, select {
      background-color: #333 !important;
      color: #ffffff !important;
      border-color: #555 !important;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = darkModeStyles;
  document.head.appendChild(style);
}

function mimicGrammarly() {
  document.body.classList.add('mimic-grammarly');
  
  // Add grammar check styles
  const grammarStyles = `
    .grammar-error {
      border-bottom: 2px solid #ff0000;
      position: relative;
    }
    .grammar-error:hover::after {
      content: "Grammar suggestion";
      position: absolute;
      background: #333;
      color: white;
      padding: 5px;
      border-radius: 3px;
      font-size: 12px;
      bottom: 100%;
      left: 0;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = grammarStyles;
  document.head.appendChild(style);
}

function mimicPasswordManager() {
  document.body.classList.add('mimic-password');
  
  // Find password fields
  const passwordFields = document.querySelectorAll('input[type="password"]');
  
  passwordFields.forEach(field => {
    // Add save password button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Password';
    saveButton.style.marginLeft = '10px';
    saveButton.style.padding = '5px 10px';
    saveButton.style.backgroundColor = '#4CAF50';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '3px';
    saveButton.style.cursor = 'pointer';
    
    field.parentNode.insertBefore(saveButton, field.nextSibling);
  });
}

function mimicTranslator() {
  document.body.classList.add('mimic-translate');
  
  // Add translation overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '10px';
  overlay.style.right = '10px';
  overlay.style.zIndex = '9999';
  overlay.style.padding = '10px';
  overlay.style.backgroundColor = 'white';
  overlay.style.borderRadius = '5px';
  overlay.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  
  const select = document.createElement('select');
  select.innerHTML = `
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="it">Italian</option>
  `;
  
  overlay.appendChild(select);
  document.body.appendChild(overlay);
} 