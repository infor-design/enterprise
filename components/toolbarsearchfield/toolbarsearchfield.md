# Toolbar Searchfield Implementation Detail [Learn More](#)

## Important Notes

This is a specific component wrapper for searchfield components that reside inside of [Toolbars](/components/toolbar/) entitled Toolbar Searchfield.  These components are very different from regular searchfields and have an expanded API.  There is an alternate API documentation for the main [Searchfield](/components/searchfield) component.

{{api-details}}

## Configuration Options

1. [Common Configuration](/components/toolbar-searchfield/example-index.html)

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

## Accessibility

## Keyboard Shortcuts

## States and Variations
