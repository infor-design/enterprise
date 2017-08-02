
# Datagrid [Learn More](https://soho.infor.com/index.php?p=component/about-dialog)

## Configuration Options

1. Simple Datagrid Example [View Example]( ../components/datagrid/example-index)
2. Alternate Row Shading [View Example]( ../components/datagrid/example-alternate-row-shading.html)
3. Drilldown Formatter [View Example]( ../components/datagrid/example-drilldown.html)
4. Paging (Indeterminate) [View Example]( ../components/datagrid/example-paging-indeterminate.html)
5. Paging (Server Side) [View Example]( ../components/datagrid/example-paging.html)
6. Paging (Client Side) [View Example]( ../components/datagrid/example-paging-client-side.html)
7. Editing [View Example]( ../components/datagrid/example-editable.html)
8. Column Reordering [View Example]( ../components/datagrid/example-reorder.html)
9. Expandable Row [View Example]( ../components/datagrid/example-expandable-row.html)
10. Row Reordering [View Example]( ../components/datagrid/example-row-reorder.html)
11. Filtering [View Example]( ../components/datagrid/example-filter.html)
12. Selection (Single) [View Example]( ../components/datagrid/example-singleselect.html)
13. Selection (Multiple) [View Example]( ../components/datagrid/example-multiselect.html)
14. Grouped Headers [View Example]( ../components/datagrid/example-grouped-headers.html)
17. Tooltips [View Example]( ../components/datagrid/example-tooltips.html)
18. Datagrid List Styling [View Example]( ../components/datagrid/example-list.html)
19. Tree Grid [View Example]( ../components/datagrid/example-tree.html)
20. Using Nested Objects [View Example]( ../components/datagrid/example-nested-objects.html)
21. Making a custom toolbar [View Example]( ../components/datagrid/example-custom-toolbar.html)
22. Comments Grid (Flexible Row Size)  [View Example]( ../components/datagrid/example-comments.html)
23. Fixed Header   [View Example]( ../components/datagrid/example-fixed-header.html)
24. Datagrid Grouping [View Example]( ../components/datagrid/example-grouping.html)
25. Datagrid Grouping (Totals) [View Example]( ../components/datagrid/example-grouping-totals.html)
26. Selection (Mixed)  [View Example]( ../components/datagrid/example-mixed-selection.html)
27. Summary Row  [View Example]( ../components/datagrid/example-summary-row.html)
28. Export to Excel [View Example]( ../components/datagrid/example-export-from-button.html)

{{api-details}}

## Code Example

The Datagrid is created via JS or via direct html markup (css table styling). You should pass an array of objects in to the grid on the dataset object. Also pass the columns array for the column information. There are a number of events described in the events and api section, as well as the column settings.

A Read-Only Datagrid uses "Formatters" to render cell content. A number of these are listed in the api section, and it is possible to create your own.

```html


<div class="row">
  <div class="twelve columns">
    <div id="datagrid">
    </div>
  </div>
</div>


```

```javascript


  //Define Columns for the Grid.
  columns.push({ id: 'productId', name: 'Product Id', field: 'productId', width: '50%', formatter: Formatters.Readonly});
  columns.push({ id: 'productName', name: 'Product Name', sortable: false, field: 'productName', width: '50%', formatter: Formatters.Hyperlink});

  //Init and get the api for the grid
  $('#datagrid').datagrid({
    columns: columns,
    dataset: data //Json Array
  });


```

## Keyboard Shortcuts

-   **Tab  **The initial tab enters the grid with focus on the first cell of the first row, often a header. A second tab moves out of the grid to the next tab stop on the page. Once focus is established in the grid, a TAB into or a Shift Tab into the grid will return to the cell which last had focus.
-   **Left and Right Arrow** Move focus to the adjacent column's cell. There is no wrap at the end or beginning of columns.
-   **Up and Down Arrow** Move focus to the adjacent row's cell. There is no wrap at the first or last row.
-   **Home** moves focus to the first cell of the current row
-   **End** moves focus to the last cell of the current row
-   **Page Up** moves focus to the first cell in the current column
-   **Page Down** moves focus to the last cell in the current column
-   **Enter** toggles edit mode on the cell if it is editable. There is also an "auto edit detection". If the user starts typing then edit mode will happen automatically without enter.
-   **F2** toggles actionable Mode. Pressing the **Tab** key while in actionable mode moves focus to the next actionable cell. There is no wrap at the end or beginning of columns. While in actionable mode you can do things like type + enter. This will move you down a row when you hit enter. If the cell has a control that uses down arrow (like the dropdowns or lookups that are editable). Then the user needs to hit enter to enable the edit mode on that cell.


## States and Variations

-   Hover
-   Selected

## Responsive Guidelines

-   Grid resizes to max in a table, allows scrolling vertically. Scrolling horizontally is at the parent container.

## Upgrading from 3.X

-   Still uses same columns and data set options. Some column options enhanced and changed.
-   Uses normal events vs the custom OnThing Event
-   Some Api Functions changed
-   Drill Down Tool tip option moved to the column tooltip option
