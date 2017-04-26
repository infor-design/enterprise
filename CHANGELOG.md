## 4.3.0
Release Date: 2017-05-09

### Download Build Assets:
Build Server: http://bamboo.infor.com/browse/SOHO-NEXT
Npm: http://npm.infor.com
Full Jira Release Notes: http://bit.ly/2mWAmjY

### Demo Site
http://usalvlhlpool1.infor.com/4.3.0-rc/controls

### Key New Features
-

### Improvements
- Datagrid - Added am option (allowOneExpanded) to only show one expandable row at a time. It is now the default.
- Datagrid - Added an optional light background color on the list version by adding class datagrid-alternate-bg-color to the datagrid div. See tests/datagrid/datagrid-expandable-row-one-only.html
- Dropdown - Added ability to set text on blank items on (Clear Selection)
- Multiselect - Added ability to move selected items to the top of the entire list or to the top of groups when the list is opened.
- Locale - Added new set of translated strings for 37 languages / 49 locales

### Bug Fixes
- Datagrid - Fixed column alignment issue on reload with hidden columns

### Breaking Changes
- Tag - Revised the spelling of the CSS class for "X" buttons on tags from "is-dismissable" to "is-dismissible".  The original class still works, but is deprecated and will be removed in a future version.
- Pie - The Chart now sorts slices in the order of the dataset (was on size from biggest to smallest before).
- Button - Changed the standard `.btn` style on forms to reflect Tertiary button style instead of Secondary button style (SOHO-6083).
- Multiselect - `moveSelectedToTop` has been deprecated in favor of `moveSelected`, which is now a text string instead of a boolean.  This defaults to `"all"` on Multiselect but can be defined as `"group"` or `"none"` as well.

### Ui Changes
- Added heart and heart-filled icons

### Whats Next
-

## 4.2.6
Release Date: 2017-04-02

### Download Build Assets:
Build Server: http://bamboo.infor.com/browse/SOHO-426
Npm: http://npm.infor.com
Full Jira Release Notes: http://bit.ly/2mWAmjY

### Demo Site
http://usalvlhlpool1.infor.com/4.2.6/controls

### Key New Features
- Datagrid - Added RichText Editor
- Datagrid - Added Time Editor
- Datagrid - Added ability to reorder rows
- Datagrid - Added "mixed" section mode and activate event
- More Performance Improvements
- Targeted Achievement - (Form Only) New Chart
- Swaplist - Angular 2.0 Component wrapper added

### Improvements
- Autocomplete - Improved Mobile Support
- Datagrid - Improved Column Resize Logic
- Datagrid - Added ability to have two line column header
- Datagrid - Added dirty indicator and api for indicating dirty rows
- Datagrid - Changed selection event to pass more info about the action that occurred (select, deselect, selectall, deselectall)
- Dropdown - Mobile Support Improved Greatly
- Fileupload - Prevent Typing, Space key will now open dialog, prevent browser autocomplete from occurring.
- Locale - Changed French Language Translations to be in lower case
- Listbuilder - Added selected event
- Listbuilder - Added updateDataset method to refresh the UI
- Module Tabs - UI Improvements when page is zoomed in the browser
- Module Tabs - Added a tooltip if longer text is cut off
- Pager - Added option hideDisabledPager to hide the pager if only one page
- Rich Text Editor - Better ability to paste into the editor from external documents
- Rich Text Editor - Added font color picker button to set text color
- SearchField - Added api to get / set categories
- Splitter - Added option to show a expand collapse button
- Swaplist - Added updateDataset method to refresh the UI
- Tabs - Added setting to skip lazy loading for "UI only tabs"
- Tree - Allow Badges to accept a Hex Value for color

### Bug Fixes
- Autocomplete - Fixed runtime exception when filtering dynamically loaded lists
- Autocomplete - Fixed bug when list had two items with the same ID
- Autocomplete - Fixed bug when using mask that prevented tabbing
- Autocomplete - Fixed bug when used on OSX on a modal dialog
- Autocomplete - Fixed UI placement issue of popup on Modal.
- Colorpicker - Fix issue that caused it to not work when on a modal dialog
- Contextual Action Panel - Fixed bug that prevented datepicker from working when on a Contextual Action Panel
- Datagrid - Fixed issue in lookup that prevented the value updating back in the dataset
- Datagrid - Export to excel was missing header information in exported file
- Datagrid - Fixed UI bug on filtering when column is right aligned
- Datagrid - Fixed error when the page URL contains a space
- Datagrid - Fixes to the column width algorithm
- Datagrid - Fixed some cases where "Reset to Default" was not working correctly
- Datagrid - Fixed issue that prevented editing to work with paging
- Datagrid - Fixed issue that caused scrolling when clicking items in the personalization menu
- Datagrid - When adding a validation rule to the cells you can now get additional information from the grid for validating. check: function (value, field, grid) {
- Datagrid - Fixed dropdown editor to expand to width on narrower cells.
- Datagrid - Editors (Lookup and Datepicker), fixed issue clicking trigger icon when cell is focused.
- Datagrid - Autocomplete Editors added additional arguments to pass data to the source function
- Datagrid - Fixed issue with pager when on a card
- Datagrid - Datepicker Editor, Fixed editing issue that caused date to be one day off
- Datagrid - Fixed bug that prevented selecting rows from working while filtered
- Datagrid - Fixed bug in pager when first page equals the last page
- Datepicker - Fixed Korean and Japanese Translation Issue
- Datepicker - Fixed issue where NaNaNa is shown when selecting with some locales
- Dropdown - Fixed IE11 issue that cut off text when element is all Caps
- Dropdown - Fixed bug if &quot is part of one of the data element
- General - Fixed IE Edge bug that caused text to get cut off
- General - Fixed missing Icons on IE11
- Homepage - Fixed error message in some layouts
- Locale - Fixed Thai Translations
- Locale - Fixed hours conversion in some languages
- Locale - Fixed issues in date formatting settings in various languages
- Locale - Fixed bug in formatNumber for percent formatting
- Mask - Fixed tabbing issue in Safari (OSX)
- Mask - Fixed bug when typing numbers with a minus sign
- Modal - Fixed missing SVG's in IE11 when appended to modals
- Modal - Fixed issue in validation that stopped OK button from being enabled with datepicker on the dialog
- Multiselect - Fixed Mobile issues when selecting / checking items
- Pie Chart - Fixed overlapping issue with smaller data points
- Popupmenu - Fixed keyboarding to skip disabled items
- Popupmenu - Fixed issue causing keyboard to not work when used on contextual action panels
- Popupmenu - Fixed broken extraClass option to provide an extra css class
- Popupmenu - Fixed backwards compatibility issue with disabled items
- Popupmenu - Fixed error shown when scrolling page while open
- Popupmenu - Fixed error that occurred occasionally on Contextual Action Panels
- Popupmenu - Fixed keyboard trap on disabled items
- Tabs - Fixed a bug in activated event that caused focus to change
- Toolbar - Fix that caused hidden buttons to appear in the overflow menu
- Searchfield - Fixed destroy method to fully remove all elements
- Searchfield - Improved popup to not cover search field on full page search
- Validation - Fixed backwards compatibility issue when on accordion
- Validation - Fixed issue that caused 0 to appear as "required"
- Themes - Improved Theme Switching Flashing

### Ui Changes
- Datagrid - Reduced left and right padding on Small and Medium Row Height so more data can be shown.
- Datagrid - Fixed missing right border
- Form Buttons - Improved themes to work when icons are added
- Popover - Fixed Dark themes
- Searchfield - Added option to work on white background and sync UI designs
- Wizard - Fixed azure color issue on first wizard tick

### Whats Next
* Minor (vs patch release) 4.3 up next in approx a month.
* Design QA - Design updates to fully align to latest soho standards
* Datagrid Bug Fixes and Enhancements
* Listbuilder API improvements
* Multiselect Improvements
* Adding new Section on Widget Guidelines to soho.infor.com
* Ability to save Datagrid configuration and restore it (Filters, Columns ect)
* Improvements to circle pager to show more than one item at a time
* Collapsible Cards
* New Pattern - Composite Form
* Dropdown - Clear Selection
* Datagrid - Additional formatters and editors
* Datagrid - Expand Row, Only one at a time
* Layouts - Full width Search on the header
* Layouts - Header with call to action button
* New Component - Toggle - Toggles Stars, Hearts, Icons
* Datagrid - New Deselect Event
* Targeted Achievement - Datagrid Formatter
* Reduce size of npm deployment packages
* New Pattern - Search Form
* Datepicker - Hirji Calendar Support
* Locale - Numeric Improvements
* Tree - Have Disabled Tree nodes

## 4.2.5
Release Date: 2017-02-23

### Download Build Assets:
Build Server: http://bamboo.infor.com/browse/SOHO
Npm: http://npm.infor.com

### Demo Site
http://usmvvwdev53:425/controls

### Key New Features
* Editor - Added color picker
* jQuery - Updated from 3.1.0 to 3.1.1 (non breaking)
* Tabs - Ability to lazy load tab content; Other performance improvements

### Improvements
* Datagrid - Performance improvements
* Datagrid - Column resize independently; Headers remain in sync
* Datagrid - Scrolling improvements for fixed header and mobile
* Datagrid - Added support for multi-line title
* Datagrid - Fixed Header Row - fixed issues with scrolling and column misalignment
* Datagrid - Built in columns, e.g. drilldown and selection, will now auto-size
* Datagrid Dropdown Editor - Improved keyboard support
* Dropdown - Improved search speed for large result sets
* Dropdown List - Ability to submit your selection using the tab key
* Lookup - Columns resize independently
* Personalization Stylesheet - Option to cache this stylesheet server-side to eliminate the flashing of unstyled content the page loads (see Tips)
* Popover/Tooltip - Performance improvements
* Splitter - Improved dragging performance using CSS Flexbox
* Splitter - Removed extra spacing at top and right (now aligns flush)
* Themes - Switching no longer flashes unstyled content
* Toolbar - Ability to copy title text
* Toolbar - Better handling for long titles

### Bug Fixes

* About Dialog - Fixed the Russian and Ukrainian translation
* Checkboxes - Fix for .asp alignment issue
* Color Picker - Fix for bug causing color picker to not open again after initial use
* Donut Chart - Fixed center label not showing in IE
* Datagrid - Fixed logic for “does not end with”
* Datagrid Tree - Fixed expanding logic for multiple child nodes
* Datagrid Tree - Fixed syncing of underlying data set
* Datagrid Tree - Fixed bug causing short row height not to work
* Datagrid - Fix to allow for empty datasets
* Datagrid - Fix to treat “0000/00000000” as an empty date
* Datagrid - Fix to remove flashing of “(N Results)” while result is loading
* Datagrid Filter Row - Fixed “Equals and Does Not Equal” Japanese translation
* Datagrid Editor - Fix for deleted data returning space character
* Datagrid Dropdown Editor - Fixed issue where open and closing the dropdown would clear the value
* Date Picker - Fixed bug that prevented tabbing out of a read-only field
* Global - Performance Fix to prevent mobile zoom logic from firing unnecessarily
* List View Multi-Select - Fixed IE 11 bug that caused the scroll to jump to the top of the list after selecting a checkbox
* Lookup - Fixed inconsistency between how single and multi-select fire the change event - in both cases the change event is now fired when the modal
* Mask - Prevents NgMode updates, Mask now passes a parameter that contains the updated value of the Masked field every time it's updated
* Module Tabs - Fixed IE layout bugs
* Search Field - Fix for bug causing multiple “all results” option
* Swaplist - Added method to refresh the swaplist when data changes
* Tabs - Fix to treat “0 more” tabs appropriately (don’t show more menu)
* Text Editor, IE - Fixed issue where only the first extra paragraph break is removed when pasting multiple paragraphs
* Toolbar - Fixed issue for disabled property on menu button options, where disabled buttons on toolbar weren’t showing as disabled when they moved to the overflow
* Tree - Fixed bug in tree reorder logic for dragging
* Validation - Fix to handle empty data-validate attribute

### Breaking Changes
* Datagrid - No longer forces a minimum width (exact width set is respected); Affects column widths (related to improvements for column resizing)
* List View - No longer initializes every type of component inside it for performance reasons. Instead, the developer can select which elements to initialize. You can do this manually using the render method.
* Tabs - Revised to have CSS-based transitions instead of Javascript-based. This change includes a new method of hiding tab panels by default, instead of showing them by default. This caused a breaking change that requires removing any display: none; inline-styles from .tab-panel elements that may have been pre-defined in older versions.

### Ui Changes
* Icons - The Duplicate Icon has been updated. Make sure to update your SVG
* Positive-Negative Chart - Added more padding to separate chart from legend; moved minus sign to left of number; added padding between squares and labels on chart legend

### Tips
* Global - Personalization may cause a Flash of Unstyled Content (FOUC). To prevent this you now have two choices.
Set the column after loading the soho stylesheet. But before loading the soho stylesheet in the page. The order should be: Set Color, Load Style Sheet (in correct theme), Load Dom, initialize locale and components.
You can call window.Soho.getColorStyleSheet(color) and get the actually style sheet you would need to append. Then save this and add the stylesheet server side. Some colors are generated so you should use the function to get the right styles.
* Toolbar - To get longer titles to display, you may need to add some hints to what “algorithm” to use, like these:
rightAligned: false, // Will always attempt to right-align the contents of the toolbar.
maxVisibleButtons: 3, // Total amount of buttons that can be present, not including the More button
favorButtonset: true // When resizing elements inside the toolbar, setting this to "true" will try to display as many buttons as possible.  Setting to false attempts to show the entire title instead.

### Other
* Added section to view performance tests: http://usmvvwdev53:425/performance-tests
* Full Jira Release Notes: http://bit.ly/2kQycl2

## 4.2.4 - Minor Release
Release Date: 2017-01-10

### Key New Features
* Datagrid - Reset to Default
* List Builder
* Tree Drag and Drop
* Datepicker Color Coded Legend

### Breaking Changes

* 2016-12-28 - Moved the "add tab button" in the Tabs component from being inside the tabset, to a floating button, similar to how the More button already works.  This is largely controlled by the component itself but it's possible to pre-define the markup for the entire Tabs component.  In these cases, this should be considered a breaking change and markup should be modified (SOHO-5436).
* 2016-12-20 - Removed some code in the Mask control that attempted to automatically detect thousands separators in a number mask.  In some cases explicit disabling of thousands separators was being overridden by this setting, so we removed it (SOHO-5445).
* 2016-12-14 - Moved all the list view examples into seperate files fx listview-status
* 2016-12-06 - Changed the name of the `deactivate` event listener on Toolbar Searchfield to `collapse`, as well as the _deactivate()_ method to _collapse()_, to avoid conflicts with the native "deactivate" event propogated in IE.  This was causing some focus issues and visual glitches in the Toolbar Searchfield (SOHO-5297).  Additionally, the `activated` event trigger was renamed to `expanded`, as well as the _activate()_ method to _expand()_, for the purposes of keeping nomenclature consistent.

### Ui Changes

### Affects
- Datagrid (Columns)
- Toolbar Searchfield
- Toolbar (scroll bar)
- Auto Complete / Editor (xss)
- Datepicker (seconds / time)
- Time Picker
- Tree
- List Builder (New)
- Mask

Jira Release Notes
http://jira.infor.com/secure/ReleaseNote.jspa?version=27962&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX%7C7c9b3f18b5f46187205e0d24b1489b80c8b4e1a1%7Clin

## 4.2.3 - Minor Release
Release Date: 2016-12-06

### Key New Features
* Datagrid Grouping and Summary Row
* Swap List API Improvements
* Circle Pager
* Datagrid Validation
* Ajax Dropdowns in Datagrid
* Hero Widget on Home Pages

### Breaking Changes

* 2016-12-05 - builder-header / subheader should have class header added fx:
class="builder-header header subheader is-personalizable"
* 2016-11-29 - Circlepager - Changed api method names **active** to **showCollapsedView** and **unactive** to **showExpandedView**.
* 2016-11-11 - Swaplist (SOHO-4552) - now returns data arrays instead of jQuery object array, so datasets should be kept in sync with the UI. This will allow for additional data, like the key values, that is not displayed to the user to be used.
* 2016-11-21 - The Button with id = "masthead-icon" on the mast head was changed to use a class. Use: <button type="button" class="masthead-icon" class="btn">

### Ui Changes
* 2016-11-17 - Tree - Changed the selection state to only focus the element instead of the longer bar. This is more performant.

### Affects:
* Autocomplete
* Datagrid
* Popups
* Datepicker
* Tooltip
* Bullet Chart
* Popover
* Paging (list and Datagrid)
* Tabs
* Home pages
* Select/Dropdown

Jira Release Notes
http://bit.ly/2h1veF3

## 4.2.2 - Minor Release
Release Date: 2016-10-20

### Key New Features
* Personalization
* Improved Positioning logic
* Improved Filtering and Tree grid

### Breaking Changes

* 2016-11-01 - Datagrid Column widths. In 4.2.1 the column widths would not be exact for plain px with eg: width: 125 in the column definition. This should be noted as you may need to adjust this if columns appear to narrow
* 2016-11-01 - Made Dropdown Component dependent on ListFilter Behavior (SOHO-4936)
* 2016-10-18 - Tree renamed method setSelectedNode to selectNode for consistency
* 2016-10-18 - Split place logic into new file place.js. This is a dependency for controls that position like datepicker, tooltip, popup.
* 2016-10-18 - Split initialize logic into 3 files personalize.js for personalization, environment.js for setting up environmental changes like global browser css tags and initialize.js for initializing controls.
* 2016-10-11 - Event personalizecolors now called change colors to match changetheme
* 2016-10-11 - Css File is now called light.scss not grey.css to match Soho Naming standards
* 2016-10-11 - tab-container module-tabs should have class is-personalizable appended for module tabs to handle personalization - SOHO-4162

### Ui Changes
* 2016-08-30 -

Jira Release Notes
http://bit.ly/2cwBELt

## 4.2.1 - Minor Release
Release Date: 2016-10-06

### Key New Features

* Hello

### Breaking Changes
* 2016-10-05 - Pie and Donut Chart - Changed api option **legendshow** to **showLegend** for consistency.

* 2016-09-16 - Busy Indicator - Changed the **delay** setting to **displayDelay**.  When defining settings inside of the HTML markup using the _data-options_ attribute, using "delay" in some cases would cause settings on different Soho Controls that were named "delay" to conflict, causing them both to be the same number.  Changing the name of property on the more transient Busy Indicator fixed the bug, but it does cause a breaking change.  This was completely changed and there was no deprecation, in order to prevent issues with "delay" from occuring. (see SOHO-2951)

### Ui Changes
* 2016-08-30 -

Jira Release Notes
http://bit.ly/2cwBELt

## 4.2.1.rc1 - Patch Release
Release Date: 2016-09-16

### Key New Features

* Datagrid Filter Row
* Datagrid Tree
* Bubble Chart
* Positive/Negative Chart
* Datagrid Export to XLS
* Datagrid Icon Buttons
* Datagrid Formatters for Class/ Content Visible
* Datagrid Rendering Performance Boost
* Property Sheet pattern
* Tree - Ability to add nodes with Ajax
* Splitter - Added keyboard/Aria
* Record ID styling - Options

### Breaking Changes
* 2016-09-21 - Reverted Changes for external SVG files. For reasons on SOHO-3932 external svg files cannot be supported. We reverted this change back. Please using inline svg's in the page.
* 2016-09-16 - tabs afteractive renamed to afteractived for consistency
* 2016-08-16 - Popupmenu classes were not mutually exclusive now both the is-selectable and has-icons class add extra left padding. It may be needed to remove has-icons if you have a selectable menu and no actual row icons or you might end up with extra space.
* 2016-08-10 - Date and TimePicker - The forceHourMode option was not used in timepicker so was removed. In Datepicker it had a buggy effect. If used it can be removed from your markup. Use the timeFormat option to control 24h vs 12h format.
* 2016-07-14 - Changed app menu so its less backwards compatible. Anyone that has written their app menu markup to sit next to the hamburger button in the header; will need to move that app menu markup to the body in their code manually. So the structure should be icons -> app menu -> page container.
* 2016-07-01 - Changed css table-layout of datagrid. This means that the widths set in columns now work more accurately. In examples previously some of the widths set did not work. Now they do. So this may require update default column widths in grids you use. If you leave width out it will auto size to content as previously.
* 2016-06-14 - Changed font weight of placeholder text to normal (from lighter)
* 2016-06-01 - Wizard now longer has disabled style as this conflicts with "not completed" style. If a situation arises where a wizard tab cannot be clicked, use error messages to indicate.
* 2016-06-01 - Updated to jQuery 3.0 (not really totally required/breaking)
* 2016-06-01 - Renamed (not frequently used) .sort plugin to .arrange.

### Ui Changes
* 2016-08-30 - http://usmvvwdev53:421/tests/header - Shows a number of header options we added
* 2016-08-24 - Changed border color from graphite02 to graphite03 (this was a mistake and not matching design comps)
* 2016-07-13 - Datagrid alternate row colors Changed
* 2016-06-20 - Changed background color of drop down to transparent (to match designs)
* 2016-06-08 - Vertical Tabs - added 3 themes.
* 2016-06-02 - Design of Datagrid Changed to add back the column next to the selection checkboxes.
* 2016-06-02 - Design of radios/checkboxes changed to reduce size.

Jira Release Notes
http://bit.ly/2cLADk7

## 4.2.0 - Minor Release
Release Date: May 26th

### Key New
* Module Tabs
* Lightbox
* Datagrid Column Reorder
* Datagrid Personalization
* Expandable Area
* Error States
* Swap List
* Empty States
* Bullet Chart

### Breaking Changes
* 2016-05-25 - Datepicker
  - If a placeholder is provided it wont be overriden with the date format.
  - isTimepicker changed to showTime - Option value
* 2016-05-11 - Checkboxes - Changed to display inline-block. This should not cause any issues unless you forgot to wrap your checkbox elements in a field element.
* 2016-05-04 - Slider - changed the name of the _refresh()_ method to _setValue()_ so its clear that it sets the value.  _refresh()_ still exists and is marked as "deprecated" - will be removed in future releases.  Please update your code to use _setValue()_ instead of _refresh()_.
* 2016-04-26 - Expandable Area - Event Renamed from open-expandablearea, close-expandablearea to expand, collapse
* 2016-02-23 - Tree - Select Event node ommits {node: elem, data: json}

### Ui Changes
* 2016-05-20 - Tree - Major UX changes
* 2016-05-20 - Toolbar - has version with background fill/border
* 2016-05-20 - New soho.infor.com pages - Added new pages: splitter, popover, pagination, swap list
* 2016-05-11 - Validation Errors - The styling of the validation is now on the bottom of the fields without a tooltip.
* 2016-04-11 - Lookup Area - Removed secondary header, added search.
* 2016-04-11 - Datagrid  - Some colors fx selection state changed. Themes added.
* 2016-04-26 - Expandable Area - Colors and font changed. Changed to not look like an accordion.
* 2016-04-13 - Accordion - The Accordion's default style is now an "in-page" design with less borders and configuration.  The original style is now known as a "panel" accordion.  If you wish to keep your accordion looking how it was previously, you must append a "panel" CSS class to your top-level ".accordion" element.
* 2016-04-13 - Application Menu - The changes for the Accordion in this release affect the internal accordion used by the Application Menu.  If you use this control, make sure it receives the same markup change required by other "panel"-style Accordions.
* 2016-03-07 - Changed Cards - Font size to 1.6 and Icon Color
* 2016-02-23 - Changed File Upload States. Refined all 3 themes.
* 2016-03-30 - Minor changes to the progress indicator
* 2016-03-31 - Hide Focus Support Added to Links. Note that many links will benefit from adding class hide-focus.

### Dev Server Changes
* 2016-04-08 - The Xi Controls Dev Server has been upgraded to Express 4.x.  Some of its dependancies may have changed.  If you rely on our Dev Server for examples/testing, please stop the server, delete this project's _/node\_modules/_ folder, and rerun npm install and  npm run install-test-deps.

Jira Release Notes
http://bit.ly/1OCRwLD

## 4.1.1 - Patch Release
Release Date: March 18th, 2016

### Key New
* Splitter Control
* File Upload Control
* Empty States Widget Design
* Lightbox

### Breaking Changes
* 2016-03-01 - Input Fields - Changed event in datagrid from rowremove, to removerow to match other events.
* 2016-03-01 - Datagrid Control - Changed event in datagrid from rowremove, to removerow to match other events.
* 2016-02-09 - Mask Control - Due to the change in how the options are defined for the Mask Control, the "pattern" definiton no longer resides on the `data-mask` attribute.  However, the `data-mask` attribute is still necessary in order for _initialize.js_ to properly invoke a mask on an input field.  This attribute has become a boolean as a result.  Providing `data-mask` on an input element creates a mask, and not providing it will do nothing.
* 2016-02-09 - Mask Control - Making the move to normalize this Control against the others by setting things up with a `data-options` attribute instead of unqiue HTML5 `data-*` attributes.  In the next version these will no longer work.  Please update your code accordingly.

### Ui Changes
* 2016-02-16 - Changed Hyperlink, Focus state and colors. Refined all 3 themes.
* 2016-02-16 - Changed Breadcrumb, Focus state and colors. Refined all 3 themes.
* 2016-02-16 - Action Button, changed some state colors. Refined all 3 themes.
* 2016-02-19 - Changed Slate and Graphite 10

Jira Release Notes
http://bit.ly/1Upu6WS

## 4.1.0 - Minor  Release
Release Date: 2016-01-26

### Key New
* Bullet Chart
* Datagrid Contextual Toolbar
* Design Changes for V1.2 of Design Specs

### Breaking Changes

* 2016-01-18 - Color Picker: the colors array should get colors in a 10xN grid.
* 2016-01-18 - "hyperlink back" class now requires use of an SVG element.
* 2016-01-18 - breadcrumb-arrow class removed use breadcrumb class for header breadcrumbs
* 2016-01-14 - Tree - requires updates to SVG icons
* 2016-01-11 - Listview - Changed the name of the listview-toolbar class to contextual-toolbar as it is shared with datagrid.
* 2016-01-11 - Listview - Modified the "dataset" property that previously could contain both an array of data, or a string containing a URL.  This has now been separated into two properties:  "dataset", which always represents the array of internal data, and "source", which is the original set of data as an array, an object, or a URL.  This normalizes the API to be similar to other controls that implement "source", and makes interfacing with the Pager control easier.
* 2016-01-11 - Listview - Changed the 'loadApi()' method to 'loadData()', to standardize against datagrid.  Did this to make the interfacing of both controls with the Pager control work better, and to be consistent.
* 2016-01-05 - Dropdown - Changed the name of the openList event to openlist for consistency.
* 2015-12-07 - Dropdown/Menu Button - Changed the size of the view box n the svg element. That needs to be updated when updating the css or dropdown arrows look too small.
* 2015-12-07 - Dropdown/Multiselect, Tabs, Vertical Tabs, Wizard - changed the name of the "activate" event to "activated", to prevent conflicts with the built-in "activate" event in Windows browsers (IE/Edge).  This issue is documented in HFC-3221.
* 2015-12-04 - Contextual Action Panel - The order in which the close/destroy methods previously worked has been changed to flow a bit more nicely.  The order was changed to accomodate HFC-3212, where a bug was discovered that caused Contextual Action Panels to leave behind markup and events from a Modal control.

### Ui Changes
* 2016-01-25 - Swap List - Changed fonts down a size, colors.
* 2016-01-25 - Pager - Color Changes, Handle Changes, Pressed/Focus State
* 2016-01-25 - Skip Link - Dropped Drop Shadow, reduced font size
* 2016-01-25 - Modal/PopDown/Popover/Toast - Dropped Drop Shadow, since size reduction and border color increase
* 2016-01-25 - Inputs/Text Area/Search Field/Spin Box - various styles
* 2016-01-25 - Links - slight changes, font size to 12px in some situation
* 2016-01-21 - Datagrid - changed row height options, border colors, toolbar height and darkened some states
* 2016-01-21 - Pager - Updated Pager Style to match SoHo Xi Style Guide v1.2
* 2016-01-21 - Tabs - Blue Bar no longer moves with the "focus" state, and only moves when the "selected" Tab changes.
* 2016-01-21 - Dropdown/Multiselect - Reworked Style to match SoHo Xi Style Guide v1.2, can now focus items in the list after hovering or after keying with the keyboard.
* 2016-01-20 - Color Picker - Has a different popup style and swatch is moved.
* 2016-01-19 - Progress Bar - Is heigher and has darker colors.
* 2016-01-19 - Switch Control - Reworked the style to match the SoHo Xi Style Guide v1.2
* 2016-01-19 - Tabs Control - Reworked the style to match the SoHo Xi Style Guide v1.2
* 2016-01-18 - Radios - Text colors and border colors and a few states changed
* 2016-01-18 - Checkboxes - Text colors and border colors and a few states changed
* 2016-01-15 - Breadcrumbs - Text colors changed
* 2016-01-15 - Badges - Height Changed, text color changed.
* 2016-01-15 - Action Buttons - Changed the colors and all states.
* 2016-01-15 - About - Changed the text colors and added a border. Removed the redundent button.
* 2016-01-14 - Tree - Changed (finalized finally) the styles for trees, added new SVG icons, changed colors and states.
* 2015-12-09 - Datepicker - Style various styles and button positions on date picker
* 2015-11-20 - We did some fine tuning to the color pallette. The following colors have changed: azure05, azure07, amber03, amber06, amber07, amber08, amber09, amber10, emerald09, turquoise04, amethyst01, amethyst04, amethyst05, amethyst06, amethyst07, amethyst08, amethyst09, slate10, alert-orange

Jira Release Notes
http://bit.ly/1reEaKk

## 4.0.6 - Patch Release
Release Date: 2015-11-16

### Breaking Changes
* 2015-11-16 - All events are now lower case for consistency. For example some events were called beforeOpen this is now beforeopen. Ect.. Try to search your project for any events fx .on('beforeOpen') and rename. Such beforeopen, animateopen , afterstart, animateclosedcomplete, afterreset, animateclosedcomplete, afteropen, afterpaste, beforeclose, animateopencomplete, beforeactivate
* 2015-11-16 - bar-progress type chart was renamed to completion-chart
* 2015-11-16 - List detail has new markup

### Ui Changes
* 2015-11-16 - In the High Contrast themes all colors changed from slate to the graphite spectrum
* 2015-11-16 - List detail has style changes

Jira Release Notes
http://bit.ly/24CCurl

## 4.0.5 - Patch Release

### Key New
* Accordion Refactoring ([HFC-2886](http://jira/browse/HFC-2886))
* Lookup

### Breaking Changes
* 2015-??-?? Accordion Refactoring - Some markup modifications are necessary to retain compatibility with all Accordion controls.  All current examples of Accordions in this repository have been updated to reflect the new Markup (and by proxy, all Application Menus as well).  Markup Changes include:
 `<div class=".accordion-pane"></div>` elements are no longer nested inside of `<div class=".accordion-header"></div>` elements.  Place the Panes immediately following the Headers.
 All Accordion Headers that can expand and show content or subheaders will now contain a trigger button that performs this action.  In cases where the trigger isn't present, it will be created and placed correctly.  If the Accordion Header is at the top-level, the trigger will look like a "chevron" be placed immediately after the `<a>`.  If it's a sub-header, the trigger will be a (+/-) depending on its current state, and will be placed before the `<a>`.
 SVG elements containing icons are no longer placed inside of `<a>` elements.  Icons sit adjacent to the `<a>` elements either by themselves, or inside of trigger buttons.  The Accordion Control will move these icons to their proper locations automatically if they are found inside of `<a>` links.
 In order to correctly space out content inside an accordion, a new element type, `<div class="accordion-content"></div>` can be used inside accordion panes to separate the content from other accordion headers in a more semantic way.
* Datagrid sorting is now matched up via column id - where as before it was field. Should not cause any major issues as most of the time these values are the same , but this was done so that the same field can be used with different id's


### Ui Changes
* The Accordion Control has been redesigned per a new specification ([HFC-2927](http://jira/browse/HFC-2927)).

Jira Release Notes
http://bit.ly/24CCyY9
