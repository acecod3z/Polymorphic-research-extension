// Constants
const BEHAVIOR_DESCRIPTIONS = {
  default: "Default behavior with no modifications",
  morph1: "Enhances visual elements with color adjustments and highlighting",
  morph2: "Adds interactive elements and hover effects to page content",
  morph3: "Improves accessibility with high contrast and text enlargement",
  morph4: "Applies various animation effects to page elements",
  morph5: "Analyzes and highlights important content on the page",
  morph6: "Enhances security by modifying potentially sensitive elements"
};

const MIMIC_DESCRIPTIONS = {
  none: "No mimic mode active",
  adblock: "Blocks advertisements and tracking elements",
  darkmode: "Applies dark theme to web pages",
  grammarly: "Highlights and suggests grammar improvements",
  password: "Detects and offers to save passwords",
  translate: "Translates page content to selected language"
};

// Main application
(function() {
  'use strict';

  // UI Elements
  let behaviorSelect;
  let applyButton;
  let resetButton;
  let saveButton;
  let statusDiv;
  let behaviorPreview;
  let mimicSelect;
  let mimicPreview;
  let autoSwitch;
  let randomizeSwitch;
  let intensitySlider;
  let durationSlider;
  let switchInterval;
  let intensityValue;
  let durationValue;

  // Initialize the application
  function init() {
    initializeElements();
    loadSavedSettings();
    setupEventListeners();
  }

  // Initialize DOM elements
  function initializeElements() {
    behaviorSelect = document.getElementById('behavior-select');
    applyButton = document.getElementById('apply-behavior');
    resetButton = document.getElementById('reset-behavior');
    saveButton = document.getElementById('save-settings');
    statusDiv = document.getElementById('status');
    behaviorPreview = document.getElementById('behavior-preview');
    mimicSelect = document.getElementById('mimic-select');
    mimicPreview = document.getElementById('mimic-preview');
    autoSwitch = document.getElementById('auto-switch');
    randomizeSwitch = document.getElementById('randomize-switch');
    intensitySlider = document.getElementById('intensity-slider');
    durationSlider = document.getElementById('duration-slider');
    switchInterval = document.getElementById('switch-interval');
    intensityValue = document.getElementById('intensity-value');
    durationValue = document.getElementById('duration-value');
  }

  // Load saved settings from storage
  function loadSavedSettings() {
    chrome.storage.local.get([
      'currentBehavior',
      'autoSwitchEnabled',
      'randomizeEnabled',
      'intensity',
      'duration',
      'switchInterval',
      'mimicMode'
    ], function(result) {
      if (result.currentBehavior) {
        behaviorSelect.value = result.currentBehavior;
        updateBehaviorPreview(result.currentBehavior);
      }
      if (result.mimicMode) {
        mimicSelect.value = result.mimicMode;
        updateMimicPreview(result.mimicMode);
      }
      if (result.autoSwitchEnabled !== undefined) {
        autoSwitch.checked = result.autoSwitchEnabled;
        updateToggleUI(autoSwitch);
      }
      if (result.randomizeEnabled !== undefined) {
        randomizeSwitch.checked = result.randomizeEnabled;
        updateToggleUI(randomizeSwitch);
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
  }

  // Set up event listeners
  function setupEventListeners() {
    behaviorSelect.addEventListener('change', () => {
      updateBehaviorPreview(behaviorSelect.value);
    });

    mimicSelect.addEventListener('change', () => {
      updateMimicPreview(mimicSelect.value);
      applyMimicMode(mimicSelect.value);
    });

    intensitySlider.addEventListener('input', () => {
      intensityValue.textContent = `${intensitySlider.value}%`;
    });

    durationSlider.addEventListener('input', () => {
      durationValue.textContent = `${durationSlider.value}s`;
    });

    autoSwitch.addEventListener('change', () => {
      updateToggleUI(autoSwitch);
      saveToggleState('autoSwitchEnabled', autoSwitch.checked);
    });

    randomizeSwitch.addEventListener('change', () => {
      updateToggleUI(randomizeSwitch);
      saveToggleState('randomizeEnabled', randomizeSwitch.checked);
    });

    applyButton.addEventListener('click', () => {
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

    resetButton.addEventListener('click', resetToDefault);
    saveButton.addEventListener('click', saveSettings);
  }

  // Helper functions
  function updateToggleUI(toggleElement) {
    const slider = toggleElement.nextElementSibling;
    slider.style.backgroundColor = toggleElement.checked ? 'var(--primary-color)' : '#ccc';
  }

  function saveToggleState(key, value) {
    chrome.storage.local.set({ [key]: value }, () => {
      showStatus(`${key} ${value ? 'enabled' : 'disabled'}`, 'success');
    });
  }

  function updateBehaviorPreview(behavior) {
    behaviorPreview.textContent = BEHAVIOR_DESCRIPTIONS[behavior] || "No description available";
  }

  function updateMimicPreview(mode) {
    mimicPreview.textContent = MIMIC_DESCRIPTIONS[mode] || "No description available";
  }

  function applyBehavior(settings) {
    chrome.storage.local.set(settings, () => {
      showStatus('Behavior applied successfully!', 'success');
      
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
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

  function applyMimicMode(mode) {
    chrome.storage.local.set({ mimicMode: mode }, () => {
      showStatus(`Mimic mode "${mode}" applied`, 'success');
      
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'applyMimicMode',
          mode: mode
        });
      });
    });
  }

  function resetToDefault() {
    const defaultSettings = {
      behavior: 'default',
      intensity: 50,
      duration: 5,
      autoSwitchEnabled: false,
      randomizeEnabled: false,
      switchInterval: 5,
      mimicMode: 'none'
    };

    chrome.storage.local.set(defaultSettings, () => {
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

    chrome.storage.local.set(settings, () => {
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

  // Initialize the application when the DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
})(); 