# Datagrid

## Main Test Cases

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

[Reorder](controls/datagrid-reorder)
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

TODO: Had broken layout needs more testing

[Single Select](controls/datagrid-singleselect)
- This example tests shows single select mode.
- Test the focus on all the cells is visual ok
- Test the three themes
- Resize the columns
- Test the the row sizes
- Hovering the whole row shows cursor
- Clicking the whole row selects whole row

[Init Via Table Markup](controls/datagrid-table-markup)
- This example tests shows that you can initialize a grid with a table in the page.
- The example is working if teh grid renders normally
- User should be able to use the toolbar, resize and sort and other normal actions

[Tooltips](controls/datagrid-tooltips)
- This example tests shows various places you can see tooltips
- Hover the first column (drill down arrow) and you should see a black tooltips
- Hover the header "Product Id" and you should see a tooltips
- Hover the last cell on the rows with ... A tooltip should appear
- Sort the last column and hover the cell with ... A tooltip should appear

[Tree](controls/datagrid-tree)
- This example tests shows a hierarchical structure in the datagrid
- When resizing the page (height) the grid should stay in view (fixed header)
- Should be able to expand and collapse tree rows
- Test 3 themes
- Test Row heights in the actions menu. Then test that the grid rows are the correct heights.
- Test keyboard (space to open rows) while in that cell
- Sort should work (only at the top level)

## Additional Test Cases

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

[Column Widths](/tests/datagrid/column-widths.html)
- This example shows auto column width. The last column has a lot of data and should scroll until you see "end of data"

[Column Css Class Option](/tests/datagrid/columns-class.html)
- This example shows the config option of adding a column css class. The example is working of two columns with 1 are bold and have a purple style.

[Columns Colors](/tests/datagrid/columns-colors.html)
- This example shows the config option of adding a column css class. The example is working of two columns with 1 are bold and have a purple style.

[Contextual Action Panel](/tests/datagrid/contextualactionpanel.html)
- This example shows a grid in a contextual action panel
- Click the button to see the contextual-action-panel (CAP)
- Try the three themes
- Test the row heights
- Click the close button
- Hit Escape to close

[Counts on Tabs](/tests/datagrid/counts-on-tab.html)
- This example was to fix a problem that when on a tab the results didnt show.
The example is working of on the second and third tab the results shows. Or its a regression.

[Custom Number Format](/tests/datagrid/custom-number-format.html)
- This example was to show developers how to customize the number format. The example is working if Price has 210,99 , Price ($) has $210.99 and Quantity has 100.00 %

[Custom Results Text](/tests/datagrid/custom-results-text.html)
- This example was to show developers how hook so they can customize the results text on the grid toolbar. Its working if 'Datagrid Header Title (Custom Count is 7
| No Filter)' is shown

[Custom Toolbar Max Visible](/tests/datagrid/custom-toolbar-maxvisible-button.html)
- This example was to show developers how to make the toolbar go over the max 3 buttons.
Its working if you see A Filter Button, Then Button 1 -> Button 4, Then Actions

[Custom Toolbar](/tests/datagrid/custom-toolbar.html)
- This example was to show developers how to make the toolbar custom and not use the grid settings. The example is working if the toolbar appears about the grid

[Columns Auto](/tests/datagrid/datagrid-columns-fixed.html)
- This example shows how columns work when not width is set. The first column (drilldown) should be the right size for the buttons. The other three columns should be equally spread.
- Test Resize and Sort

[Columns Fixed](/tests/datagrid/datagrid-columns-fixed.html)
- This example shows how columns work when a fixed pixel size is set. The first column should be 80px and the rest 250px (approx is ok).
- At responsive the grid maintains the same size and you can scroll left
- Test Resize and Sort

[Columns mixed](/tests/datagrid/datagrid-columns-mixed.html)
- This example shows how columns work when a mix of percent and pixel size columns are used.
- At responsive the percent columns stay at percent and will eventually go away because the percentage size of the total is too small. (We will introduce a mobile size)
- Test Resize and Sort

[Columns mixed](/tests/datagrid/datagrid-columns-percent.html)
- This example shows how columns work with percent columns sizes. All columns but the first are 20%
- On mobile they all stay at 20%
- Test Resize and Sort
TODO: Resize Quantity and Sort (BUG!)

[Comments](/tests/datagrid/datagrid-comments.html)
- This example shows how you can have a bigger, wrapping description column.
- The columns are not resizable here as it doesnt make much sense
- Test Resize the page
- Sort the Comments folder

[Context Menu](/tests/datagrid/datagrid-contextmenu.html)
- This example shows how you can have a row context menu.
- Try to right click each row
- Each time you right click the menu should reopen in the same position

[Custom Editor](/tests/datagrid-custom-editor.html)
- This example is showing a custom editor API. TODO: It is currently broken due to a known issue. Skip

[Custom Formatter](/tests/datagrid-custom-formatter.html)
- This example is showing a custom cell formatter. The last column is customized as an example by adding bold text. It is working if there is bold in the last column

[Editor With Auto Complete](/tests/datagrid-editable-autocomplete.html)
- This example shows an editable cell with an auto complete.
- Click in the auto complete column and start typing, the auto complete popup should appear.
- Resize the column (should adapt to size)
- Same with Keyboard

[Editor With Date Time Picker](/tests/datagrid-editable-datetime.html)
- This example shows an editable cell with a date + time field
- Click in the order date column, then try to type
- Click in the order date column, then try to open the calendar
- Hover a non focus'd cell and click the datepicker to open (vs focus the cell)
- Resize the column (should adapt to size)
- Same with Keyboard

TODO
- Focus the cell
- then click editor (this is an optiva issue)?

[Editor With Lookup](/tests/datagrid-editable-lookup.html)
- This example shows an editable cell with a lookup editor field
- Click in the Product id column, then try to type
- Click in the Product id column, then try to open the popup
- Hover a non focus'd cell and click the icon to open (vs focus the cell)
- Resize the column (should adapt to size)
- Do Same with Keyboard

TODO
- Focus the cell
- then click editor (this is an optiva issue)?

[Editing and Paging](/tests/datagrid-editable-paging.html)
- This example shows combining editing with Paging
- Edit the first 3 columns and type a 1 in them
- Go to page 2 and edit the first 3 columns and type a 2 in them
- Click back and forth pages and the values should stick
- Do Same with Keyboard
- Change Pagesize and repeat

[Editing and Short Row](/tests/datagrid-editable-short-row.html)
- This example shows combining editing with shorter row
- Retest like datagrid-editable
- The Columns being shorter should all function correctly and look ok visually

[Ellipsis Tooltips](/tests/datagrid-ellipsis-tooltips.html)
- This test shows a use case used in Xtreme where if the description is very long you can hover it and get a tooltip to see the rest.
- The lines with ... in the comment column, should show a tooltip when hovered
- Test 3 themes
- Test 3 row heights
- Resize the column and retry

TODO: Resize/Reordr not converting from % to pixel and failing

[Expandable Area and Drill Down](/tests/datagrid-expandable-drill-page.html)
- This tests the eventing along with the expand row feature
- Open develop tools and watch the console
- Click the drill down icons on the first page (should show id and row index in the console)
- Go to page two - test from here
- Expand the rows each time you expand a new "Thing" will be added

[Filter Active Cell](/tests/datagrid-filter-activecell.html)
- This tests the eventing along with the filter row feature
- Open develop tools and watch the console
- Click and select any row and it will show the cell and row in the console (zero based)
- Create a filter and test that to still shows the right zero based info in the console

[Filter Row Shading](/tests/datagrid-filter-alternate-row-shading.html)
- This tests the alternate row shading along with the filter row feature
- Visually the rows should alternate in shading for readability.
- Darker row should start on the second row (even)
- Test with themes
- Filter some rows and ensure darker rows still start on the second row

[Filter Row Shading](/tests/datagrid-filter-alternate-row-shading.html)
- This tests the alternate row shading along with the filter row feature
- Visually the rows should alternate in shading for readability.
- Darker row should start on the second row (even)
- Test with themes
- Filter some rows and ensure darker rows still start on the second row

[Filter Conditions](/tests/datagrid-filter-conditions.html)
- This tests shows a feature to limit the filter conditions.
- This is wokring if the product id column has only Equals and Contains

[Filter Conditions](/tests/datagrid-filter-disabled.html)
- This tests shows a feature to disable (readonly) filter conditions.
TODO


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

[All Formatters](/tests/datagrid-formatters.html)
  TODO: Resize + Sort is all messed up

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

TODO: Not rendering 100%
[All Formatters](/tests/dicon-buttons.html)
  TODO: Not rendering 100%

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
- Test Directly on Optiva
- Test More on Windows
- Mobile (percent col widths) or mobile min - width....
- Test Last Column is hidden.
- Test Reorder Example More
- Last Column / Border Resize (maybe)
- Re-Test Screen Reader - Not reading headers
- IE Speed (Fifty Cols)
- IE Scroll Bar (out of alignment for size of the scrollbar)
- Charts Scroll Bar
- Remove RTL .scrollable stuff http://localhost:4000/tests/tooltip/positions.html?locale=ar-EG
