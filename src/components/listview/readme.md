---
title: Listview
description: Displays a set of related data objects and their attributes. Best for limited attribute data that may or may not include clear differentiators like status.
system:
  category: blocks
  name: data-list
demo:
  embedded:
  - name: Default Listview Example
    slug: example-index
  pages:
  - name: Alternate Row Colors
    slug: example-alternate-row-color
  - name: List View Classes
    slug: example-list-view-classes
  - name: Multiple Selection
    slug: example-multiselect
  - name: Paging Server Side
    slug: example-paging
  - name: Paging Client Side
    slug: example-paging-clientside
  - name: Single Select
    slug: example-singleselect
  - name: Status Indicators
    slug: example-status
  - name: Click Events
    slug: example-click-events
  - name: Mixed Selection Mode
    slug: example-mixed-selection
---
## Behavior Guidelines

- Lists may be single or multiple selected
- You can have a fixed list toolbar on top, which may contain a title and filtering/search options
- You can have a contextual action toolbar for selected items
- Paging may be supported in the future

## Code Example

### Basic List

This example shows using a list with a <a href="https://mustache.github.io/mustache.1.html" target="_blank">mustache template</a>. The list itself is the div with the listview class. This example is showing the list in a card but this is optional.

The template shows the use of an if/else to show a is-disabled class. And also shows the use of the three text sizes available. Note that `dataset` is required to loop over the dataset option passed into the control.

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
        <use href="#icon-vertical-ellipsis"></use>
      </svg>
    </button>
    <ul class="popupmenu">
      <li><a href="#" id="action-item-one">Action One</a></li>
      <li><a href="#" id="action-item-two">Action Two</a></li>
    </ul>
  </div>
  <div class="card-content">
    <div class="contextual-toolbar toolbar is-hidden">
      <div class="buttonset">
        <button id="btn-tertiary" class="btn-tertiary" title="Assign Selected Items" type="button">Assign</button>
        <button class="btn-tertiary" id="remove" title="Remove Selected Items" type="button">Remove</button>
      </div>
    </div>
    <div class="listview" id="multiselect-listview" data-options="{ template: 'multiselect-tmpl', selectable: 'multiple', dataset: 'demoTasks' }"></div>
  </div>
</div>
```

### Listview - Classes

The list view comes with a few built in classes you can use for the text styling. The following classes are available:

- `listview-heading-lg` - shows larger heading text to form part of a text hierarchy
- `listview-heading` - shows a normal larger heading text to form part of a text hierarchy
- `listview-subheading` - shows a second level heading text to form part of a text hierarchy
- `listview-micro` - shows text for a small detail to form the bottom of the text hierarchy
- `listview-data-label` - shows label text for a `field`
- `listview-data` - shows data text for a `field`
- `hyperlink` - shows the text as a hyperlink

See example <a href="https://design.infor.com/code/ids-enterprise/latest/demo/components/listview/example-list-view-classes" target="_blank">To see it in action</a>

To add some color you can colorize the borders of the cells and some text. The following classes are available to place on text elements or on the card `li` itself to form the border color: `error`, `alert`, `success`, `info`

See example <a href="https://design.infor.com/code/ids-enterprise/latest/demo/components/listview/example-singleselect.html" target="_blank">To see it in action</a>

### Listview - Card List

You can have a list of cards by adding the `card-list` class in the list view component. Each `li` in the list should have a card. You can add `card-variant` in the card to minimize the height if needed. The cards can be customized using existing card settings and classes.

```html
  <div class="listview card-list">
    <ul>
      <li>
        <div class="card card-variant"></div>
      </li>
    </ul>
  </div>
```

See example <a href="https://design.infor.com/code/ids-enterprise/latest/demo/components/listview/example-card" target="_blank">To see it in action</a>

## Keyboard Shortcuts

- <kbd>Tab</kbd> When a list is tabbed to, select the first item if nothing else is already selected. A second tab will take the user out of the widget to the next tab stop on the page.
- <kbd>Up/down arrow</kbd> navigate up and down the list.
- <kbd>Shift+F10</kbd> If the current item has an associated context menu, then this key combination will launch that menu.
- <kbd>Space</kbd> toggles <a href="http://access.aol.com/dhtml-style-guide-working-group/#checkbox" target="_blank">checkboxes</a> in the case of multi select or a list item in case of normal select

## States and Variations

- Hover
- Selected
- Focus
- Disabled

## Accessibility

- Lists must have keyboard support
- Lists should have role="listbox"
- The aria tag aria-activedescendant should point to the active item's id
- The attribute aria-posinset should point to the position index for each item starting at 1
- The attribute aria-setsize - should be the list count
- The attribute aria-disabled should be added to any disabled items
- The aria-selected tag should be added to any selected entries
- For multiselect note that aria-selected = "true" will set on the selected elements.

## Responsive Guidelines

- The list is 100% of the parent container in height and width so can be used in a widget object or responsive grid object.
- The list body will expand vertically and horizontally to fill it the size of its parent container.
- When used in [homepages]( ../homepage), special rules apply with sizes.

## Testability

You can add custom id's/automation id's to the Listview Component that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes.
For example:

```js
  attributes: { name: 'id', value: args => `background-color` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

The Listview component automatically appends these attributes to the top-level Listview component, as well as each item in the list.  The items have an index appended to each to distinguish them from the rest.

## Upgrading from 3.X

- Single select roughly replaces the inforListBox component.
- Multiselect is a new construct, however it replaces the listbox with checkboxes construct.
