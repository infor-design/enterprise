# 4.2 - Patch Release
Release Date: April 4th

* New - Module Tabs
* New - Lightbox
* New - Datagrid Column Reorder
* New - Datagrid Personalization
* New - Expandable Area

## Breaking Changes
* 2016-02-23 - Tree - Select Event node ommits {node: elem, data: json}
* 2016-04-26 - Expandable Area - Event Renamed from open-expandablearea, close-expandablearea to expand, collapse.

## Ui Changes
* 2016-04-26 - Expandable Area - Colors and font changed. Changed to not look like an accordion.
* 2016-04-13 - Accordion - The Accordion's default style is now an "in-page" design with less borders and configuration.  The original style is now known as a "panel" accordion.  If you wish to keep your accordion looking how it was previously, you must append a "panel" CSS class to your top-level ".accordion" element.
* 2016-04-13 - Application Menu - The changes for the Accordion in this release affect the internal accordion used by the Application Menu.  If you use this control, make sure it receives the same markup change required by other "panel"-style Accordions.
* 2016-03-07 - Changed Cards - Font size to 1.6 and Icon Color
* 2016-02-23 - Changed File Upload States. Refined all 3 themes.
* 2016-03-30 - Minor changes to the progress indicator
* 2016-03-31 - Hide Focus Support Added to Links. Note that many links will benefit from adding class hide-focus.

## Dev Server Changes
* 2016-04-08 - The Xi Controls Dev Server has been upgraded to Express 4.x.  Some of its dependancies may have changed.  If you rely on our Dev Server for examples/testing, please stop the server, delete this project's _/node\_modules/_ folder, and rerun {{npm install}} and {{npm run install-test-deps}}.

[Jira Release Notes 4.2](http://jira.infor.com/secure/ReleaseNote.jspa?version=25271&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX|ae7ebfcb3629c91a9735d7831cc311b96f69495d|lin)

# 4.1.1 - Patch Release
Release Date: March 18th, 2016

* New - Splitter Control
* New - File Upload Control
* New - Empty States Widget Design
* New - Lightbox

## Breaking Changes
* 2016-03-01 - Input Fields - Changed event in datagrid from rowremove, to removerow to match other events.
* 2016-03-01 - Datagrid Control - Changed event in datagrid from rowremove, to removerow to match other events.
* 2016-02-09 - Mask Control - Due to the change in how the options are defined for the Mask Control, the "pattern" definiton no longer resides on the `data-mask` attribute.  However, the `data-mask` attribute is still necessary in order for _initialize.js_ to properly invoke a mask on an input field.  This attribute has become a boolean as a result.  Providing `data-mask` on an input element creates a mask, and not providing it will do nothing.
* 2016-02-09 - Mask Control - Making the move to normalize this Control against the others by setting things up with a `data-options` attribute instead of unqiue HTML5 `data-*` attributes.  In the next version these will no longer work.  Please update your code accordingly.

## Ui Changes
* 2016-02-16 - Changed Hyperlink, Focus state and colors. Refined all 3 themes.
* 2016-02-16 - Changed Breadcrumb, Focus state and colors. Refined all 3 themes.
* 2016-02-16 - Action Button, changed some state colors. Refined all 3 themes.
* 2016-02-19 - Changed Slate and Graphite 10

[Jira Release Notes 4.1.1](http://jira.infor.com/secure/ReleaseNote.jspa?version=24959&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX|98895c37e1521edcf7f6dd012b2fd8daccf5b6fc|lin)

# 4.1.0 - Minor  Release
Release Date: Jan 26, 2015

* Bullet Chart
* Datagrid Contextual Toolbar
* Design Changes for V1.2 of Design Specs

## Breaking Changes

See 4.0.7 Changes

## Ui Changes
See 4.0.7 Changes

[Jira Release Notes 4.1.0](http://jira.infor.com/secure/ReleaseNote.jspa?version=24959&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX|98895c37e1521edcf7f6dd012b2fd8daccf5b6fc|lin)

# 4.0.7 - Patch QA Release
Release Date: TBD
* Bullet Chart
* Datagrid Editing
* Datagrid Contextual Toolbar

## Breaking Changes

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

## Ui Changes
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

[Jira Release Notes 4.0.7](http://jira.infor.com/secure/ReleaseNote.jspa?version=24737&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX|98895c37e1521edcf7f6dd012b2fd8daccf5b6fc|lin)

# 4.0.6
Release Date: 2015-11-16

Patch QA Release

## Breaking Changes
* 2015-11-16 All events are now lower case for consistency. For example some events were called beforeOpen this is now beforeopen. Ect.. Try to search your project for any events fx .on('beforeOpen') and rename. Such beforeopen, animateopen , afterstart, animateclosedcomplete, afterreset, animateclosedcomplete, afteropen, afterpaste, beforeclose, animateopencomplete, beforeactivate
* bar-progress type chart was renamed to completion-chart
* List detail has new markup

## Ui Changes
* In the High Contrast themes all colors changed from slate to the graphite spectrum
* List detail has style changes

[Jira Release Notes](http://jira.infor.com/secure/ReleaseNote.jspa?version=24229&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX|dd7803af39297f33274f5a7b7cd17c27e235d9d2|lin)


# 4.0.5

Patch QA Release.

## New Features
* Accordion Refactoring ([HFC-2886](http://jira/browse/HFC-2886))
* Lookup

## Breaking Changes
* Accordion Refactoring
** Some markup modifications are necessary to retain compatibility with all Accordion controls.  All current examples of Accordions in this repository have been updated to reflect the new Markup (and by proxy, all Application Menus as well).  Markup Changes include:
*** `<div class=".accordion-pane"></div>` elements are no longer nested inside of `<div class=".accordion-header"></div>` elements.  Place the Panes immediately following the Headers.
*** All Accordion Headers that can expand and show content or subheaders will now contain a trigger button that performs this action.  In cases where the trigger isn't present, it will be created and placed correctly.  If the Accordion Header is at the top-level, the trigger will look like a "chevron" be placed immediately after the `<a>`.  If it's a sub-header, the trigger will be a (+/-) depending on its current state, and will be placed before the `<a>`.
*** SVG elements containing icons are no longer placed inside of `<a>` elements.  Icons sit adjacent to the `<a>` elements either by themselves, or inside of trigger buttons.  The Accordion Control will move these icons to their proper locations automatically if they are found inside of `<a>` links.
*** In order to correctly space out content inside an accordion, a new element type, `<div class="accordion-content"></div>` can be used inside accordion panes to separate the content from other accordion headers in a more semantic way.
* Datagrid sorting is now matched up via column id - where as before it was field. Should not cause any major issues as most of the time these values are the same , but this was done so that the same field can be used with different id's


## Ui Changes
* The Accordion Control has been redesigned per a new specification ([HFC-2927](http://jira/browse/HFC-2927)).

[Jira Release Notes](http://jira.infor.com/secure/ReleaseNote.jspa?version=24079&styleName=&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX%7Cd4fa9776810ba8b865710d777c0a664cc99196a2%7Cli)


# 4.0.4 - Patch QA Release
Release Date: TBD

## Breaking Changes
* 2015-11-16 Notes on this change


## New Features
* 2015-11-16 Notes on this change


## Breaking Changes
* 2015-11-16 Notes on this change


## Ui Changes
* 2015-11-16 Notes on this change


[Jira Release Notes](http://jira.infor.com/secure/ReleaseNote.jspa?version=23807&styleName=&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX%7Cd4fa9776810ba8b865710d777c0a664cc99196a2%7Clin)
