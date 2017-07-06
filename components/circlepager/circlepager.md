
# Circle Pager  [Learn More](#)

{{api-details}}

## Configuration Options

1. Default Circle Pager Example [View Example]( ../components/circlepager/example-index)
2. Circle Pager on a Form [View Example]( ../components/circlepager/example-form)
3. Circle Pager with more than one item per slide [View Example]( ../components/circlepager/example-more-slides)
4. Circle Pager on a Tab Example [View Example]( ../components/circlepager/example-tabs)

## Code Example

This example shows how markup the circle pager. Then call `$(elem).circlepager()` to invoke. The structure of the circle pager is that you have a circlepager div followed by a slides container and then one slider per "page". The page content goes in the slide-content element.

```html

<div class="circlepager example1">
  <div class="slides">

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br />
        $750.00
        </p>
      </div>
    </div>

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br />
        $750.00
        </p>
      </div>
    </div>

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br />
        $750.00
        </p>
      </div>
    </div>

  </div>
</div>


```

## Accessibility

-   [Carousel](https://www.w3.org/WAI/tutorials/carousels/) guidelines apply.
- We do not auto move the carousel elements
- User can tab to the cicles and activate

## Keyboard Shortcuts

-   **Tab:** Tab through the pager buttons (circles)
-   **Enter:** Activate a Page

## Upgrading from 3.X

-   Replaces .inforCarousel() in a more limited fashion
