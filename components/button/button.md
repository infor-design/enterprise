# Button Component Implementation Detail [Learn More](https://soho.infor.com/index.php?p=component/buttons)

{{api-details}}

## Configuration Options

1. Form Buttons [View Example]( /components/button/example-index)
2. 100% Width Button [View Example]( /components/button/example-100-percent)
3. Button on an <a> tag  [View Example]( /components/button/example-as-link)
4. Form Call to Action Button [View Example]( /components/button/example-secondary-border)
5. Button with Icons [View Example]( /components/button/example-with-icons)

## Code Example

### Buttons

A button object should always use a button element. Also make sure to add type+"button" or some browsers will treat this as a submit button and refresh the page.

This example shows four types of buttons, all controlled by class.

-   btn-primary -\> Primary action form button
-   btn-secondary -\> Secondary action form button
-   btn-tertiary or btn -\> Normal tertiary button
-   btn-icon -\> Icon only button

All buttons are assumed to be icon + text. To add the icon you add the svg icon element and use a span to hold the button text.

```html

  <button class="btn-primary" type="button">Action</button>

  <button class="btn-secondary" type="button">Action</button>

  <button type="button" class="btn-tertiary">
    <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
      <use xlink:href="#icon-filter"/>
    </svg>
    <span>Action</span>
  </button>

  <button type="button" class="btn-icon">
    <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
      <use xlink:href="#icon-calendar"/>
    </svg>
    <span>Date</span>
  </button>


```

## Implementation Tips

-   Do not use any elements other than button attributes for buttons.
-   Press State has a touch effect which requires JS to implement
-   Buttons can optionally have tooltips via adding a title attribute

## Accessibility

-   Make sure Form Buttons have a succinctly descriptive value that indicates its purpose
-   Do not use directional of visual information in the button description

## Keyboard Shortcuts

-   **Spacebar or Enter keys** execute the action for that button.
-   If the button activation closes the containing entity or launches another entity, then focus moves to the newly-opened entity.
-   If the button activation does not close or dismiss the containing entity, then focus remains on the button. An example might be an Apply or Recalculate button.

## States and Variations

-   Hover
-   Disabled
-   Active
-   Pressed

## Responsive Guidelines

-   Buttons can optionally span in width across elements on mobile to 100% example sign in page

## Upgrading from 3.X

-   Change class "inforFormButton default" to btn-primary
-   Change class "inforFormButton" to btn
-   Tertiary is new
