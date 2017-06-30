
# Expandable Area [Learn More](#)

{{api-details}}

## Configuration Options

1. Default Expandable Area Example [View Example]( /components/expandablearea/example-index)
2. Custom Link Text Demo [View Example]( /components/expandablearea/example-custom-text)

## Code Example

An expandable area is a div with the *expandable-area* class. Inside that element would be a header with a title and a pane. The pane has the class *expandable-pane* and is the area that will hide and show.

Its possible to keep the area open by default by adding the class *is-expanded* to the *expandable-area*. You can also add a second pane with class *expandable-visible-panel.* This pane will always remain open.\

```html
    <div class="expandable-area">
      <div class="expandable-header">
        <span class="title">Procurement</span>
      </div>
      <div class="expandable-pane">
        <div class="content">
          Ubiquitous out-of-the-box, scalable; communities disintermediate beta-test, enable utilize markets dynamic infomediaries virtual data-driven synergistic aggregate infrastructures, "cross-platform, feeds bleeding-edge tagclouds." Platforms extend interactive B2C benchmark proactive, embrace e-markets, transition generate peer-to-peer.
        </div>
      </div>
    </div>

```

## Keyboard Shortcuts

-   Press **Tab** to focus the Expandable Area's link.
-   Press **Enter** to expand the area or collapse it
-   If the content pane is open, pressing **Tab** or **Shift + Tab** will focus the next/previous focusable element inside the content pane.
-   If the content pane is closed, or focus is on the last focusable element inside the content pane, pressing **Tab** once more will leave the content pane and focus the next focusable element on the page.
-   **Shift + Tab** will do the opposite.

## States and Variations

An Expandable Area content pane can be either:

-   Collapsed
-   Expanded

During initialization, the Expandable Area's base element \$('.expandable-area') is checked for the css class 'is-expanded'. If found, the Expandable Area content pane will open automatically.

## Responsive Guidelines

The Expandable Area will automatically stretch to fill 100% of it's parent element's width.

## Upgrading from 3.X

-   Expandable Area and Field Set are separated
