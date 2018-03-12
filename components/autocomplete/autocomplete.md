---
title: Autocomplete  
description: This page describes Autocomplete.
---

## Configuration Options

1. Default Autocomplete [View Example]( ../components/autocomplete/example-index)
2. Ajax Autocomplete [View Example]( ../components/autocomplete/example-ajax)
3. Ajax as a Function Autocomplete  [View Example]( ../components/autocomplete/example-ajax-as-function)
4. Autocomplete Contains Search [View Example]( ../components/autocomplete/example-contains)
5. Autocomplete Disable Search/Filter [View Example]( ../components/autocomplete/example-no-filtering)
6. Autocomplete List Templates [View Example]( ../components/autocomplete/example-templates)

## Code Example

This example shows how to invoke the autocomplete and its starting markup. Remember to add autocomplete="off" as some browsers have their own autocomplete functionality that interferes.

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

- **Arrow Down** When closed will display the list of choices, if open will move down to the next item in the last. At the bottom it should wrap around to the top again.
- **Arrow Up** If open will move down to the previous item in the last. At the top it should wrap around to the top again.
- **Enter** selects the highlighted choice
- **Any Letter** After a typehead delay all of these choices should be shown. The focus should stay in the field for additional typing. NOTE: Only valid alpha numeric characters will open the list.
- **Escape** Closes the drop down list and restores the last value (if any)
- **Tab** Goes to the next tabbable item. If the list is open the currently highlighted one will be selected

## States and Variations

- Normal
- Focus
- Active (Popup Menu is present)
- Disabled
- Readonly

## Test Pages

1. Test Autocomplete on a long scrolling page [View Example]( ../components/autocomplete/test-longpage-modal)
2. Test Autocomplete on a modal dialog [View Example]( ../components/autocomplete/test-modal-autocomplete)
3. Test Autocomplete Selected Event Fires  [View Example]( ../components/autocomplete/test-selected-event)
4. Test Turkish Keyboard Works [View Example]( ../components/autocomplete/test-turkish-filters)
5. Test Xss is prevented [View Example]( ../components/autocomplete/test-xss-security)
