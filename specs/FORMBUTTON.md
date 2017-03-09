# Form Button

AKA: Action Button

There are three types of form buttons:

  -Primary buttons are used for the most important or highly-used actions. These buttons are generally basic, single-action buttons and are usually associated with the ENTER key.

  -Secondary buttons are used for supporting actions. These are generally basic, single-action buttons.

  -Tertiary buttons are used for destructive actions as well as actions that you do not want to call out visually.

Can be an icon only, text or text and icon button...


![image here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-darkui.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)

Live Example - In all Themes

## Usage Guidlines

- Primary buttons can be located within a container (such as a form, field set, input dialog, or card) or a list/data grid row. (Use toolbar buttons for buttons that appear within a page or section header).
- Only one button within a button group should use the Primary styling.

## UI Specs

[Spec PSD Doc Here]

## Markup

    <button class="btn-primary" type="button">Action</button>

## CSS

http://git.infor.com/projects/SOHO/repos/controls/browse/sass/controls/_buttons.scss

## Dependencies

Utils

## States

**disabled** – The button is dimmed via color change cannot be pressed. The cursor should not change when hovering.

**hover** – Hover will change cursor and color and background color.

**active/press** – Continual press will change cursor and color and background color. An animated circle indicating the touch area will appear and "pulse out" from the touch point to a max size circle.

## Themes

**grey**

![enter image description here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-normal.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)

**dark**

![image here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-darkui.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)

**high contrast**

![enter image description here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-highcontrast.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)

## Events

**click** – a click event would fire when the button is clicked, this is a browser standard event

## Keyboard

**Space or Enter** – Execute the action for that button. If the button activation closes the containing entity or launches another entity, then focus moves to the newly-opened entity. If the button activation does not close or dismiss the containing entity, then focus remains on the button. An example might be an Apply or Recalculate button.

**Tab/Shift Key** - With focus on the button pressing the tab key will take the user to/from the next/previous tab focusable item on the page.

For More Info See:
http://access.aol.com/dhtml-style-guide-working-group/#button

## Behaviors

**Min Width** – Buttons look better on the page if they are all the same size. This can be done with a min-width value. The min-width is 100px by default.

**Right To Left** – Icons if there and the entire button will move to the opposite side of the page.

**Printable** – To Conserve ink, print just the text with no background

## Mobile

**Touch** - When a button is touched some schools say you should normalize the 300ms touch delay for percieved performance. However, this my cause issues with accessibility as a pinch over the button would be treated as a click.

## Animations

 - States should be changed with an eas effect of 300ms (background-color/border/color)
 - When the button is clicked a "circular" ball flash across the touch area.

## Accessibility

 - The button element should have aria-haspopup="true" if it has a popup.
 - The colors can be problematic for accessibilty / contrast. This is covered by different themes.

## Special Use Cases

 - Can be a shorter size to work with smaller form fields
 - Can have an icon

## Implementations

- Link to Soho XI Code
- ExtJS Version

## Test Cases
