# Polymorphic Research Extension

This Chrome extension demonstrates polymorphic behavior for research purposes. It can modify its behavior and appearance based on user selection or other conditions.

## Features

- Multiple behavior modes that can be switched dynamically
- Persistent behavior selection using Chrome storage
- Non-intrusive modifications to web pages
- Easy-to-extend architecture for adding new behaviors

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your browser toolbar
2. Select a behavior from the dropdown menu
3. Click "Apply Behavior" to activate the selected behavior
4. The behavior will be applied to the current tab and persist until changed

## Behaviors

- **Default**: No modifications to the page
- **Morph 1**: Changes text color to red and background to light gray
- **Morph 2**: Adds green borders to all elements
- **Morph 3**: Rotates all images 180 degrees

## Research Applications

This extension can be used to study:
- Dynamic behavior modification in browser extensions
- User interaction with polymorphic interfaces
- Performance impact of different modification strategies
- Security implications of runtime behavior changes

## Extending the Extension

To add new behaviors:
1. Add a new option to the dropdown in `popup.html`
2. Implement the behavior in the `behaviors` object in `content.js`
3. The behavior will be automatically available in the popup interface 