---
title: Blockgrid
description: null
demo:
  embedded:
  - name: Blockgrid with images
    slug: example-index
  pages:
  - name: Blockgrid with image and text
    slug: example-text
  - name: Blockgrid with single selection
    slug: example-singleselect
  - name: Blockgrid with multiselect select
    slug: example-multiselect
  - name: Blockgrid with mixed selection select
    slug: example-mixed-selection
  - name: Blockgrid with paging
    slug: example-paging
---

## Code Example

This example shows how to place several objects inside a block grid. The block grid will lay out the elements across the parent width and flow to the next line if need be. The block grid supports using markup in the block for example:

```html
<div class="row blockgrid l-center">
  <div class="block">
    <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
  </div>
</div>
```

It is also possible to pass a dataset to the block grid to support paging and selection. For example:

```javascript
var data = [];
data.push({
  image: '/images/11.jpg',
  title: 'Mary Pane',
  subtitle: 'Infor, Developer',
  id: 1
});
data.push({
  image: '/images/12.jpg',
  title: 'Paula Paulson',
  subtitle: 'Infor, Architect',
  id: 2
});

$('#blockgrid').blockgrid({
  dataset: data,
  selectable: 'single'
}).on('selected', function (e, args) {
  console.log(args);
});
```

## Accessibility

Note that tab order should be maintained and not changed with any explicit `tabindex`.

## Code Tips

The elements should be the same or very close in width and height. Note that due to constraints the bottom rows are not centered at this time. This may happen if the total count is not even across rows.

## Testability

You can add custom id's/automation id's to the blockgrid that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  steps: 7,
  completed: 2,
  inProgress: 3,
  iconType: 'icon-error',
  extraText: '{1} Days Overdue',
  attributes: [
    { name: 'id', value: 'example1' },
    { name: 'data-automation-id', value: 'automation-id-example1' }
  ]
}
```

Providing the data this will add an ID added to each checkbox with `-blockgrid-checkbox{index}` and checkbox-label with `-blockgrid-checkbox-label{index}` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.
