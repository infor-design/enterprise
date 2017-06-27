# Toolbar Searchfield Implementation Detail [Learn More](#)

## Important Notes

This is a specific component wrapper for searchfield components that reside inside of [Toolbars](/components/toolbar/) entitled Toolbar Searchfield.  These components are very different from regular searchfields and have an expanded API.  There is an alternate API documentation for the main [Searchfield](/components/searchfield) component.

{{api-details}}

## Configuration Options

1. [Common Configuration](/components/toolbarsearchfield/example-index.html)

## Code Example

*NOTE:* Toolbar Searchfields can only exist when a searchfield becomes invoked inside of a Toolbar element.  The minimum amount of markup for building a toolbar is present in the code sample below.  For more information about how to define and configure the Toolbar component, please see the [Toolbar API page](/components/toolbar/).

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

- A regular (Searchfield)[/components/searchfield] defined as an input field with a `.searchfield` class will be automatically converted to Toolbar Searchfield by its parent toolbar element when being invoked.


## Keyboard Shortcuts

- *Shift+left/up arrows* or *Shift+right/down arrows* - When focused on a Toolbar Searchfield, the focused element is wrapped inside of a [Toolbar](/components/toolbar) element, which has its own rules that govern navigation with the arrow keys.  These shortcuts help the user navigate a toolbar while leaving movement of the text cursor to be controlled with the arrow keys.
- *Alt+Del* - On a `clearable` searchfield, pressing this will clear its contents.


## States and Variations

- Disabled
- Enabled
- Focused

### Contextual Colors

There are several scenarios where the background, border, and text color of a Toolbar Searchfield can change based on how it's used:

- There is an [Alternate In-Page Style](/components/toolbarsearchfield/example-alternate-style) for Toolbar Searchfields that can be used when content is displayed over a gray background.
- [Inside Contextual Action Panels](/components/toolbarsearchfield/example-inside-contextual-panel.html), the background and border colors change to match the header.
- In any example of a [Header](/components/header), the Toolbar Searchfield's background color becomes semi-transparent black, and the text/border change to stand out better on the darker colors defined in the Header's background.
- Inside of [Mastheads](/components/masthead), the Toolbar Searchfield will change to a dark graphite/slate to match the background color of the Masthead.

### Size Settings

- *Collapsed* - If the `collapsible` setting is changed to true, toolbar searchfield can become "collapsed" when either de-focusing the searchfield wrapper, or resizing the page.
- *Expanded* - This is the default state for Toolbar Searchfields when `collapsible` is set to false.  The searchfield will also look like this when focused in either case.


## Responsive Guidelines

- When Activating a Toolbar Searchfield beneath the Phone Breakpoint Size, it will resize to become the full width of the viewport to make the search text easier to read.
