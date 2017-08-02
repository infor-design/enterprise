
# Counts  [Learn More](#)

## Configuration Options

1. Counts - Of an Instance [View Example]( ../components/counts/example-instance-count)
2. Counts - Of an Object [View Example]( ../components/counts/example-object-count)

## API Details

### Settings

* Icon Types - icon-alert, icon-confirm, icon-dirty, icon-error, icon-info, icon-pending, icon-new, icon-in-progress, icon-info-field
* Icon Colors - This is done automatically by the type (alert, error ect)

## Code Example

Instance Counts are simple css/html components with a count and title element. You can use any of the [colors in the pallette.]( ../components/colors/example-index)


```html

<div class="instance-count ">
  <span class="count emerald07">40</span>
  <span class="title">Active Goals</span>
</div>>


```

## Accessibility

-   Be careful to select a color that passes [WCAG AA or AAA contrast](http://webaim.org/resources/contrastchecker/) with the background its on.

## Keyboard Shortcuts

No Keyboard, screen readers can access the information via a virtual keyboard. Make sure to augment the labels with audible only spans to add additional context if needed.

## Upgrading from 3.X

- New component
