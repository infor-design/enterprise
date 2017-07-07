
# HomePage  [Learn More](https://soho.infor.com/index.php?p=component/about-dialog)

{{api-details}}

## Configuration Options

1. Example of Empty HomePage Layout [View Example]( ../components/homepage/example-index)
2. Example of HomePage filled with Sample Data [View Example]( ../components/homepage/example-filled)
3. 4 Column Layout [View Example]( ../components/homepage/example-four-column)
4. Hero Widget 3 Columns [View Example]( ../components/homepage/example-hero-widget)
5. Hero Widget 2 Column [View Example]( ../components/homepage/example-widget-two-column)
6. More Test Layouts (replace a-o in url) [View Example]( ../components/homepage/example-scenario-a.html)

## Code Example

The home page component needs js for its layout mechanism. Call the `.homepage()` plugin on the prescribed structure. The plugin will take care on resize that everything is laid out in the best order and use of space it can be.

See also the card/widget examples [View Example]( ../components/cards) for widget structure.

```html

<div class="homepage page-container scrollable" data-columns="3">
  <div class="content">

    <div class="widget triple-width">
    ...
    </div>

    <div class="widget">
    ...
    </div>

    <div class="widget">
    ...
    </div>

  </div>
</div>


```

## Accessibility

- The component respects element tab order which is important between the main containers.

## Code Tips

- It is possible to toggle / view 3 or 4 columns depending on how much screen real estate you want to use.

## Keyboard Shortcuts

-   **Tab** Moves between the card sections

## Upgrading from 3.X

-  Replaces the Tiles layout and is not compatible.
