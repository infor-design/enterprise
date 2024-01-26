---
title: ListBuilder
description: null
demo:
  embedded:
  - name: Default List Builder Example
    slug: example-index
---

## Code Example

The list builder is structured as a `listbuilder` element that contains a [standard toolbar](./toolbar) structure followed by a `listbuilder-content` section that contains a standard [listview]( ./listview).

When initialized with the `$elem.listbuilder()` plugin, you pass in a data set that interacts with the list view template. The toolbar buttons are automatically mapped to add, edit, delete, up, and down functions via the option settings.

```javascript
  <div class="listbuilder" >
    <div class="toolbar formatter-toolbar">
      ...
    </div>
    <div class="listbuilder-content">
      <div class="listview"></div>
    </div>
  </div>
```

## Accessibility / Keyboard Shortcuts

- [ListView](./listview) guidelines apply as this contains a listview
- [Toolbar](./toolbar) guidelines apply as this contains a toolbar

## Testability

You can add custom id's/automation id's to the listbuilder that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
var ds = [];
ds.push({id: 1, value: 'opt-1', text: 'Argentina'});
ds.push({id: 2, value: 'opt-2', text: 'Belize'});
ds.push({id: 3, value: 'opt-3', text: 'Colombia'});
ds.push({id: 4, value: 'opt-4', text: 'Dominican Republic'});
ds.push({id: 5, value: 'opt-5', text: 'Ecuador', disabled: true});
ds.push({id: 6, value: 'opt-6', text: 'France'});
ds.push({id: 7, value: 'opt-7', text: 'Germany'});
ds.push({id: 8, value: 'opt-8', text: 'Hong Kong'});
ds.push({id: 9, value: 'opt-9', text: 'India'});
ds.push({id: 10, value: 'opt-10', text: 'Japan'});
ds.push({id: 11, value: 'opt-11', text: 'Kuwait'});
ds.push({id: 12, value: 'opt-12', text: 'Libya'});

$('#example1').listbuilder({
  dataset: ds,
  template: $('#listbuilder-tmpl').html(),
  attributes: [
    { name: 'id', value: 'example1' },
    { name: 'data-automation-id', value: 'automation-id-example1' }
  ]
});
```

Providing the data this will add an ID added to each list item with `-listbuilder-listview-item-{index}`, buttons with `-listbuilder-btn-{btnName}`, and list container with `-listbuilder-listview` appended after it.

## Upgrading from 3.X

- This replaces the list view examples with toolbar. We made this a component with some default functionality
