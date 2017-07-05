# Tooltip Component [Learn More](https://soho.infor.com/index.php?p=component/tooltip)

{{api-details}}

## Important Notes

The [Popover](/components/popover) component shares a common API with the Tooltip Component.  When a Soho Popover component is invoked, any methods and events used by the Tooltip will also be available in the Popover.

## Configuration Options

1. [Default Tooltip Example](/components/tooltip/example-index)
2. [Tooltip with an Icon](/components/tooltip/example-icon-in-tooltip)
3. [Functioning URL inside of a Tooltip](/components/tooltip/example-url-in-tooltip)
4. [Example of triggering by "focus"](/components/tooltip/example-trigger-focus)
5. [Example of triggering with "immediate"](/components/tooltip/example-trigger-immediate)
6. [Using the `extraCssClass` setting](/components/tooltip/example-extra-css-class)
7. [Demo of the `setContent()` API method](/components/tooltip/example-setcontent-api)
8. [Demo of AJAX-powered Tooltip Content](/components/tooltip/example-ajax-tooltip)
9. [Using the `keepOpen` setting](/components/tooltip/example-keep-open)

## Behavior Guidelines

- For accessibility the tooltip should be shown when you keyboard onto an element after a short delay (Open Task)

## Code Example

### Simple Tooltips

If using the [Soho Initializer](/components/initialize), any elements with a `title` attribute will be picked up and turned into a Soho Tooltip when the element becomes hovered (or tapped in a mobile scenario). It may be needed to [reinitialize a component](https://soho.infor.com/index.php?p=component/getting-started) or page section which has been added.  

```html

<button class="btn" type="button" title="Tooltips Provide Additional Information">
  Tootltip Button
</button>


```

The code above is demoed in the [Common Tooltip Example](/components/tooltip/example-index).

### Custom HTML Tooltips

It's also possible to use inline HTML inside of the `title` atribute:

```html

<button class="btn-secondary" type="button" title="<span style='text-align: right; display: inline-block;'><b style='line-height: 1.7em;'>Connected order</b><br>Tooltips Provide <br> <span style="color: #AFDC91;">Additional Information</span>.</span>">
  Custom HTML Tooltip
</button>


```

The code above is demoed in the [HTML Tooltip Example](/components/tooltip/example-html-tooltip).

Another possible method of defining custom tooltips is to create a hidden HTML element that will be referenced by its ID attribute.  When defining your `title` attribute on your trigger element, simply place use ID selector instead of the actual content, and the initializer will pick it up:

```html

<button class="btn-secondary" type="button" title="#tooltip-id">
  <span>Example</span>
</button>

<div id="tooltip-id" class="hidden">
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use xlink:href="#icon-compose"/>
  </svg>
  <p>Add Comment</p>
</div>


```

The code above is demoed in the [Icons in Tooltips Example](/components/tooltip/example-icon-in-tooltip).


## Accessibility

- aria-describedby is added to the related element
- The tooltip content should be physically add to the dom right after the input field for the case of validation errors. This is so that a screen reader use can down arrow and reread content in case they missed it.
- For accessibility the tooltip should be shown when you keyboard onto an element after a short delay (Open Task)

## Keyboard Shortcuts

- None but see next note.

## States and Variations

- Hidden
- Visible

## Responsive Guidelines

- Will be showin in the direction it fits

## Upgrading from 3.X

- Remove calls to `inforTooltip()` and use `tooltip()` instead. Can use the initializer if possible.
- Specific content may need re-styling.
- close event renamed to hide event
