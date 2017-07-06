# Icons  [Learn More](#)

{{api-details}}

## Configuration Options

1. Basic Icons [View Example]( ../components/icons/example-index)
2. Extended Icon Set [View Example]( ../components/icons/example-extended)
3. Caret Icons [View Example]( ../components/icons/example-caret)
4. Checkmarks [View Example]( ../components/icons/example-checks)
5. Empty Widget Icons [View Example]( ../components/icons/example-empty-widgets)
6. Infor / SoHo Logos [View Example]( ../components/icons/example-logos)
7. Animated Pseudo Elements (Hamburger / Back) / SoHo Logos [View Example]( ../components/icons/example-pseudo-elements)
8. Tree Icons [View Example]( ../components/icons/example-tree)

## Code Example

### SVG Icons Support

It is required to inline the svg icons in html markup in order to be able to change dimensions and colors with css. To achieve this, follow the following steps:

1.  Add a div containing all icons (referred to as the svg block) as per [http://git.infor.com/projects/SOHO/repos/controls/...](http://git.infor.com/projects/SOHO/repos/controls/browse/views/controls/svg.html), then click the raw element for the exact html. This should be at the top of the page for wider support (Safari needs this at the top).
2.  Add markup as per the [example page]( ../components/icons/example-index), for example:
    1.  focusable="false" is added so that the element does not get a tab stop in some browsers
    2.  role="presentation" is added to stop duplicate control feedback when using down arrows while using assistive technology
    3.  aria-hidden="true" causes the icon to be hidden for assistive technologies


```html

// As Button
<button class="btn-icon">
  <svg aria-hidden="true" focusable="false" role="presentation" class="icon">
     <use xlink:href="#icon-calendar"/>
   </svg>
   <span>Calendar</span>
 </button>

// With Button - Just Icon
<svg aria-hidden="true" focusable="false" role="presentation" class="icon" >
   <use xlink:href="#icon-calendar"/>
</svg>


```

## Accessibility

-   When used alone (icon with out text) an audible span should be used for screen readers to now what the button does.
-   Tooltips should be shown on icons (but not on icons with text as it is redundant)

## Keyboard Shortcuts

-   Icons are usually on buttons, so the usually keyboard shortcuts of tab and shift tab apply. Buttons can also be disabled

## States and Variations

-   When on a button, will have distinct focus, hover and disabled states.

## Responsive Guidelines

-   At large breakpoints on the toolbar icon + text or just text is shown
-   At smaller breakpoints just icon is shown. (This is handled by the soho toolbar control)

## Upgrading from 3.X

-   Icons nows use svg
-   Need to add the SVG document containing all icons/symbals at the head of the document
-   svg elements should be added to the page to replace the iconButton classes
