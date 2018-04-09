# Ed's TODO List:

- Unit test Flex Toolbar
- MaxVisibleButtons setting? (done per-section)
- Figure out why all Popupmenus are set to "has-icons"
- (DONE, REVIEW) Make clicking on `More Actions` menu items trigger selected events on Toolbar items, if applicable.
  - If no `originalButton` exists on menu item, trigger a `selected` event as expected.
  - If `originalButton` exists, trigger `selected` event on the toolbar item.
