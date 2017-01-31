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

[Editing](controls/datagrid-editable)

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
