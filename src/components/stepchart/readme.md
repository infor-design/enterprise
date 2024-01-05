---
title: Step Chart
description: null
demo:
  embedded:
  - name: Standard Step Chart
    slug: example-index
  pages:
  - name: Custom Colors
    slug: example-colors
---

## Behavior Guidelines

- When all steps are complete the chart shows in positive color (green) with an icon.
- In progress steps shown in a ruby color

## Code Example

You can initialize a step chart by putting a simple div in the page with data-options which contain any of the above options.

```html
<div id="manual" class="step-chart" data-options="{steps: 7, completed: 2, inProgress: 3, iconType: 'icon-error', extraText: '2 Days Overdue'}">
</div>
```

Or you can initialize the component using javascript, remove the data-options and initialize like a normal plugin.

```html
$('#manual').stepchart({
  completed: 2,
  steps: 10,
  completedText: 'Amount Completed'
});
```

## Accessibility

- The step chart infor is displayed via the text "N of N Complete" which the user can read with a screen reader.
- The rest of the chart
- Colors are AA compliant and adapt to AAA on hey contrast version

## Testability

You can add custom id's/automation id's to the step chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  steps: 7,
  completed: 2,
  inProgress: 3,
  iconType: 'icon-error',
  extraText: '{1} Days Overdue',
  attributes: [
    { name: 'id', value: 'stepchart-example' },
    { name: 'data-automation-id', value: 'automation-id-stepchart-example' }
  ]
}
```

Providing the data this will add an ID added to each label with `-label`, label-icon with `-label-icon`, label-small with `-label-small`, and step with `-step{index}` appended after it.

## Keyboard Shortcuts

- None

## States and Variations

A Step Chart can take the following states:

- Error
- N Complete
- All Complete

## Responsive Guidelines

- The chart adapts to the parent size and the steps will resize to equal portions.

## Upgrading from 3.X

- This is a new component in 4.x
