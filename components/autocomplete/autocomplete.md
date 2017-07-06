# Autocomplete  [Learn More](https://soho.infor.com/index.php?p=component/autocomplete)

{{api-details}}

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

-   With focus in an empty textbox, press **Arrow Down, Arrow Up, Alt+Arrow Down or Alt+Arrow Up** to display the entire list of choices – focus remains in the textbox and no choice is highlighted. Press the down arrow to highlight the first choice in the list. Press the up and down arrow keys to highlight the desired choice in the list. Note that the arrows will wrap through the textbox when the top or bottom of the list is reached. For example, pressing the down arrow when the last choice is highlighted will move focus back to the textbox, pressing down again will move focus to the first item in the list. Likewise, with focus in the textbox and the list displayed, pressing up arrow will move focus to the last item in the list. When a choice is highlighted using the arrow keys, the highlighted choice is displayed in the textbox. Press enter or click on the highlighted choice to select it and close the drop-down list. This mimics the behavior of the HTML select element.
-   With the drop-down list of choices displayed, move the mouse pointer over an item in the list to highlight it. The textbox value is not modified when the mouse is used to highlight a choice. Clicking on the highlighted choice will close the drop-down and update the textbox with the selected choice. This mimics the behavior of the HTML select element.
-   With focus in an empty textbox, type **Any Letter** If any of the available choices begin with the letter typed, those choices are displayed in a drop down. Keyboard and mouse behavior in the drop-down matches that described above. If the letter typed does not match any of the available choices the drop-down list is not displayed.
-   With focus in textbox with an existing value type **Additional Letters.**As the user types letters the list of choices is filtered so that only those that begin with the typed letters are displayed. Until the user presses the arrow keys to highlight a particular choice, only the typed letters are displayed in the textbox. In an editable auto-complete, If there are no choices that match the letter(s) typed, the drop down list of choices is closed. In a non-editable auto-complete any letters which do not result in a match from the list are ignored, the drop down list of choices remains static until the user presses escape to clear the text field, backspaces to remove some of the letters previously typed, or types an additional letter that results in a valid list of choices. Navigation through the list of choices and display of the highlighted choice in the textbox works as described above.*Optional: When a choice is highlighted via arrow key navigation, the input cursor is left at the end of the typed entry and the highlighted choice is displayed in the textbox with the characters after the input cursor selected. Typing an additional character will remove the auto-completed portion and append the newly typed character to the end of the previously typed characters. The list will be filtered based on the additional character(s) typed.*
-   With focus in a textbox, type **Escape**
    -   If there is no text in the textbox, pressing escape closes the drop-down if it is displayed.
    -   For an editable autocomplete that has text in the textbox that was both typed by the user and auto-completed by highlighting a choice using the keyboard, the auto-completed portion of the text is cleared and the user typed characters remain in the textbox. The drop-down list is closed. To completely clear the textbox contents the user must use the backspace key to remove the typed characters. This is how the Google search box in the Firefox UI works. *Recommend that (unlike the Google example), pressing the escape key again completely clears the textbox rather than relying on only the backspace key.*
    -   For a non editable auto-complete that has text in the textbox that was both typed by the user and auto-completed by highlighting a choice using the keyboard, pressing escape closes the drop-down list and leaves the current choice in the textbox.
    -   For an editable or non-editable auto complete with text in the textbox that was typed by the user and the mouse is highlighting a choice in the drop down (keyboard navigation was NOT used), pressing escape closes the drop down and leaves the typed text displayed in the text box. Need to consider if pressing escape again should clear the typed text. The user must press the down arrow or alt+down arrow or click the associated icon to invoke the drop-down list of choices again.
-   Moving focus out of an empty auto complete field where a value is required should either invoke an error or if a default value was initially assigned, reset the value to the default value.
-   Moving focus out of an auto complete field that does not contain a valid entry should either invoke an error or if a default value was initially assigned, reset the value to the default value.

## States and Variations

-   Normal
-   Focused
-   Active (Popup Menu is present)
-   Disabled


## Test Pages

1. Test Autocomplete on a long scrolling page [View Example]( ../components/autocomplete/test-longpage-modal)
2. Test Autocomplete on a modal dialog [View Example]( ../components/autocomplete/test-modal-autocomplete)
3. Test Autocomplete Selected Event Fires  [View Example]( ../components/autocomplete/test-selected-event)
4. Test Turkish Keyboard Works [View Example]( ../components/autocomplete/test-turkish-filters)
5. Test Xss is prevented [View Example]( ../components/autocomplete/test-xss-security)
