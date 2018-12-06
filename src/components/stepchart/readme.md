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

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

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
