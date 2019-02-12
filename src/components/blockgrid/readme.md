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
    <img alt="Placeholder Image" src="http://placehold.it/200x200/999999/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/999999/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/999999/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/999999/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/999999/ffffff"/>
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

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
