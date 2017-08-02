# Popover Component [Learn More](https://soho.infor.com/index.php?p=component/popover)

## Configuration Options

1. [Common Configuration]( ../components/popover/example-index)
2. [Simple Popover Content]( ../components/popover/example-simple)
3. [Complex Form Layout Inside Popover]( ../components/popover/example-complex-content)
4. [Attached To Textbox's Info Icon]( ../components/popover/example-attached-to-textbox)
5. [Alternate (Flipped) Positioning]( ../components/popover/example-alternate-positions)
6. [Demo of `extraCssClass` Setting]( ../components/popover/example-extra-css-class)

## API Details

This component shares a common API with the [Tooltip]( ../components/tooltip) Component.  When a Soho Popover component is invoked, any methods and events used by the Tooltip will also be available in the Popover.  For more details on this component's API, please see the [Tooltip Documentation]( ../components/tooltip).

## Code Example

Popover Components are generally created with a combination of a "trigger" element and a container element  which will be used inside of the popover.  Consider the following HTML:

```html

<!-- This is the trigger element -->
<button id="popover-trigger" class="btn-primary">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use xlink:href="#icon-duplicate"></use>
  </svg>
  <span>Hover Me To Show Popover</span>
</button>

<!-- This is the actual template to be used for content -->
<div id="popover-contents" class="hidden">
  <p>This is a popover</p>
</div>

```

The above HTML snippets will then be associated by the following Javascript code:

```javascript

$('#popover-trigger').popover({
  content: $('#popover-contents'),
  placement: 'bottom',
  offset: {
    y: 10
  }
});


```


## Accessibility

-   Focus should always return to the object on which the popover is called from once the popover closes.

## Keyboard Shortcuts

See Details on the respective Code pages in the related links section.

## States and Variations

-   Normal
-   Hover
-   Pressed
-   Active
