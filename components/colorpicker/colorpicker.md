
# Color Picker  [Learn More](#)

## Configuration Options

1. Color Picker Example [View Example]( ../components/colorpicker/example-index)
2. Showing Custom Colors [View Example]( ../components/colorpicker/example-custom-labels)
2. Select the label not the Hex [View Example]( ../components/colorpicker/example-show-label)
4. Test States [View Test]( ../components/colorpicker/test-states)
5. Test it works on a Modal [View Test]( ../components/colorpicker/test-modal)
6. Test it works on a Modal [View Test]( ../components/colorpicker/test-modal)

{{api-details}}

## Code Example

The color picker is made from a text input with class="colorpicker". It can be initialized manually or via the page initializer. Once initialized it functions similar to a dropdown except that the list is showing colors in a pallette / swatch. A tooltip shows the hex code to be inserted. After selecting the hex code is inserted.

```html

<div class="field">
  <label for="background-color">Color Picker</label>
  <input class="colorpicker" value="#ffa800" id="background-color" type="text" />
</div>


```

## Behavior Guidelines

-   The Color Picker only supports colors within a pre-configured palette (specified by the developer). Users cannot manually enter values, but can only select from the Color Picker.
-   Some use cases require the ability to clear selection (i.e., remove color/restore default color).

## Accessibility

-   Implemented similar to aria combobox

## Keyboard Shortcuts

-   **Tab** moves focus into the edit field.
-   **Down Arrow** opens the color list and moves focus to the selected color. (If nothing is selected, then focus moves to the first color in the list).
-   **Up and Down Arrow** moves focus up and down the list of colors.
-   **Enter** selects the color on the list and updates the combo then closes the drop down and returns to the edit field.
-   **Escape key** closes the list, returns focus to the edit field, and does not change the current selection.

## States and Variations

-   Disabled
-   Focus

## Responsive Guidelines

-   Follows form guidelines

## Upgrading from 3.X

-   inforColorPicker class renamed to colorpicker
-   Plugin renamed from .inforColorPicker() to .colorpicker()
-   Options mode, and title depricated (never used)
