
# Breadcrumb Component Implementation Detail [Learn More](#)

{{api-details}}

## Configuration Options

1. Default Breadcrumb Example [View Example]( /components/breadcrumb/example-index)
3. Breadcrumb with current item a link [View Example]( /components/breadcrumb/example-current-as-link)

## Code Example

### Breadcrumbs

This is an example showing a bread crumb pattern with four items. The current item should be last and have the current class. All items take the hyperlink style via class hyperlink. However, based on background element (header vs page) the style may adopt and change. Like hyperlinks the states has an underline appearing. The disabled class can be added to prevent links from being clicked, however they can still be focused because the hyperlink element cannot by valid html standards contain a disabled property.

This control is entirely html and css, to update you will need to implement the logic to replace the link elements in the hierrarchy.\

```html


<nav class="breadcrumb">
  <ol aria-label="breadcrumb">
    <li>
      <a href="#" class="hyperlink hide-focus">Home</a>
    </li>
    <li>
      <a href="#" class="hyperlink hide-focus">Second Item</a>
    </li>
    <li>
      <a href="#" class="hyperlink hide-focus">Third Item</a>
    </li>
    <li class="current">Fourth Item <span class="audible">Current</span></li>
  </ol>
</nav>


```

## Accessibility

-   Add an aria-label with the localized term breadcrumb
-   May need to add audible spans to indicate levels

## Keyboard Shortcuts

-   **Tab** moves focus to the link. A second tab moves focus to the next focusable item.
-   **Space or Enter** executes the link.

## States and Variations

-   Hover
-   Focus
-   Active
-   Disabled
-   Hide Focus

## Upgrading from 3.X

-   Collapsing Lists Is Deprecated
-   Markup entirely changed, see updated example
