// Behavior descriptions
const behaviorDescriptions = {
  default: "Default behavior with no modifications",
  morph1: "Enhances visual elements with color adjustments and highlighting",
  morph2: "Adds interactive elements and hover effects to page content",
  morph3: "Improves accessibility with high contrast and text enlargement",
  morph4: "Applies various animation effects to page elements",
  morph5: "Analyzes and highlights important content on the page",
  morph6: "Enhances security by modifying potentially sensitive elements"
};

document.addEventListener('DOMContentLoaded', function() {
  // UI Elements
  const behaviorSelect = document.getElementById('behavior-select');
  const applyButton = document.getElementById('apply-behavior');
  const resetButton = document.getElementById('reset-behavior');
  const saveButton = document.getElementById('save-settings');
  const statusDiv = document.getElementById('status');
  const behaviorPreview = document.getElementById('behavior-preview');
  const autoSwitch = document.getElementById('auto-switch');
  const randomizeSwitch = document.getElementById('randomize-switch');
  const intensitySlider = document.getElementById('intensity-slider');
  const durationSlider = document.getElementById('duration-slider');
  const switchInterval = document.getElementById('switch-interval');
  const intensityValue = document.getElementById('intensity-value');
  const durationValue = document.getElementById('duration-value');

  // Load saved settings
  chrome.storage.local.get([
    'currentBehavior',
    'autoSwitchEnabled',
    'randomizeEnabled',
    'intensity',
    'duration',
    'switchInterval'
  ], function(result) {
    if (result.currentBehavior) {
      behaviorSelect.value = result.currentBehavior;
      updateBehaviorPreview(result.currentBehavior);
    }
    if (result.autoSwitchEnabled !== undefined) {
      autoSwitch.checked = result.autoSwitchEnabled;
      updateSwitchUI(autoSwitch);
    }
    if (result.randomizeEnabled !== undefined) {
      randomizeSwitch.checked = result.randomizeEnabled;
      updateSwitchUI(randomizeSwitch);
    }
    if (result.intensity) {
      intensitySlider.value = result.intensity;
      intensityValue.textContent = `${result.intensity}%`;
    }
    if (result.duration) {
      durationSlider.value = result.duration;
      durationValue.textContent = `${result.duration}s`;
    }
    if (result.switchInterval) {
      switchInterval.value = result.switchInterval;
    }
  });

  // Event Listeners
  behaviorSelect.addEventListener('change', function() {
    updateBehaviorPreview(this.value);
  });

  intensitySlider.addEventListener('input', function() {
    intensityValue.textContent = `${this.value}%`;
  });

  durationSlider.addEventListener('input', function() {
    durationValue.textContent = `${this.value}s`;
  });

  // Toggle switch event listeners
  autoSwitch.addEventListener('change', function() {
    updateSwitchUI(this);
    saveToggleState('autoSwitchEnabled', this.checked);
  });

  randomizeSwitch.addEventListener('change', function() {
    updateSwitchUI(this);
    saveToggleState('randomizeEnabled', this.checked);
  });

  applyButton.addEventListener('click', function() {
    const settings = {
      behavior: behaviorSelect.value,
      intensity: intensitySlider.value,
      duration: durationSlider.value,
      autoSwitchEnabled: autoSwitch.checked,
      randomizeEnabled: randomizeSwitch.checked,
      switchInterval: switchInterval.value
    };

    applyBehavior(settings);
  });

  resetButton.addEventListener('click', function() {
    resetToDefault();
  });

  saveButton.addEventListener('click', function() {
    saveSettings();
  });

  // Functions
  function updateSwitchUI(switchElement) {
    const slider = switchElement.nextElementSibling;
    if (switchElement.checked) {
      slider.style.backgroundColor = 'var(--primary-color)';
    } else {
      slider.style.backgroundColor = '#ccc';
    }
  }

  function saveToggleState(key, value) {
    chrome.storage.local.set({ [key]: value }, function() {
      showStatus(`${key} ${value ? 'enabled' : 'disabled'}`, 'success');
    });
  }

  function updateBehaviorPreview(behavior) {
    behaviorPreview.textContent = behaviorDescriptions[behavior] || "No description available";
  }

  function applyBehavior(settings) {
    chrome.storage.local.set(settings, function() {
      showStatus('Behavior applied successfully!', 'success');
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'applyBehavior',
          settings: settings
        });
      });

      if (settings.autoSwitchEnabled) {
        setupAutoSwitch(settings);
      } else {
        chrome.alarms.clear('behaviorSwitch');
      }
    });
  }

  function resetToDefault() {
    const defaultSettings = {
      behavior: 'default',
      intensity: 50,
      duration: 5,
      autoSwitchEnabled: false,
      randomizeEnabled: false,
      switchInterval: 5
    };

    chrome.storage.local.set(defaultSettings, function() {
      showStatus('Reset to default settings', 'success');
      location.reload();
    });
  }

  function saveSettings() {
    const settings = {
      autoSwitchEnabled: autoSwitch.checked,
      randomizeEnabled: randomizeSwitch.checked,
      intensity: intensitySlider.value,
      duration: durationSlider.value,
      switchInterval: switchInterval.value
    };

    chrome.storage.local.set(settings, function() {
      showStatus('Settings saved successfully!', 'success');
    });
  }

  function setupAutoSwitch(settings) {
    chrome.alarms.create('behaviorSwitch', {
      delayInMinutes: parseInt(settings.switchInterval),
      periodInMinutes: parseInt(settings.switchInterval)
    });
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 3000);
  }
}); 