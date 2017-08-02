
# Listview  [Learn More](#)

## Configuration Options

1. Default Listview Example [View Example]( ../components/listview/example-index)
2. Alternate Row Colors [View Example]( ../components/listview/example-alternate-row-color)
3. Multiple Selection [View Example]( ../components/listview/example-multiselect)
4. Paging Server Side [View Example]( ../components/listview/example-paging)
5. Paging Client Side [View Example]( ../components/listview/example-paging-clientside)
6. Single Select [View Example]( ../components/listview/example-singleselect.html)
7. Status Indicators [View Example]( ../components/listview/example-status)

{{api-details}}

## Behavior Guidelines

-   Lists may be single or multiple selected
-   You can have a fixed list toolbar on top, which may contain a title and filtering/search options
-   You can have a contextual action toolbar for selected items
-   Paging may be supported in the future

## Code Example

### Basic List

This example shows using a list with a [mustache template](https://mustache.github.io/mustache.1.html). The list itself is the div with the listview class. This example is showing the list in a card but this is optional.

The template shows the use of an if/else to show a is-disabled class. And also shows the use of the three text sizes available. Note that `dataset`}}` is required to loop over teh dataset option passed into the control.

```html

<div class="listview" id="id-to-list" data-tmpl="id-to-task-tmpl" data-dataset="array or url"></div>


```

### Listview - Multiselect

Creating a Multiselect Listview also uses the listview component. API guidelines are listed on the basic list page. The only special option to create a multiselect list is to add data-selectable="multiple". When doing this, a checkbox is added. You can also create a listview-toolbar which will show buttons upon selection of one or more rows.

```html

<div class="card">
  <div class="card-header">
    <h2 class="card-title">My Tasks</h2>
    <button class="btn-actions" type="button">
      <span class="audible">Actions</span>
      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xlink:href="#icon-more"></use>
      </svg>
    </button>
    <ul class="popupmenu">
      <li><a href="#">Action One</a></li>
      <li><a href="#">Action Two</a></li>
    </ul>
  </div>
  <div class="card-content">
    <div class="contextual-toolbar toolbar is-hidden">
      <div class="buttonset">
        <button class="btn-tertiary" title="Assign Selected Items" type="button">Assign</button>
        <button class="btn-tertiary" id="remove" title="Remove Selected Items" type="button">Remove</button>
      </div>
    </div>
    <div class="listview" id="multiselect-listview" data-options="{ template: 'multiselect-tmpl', selectable: 'multiple', dataset: 'demoTasks' }"></div>
  </div>
</div>


```

## Keyboard Shortcuts

-   **Tab:** When a list is tabbed to, select the first item if nothing else is already selected. A second tab will take the user out of the widget to the next tab stop on the page.
-   **Up/down arrow** navigate up and down the list.
-   **Shift+F10:** If the current item has an associated context menu, then this key combination will launch that menu.
- **Space bar** toggles [checkboxes](http://access.aol.com/dhtml-style-guide-working-group/#checkbox) in the case of multi select or a list item in case of normal select

## States and Variations

-   Hover
-   Selected
-   Focus
-   Disabled

## Accessibility

-   Lists must have keyboard support
-   Lists should have role="listbox"
-   The aria tag aria-activedescendant should point to the active item's id
-   The attribute aria-posinset should point to the position index for each item starting at 1
-   The attribute aria-setsize - should be the list count
-   The attribute aria-disabled should be added to any disabled items
-   The aria-selcted tag should be added to any selected entries
-   For multiselect note that aria-selected = "true" will set on the selected elements.

## Responsive Guidelines

- The list is 100% of the parent container in height and width so can be used in a widget object or responsive grid object.
- The list body will expand vertically and horizontally to fill it the size of its parent container.
- When used in [homepages]( ../components/homepage), special rules apply with sizes.

## Upgrading from 3.X

-   Single select roughly replaces the inforListBox component.
-   Multiselect is a new construct, however it replaces the listbox with checkboxes construct.
