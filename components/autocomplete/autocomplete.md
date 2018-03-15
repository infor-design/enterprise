---
title: Autocomplete
description: This page describes Autocomplete.
demo:
  pages:
  - name: Default Autocomplete
    slug: example-index
  - name: Ajax Autocomplete
    slug: example-ajax
  - name: Ajax as a Function Autocomplete
    slug: example-ajax-as-function
  - name: Autocomplete Contains Search
    slug: example-contains
  - name: Autocomplete Disable Search/Filter
    slug: example-no-filtering
  - name: Autocomplete List Templates
    slug: example-templates
test:
  pages:
  - name: Test Autocomplete on a long scrolling page
    slug: test-longpage-modal
  - name: Test Autocomplete on a modal dialog
    slug: test-modal-autocomplete
  - name: Test Autocomplete Selected Event Fires
    slug: test-selected-event
  - name: Test Turkish Keyboard Works
    slug: test-turkish-filters
  - name: Test Xss is prevented
    slug: test-xss-security
---

## Code Example

This example shows how to invoke the autocomplete and its starting markup. Remember to add `autocomplete="off"` as some browsers have their own autocomplete functionality that interferes.

```html
    <div class="field">
      <label for="autocomplete-default">States</label>
      <input type="text" autocomplete="off" class='autocomplete' id="autocomplete-default">
    </div>

    <script>
      $('#autocomplete-default').autocomplete();
    </script>
```

## Keyboard Shortcuts

- <kbd>Arrow Down</kbd> When closed will display the list of choices, if open will move down to the next item in the last. At the bottom it should wrap around to the top again.
- <kbd>Arrow Up</kbd> If open will move down to the previous item in the last. At the top it should wrap around to the top again.
- <kbd>Enter</kbd> selects the highlighted choice
- <kbd>Any Letter</kbd> After a typehead delay all of these choices should be shown. The focus should stay in the field for additional typing. NOTE: Only valid alpha numeric characters will open the list.
- <kbd>Escape</kbd> Closes the drop down list and restores the last value (if any)
- <kbd>Tab</kbd> Goes to the next tabbable item. If the list is open the currently highlighted one will be selected

## States and Variations

- Normal
- Focus
- Active (Popup Menu is present)
- Disabled
- Readonly
