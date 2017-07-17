# Mask  [Learn More](#)

## Configuration Options

1. Radio Example [View Example]( ../components/radios/example-index)

## Behavior Guidelines

-   One option (and only one option) must always be selected.
-   Users should be able to select/deselect an option by clicking either the button itself or anywhere within the associated label.

## Code Example

A Radio Button should always have a group label to indicate what you are selecting. To get the group label, place the Radio Button in a field set with class radio-group. The legend contains this label.

Add any number of input elements, but other controls are better for a large number of options: See [decision tree article](https://soho.infor.com/index.php?p=articles/selecting-from-a-set-of-values-choosing-the-right-component).

Each input should have class = "radio" and type="radio" and should have an id that points to the matching label (required). Value can be set to the logical value represented by that radio choice.

```html

 <fieldset class="radio-group">
  <legend>Select delivery method</legend>
    <input type="radio" class="radio" name="delivery" id="delivery1" value="in" />
    <label for="delivery1" class="radio-label">Dine in</label>
    <br>
    <input type="radio" checked class="radio" name="delivery" id="delivery2" value="out" />
    <label for="delivery2"  class="radio-label">Carry out</label>
    <br>
    <input type="radio" class="radio" name="delivery" id="delivery3" value="delivery" />
    <label for="delivery3" class="radio-label">Delivery</label>
</fieldset>


```

## Accessibility

-   The radio button element uses the standard radio construct which makes it possible to be accessible.

## Keyboard Shortcuts

- **Tab** will enter the radio group. When tabbing into a group focus goes to the selected button. If none is selected it goes to the first button in the group unless you are shift tabbing, which goes to the last button in the group. Or in ARIA it can go to the radio group. HTML does not have a radio group. Tab again will exit the radio group.
- **Down/Right** moves forward in the group.
- **Up/Left** moves backwards in the group; when the arrow moves focus, the button is selected.
- **Down/Right arrow** at bottom should wrap to beginning of the set
- **Up/Left arrow** at top should wrap to end of the set
- **Space** Toggles Check/Unchecked
- **Control + Arrow** moves through the options without updating content or selecting the button.

## States and Variations

A Radio Button can take the following states:

-   Selected/Not Selected
-   Hover
-   Focus
-   Disabled (generally, the entire set of values will be disabled)
-   Dirty

## Responsive Guidelines

-   Will always be smaller than the max container height.
-   See form guidelines

## Upgrading from 3.X

-   Css only now. Remove all calls to inforRadioButton
-   Many changes for accessibility - use new simplified DOM structure
-   role = radio should be removed its redundant
-   parent inforRadioButton set is no longer needed
