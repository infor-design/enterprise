---
title: Popover Component
description: null
demo:
  embedded:
  - name: Common Configuration
    slug: example-index
  pages:
  - name: Attached To Textbox's Info Icon
    slug: example-attached-to-textbox
  - name: Alternate (Flipped) Positioning
    slug: example-alternate-positions
  - name: Demo of `extraCssClass` Setting
    slug: example-extra-css-class
---

This component shares a common API with the [Tooltip](./tooltip) component. When a popover component is invoked, any methods and events used by the tooltip will also be available in the popover. For more details on this component's API, please see the [tooltip documentation](./tooltip).

## Code Example

Popover components are generally created with a combination of a "trigger" element and a container element which will be used inside of the popover.  Consider the following HTML:

```html
<!-- This is the trigger element -->
<button id="popover-trigger" class="btn-primary">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-duplicate"></use>
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

Focus should always return to the object on which the popover is called from once the popover closes.

## Testability

The popover can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the popover. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `popover-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

If setting the id/automation id with a function, the id will be a running total of open popover.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
