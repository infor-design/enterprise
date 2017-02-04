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

[Grouped Headers](controls/datagrid-paging)
- Idea behind this example is its the main paging defaults
- Note that it is starting on page 2 by design
- Resize the columns, then go to next and then previous page
- Change the number of rows per page and use the paging
- Try the search
- Tab down to the pager and use left and right arrow
- Tab to the number of rows per page
- Change Local and see that the pager is translated (controls/datagrid-paging?locale=es-ES)
- Test the three themes
- Test RTL (controls/datagrid-paging?locale=ar-SA)
- Go to page two and press the drill down arrow. Make sure the console shows the right row id / data
