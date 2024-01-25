---
title: Button
description: Displays an action. A user can interact with a button to initiate a process. Best used for performing discrete operations on a given set of data, or triggering a separate workflow.
demo:
  embedded:
  - name: Form Buttons
    slug: example-index
  pages:
  - name: Simple Menu Button
    slug: example-menubutton
  - name: Menu Button with Submenus
    slug: example-menubutton-submenu
  - name: 100% Width Button
    slug: example-100-percent
  - name: Anchor tags that look like buttons
    slug: example-as-link
  - name: Button with Icons
    slug: example-with-icons
  - name: Toggle Buttons
    slug: example-toggle-button
  - name: Disabled Button Tooltip
    slug: example-disabled-button-tooltip
---

## Code Example

A button object should always use a `<button>` element. Also make sure to add `type="button"` or some browsers will treat this as a submit button and refresh the page.

There are five types of buttons, all controlled by classes and markup.

- `btn-primary` - Primary action form button
- `btn-secondary` - Secondary action form button
- `btn-tertiary` or `btn` - Normal tertiary button
- `btn-icon` - Icon only button
- `btn-menu` - A button with a context menu attached

All buttons are assumed to include an icon and a text label. An icon can be added by including the SVG icon element and use a span to hold the button text.

```html
<button class="btn-primary" type="button" id="page-button-primary">Action</button>

<button class="btn-secondary" type="button" id="page-button-secondary">Action</button>

<button type="button" class="btn-tertiary" id="page-button-tertiary">
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use href="#icon-filter"></use>
  </svg>
  <span>Action</span>
</button>

<button type="button" class="btn-icon" disabled id="page-button-icon">
  <span>Date</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use href="#icon-calendar"></use>
  </svg>
</button>
```

You can also use the button component to make a toggle button. Here is an example of a favorite style icon you can toggle on and off. Adding the class `icon-favorite` will change the icon color to a gold color instead of the usually azure toggle buttons when on.

```html
<button type="button" id="favorite" class="btn-icon icon-toggle" title="Favorite">
   <svg class="icon-test icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-star-filled"></use>
   </svg>
   <span>Favorite</span>
</button>
```

If you need a menu button, note that it is comprised of the [popupmenu](../popupmenu/readme.md) and the button component.

Once the proper markup is in place calling `$(elem).button()` will correctly initialize a menu button. If the arrow icon is missing in the markup it will be added. For example:

```html
<button class="btn-menu">
  <span>Menu Button</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
    <use href="#icon-dropdown"></use>
  </svg>
</button>
<ul class="popupmenu">
  <li><a href="#" id="menu-option-1">Menu Option #1</a></li>
  <li><a href="#" id="menu-option-2">Menu Option #2</a></li>
  <li><a href="#" id="menu-option-3">Menu Option #3</a></li>
</ul>
```

We introduce a new style button in generative AI purpose. This example button is an generative AI button specifically crafted for triggering the generation of AI insights.

Here's the example markup:

```html
<!-- Primary -->
<button class="btn-primary btn-generative" type="button" id="btn-generate-ai-1">
  <span>Generate</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use href="#icon-insights-smart-panel"></use>
  </svg>
</button>

<!-- Tertiary -->
<button class="btn-tertiary btn-generative" type="button" id="btn-tertiary-generate-ai-1">
  <span>Generate</span>
</button>

<!--Generative Button Icon -->
<button type="button" class="btn-icon btn-generative" id="gen-icon-ai-1">
  <span>Date</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use href="#icon-insights-smart-panel"></use>
  </svg>
</button>
```

We created an API called `performGenerativeAction()` by replacing the content of a button with a loading indicator, then replacing it with generated AI content after a specified delay.

```javascript
$('#btn-tertiary-generate-ai-1').on('click keypress', function (e) {
  e.preventDefault();
  var $btn = $(this);
  var btnApi = $btn.data('button');
  btnApi.performGenerativeAction(10000);
});
```


## Implementation Tips

- Make sure to add an automation-id or permanently unique id for testing that remains the same across versions.
- Do not use any elements other than button attributes for buttons.
- Press State has a touch effect which requires JS to implement
- Buttons can optionally have tooltips via adding a title attribute

## Accessibility

- Make sure form buttons have a succinctly descriptive value that indicates its purpose

## Testability

In most cases, special attributes or automation ids should be added directly to the button markup:

```html
<button id="my-button" data-automation-id="my-button" class="btn-primary">
  <span>My Button</span>
</button>
```

It's also possible to use the Javascript IDS Button API to add attributes programmatically.  This is helpful when composing more complex components using the button as a trigger:

```js
$('#my-button').button({
  attributes: [
    {
      name: 'data-automation-id',
      value: 'my-button'
    }
  ]
})
```

## Keyboard Shortcuts

- <kbd>Spacebar</kbd> or <kbd>Enter</kbd> keys execute the action for that button. If the button activation closes the containing entity or launches another entity, then focus moves to the newly-opened entity. If the button activation does not close or dismiss the containing entity, then focus remains on the button. An example might be an "Apply" or "Recalculate" button.
- <kbd>Enter</kbd> If the button is a menu button the enter key will toggle the menu. Use the arrow keys and enter to select in the menu. See [popupmenu](../popupmenu/readme.md) for details on using the keyboard in the the open menu.

## Responsive Guidelines

- Buttons can optionally be 100% width of their parent container on mobile breakpoints

## Upgrading from 3.X

- Change class `inforFormButton default` to `btn-primary`
- Change class `inforFormButton` to `btn-secondary`

## Workaround for title to display as tooltip on disabled buttons

- Disabled elements do not handle events in most browsers. This necessitates the need for an alternate element to handle the `Tooltip.plugin` which adds functionality that strips the title and renders it as a tooltip on the hover event of the element.
- Include `<div title="{{desired title/tooltip}}}">{{button content}}</div>` as child of `<button disabled></button>` to allow hover event to engage tooltip functionality, taking title from inner div and displaying as tooltip.
