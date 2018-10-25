---
title: Toolbar Searchfield
description: This page describes Toolbar Searchfield .
demo:
  embedded:
  - name: Common Configuration
    slug: example-index.html
  pages:
  - name: Alternate In-Page Style
    slug: example-alternate-style.html
  - name: "`collapsibleOnMobile` Setting Demo"
    slug: example-collapsible-on-mobile.html
---

## Important Notes

This is a specific component wrapper for searchfield components that reside inside of a [toolbar]( ./toolbar). This component is very different from regular searchfields and have an expanded API. There is an alternate API documentation for the main [Searchfield]( ./searchfield) component.

## Code Example

*NOTE:* Toolbar searchfields can only exist when a searchfield becomes invoked inside of a toolbar element.  The minimum amount of markup for building a toolbar is present in the code sample below.  For more information about how to define and configure the toolbar component, please see the [toolbar API page]( ./toolbar).

```html
<div class="toolbar no-actions-button left-aligned">
    <div class="buttonset">
        <!-- Begin Toolbar Searchfield Component Part -->
        <label for="example-toolbar-searchfield">Example</label>
        <input id="example-toolbar-searchfield" class="searchfield" />
        <!-- End Toolbar Searchfield Component Part -->
    </div>
</div>
```

## Implementation Tips

- A regular [searchfield](./searchfield) defined as an input field with a `.searchfield` class will be automatically converted to toolbar searchfield by its parent toolbar element when being invoked

## Keyboard Shortcuts

- <kbd>Shift + Left</kbd> and <kbd>Shift + Up</kbd> or <kbd>Shift + Right</kbd> and <kbd>Shift + Down</kbd> arrows - When focused on a toolbar searchfield, the focused element is wrapped inside of a [toolbar]( ./toolbar) element, which has its own rules that govern navigation with the arrow keys.  These shortcuts help the user navigate a toolbar while leaving movement of the text cursor to be controlled with the arrow keys
- <kbd>Alt + Del</kbd> - On a `clearable` searchfield, pressing this will clear its contents.

## States and Variations

- Disabled
- Enabled
- Focused

### Contextual Colors

There are several scenarios where the background, border, and text color of a toolbar searchfield can change based on how it's used:

- There is an [alternate in-page style](https://design.infor.com/code/ids-enterprise/latest/demo/toolbarsearchfield/example-alternate-style?font=source-sans) for toolbar searchfields that can be used when content is displayed over a gray background
- [Inside contextual action panels](https://design.infor.com/code/ids-enterprise/latest/demo/toolbarsearchfield/example-inside-contextual-panel?font=source-sans), the background and border colors change to match the header
- In any example of a [header]( ./header), the toolbar searchfield's background color becomes semi-transparent black, and the text/border change to stand out better on the darker colors defined in the header's background
- Inside of [mastheads]( ./masthead), the toolbar searchfield will change to a dark graphite/slate to match the background color of the masthead

### Size Settings

- `Collapsed` - If the `collapsible` setting is changed to true, toolbar searchfield can become "collapsed" when either de-focusing the searchfield wrapper, or resizing the page.
- `Expanded` - This is the default state for toolbar searchfields when `collapsible` is set to false.  The searchfield will also look like this when focused in either case.

## Responsive Guidelines

- When activating a toolbar searchfield beneath the phone breakpoint size, it will resize to become the full width of the viewport to make the search text easier to read

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
