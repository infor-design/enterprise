
# Empty Widgets  [Learn More](#)

## Configuration Options

1. Example Showing all Types of Empty Widgets [View Example]( ../components/empty-widgets/example-index)

## API Details

### Html Sections

-   `card-empty-icon` -  If true will contain one of the icons from the [icon list](http://git.infor.com/projects/SOHO/repos/controls/browse/components/empty-widgets/svg-empty.html)
-   `card-empty-title` -  If true chart will not resize / update when resizing the page.
-   `card-empty-info` -  If true chart will not resize / update when resizing the page.
-   `card-empty-actions` -  If adding this section will contain some actions a person can do to resolve the empty situation such as reload ect. Should be preferably one action.

```html

<div class="card-content">
  <div class="card-empty-icon">
    <svg class="icon-empty-state" focusable="false" aria-hidden="true" role="presentation">
      <use xlink:href="#icon-empty-new-project"></use>
    </svg>
  </div>
  <div class="card-empty-title">
    Add a New Project
  </div>
  <div class="card-empty-info">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do siusmod temp.
  </div>
  <div class="card-empty-actions">
    <button type="button" class="btn-primary">
      <span>Start</span>
    </button>
  </div>
</div>

```

## Accessibility

- Do not use only an icon. There should be text as well as the icon for screen reader users.

## Code Tips

- Submit a new example showing your usage, we would like to refactor these to be used on lists, pages ect.

## Keyboard Shortcuts

- None

## Upgrading from 3.X

- This is a new concept
