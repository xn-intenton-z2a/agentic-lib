# WEB_ACCESSIBILITY

## Crawl Summary
The technical details provide exact keyboard shortcuts for adjusting text size across different operating systems, with explicit instructions for both full page zoom and text-only zoom. It includes browser-specific guidance from Google Chrome, Apple Safari, Mozilla Firefox, and others; details on Reader View and advanced options using browser extensions are also provided.

## Normalised Extract
## Table of Contents
1. Browser Zoom Key Combinations
2. Detailed Steps for Text Size Adjustment
3. Browser Specific Configuration
4. Advanced Options & Reader View
5. Troubleshooting

## 1. Browser Zoom Key Combinations
- Windows, Linux, Chrome OS: Zoom in (Ctrl + +), Zoom out (Ctrl + -)
- Mac OS: Zoom in (⌘ + +), Zoom out (⌘ + -)

## 2. Detailed Steps for Text Size Adjustment
- Step 1: Press the appropriate key combination to invoke browser zoom.
- Step 2: Adjust page zoom settings via browser menus (e.g., Chrome Settings > Appearance > Page Zoom).
- Configuration: Default page zoom is typically 100% but may be set to custom scales (e.g., 125%, 150%).

## 3. Browser Specific Configuration
- **Google Chrome:** Navigate to Settings > Appearance > Page Zoom. Also supports text-only zoom adjustments through flags or extensions.
- **Mozilla Firefox:** Accessible via Options > Language and Appearance with options for full page and text-only zoom.
- **Apple Safari:** Offers zoom options via menu and Reader View customization (font size, color, spacing).

## 4. Advanced Options & Reader View
- Enable Reader View to isolate content and configure settings like text font, size, color, background, and line spacing.
- Use extensions such as Stylus for advanced style overriding when native user stylesheets are unsupported.

## 5. Troubleshooting
- Check browser compatibility and verify that website design supports zoom adjustments.
- Use browser developer tools to inspect computed styles if custom zoom settings are not applied.
- Confirm that system keyboard shortcuts are not overridden by other applications.

## Supplementary Details
### Exact Parameter Values & Configuration Options
- **Zoom Scale Range:** Typically allowed values range from 25% (0.25) to 500% (5.0) with a step of 10-25% increments.
- **Default Zoom:** 100% (1.0 scale)
- **Browser Settings Path Examples:**
  - Chrome: Settings > Appearance > Page Zoom (Options such as 90%, 100%, 110% available)
  - Firefox: Options > Language and Appearance > Zoom (Settings for both full page and text-only zoom).

### Implementation Steps for Developers
1. Detect key events using JavaScript event listeners for keyboard shortcuts (e.g., Ctrl/⌘ and + or -).
2. Modify the CSS property `zoom` or `transform: scale()` on the document’s root element.
3. Provide UI feedback and allow custom input for non-standard zoom levels.

Example JavaScript snippet:
```javascript
/**
 * Adjusts the zoom level on the document
 * @param {number} scale - The desired zoom scale factor (e.g., 1.0 for 100%)
 * @throws {Error} if scale is out of valid bounds (0.5 to 3.0 recommended)
 */
function adjustZoom(scale) {
  if (scale < 0.5 || scale > 3.0) {
    throw new Error('Invalid scale parameter. Must be between 0.5 and 3.0.');
  }
  document.documentElement.style.zoom = scale;
}

// Event listener for keydown to adjust zoom
document.addEventListener('keydown', function(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === '+') {
    // Increase zoom by 10%
    let currentZoom = parseFloat(document.documentElement.style.zoom) || 1.0;
    adjustZoom(currentZoom + 0.1);
    event.preventDefault();
  } else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
    // Decrease zoom by 10%
    let currentZoom = parseFloat(document.documentElement.style.zoom) || 1.0;
    adjustZoom(currentZoom - 0.1);
    event.preventDefault();
  }
});
```

### Best Practices
- Always validate the zoom scale value before applying changes.
- Use browser APIs and CSS standards to ensure cross-browser compatibility.
- Test zoom functionality in multiple browsers to confirm that both text and visual elements scale appropriately.

### Troubleshooting Procedures
1. Verify that the browser version supports the CSS zoom property (alternative: use transform scale).
2. Use browser developer tools (F12) to inspect the applied styles and confirm that the correct zoom level is set.
3. If custom extensions or user scripts are interfering, disable them and test functionality in incognito mode.
4. Check for JavaScript errors in the console and ensure that event listeners are correctly attached.

## Reference Details
### Complete API Specifications & SDK Method Signatures

#### Function: adjustZoom
- **Signature:**
  ```typescript
  function adjustZoom(scale: number): void
  ```
- **Parameters:**
  - scale: number (A floating point value representing the zoom factor; valid values range from 0.5 to 3.0, default is 1.0)
- **Return Type:** void
- **Exceptions:** Throws an Error if the scale is out of bounds.

#### Event Listener for Keyboard Shortcuts
- **Implementation:**
  ```javascript
  /**
   * Handles keyboard events for zoom adjustments.
   * Listens for Ctrl (or ⌘) and '+' or '-' key presses.
   */
  document.addEventListener('keydown', function(event) {
    // Increase zoom
    if ((event.ctrlKey || event.metaKey) && event.key === '+') {
      let currentZoom = parseFloat(document.documentElement.style.zoom) || 1.0;
      adjustZoom(currentZoom + 0.1);
      event.preventDefault();
    // Decrease zoom
    } else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
      let currentZoom = parseFloat(document.documentElement.style.zoom) || 1.0;
      adjustZoom(currentZoom - 0.1);
      event.preventDefault();
    }
  });
  ```

### Full Code Example with Comments

```javascript
/**
 * Adjust the zoom level of the webpage by modifying the CSS zoom property.
 * @param {number} scale - The desired zoom scale factor (e.g., 1.0 for 100%). Must be between 0.5 and 3.0.
 * @throws {Error} Throws an error if the provided scale is out of the allowed range.
 */
function adjustZoom(scale) {
  if (scale < 0.5 || scale > 3.0) {
    throw new Error('Invalid scale parameter. Must be between 0.5 and 3.0.');
  }
  document.documentElement.style.zoom = scale;
}

// Attach an event listener to handle key combinations for zoom adjustments
// Ctrl (or ⌘) and '+' to increase, Ctrl (or ⌘) and '-' to decrease the zoom level
document.addEventListener('keydown', function(event) {
  // Increase zoom when either Ctrl (Windows) or Meta (Mac) is pressed with '+'
  if ((event.ctrlKey || event.metaKey) && event.key === '+') {
    let currentZoom = parseFloat(document.documentElement.style.zoom) || 1.0;
    adjustZoom(currentZoom + 0.1);
    console.log(`Zoom increased to: ${currentZoom + 0.1}`);
    event.preventDefault();
  } else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
    let currentZoom = parseFloat(document.documentElement.style.zoom) || 1.0;
    adjustZoom(currentZoom - 0.1);
    console.log(`Zoom decreased to: ${currentZoom - 0.1}`);
    event.preventDefault();
  }
});
```

### Configuration Options
- **zoom property:** Applied directly on the documentElement.style.zoom property.
- **Default Behavior:** If not set, zoom defaults to 1.0 (100%).
- **Custom Scale Values:** Developers can set custom scale increments (e.g., 0.1 for a 10% change per key press).

### Troubleshooting Commands
- **Verify Computed Style:** Use browser console command:
  ```javascript
  getComputedStyle(document.documentElement).zoom;
  ```
  Expected output: The current zoom factor as a string (e.g., "1.1").
- **Error Logging:** Check the browser console for thrown errors indicating invalid zoom scales.
- **Browser Compatibility:** Test the code snippet in multiple browsers (Chrome, Firefox, Safari) to ensure consistent zoom functionality.

This detailed technical reference ensures that developers have all necessary method signatures, configuration options, and troubleshooting procedures to implement and maintain custom text zoom features in web applications.

## Original Source
W3C Web Accessibility Initiative (WAI)
https://www.w3.org/WAI/

## Digest of WEB_ACCESSIBILITY

# Overview

This document captures the technical instructions for adjusting text size and color settings directly in web browsers as provided in the crawled WAI content. Retrieved on: 2023-10-27

# Browser Zoom Shortcuts

**Windows, Linux, Chrome OS:**
- Zoom in: Press <kbd>Ctrl</kbd> + <kbd>+</kbd>
- Zoom out: Press <kbd>Ctrl</kbd> + <kbd>-</kbd>

**Mac OS:**
- Zoom in: Press <kbd>⌘</kbd> + <kbd>+</kbd>
- Zoom out: Press <kbd>⌘</kbd> + <kbd>-</kbd>

# Detailed Steps for Changing Text Size

1. **Invoke Zoom:** Use the key combination appropriate for your operating system.
2. **Browser Behavior:** Most browsers zoom both text and images, though some offer text-only zoom options.
3. **Configuration Options:**
   - Example for Google Chrome: Navigate to Settings > Appearance > Page Zoom. Default: 100%
   - Example for Firefox: Navigate to Options > Language and Appearance > Zoom. Offers both full page zoom and text-only zoom.

# Browser Specific Settings

- **Google Chrome:**
  - Offers full page zoom adjustments via menu or shortcuts.
  - Provides specific guidance in the "Change text, image, and video sizes (zoom)" help section.

- **Apple Safari:**
  - Provides zoom in on webpages and Reader View adjustments such as text size and font changes.

- **Mozilla Firefox:**
  - Offers both page zoom and font size changes in Options > Language and Appearance.

- **Other Browsers (Opera, Internet Explorer, Microsoft Edge, Vivaldi):**
  - Similar zoom key combinations; details available in respective help documents.

# Advanced Options and Extensions

- **Reader View:** Most browsers offer a clutter-free reading mode allowing custom settings for text font, color, and spacing.
- **Browser Extensions:** Tools like Stylus can enable advanced user style controls, substituting for deprecated user style sheet functionality.
- **Troubleshooting:** Verify if a website supports accessibility guidelines; non-compliant designs may override user settings.

# Attribution and Data Size

- Data Size: 12143351 bytes
- Links Found: 32280
- No errors reported in crawl.

## Attribution
- Source: W3C Web Accessibility Initiative (WAI)
- URL: https://www.w3.org/WAI/
- License: License: W3C Document License
- Crawl Date: 2025-04-17T20:46:16.533Z
- Data Size: 12143351 bytes
- Links Found: 32280

## Retrieved
2025-04-17
