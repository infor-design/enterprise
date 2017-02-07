# Datagrid

## Test Cases

[Alternate Row Shading](controls/datagrid-alternate-row-shading)

 - The rows should appear in alternate colors. The darker color should be starting on the even row (2,4,6)
 - Change the Theme to High Contrast and Visually Test
 - Change the Theme to Low Contrast and Visually Test
 - Hover the rows on all three themes - there should be a visual difference

[DrillDown](controls/datagrid-drilldown)

 - Click the drill down icon, and check the console (Dev tools). The console should show the right row number (zero based) and data for the row you click.
 - Navigate to the drill down column and press space/enter, and check the console (Dev tools). The console should show the right row number (zero based) and data for the row you click.
 - Click into the search field and type "Com" then enter. The rows should highlight.
 - In the .. Menu, Select the three row sizes and check that the grid is rendered accordingly.
 - Drill down column should not be resizable

[Editing](controls/datagrid-editable) TODO

 - Select one or Two Rows - The Contextual Panel Should appear
  - The Count should show the number selected
  - Clicking Remove should remove the selected rows
 - Click Add
   - The Add icon should appear on the row
   - The row id should increment
   - The row should appear on the top

[Expandable Row](controls/datagrid-expandable-row)

 - Click the Expand Icon and the content should show underneath
 - Click the drill down icon, and check the console (Dev tools). The console should show the right data for the row you click.
 - Toggling the row should omit a expandrow and collapserow event in the console

[Filter Row](controls/datagrid-filter)

 - Some Columns are disabled from filtering and cannot be interacted with.
 - Try to Filter on each column and each combination in the columns
 - Try to combine two columns and filter (AND) condition
 - Toggle the row heights in the actions button and see that the filter row is still visible but the row heights change.
 - Resize columns and the filter inputs should size according
 - Type in the Product name and then hit enter to filter
 - Clear the text in the Product name and then hit enter to filter
 - Clear the text in the Product name and tab out to filter
 - Type a filer in product name and active with the action button "Run Filter"
 - When a filter is set select clear filter to reset in the actions menu

[Grouped Headers](controls/datagrid-grouped-headers)
- Visually 3 headers should be in the First group and 4 in the second, the top group is a darker color
- Test the visual difference on all three themes
- The bottom columns can be sorted
- The bottom columns can be resized

TODO
- P4 The top column can be resized
- P4 Smoother resize
- P4 Can it be down with col groups

[Grouped Headers](controls/datagrid-list)
- Visually the header and the body look more integrated than the normal tables, so has a different styling
- Test the visual difference on all three themes
- Columns can be sorted and resized
- Cells can be focus and arrow keys to move around

TODO
- P2 Resize to Reponsive

[Grouped Headers](controls/datagrid-multiselect)
- Clicking on the row itself or the checkbox will select the row visually and with the checkbox
- Test the visual difference on all three themes
- Test the visual appearance on all three row heights in the actions menu
- Selecting a row will show the count and slide in the "contextual action" toolbar. The remove button has no functionality wired
- The Count should so the right number of rows

[Grouped Headers](controls/datagrid-nested-objects)
- This example just shows data can be in nested form its working if the last columns says "test"

[Grouped Headers](controls/datagrid-paging-client-side)
- The count should show for all rows (1000 Results)
- Resize the columns, then go to next and then previous page
- Sort the number columns and then go through pages and confirm
- Enter a page number in the input and tab or enter

[Grouped Headers](controls/datagrid-indeterminate)
- Idea behind this example is you cannot go to specific page (only next, prev, first, last)
- Note that it is starting on page 2 by design
- Resize the columns, then go to next and then previous page
- Change the number of rows per page and use the paging
- Try the search
- Tab down to the pager and use left and right arrow
- Tab to the number of rows per page
- Change Local and see that the pager is translated (controls/datagrid-paging-indeterminate?locale=es-ES)
- Test the three themes
- Test RTL (controls/datagrid-paging-indeterminate?locale=ar-SA)
- Test the row heights

[Grouped Headers](controls/datagrid-paging)
- Idea behind this example is its the main paging defaults
- Note that it is starting on page 1
- Resize the columns, then go to next and then previous page
- Change the number of rows per page and use the paging
- Try the search
- Tab down to the pager and use left and right arrow
- Tab to the number of rows per page
- Change Local and see that the pager is translated (controls/datagrid-paging?locale=es-ES)
- Test the three themes
- Test RTL (controls/datagrid-paging?locale=ar-SA)
- Go to page two and press the drill down arrow. Make sure the console shows the right row id / data
- Test the 3 row heights
- Test sorting with pager

[Grouped Headers](controls/datagrid-reorder)
- Idea behind this example is showing the functionality to drag/reorder the columns and the Personalize Columns Menu
- Resize the columns, then try to drag and move a column from the header
- Note that the filter button has no functionality
- Open the ... menu and select personalize columns try to hide and show a few columns
- Resize the columns, then try to drag and move a column from the header
- Change Local and see that the personalize columns is translated (controls/datagrid-reorder?locale=es-ES)
- Test the three themes
- Test RTL (controls/datagrid-reorder?locale=ar-SA)
- Test the 3 row heights
- Reload the page and notice that all the columns you changed are saved
- Rest to Default, Resize a column then hide and show a column

[Grouped Headers](controls/datagrid-singleselect)
- This example tests shows single select mode.
- Test the focus on all the cells is visual ok
- Test the three themes
- Resize the columns
- Test the the row sizes
- Hovering the whole row shows cursor
- Clicking the whole row selects whole row

[Grouped Headers](controls/datagrid-table-markup)
- This example tests shows that you can initialize a grid with a table in the page.
- The example is working if teh grid renders normally
- User should be able to use the toolbar, resize and sort and other normal actions

[Grouped Headers](controls/datagrid-tooltips)
- This example tests shows various places you can see tooltips
- Hover the first column (drill down arrow) and you should see a black tooltips
- Hover the header "Product Id" and you should see a tooltips
- Hover the last cell on the rows with ... A tooltip should appear
- Sort the last column and hover the cell with ... A tooltip should appear

[Grouped Headers](controls/datagrid-tree)
- This example tests shows a hierarchical structure in the datagrid
- When resizing the page (height) the grid should stay in view (fixed header)
- Should be able to expand and collapse tree rows
- Test 3 themes
- Test Row heights in the actions menu. Then test that the grid rows are the correct heights.
- Test keyboard (space to open rows) while in that cell
- Sort should work (only at the top level)

## Test Cases

[Only 2 Columns](tests/datagrid/2-columns)
- Purpose of the example was to test resize with two Columns
- Deprecate Maybe?

[A bunch of columns](tests/datagrid/auto-column-width-many-columns)
- Purpose of the example was to test left and right scrolling with a lot of columns
- Test on multiple browsers (not speed scrolling)

[A bunch of columns](tests/datagrid/cascading-dropdowns-short-row)
- Purpose of the example was to show a drop down that is filtered based on the row types.
  The example is working if there are different values in each row
- This example is the same as cascading-dropdowns but with a short row, test the short row is visually correct

[A bunch of columns](tests/datagrid/cascading-dropdowns.html)
- Purpose of the example was to show a drop down that is filtered based on the row types.
  The example is working if there are different values in each row
TODO: Issues in Optiva with mismtached columns

[Row Click Event](tests/datagrid/click-event-on-rows.html)
- Purpose of the example was to show the column click event. When you click the drill down a message should display the 1 based row id.

[Row Click Event](tests/datagrid/column-widths.html)
- Purpose of the example was to show the column click event. When you click the drill down a message should display the 1 based row id.

[Page Panes](/examples/landmark/pagepanes-grid.html)
- This example shows an landmark form with a bunch of configurable panes. Tab through panes and see all is rendered normally.
- Resize to mobile and retest

[Page Panes](/tests/datagrid/column-widths.html)
- This example shows an landmark form with a bunch of configurable panes. Tab through panes and see all is rendered normally.


columns-class.html
columns-colors.html
contextualactionpanel.html
counts-on-tab.html
custom-number-format.html
custom-results-text.html
custom-toolbar-maxvisible-button.html
custom-toolbar.html
datagrid-columns-auto.html
datagrid-columns-fixed.html
datagrid-columns-mixed.html
datagrid-columns-percent.html
datagrid-comments.html
datagrid-contextmenu.html
datagrid-custom-editor.html
datagrid-custom-formatter.html
datagrid-editable-autocomplete.html
datagrid-editable-datetime.html
datagrid-editable-hidden.html
datagrid-editable-lookup.html
datagrid-editable-paging.html
datagrid-editable-short-row.html
datagrid-ellipsis-tooltips.html
datagrid-expandable-drill-page.html
datagrid-filter-activecell.html
datagrid-filter-alternate-row-shading.html
datagrid-filter-conditions.html
datagrid-filter-disabled.html
datagrid-filter-gridlist.html
datagrid-filter-hidden.html
datagrid-filter-localized.html
datagrid-filter-multiselect.html
datagrid-filter-paging-client-side.html
datagrid-filter-paging-server-side.html
datagrid-filter-server-side.html
datagrid-filter-singleselect.html
datagrid-filter-using.period.in.filename.html
datagrid-fixed-header-list.html
datagrid-fixed-header-short-row-filter.html
datagrid-fixed-header-short-row.html
datagrid-fixed-header.html
datagrid-formatters.html
datagrid-full-width.html
datagrid-grouping-formatter.html
datagrid-grouping-list-custom.html
datagrid-grouping-list.html
datagrid-grouping-tests.html
datagrid-grouping-totals.html
datagrid-grouping.html
datagrid-image.html
datagrid-modal-over.html
datagrid-multiselect-nonchecks.html
datagrid-on-card.html
datagrid-pagesize.html
datagrid-paging-deferred.html
datagrid-paging-disable-lastpage.html
datagrid-paging-empty-dataset.html
datagrid-paging-indeterminate-nototal.html
datagrid-paging-issues.html
datagrid-paging-long-page.html
datagrid-paging-multiple-calls.html
datagrid-paging-specific-page.html
datagrid-paging-trigger.html
datagrid-programmatic-updates.html
datagrid-rowheight.html
datagrid-rowspan.html
datagrid-scrolling-contained-defined.html
datagrid-scrolling-contained-filter.html
datagrid-scrolling-contained-less-rows.html
datagrid-scrolling-contained-maxheight-list.html
datagrid-scrolling-contained-pane.html
datagrid-scrolling-contained-short-rows.html
datagrid-scrolling-contained.html
datagrid-scrolling-fixed.html
datagrid-sort-override.html
datagrid-source-format.html
datagrid-summary-row.html
datagrid-tree-add-children.html
datagrid-tree-alternate-row-shading.html
datagrid-tree-drilldown.html
datagrid-tree-editable.html
datagrid-tree-filter.html
datagrid-tree-grouped-headers.html
datagrid-tree-lazy-loading-rowdata.html
datagrid-tree-lazy-loading.html
datagrid-tree-list.html
datagrid-tree-multiselect.html
datagrid-tree-paging.html
datagrid-tree-patch-status.html
datagrid-tree-singleselect.html
datagrid-tree-tooltip.html
datagrid-w-lookup.html
datalist-input.html
destroy.html
drag-column-reorder.html
dynamic-links.html
dynamic-mask.html
editable-selection-issues.html
editable-short-height.html
expandable-row-checkboxes.html
expandable-short-row.html
export-custom-dataset.html
export-from-button.html
export-from-menu.html
export-paging.html
fifty-columns.html
form-buttons.html
hide-show-column.html
icon-buttons.html
large-dataset-performance.html
loaddata-selected-rows.html
localstorage-conflicts.html
long-text.html
lookup-and-grid-example.html
manual-sort.html
multiple-grids.html
on-tab.html
order-lines.html
passwords.html
readonly-links.html
records-menu.html
save-selections.html
selected-event.html
short-rows.html
some-hidden-columns.html
sort-field-vs-id.html
toggle-editable.html
toolbar-breadcrumb.html
update-columns.html
update-content-visible.html
update-grouped-headers.html
updaterow-expandable.html
wide-grid-expandable-row-with-form-buttons.html
xss-prevention.html

TODO:
- Refactor the mouse up and click code
- Editing (more)
- Last Column / Border Resize (maybe)
- TODOS
- Mobile (percent col widths) or mobile min - width....
- Test on Optiva
- Test on Windows
