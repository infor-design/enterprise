---
title: Datagrid
description: This page describes Datagrid .
demo:
  pages:
  - name: Simple Datagrid Example
    slug: example-index
  - name: Alternate Row Shading
    slug: example-alternate-row-shading.html
  - name: Drilldown Formatter
    slug: example-drilldown.html
  - name: Paging (Indeterminate)
    slug: example-paging-indeterminate.html
  - name: Paging (Server Side)
    slug: example-paging.html
  - name: Paging (Client Side)
    slug: example-paging-client-side.html
  - name: Editing
    slug: example-editable.html
  - name: Column Reordering
    slug: example-reorder.html
  - name: Expandable Row
    slug: example-expandable-row.html
  - name: Row Reordering
    slug: example-row-reorder.html
  - name: Filtering
    slug: example-filter.html
  - name: Selection (Single)
    slug: example-singleselect.html
  - name: Selection (Multiple)
    slug: example-multiselect.html
  - name: Grouped Headers
    slug: example-grouped-headers.html
  - name: Tooltips
    slug: example-tooltips.html
  - name: Datagrid List Styling
    slug: example-list.html
  - name: Tree Grid
    slug: example-tree.html
  - name: Using Nested Objects
    slug: example-nested-objects.html
  - name: Making a custom toolbar
    slug: example-custom-toolbar.html
  - name: Comments Grid (Flexible Row Size)
    slug: example-comments.html
  - name: Fixed Header
    slug: example-fixed-header.html
  - name: Datagrid Grouping
    slug: example-grouping.html
  - name: Datagrid Grouping (Totals)
    slug: example-grouping-totals.html
  - name: Selection (Mixed)
    slug: example-mixed-selection.html
  - name: Summary Row
    slug: example-summary-row.html
  - name: Export to Excel
    slug: example-export-from-button.html
  - name: Export with trailing negative signs moved in front
    slug: example-export-convert-negative.html
  - name: Empty Message Area
    slug: example-empty-message.html
  - name: Expandable Cells
    slug: example-expandable-cells.html
  - name: Dynamic Column Spans
    slug: example-colspan.html
---
## Code Example

The Datagrid is created via JS or via direct HTML markup (CSS table styling). You should pass an array of objects in to the grid on the `dataset` object. Also pass the `columns` array for the column information. There are a number of events described in the events and API section, as well as the column settings.

A Read-Only Datagrid uses "Formatters" to render cell content. A number of these are listed in the API section and it is possible to create your own.

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

## Column Settings (General)

|Setting|Description|
|---|---|
|<code>id</code> | The unique id of the column. Each column in the grid should have some unique id.|
|<code>name</code> | The text to appear in the column header.|
|<code>field</code> | The name of the field in the dataset to show. This can be nested (fx object.field)|
|<code>formatter</code> | The way to format the cell contents (see formatters)|
|<code>align</code> | Can be `left` or `right` or `center`. Note that `center` has limited column type support.|
|<code>sortable</code> | If false, the column cannot be sorted.|
|<code>width</code> | The column width, this can be an integer for pixel width or a percent fx `10%`, if left off the columns will be sized to contents and to fit the width of the grid using the internal algorithm.|
|<code>hidden</code> | If true the column will be hidden, but will appear in the personalization dialog and can thus be later shown by the user.|
|<code>resizable</code> | If false the column will not be resizable, thus is a fixed size and can never be changed by the user by dragging the left and right edge.|
|<code>headerTooltip</code> | Can be used to set a tooltip specific to the column header.|
|<code>reorderable</code> | The column cannot be dragged around to have its order in the list changed.|
|<code>colSpan</code> | The cells can be split over a header. When set to an integer > 1 this next number of columns will be split over this header.|
|<code>uppercase</code> | If true the text will be transformed to upper case in readonly view. Also in edit mode uppercase will be enforced.|
|<code>expandOnActivate</code> | If true the cell can be expanded on focus to show additional / all content.|

## Column Settings (Formatter Specific)

|Formatter Setting|Description|
|---|---|
|<code>inlineEditor</code> | If true the elements (on supported formatters) will be shown inline in the field. For example you could show an input element on each cell. This should only be used with the isList type and sparingly.|
|<code>dateFormat</code> | Used with `Date` formatters and editors. You can use it to specify the display format for date values. fx yyyy-MM-dd. See [locale]( ../components/locale) for date  formatting patterns.|
|<code>timeFormat</code> | Used with `Time` and 'Date' + `Time` formatters and editors. You can use it to specify the display format for date values. fx HH;mm See [locale]( ../components/locale) for time formatting patterns.|
|<code>numberFormat</code> | Used Decimal and Integer columns, this is the same number structure that locale uses. See [locale]( ../components/locale) for number formatting patterns.|
|<code>href</code> | Used on `Hyperlink` formatters. This can be a string to pass to the links href attribute. Or can be function which dynamically runs and can return the href using logic.|
|<code>target</code> | Used on `Hyperlink` formatters. This can be a string to pass to the links target attribute. Or can be function which dynamically runs and can return the target with using logic.|
|<code>icon</code> | Used on `Hyperlink` and `Button` formatters, if provided as a string it will show this icon from the svg icon set added to the page.|
|<code>cssClass</code> | Can be used to add a custom css class to some formatters (fx Hyperlink) or the cell itself.|
|<code>hyperlinkTooltip</code> | Used on `Hyperlink` formatter to add a custom tooltip. This should be the text of the tooltip.|
|<code>click</code> | Used on `Hyperlink` and `Button` formatters to add javascript function logic to run when the item is actioned on.|
|<code>singleline</code> | Used on `Editor` formatter, if true it will reduce the editors contents to one single line.|
|<code>expanded</code> | Used on `Group` and `Expander` formatter, if true it will make the row expanded. This can be a boolean or a javascript function, that can dynamically be used to return if the row should be expanded.|
|<code>groupRowFormatter</code> | Used on the `Group` formatter, this function will pass in info  about the row group and data and allow you to return dynamic html for formatting the group rows appearance.|
|<code>ranges</code> | For example `[{'min': 151, '(max': 9999, 'classes': 'info'}]` for example any value between 151 and 999 will add the info class which formats the color in info blue. Default color is grey. Used on badges and alerts.|
|<code>options</code> | Used on the dropdown and multiselect editor/formatters. For example `[{'value': 1, 'id': 1, 'label': 'Some Value'}]`. This should map to a select elements id, value and text option when populating.|
|<code>isChecked</code> | Used on checkbox and favorite columns. This can be a function that returns the checked state based on the dynamic data thats passed in.|
|<code>postRender</code> | If postColumnRender is set to true on the grid. This will be called for each cell in that column passing you a container and args similar to the formatter. This can be used for more complicated render logic at the cost of performance.|

## Formatters

|Formatter|Description|
|---|---|
|<code>Text</code> | Formats the column value as a direct text element using toString in the grid cell, Undefined or Null values will be shown as empty.|
|<code>Input</code> | If inlineEditor is true, will show the text in an inline input field. This should only be used with the isList type and sparingly.|
|<code>Ellipsis</code> | Shows the column value as a Text element but if the text is cut off will show ellipsis's and a tooltip. This is a bit expensive so should be used sparingly.|
|<code>Password</code> | Shows the text masked with stars. For example: `****`. This is generally used on password fields.|
|<code>Readonly</code> | Shows a Text Formatter with the readonly background color. This can be used to differentiate between editable and non editable cells. This should not be used along with an Editor.|
|<code>Date</code> | Shows a date or string date value formatted to the column's `dateFormat` settings or otherwise the current locale's date settings.|
|<code>Time</code> | Shows a dates time portion or a time string value formatted to the column's `timeFormat` settings or otherwise the current locale's time settings.|
|<code>Autocomplete</code> | Formats the column as direct text like the Text formatter. But added for symmetry with Autocomplete editor.|
|<code>Lookup</code> | Formats the column for use with a Lookup editor. It calls the editors field option / function to assist in mapping key value pairs to the columns data element. When a lookup editor is added it shows the icon on hover.|
|<code>Decimal</code> | Formats the numeric data in the current columns number format. Or you can use the `numberFormat` option for customization.See [locale]( ../components/locale) for number formatting patterns.|
|<code>Integer</code> | Formats the numeric data in the current columns integer format. Or you can use the `numberFormat` option for customization. See [locale]( ../components/locale) for number formatting patterns.|
|<code>Hyperlink</code> | Formats the current data into a clickable hyperlink. You can use the `href` value to pass the links href value in the column (this defaults to '#'). You can use the `text` column value to change the text of the link, in doing so the column value becomes the link contents. `hyperlinkTooltip` can be added to give tooltip text for the link. The `icon` option can be added to provide a icon next to the link.|
|<code>Drilldown</code> | Formats the cell with a drill down icon button in it. This type of column is used to drill into this records details. Use the `click` column option to provide the javascript for that logic.|
|<code>RowReorder</code> | Formats the cell with a reorder icon button in it. This should be used in conjunction with the row-reorder feature. See [Example]( ../components/datagrid/example-row-reorder.html)|
|<code>Checkbox</code> | Formats the cell with a checkbox in it. It can made null or undefined to unchecked and handles either 1/0 as checked un/checked or true/false.|
|<code>SelectionCheckbox</code> | Formats the cell with a selection checkbox in it. The selection functionality of the grid will populate this with the current rows selection attributes and populate the header with a select all / deselect all checkbox.|
|<code>Actions</code> | Formats the cell with a .. actions button icon. You can use the `menuId` option to pass in an id of a ul item. The menu will be the same structure as the standard popupmenu.|
|<code>Textarea</code> | Formats the cell with readonly multi line text area. The column rows will size to the contents of the largest Textarea cell.|
|<code>Editor</code> | Formats the cell with readonly Rich Text Editor. See example [See example]( ../components/datagrid/test-editable-editor-singleline.html). The `singleline` option if set to true will cut the text to single line and show a tooltip.|
|<code>Expander</code> | Formats the cell with an expander chevron. This will act on the `click` option or toggle the collapsed row, when using the [expandable row option]( ../components/datagrid/example-expandable-row.html)|
|<code>GroupRow</code> | Formats this cell / column as the group row. If a `groupRowFormatter` is provided this can be used to return customized html for the group row details. If not it will show the expander icon with the data of the group name. You can pass `expanded` true in the column to expend the row, this can also be a function that dynamically can determine if the row should be expanded. See the [grouping examples]( ../components/datagrid/example-grouping.html)|
|<code>GroupFooterRow</code> | Formats this entire row as the last row in a group when using grouping. The option should be a function that returns the `<tr>` markup for the last group row. See the [group totals example]( ../components/datagrid/example-grouping-totals.html)|
|<code>SummaryRow</code> | Formats this entire column / row as the summary row. The option should be a function that returns the <tr> markup for the summary (last) row. See the [summary row example]( ../components/datagrid/example-summary-row.html)|
|<code>Tree</code> | Formats this entire column as the tree row when using the [tree grid example]( ../components/datagrid/example-tree.html). This interacts with the `treeDepth`, `children` and `depth` options to format into a tree structure.|
|<code>Badge</code> | Formats this entire column as a badge element. You can pass in ranges option to format the badge colors for example `ranges: [{'min': 151, 'max': 9999, 'classes': 'info'}]` for example any value between 151 and 999 will add the info class which formats the color in info blue. Default color is grey.|
|<code>Tag</code> | Formats this entire column as a tag element. You can use the ranges element like the tag and badge formatter.|
|<code>Alert</code> | Formats this entire column as a alert element with text and an alert icon. You can use the ranges element like the tag and badge formatter.|
|<code>Color</code> | Formats the text in a color. It also used the ranges option. Note that this may not pass accessibility and should be used sparingly.|
|<code>Button</code> | Formats the cell with a button in it. You can use the `icon` option to select an icon from the svg set. You can also use the text option to customize the text of the button, if used the column contents will be ignored. Use the `click` column option to code the click function.|
|<code>Dropdown</code> | Formats the cell to go along with a dropdown editor. It will lookup the value in the column `options` array and display the label for the given key. This can be used to resolve code to label displays. It supports the `inlineEditor` option as well for list grids.|
|<code>Spinbox</code> | Formats the cell as text for use with a Spinbox editor. Also supports the `inlineEditor` option as well for list grids.|
|<code>Favorite</code> | Formats the cell with a favorite star. The star's value (checked or unchecked) is populated like the checkbox column with a boolean or truthy value in the data. The `isChecked` function or boolean can be used to more dynamically check set state.|
|<code>TargetedAchievement</code> | Formats the cell with the a targetted achievement chart. The row value will be diveded by 100 to form a percent and the chart will show the percent value. See the [targeted achievement example]( ../components/datagrid/test-targeted-achievement.html)|

## Creating Custom Formatters

Its possible to create your own custom formatter. The idea behind the formatter is it takes the cell value and does processing on it to return the correct markup for the element. The simplest custom formatter would be this example.

```javascript
var myCustom = function (row, cell, value, col) {
  return '<span class="my-custom"> Custom Formatter <b>' + value + '</b></span>';
};
```

The formatter is then linked to the column on the formatter setting. `columns.push({... formatter: myCustom});`. When the grid cell is rendered the formatter function is called and the following options are passed in.

- <code>row</code> The current row number (zero based).
- <code>cell</code> The current cell number (zero based). Note that data may be sorted so generally rowData is more useful.
- <code>fieldValue</code> The current array value to apply to this cell.
- <code>column</code> The columns column object with all of the column settings for this cell.
- <code>item</code> The current row data for this entire row.
- <code>api</code> Access to the entire grid api, in case grid functions are needed.


## Editors

TODO

## Column Settings (Editor Specific)

|Setting|Description|
|---|---|
|<code>maxLength</code> | Used for some editors, on some input types to restrict the input to this integer number of characters.|
|<code>mask</code> | Used to pass in an input mask for some editors to override or add a custom mask. See [the mask component]( ../components/mask) for details on making a mask.|
|<code>maskMode</code> | Used to pass in an input mask maskMode option. See [the mask component]( ../components/mask) for details on making a mask.|
|<code>caseInsensitive</code> | Used in the dropdown editor to make it such case is not used to match keys to the key/value pairs in the options.|
|<code>validate</code> | The validation function(s) to use. See [the validation component]( ../components/validation) for details on validation functions.|

## Keyboard Shortcuts

-   <kbd>Tab</kbd>The initial tab enters the grid with focus on the first cell of the first row, often a header. A second tab moves out of the grid to the next tab stop on the page. Once focus is established in the grid, a TAB into or a Shift Tab into the grid will return to the cell which last had focus.
-   <kbd>Left</kbd> and <kbd>Right</kbd> Move focus to the adjacent column's cell. There is no wrap at the end or beginning of columns.
-   <kbd>Up</kbd> and <kbd>Down</kbd> Move focus to the adjacent row's cell. There is no wrap at the first or last row.
-   <kbd>Home</kbd> moves focus to the first cell of the current row
-   <kbd>End</kbd> moves focus to the last cell of the current row
-   <kbd>Page Up</kbd> moves focus to the first cell in the current column
-   <kbd>Page Down</kbd> moves focus to the last cell in the current column
-   <kbd>Enter</kbd> toggles edit mode on the cell if it is editable. There is also an "auto edit detection". If the user starts typing then edit mode will happen automatically without enter.
-   <kbd>F2</kbd> toggles actionable mode. Pressing the <kbd>Tab</kbd> key while in actionable mode moves focus to the next actionable cell. There is no wrap at the end or beginning of columns. While in actionable mode you can do things like type + enter. This will move you down a row when you hit enter. If the cell has a control that uses down arrow (like the dropdowns or lookups that are editable). Then the user needs to hit enter to enable the edit mode on that cell.


## States and Variations

### Rows
- Hover
- Selected
- Disabled
- Readonly

### Columns
- Focus
- Hover
- Sorted
- All Selected or Not
- Disabled
- Filtering

### Cells
- Hover (sometimes)
- Selected (inherited from row)
- Readonly
- Focus

## Responsive Guidelines

-   Grid resizes to max in a table, allows scrolling vertically. Scrolling horizontally is at the parent container.

## Upgrading from 3.X

-   Still uses same columns and data set options. Some column options enhanced and changed.
-   Uses normal events vs the custom OnThing Event
-   Some Api Functions changed
-   Drill Down Tool tip option moved to the column tooltip option
