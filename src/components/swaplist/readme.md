---
title: Swaplist Component
description: null
demo:
  embedded:
  - name: Main Swaplist Example
    slug: example-index
  pages:
  - name: Swaplist with Selected Items
    slug: example-selected
  - name: Swaplist with Filter/Search
    slug: example-search
  - name: Swaplist with Disable Dragging
    slug: example-disable-dragging
---

## Behavior Guidelines

- The swap list supports touch devices.

## Code Example

The swap list uses the underlying [listview component](./basic-list). Like the listview, a list template is needed. This template can either by dynamic or static. In the example below, a template with a basic list value and support for drag and drop and disabled is shown in `id="swaplist-tmpl"` section.

The markup structure of the component itself is made up of a parent container that has an available and selected div section. Each of these has a title, buttons for moving, and a div in which the list template will be generated.

Initialize the component by calling `.swaplist()` on the element and passing a JSON array for the available, selected sides and reference to the template. (Not the template can also be passed here as a string instead of being in the DOM.

```javascript
var available = [], selected = [];

available.push({id: 1, value: 'opt-1', text: 'Option A'});
available.push({id: 2, value: 'opt-2', text: 'Option B'});
available.push({id: 3, value: 'opt-3', text: 'Option C'});
available.push({id: 4, value: 'opt-4', text: 'Option D'});
available.push({id: 5, value: 'opt-5', text: 'Option E', disabled: true});
available.push({id: 6, value: 'opt-6', text: 'Option F'});
available.push({id: 7, value: 'opt-7', text: 'Option G'});
available.push({id: 8, value: 'opt-8', text: 'Option H'});
available.push({id: 9, value: 'opt-9', text: 'Option I'});

selected.push({id: 10, value: 'opt-10', text: 'Option J'});
selected.push({id: 11, value: 'opt-11', text: 'Option K'});

$('#example-swaplist-1').swaplist({available: available, selected: selected, template: $('#swaplist-tmpl').html()});
```

## Accessibility

- This component is keyboard accessible but not entirely tested for WAI-ARIA and Screen reader support.

## Testability

You can add custom id's/automation id's to the swaplist that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
var dsAvailable = [];
dsAvailable.push({id: 1, value: 'opt-1', text: 'Option A'});
dsAvailable.push({id: 2, value: 'opt-2', text: 'Option B'});
dsAvailable.push({id: 3, value: 'opt-3', text: 'Option C'});
dsAvailable.push({id: 5, value: 'opt-5', text: 'Option E', disabled: true});
dsAvailable.push({id: 6, value: 'opt-6', text: 'Option F'});
dsAvailable.push({id: 8, value: 'opt-8', text: 'Option H'});
dsAvailable.push({id: 9, value: 'opt-9', text: 'Option I'});

var dsSelected = [];
dsSelected.push({id: 4, value: 'opt-4', text: 'Option D'});
dsSelected.push({id: 7, value: 'opt-7', text: 'Option G'});
dsSelected.push({id: 11, value: 'opt-11', text: 'Option K'});

var dsAdditional = [];
dsAdditional.push({id: 10, value: 'opt-10', text: 'Option J'});
dsAdditional.push({id: 12, value: 'opt-12', text: 'Option L'});
dsAdditional.push({id: 13, value: 'opt-13', text: 'Option M'});
dsAdditional.push({id: 14, value: 'opt-14', text: 'Option N'});

$('#example1').swaplist({
  available: dsAvailable,
  selected: dsSelected,
  additional: dsAdditional,
  template: $('#swaplist-tmpl').html(),
  attributes: [
    { name: 'id', value: 'example1' },
    { name: 'data-automation-id', value: 'automation-id-example1' }
  ]
});
```

Providing the data this will add an ID added to each list container with `-swaplist-{containerClass}`, item with `-swaplist-{containerClass}{index}` and buttons with `-swaplist-btn-{containerClass}` also if container is selected `-{left|right}` appended after it.

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves in and out of the list boxes and the between the buttons on the toolbars and the adjacent objects
- <kbd>Up</kbd> and <kbd>Down</kbd> moves up and down the currently focused list
- <kbd>Enter</kbd> or <kbd>Space</kbd> toggles selection if a list item is focused
- <kbd>CTRL + M</kbd> moves the currently selected items in one list to the next list. If in the middle list, focus will be on the toolbar and you can choose which list to go to.

## States and Variations

The individual components (list boxes, move/reorganize controls) take the following stakes:

- Hover
- Focus
- Disabled (when nothing is selected to move)
- There is an edge case where the entire swap list will be disabled.

## Responsive Guidelines

- The swap list will be 50/50 size of the parent. On smaller break points the two lists (or 3) will stack to 100%

## Upgrading from 3.X

- Replace `.inforSwapList()` with `.swaplist()` in the javascript
- The `available` and `selected` options are the same
- You must now pass markup as a template and place the markup in the DOM
