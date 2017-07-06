
# Alerts  [Learn More](https://soho.infor.com/index.php?p=component/accordion)

## Api Details

### Settings

* Icon Types - icon-alert, icon-confirm, icon-dirty, icon-error, icon-info, icon-pending, icon-new, icon-in-progress, icon-info-field
* Icon Colors - This is done automatically by the type (alert, error ect)

## Configuration Options

1. Alerts (Icons) [View Example]( ../components/alerts/example-index)
2. Alerts (Badges) [View Example]( ../components/alerts/example-badges)
3. More Badge Examples [View Example]( ../components/alerts/example-additional-badges)

## Code Example

Alerts are just specially classed icons. You can added alert icons by adding an svg element with the icons. You should also include an audible span for better accessibility.

```html

<svg class="icon icon-alert" focusable="false" aria-hidden="true" role="presentation">
  <!-- Substitute icon-alert with any of the above icon types -->
  <use xlink:href="#icon-alert"></use>
</svg>
<span class="audible">Alert</span>


```

## Accessibility

-   The traffic light colors in the Light UI theme is technically a contrast violation, so care should be given not to use the identical colors if styling text near the alerts. The high-contrast theme provides an alternative
-   Make to include an offscreen label even though the element does not get focus. This could be read by the virtual cursor on a screen reader (class="audible")

## Keyboard Shortcuts

Alert icons and Badges do not have tab stops or keyboard interaction on their own. However, they may be placed in a grid cell or other object that has tab focus.

## Upgrading from 3.X

-   The old alerts where shown as div's, the new ones are displayed as spans. These could be used interchangeably, but span is easier to position in line so is usually a better fit.
-   Classes which were formerly inforAlertIcon shuld be changed to an svg element
