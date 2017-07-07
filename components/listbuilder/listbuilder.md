
# ListBuilder  [Learn More](#)

{{api-details}}

## Configuration Options

1. Default List Builder Example [View Example]( ../components/listbuilder/example-index)


## Code Example

The list builder is structured as a listbuilder element that contains a [standard toolbar]( ../components/toolbar) structure followed by a listbuilder-content section that contains a standard [listview]( ../components/listview).

When initialized with the `$elem.listbuilder()` plugin you pass in a data set that ineracts with the list view template. The toolbar buttons are automatically mapped to add, edit , delete , up , down functions via the option settings.

```javascript

  <div class="listbuilder" >
    <div class="toolbar formatter-toolbar">
      ...
    </div>
    <div class="listbuilder-content">
      <div class="listview"></div>
    </div>
  </div>


```

## Accessibility / Keyboard Shortcuts

-   [ListView](../components/listview) guidelines apply as this is conatains a listview.
-   [Toolbar](../components/toolbar) guidelines apply as this is conatains a toolbar.

## Code Tips

The [tests folder](../components/listbuilder/index) show several test cases.

## Upgrading from 3.X

- This replaces the list view examples with toolbar. We made this a component with some default functionality.
