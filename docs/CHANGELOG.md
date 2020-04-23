# What's New with Enterprise

## v4.28.0

### v4.28.0 Features

- `[Contextmenu]` Added support for shortcut display in menus. ([#3490](https://github.com/infor-design/enterprise/issues/3490))
- `[Datepicker]` Added support for custom api callback to disable passed dates and to disable dates by years. ([#3462](https://github.com/infor-design/enterprise/issues/3462))
- `[Modal]` Improved handling of multiple Modal windows stemming from a single trigger element. ([ng#705](https://github.com/infor-design/enterprise-ng/issues/705))

### v4.28.0 Fixes

- `[Application Menu]` Fixed the icons on breaking apart it's appearance when zooming out the browser in IE11, uplift theme. ([#3070](https://github.com/infor-design/enterprise/issues/3070))
- `[Application Menu]` Fixed misalignment/size of bullet icons in the accordion on Android devices. ([#1429](http://localhost:4000/components/applicationmenu/test-six-levels.html))
- `[Autocomplete]` Added a check to prevent the autocomplete from incorrectly stealing form focus, by checking for inner focus before opening a list on typeahead. ([#3639](https://github.com/infor-design/enterprise/issues/3070))
- `[Bubble Chart]` Fixed an issue where an extra axis line was shown when using the domain formatter. ([#501](https://github.com/infor-design/enterprise/issues/501))
- `[Bullet Chart]` Added support to format ranges and difference values. ([#3447](https://github.com/infor-design/enterprise/issues/3447))
- `[Charts]` Fixed an issue where selected items were being deselected after resizing the page. ([#323](https://github.com/infor-design/enterprise/issues/323))
- `[Colorpicker]` Fixed an issue where the color swatches shift when the colorpicker has a scrollbar. ([#2266](https://github.com/infor-design/enterprise/issues/2266))
- `[ContextualActionPanel]` Fixed an issue where toolbars in CAP are not torn down on destroy. ([#3785](https://github.com/infor-design/enterprise/issues/3785))
- `[ContextualActionPanel]` Fixed an issue where nested caps or closing and reopening caps would not work. ([#801](https://github.com/infor-design/enterprise-ng/issues/801))
- `[Datagrid]` Fixed a css issue in dark uplift mode where the group row lines were not visible. ([#3649](https://github.com/infor-design/enterprise/issues/3649))
- `[Datagrid]` Fixed some styling issues in alerts and tags, and made clickable tags available in the formatter. ([#3631](https://github.com/infor-design/enterprise/issues/3631))
- `[Datagrid]` Fixed a css issue in dark uplift mode where the group row lines were not visible . ([#3649](https://github.com/infor-design/enterprise/issues/3649))
- `[Datagrid]` Fixed lookup modal title to be visible and adjust the position to make it centered. ([#3635](https://github.com/infor-design/enterprise/issues/3635))
- `[Datagrid/Hyperlink]` Fixed layout issues with links in right text align mode. To do this refactored links to not use a psuedo element for the focus style. ([#3680](https://github.com/infor-design/enterprise/issues/3680))
- `[Datagrid]` Fixed an issue where selected rows are not reset when calling loadData. ([#3718](https://github.com/infor-design/enterprise/issues/3718))
- `[Datagrid]` Fixed an issue where if using grouping totals and hiding and showing columns the page is not refreshed properly. ([#2564](https://github.com/infor-design/enterprise/issues/2564)
- `[Datagrid]` Fixed an issue the selected row header icon is the wrong state when using allowSelectAcrossPages. ([#3043](https://github.com/infor-design/enterprise/issues/3043)
- `[Datagrid]` Improved the `datagrid-default-modal-width` concept if setting a modal datagrid default with so it works on any parent. [3562](https://github.com/infor-design/enterprise/issues/3562))
- `[Datagrid]` Fixed a bug in the indeterminate paging example, that the select checkbox would not work and be out of sync when changing pages. [2230](https://github.com/infor-design/enterprise/issues/2230))
- `[Datepicker]` Fixed a bug where for some locales like `af-ZA` and `fi_FI` with dots in the day periods, setting 24 hr time to AM did not work. [3750](https://github.com/infor-design/enterprise/issues/3750))
- `[Demoapp]` Fixed incorrect directory list hyperlinks in listview and listbuilder components. ([1783](https://github.com/infor-design/enterprise/issues/1783))
- `[Dropdown]` Fixed an issue that Dropdown did not close when scrolling in some nested containers. ([#3436](https://github.com/infor-design/enterprise/issues/3436))
- `[EmptyMessage]` Updated the text to be more subtle. ([#3476](https://github.com/infor-design/enterprise/issues/3476))
- `[Fieldset]` Fixed fieldset text data overlapping in compact mode on mobile view. ([#3627](https://github.com/infor-design/enterprise/issues/3627))
- `[Hierarchy]` Added support for separators in the actions menu on a hierarchy leaf. ([#3636](https://github.com/infor-design/enterprise/issues/3636))
- `[Modal]` Fixed modal title to a two line with ellipsis when it's too long. ([#3479](https://github.com/infor-design/enterprise/issues/3479))
- `[Multiselect]` Fixed tags dismiss button on mobile devices. ([#3640](https://github.com/infor-design/enterprise/issues/3640))
- `[Icons]` Added new locked/unlocked icons in ids-identity [#3732](https://github.com/infor-design/enterprise/issues/3732)
- `[Radar Chart]` Fixed an issue where labels were cutoff at desktop view. ([#3510](https://github.com/infor-design/enterprise/issues/3510))
- `[Swaplist]` Fixed disabled swap buttons color in dark variant subtle theme. ([#3709](https://github.com/infor-design/enterprise/issues/3709))
- `[Utils]` Exposed `Soho.utils.isInViewport(elem)` for external use. ([#3436](https://github.com/infor-design/enterprise/issues/3436))
- `[Toolbar]` Improved the placeholder text color to be more visible in uplift (dark variant). ([#3727](https://github.com/infor-design/enterprise/issues/3727))

## v4.27.3

### v4.27.3 Fixes

- `[Datagrid]` Fixed a bug in the indeterminate paging example, that the select checkbox would not work and be out of sync when changing pages. [2230](https://github.com/infor-design/enterprise/issues/2230))

## v4.27.2

### v4.27.2 Fixes

- `[Datagrid]` Fixed an issue in datagrid frozen columns, actions that re-render like sorting may cause rendering issues. ([#3735](https://github.com/infor-design/enterprise/issues/3735))
- `[Datagrid]` Fixed an issue in lookup datagrid editors that clicking a trigger in the cell would commit the cell causing editing not to work in some cases. ([#785](https://github.com/infor-design/enterprise-ng/issues/785))

## v4.27.1

### v4.27.1 Fixes

- `[Icons]` Added a fix to support both `href` and `xlink:href` in icons. ([#3734](https://github.com/infor-design/enterprise/issues/3734))

## v4.27.0

### v4.27.0 Important Changes

- `[Hierarchy]` Removed the following deprecated options `paging: <bool>` and `mobileView: <bool>`. Instead use `layout='paging'` or `layout='mobile-only'`.
- `[Icons]` Changed the svg icons to use `href` instead of deprecated `xlink:href`. This isnt a breaking change either will work but `href` works better with Ivy in Angular. ([#3611](https://github.com/infor-design/enterprise/issues/3611))

### v4.27.0 Features

- `[Button]` Add `toData()` and related API for programmatically handling control of buttons. ([ng#467](https://github.com/infor-design/enterprise-ng/issues/467))
- `[Modal]` Created API for controlling the Modal ButtonSet. ([ng#467](https://github.com/infor-design/enterprise-ng/issues/467))
- `[Datagrid]` Added support for api setting on expand and collapse children. ([#3274](https://github.com/infor-design/enterprise/issues/3274))
- `[Datagrid]` Updated the fixedRowHeight setting to accept `auto` as an option. This will calculate the row height for all frozenRows section. If you have a lot of rows this may be slow so a number is preferred. ([#3374](https://github.com/infor-design/enterprise/issues/3374))
- `[Editor]` Added an option to set the height of the editor in `rows`. If you set this the estimated number for rows can be specified for the source and html pane. It will scroll after that. ([#3688](https://github.com/infor-design/enterprise/issues/3688))
- `[Homepage]` Added support for reordering, resizing, and removing widgets by enabling edit mode on the homepage component. ([#3531](https://github.com/infor-design/enterprise/issues/3531))

### v4.27.0 Fixes

- `[Accordion]` Removed stoppage of event propagation when accordion headers are clicked, in order to allow external click event listeners to propagate. ([ng#321](https://github.com/infor-design/enterprise-ng/issues/321))
- `[Bar Chart]` Fixed an issue where chart was not resizing on homepage widget resize. ([#2669](https://github.com/infor-design/enterprise/issues/2669))
- `[Blockgrid]` Fixed an issue where there was no index if the data is empty, and removed deprecated internal calls. ([#748](https://github.com/infor-design/enterprise-ng/issues/748))
- `[Busy Indicator]` Fixed an issue where it throws an error when a display delay, the busy-indicator parent removed and added via ngIf before the busyindicator shown. ([#703](https://github.com/infor-design/enterprise-ng/issues/703))
- `[Busy Indicator]` Fixed an issue where the overlay would close when closing the Modal. ([#3424](https://github.com/infor-design/enterprise/issues/3424))
- `[Busy Indicator]` Fixed an issue where position was not aligning. ([#3341](https://github.com/infor-design/enterprise/issues/3341))
- `[Colorpicker]` Fixed the dropdown icon position is too close to the right edge of the field. ([#3508](https://github.com/infor-design/enterprise/issues/3508))
- `[Contextual Action Panel]` Fixed misaligned search icon in uplift theme. ([#3630](https://github.com/infor-design/enterprise/issues/3630))
- `[Contextual Action Panel]` Fixed close icon button in getting cut off on mobile view ([#3586](https://github.com/infor-design/enterprise/issues/3586))
- `[Datagrid]` Fixed an issue where lookup editor was removing all characters following and including the '|' pipe character. ([#3556](https://github.com/infor-design/enterprise/issues/3556))
- `[Datagrid]` Fixed an issue where date range filter was unable to filter data. ([#3503](https://github.com/infor-design/enterprise/issues/3503))
- `[Datagrid]` Fixed a bug were datagrid tree would have very big text in the tree nodes on IOS. ([#3347](https://github.com/infor-design/enterprise/issues/3347))
- `[Datagrid]` Fixed a focus trap issue when using actionable mode, tab will now move up and down rows. ([#2399](https://github.com/infor-design/enterprise/issues/2399))
- `[Datagrid]` Fixed a bug when setting the UI indicator with `setSortIndicator` then it would take two clicks to sort the inverse direction. ([#3391](https://github.com/infor-design/enterprise/issues/3391))
- `[Datagrid]` Fixed an issue where date range filter was not working. ([#3337](https://github.com/infor-design/enterprise/issues/3337))
- `[Datagrid]` Fixed a bug when combining multiselect and expandable rows. If using the shift key to select multiple rows the selection would include incorrect rows. ([#2302](https://github.com/infor-design/enterprise/issues/2302))
- `[Datagrid]` Added support for dragging and reordering columns in RTL and some minor style cleanup with dragging to reorder. ([#3552](https://github.com/infor-design/enterprise/issues/3552))
- `[Datagrid]` Fixed an issue that the click event did not show the item data when the keyboard is used. ([#3645](https://github.com/infor-design/enterprise/issues/3645))
- `[Datagrid]` Fixed an issue where datagrid tree did not show empty messages. ([#3642](https://github.com/infor-design/enterprise/issues/3642))
- `[Datagrid]` Fixed an issue where grouped rows did not render when combined with frozen columns. ([#3367](https://github.com/infor-design/enterprise/issues/3367))
- `[Datagrid]` Fixed an issue where the overlay was closing after close Modal. ([#735](https://github.com/infor-design/enterprise-ng/issues/735))
- `[Datagrid]` Fixed a misaligned drag and drop column icon on IE 11. ([#3648](https://github.com/infor-design/enterprise/issues/3648))
- `[Datagrid]` Fixed an issue when using the colspan column option along with frozenColumns. ([#3416](https://github.com/infor-design/enterprise/issues/3416))
- `[Datagrid]` Fixed an issue where the empty message might still show if the amount of rows do not fill the page. ([#3697](https://github.com/infor-design/enterprise/issues/3697))
- `[Datepicker]` Fixed popover height and datepicker layout on mobile view. ([#2569](https://github.com/infor-design/enterprise/issues/3569))
- `[Datepicker]` Fixed an issue where date range with minimum range was not working. ([#3268](https://github.com/infor-design/enterprise/issues/3268))
- `[Datepicker]` Fixed an issue where date range was reverting to initial values after clearing. ([#1306](https://github.com/infor-design/enterprise/issues/1306))
- `[Datepicker]` Fixed an issue where dates would be invalid in ko-KO locale. ([#3470](https://github.com/infor-design/enterprise/issues/3470))
- `[Datepicker]` Fixed an issue where dates would be invalid in zh-TW locale. ([#3473](https://github.com/infor-design/enterprise/issues/3473))
- `[Datepicker]` Fixed an issue where AM/PM could not be set in hi-IN locale. ([#3474](https://github.com/infor-design/enterprise/issues/3474))
- `[Datepicker]` Fixed an issue where change would fire twice or when the value is still blank. ([#3423](https://github.com/infor-design/enterprise/issues/3423))
- `[Datepicker]` Fixed an issue where time would be reset to 12:00 AM when setting the time and clicking today. ([#3202](https://github.com/infor-design/enterprise/issues/3202))
- `[Dropdown]` Fixed a bug where it was not possible for Dropdowns in certain scrollable Modal regions to close on scroll. ([#2650](https://github.com/infor-design/enterprise/issues/2650))
- `[Dropdown]` Fixed a bug that dropdowns are in the wrong position if flowing up and other minor cases. ([#2068](https://github.com/infor-design/enterprise/issues/2068))
- `[Dropdown]` Fixed alignment when using dropdown in compound field. ([#3647](https://github.com/infor-design/enterprise/issues/3647))
- `[Editor]` Added ui updates to the toolbar in uplift (vibrant mode) and minor style fixes. ([#3577](https://github.com/infor-design/enterprise/issues/3577))
- `[Editor]` Added fixes to reseting the dirty indicator when used in an editor. ([#3662](https://github.com/infor-design/enterprise/issues/3662))
- `[Editor]` Fixed a width change when toggle source view when the editor is on a modal, this is also based on UI feedback that the switch was confusing, so we now disable the buttons. ([#3594](https://github.com/infor-design/enterprise/issues/3594))
- `[Editor]` Fixed an issue where bullet and number lists could not be converted to headings and regular text with the font picker. ([#2679](https://github.com/infor-design/enterprise/issues/2679))
- `[Editor]` Fixed an issue where some settings like bold and italics would not be reset consistently when applying headings and regular text with the font picker. ([#2256](https://github.com/infor-design/enterprise/issues/2256))
- `[Editor]` Fixed an issue where the dirty events did not fire changing the source view. ([#3598](https://github.com/infor-design/enterprise/issues/3598))
- `[Editor]` Adding missing bottom spacing under heading elements. ([#3288](https://github.com/infor-design/enterprise/issues/3288))
- `[Field Filter]` Fixed an issue where switching to In Range filter type with a value in the field was causing an error. ([#3515](https://github.com/infor-design/enterprise/issues/3515))
- `[Editor]` Added a font color for rest/none swatch. ([#2035](https://github.com/infor-design/enterprise/issues/2035))
- `[Field Filter]` Fixed an issue where switching to In Range filter type with a value in the field was causing an error. ([#3515](https://github.com/infor-design/enterprise/issues/3515))
- `[Field Filter]` Fixed an issue where date range was not working after using other filter. ([#2764](https://github.com/infor-design/enterprise/issues/2764))
- `[Field Filter]` Fixed an issue where stray text would be shown if the filters are hidden and then shown later. ([#3687](https://github.com/infor-design/enterprise/issues/3687))
- `[Line Chart]` Fixed an issue where x-axis labels were overlapping for small viewport on homepage widget. ([#2674](https://github.com/infor-design/enterprise/issues/2674))
- `[Lookup]` Fixed an issue where selected values were clearing when use server side data. ([#588](https://github.com/infor-design/enterprise-ng/issues/588))
- `[Locale]` Added missing Afrikaans translations. ([#3685](https://github.com/infor-design/enterprise/issues/3685))
- `[Masthead]` Fixed layout and color issues in uplift theme. ([#3526](https://github.com/infor-design/enterprise/issues/3526))
- `[Modal]` Fixed an iOS bug where after opening several Modals/Messages, it would occasionally be impossible to scroll a scrollable page area. ([#3389](https://github.com/infor-design/enterprise/issues/3389))
- `[Modal]` Fixed a bug where when iframe elements are present, focus traps could occur and cause focus on elements outside of the Modal, but within the iframe. ([#2287](https://github.com/infor-design/enterprise/issues/2287))
- `[Modal]` Added a check for preventing Tooltips inside a Modal from opening while the Modal is not visible ([#3588](https://github.com/infor-design/enterprise/issues/3588))
- `[Modal]` Fixed dropdown position when the field is required. ([#3482](https://github.com/infor-design/enterprise/issues/3482))
- `[Modal]` Fixed a regression where some Close buttons were not properly closing. ([#3615](https://github.com/infor-design/enterprise/issues/3615))
- `[Process Indicator]` Fixed icons that are not centered inside the circle indicators. ([#3509](https://github.com/infor-design/enterprise/issues/3509))
- `[Personalize]` Fixed an issue that colorschanged events do not fire on when doing a set to default ation. ([#751](https://github.com/infor-design/enterprise-ng/issues/751))
- `[Searchfield]` Correct the background color of toolbar search fields. ([#3527](https://github.com/infor-design/enterprise/issues/3527))
- `[Spinbox]` Corrected an issue in the enable method, where it did not fully remove the readonly state. ([#3527](https://github.com/infor-design/enterprise/issues/3527))
- `[Swaplist]` Fixed an issue where lists were overlapping on uplift theme. ([#3452](https://github.com/infor-design/enterprise/issues/3452))
- `[Tabs]` Fixed the position of error icon too close to the border on focus state. ([#3544](https://github.com/infor-design/enterprise/issues/3544))
- `[Tabs-Vertical]` Fixed an issue where the content cannot scroll on mobile view. ([#3542](https://github.com/infor-design/enterprise/issues/3542))
- `[Tags]` Fixed a regression on Tag Buttons, where they were visually, vertically misaligned with Tag text. ([#3604](https://github.com/infor-design/enterprise/issues/3604))
- `[Week-View]` Changed the look of the week-view and day-view day of the week so its a 3 (or 2) letter abbreviation and emphasizes the date and spans two lines. This makes all the days of the week the same length. ([#3262](https://github.com/infor-design/enterprise/issues/3262))
- `[Validation]` Fixed a bug where addMessage did not add messages to the parent. ([#711](https://github.com/infor-design/enterprise-ng/issues/711))

(87 Issues Solved this release, Backlog Enterprise 279, Backlog Ng 75, 1033 Functional Tests, 1322 e2e Test)

## v4.26.2

### v4.26.2 Fixes

- `[Textarea]` Fixed missing text in safari on disabled text areas. ([#3638](https://github.com/infor-design/enterprise/issues/3638))

## v4.26.1

### v4.26.1 Fixes

- `[Demo App]` Fixed the embedded layout to show uplift theme. ([#861](https://github.com/infor-design/website/issues/861))

## v4.26.0

### v4.26.0 Features

- `[Datagrid]` Added support for expandable row to expand across all frozen columns, and fixed span layout issues on the right side frozen columns. ([#2867](https://github.com/infor-design/enterprise/issues/2867))
- `[Datagrid]` Added a new `resizeMode` option that allows you to pick between `flex` and `fit`. `flex` will resize columns independently shifting other columns to fit the table layout if needed. `fit` will resize using the neighbor's column width. This is possible more useful when you have less columns. ([#3251](https://github.com/infor-design/enterprise/issues/3251))
- `[Icons]` Added new icons `icon-play, icon-stop, icon-record, icon-pause` for video players. ([#411](https://github.com/infor-design/design-system/issues/411))
- `[Icons]` Added new icons `icon-security-off, icon-security-on` for toggles related to security/secure items. ([#397](https://github.com/infor-design/design-system/issues/397))
- `[Searchfield]` Added a setting that makes it possible to adjust the "collapsed" size of a Toolbar Searchfield to better accommodate some use cases. ([#3296](https://github.com/infor-design/enterprise/issues/3296))

### v4.26.0 Fixes

- `[Application Menu]` Fixed bugs with filtering where it was not possible to have the filter match text within content areas, as well as general expand/collapse bugs with filtering. ([#3131](https://github.com/infor-design/enterprise/issues/3131))
- `[Application Menu]` Fixed overlap button when label is too long, and aligned dropdown icon in application menu uplift theme. ([#3133](https://github.com/infor-design/enterprise/issues/3133))
- `[Contextual Action Panel]` - Fixed shade colors of text and icon buttons in uplift theme high contrast. ([#3394](https://github.com/infor-design/enterprise/issues/3394))
- `[Calendar]` Fixed issue where on month view in events info `Date` and `Duration` fields were not working with some events and `Duration` field. Now `Duration` field support `Days, Hours and Minutes` text. ([#2777](https://github.com/infor-design/enterprise/issues/2777))
- `[Calendar]` Fixed an issue where link was not working on monthview to switch to day view when clicked on more events on that day. ([#3181](https://github.com/infor-design/enterprise/issues/3181))
- `[Calendar]` Fixed a calendar event where the start date today is not displaying as upcoming event in different timezone. ([#2776](https://github.com/infor-design/enterprise/issues/2776))
- `[Calendar]` Fixed an issue where adding an event was inconsistent in Safari. ([#3079](https://github.com/infor-design/enterprise/issues/3079))
- `[Calendar]` Fixed an issue where any event was not rendering in day and week view. ([#3222](https://github.com/infor-design/enterprise/issues/3222))
- `[Calendar]` Fixed an issue where date selection was not persist when switching from month view to week view to day view. ([#3319](https://github.com/infor-design/enterprise/issues/3319))
- `[Colors]` Fixed an incorrect ruby06 color, and made the background change on theme change now (again). ([#3448](https://github.com/infor-design/enterprise/issues/3448))
- `[Datagrid]` Fixed an issue where focus on reload data was forced to be on active cell. ([#358](https://github.com/infor-design/enterprise-ng/issues/358))
- `[Datagrid]` Fixed RTL issues in the filter row. ([#3517](https://github.com/infor-design/enterprise/issues/3517))
- `[Datagrid]` Improved the column resize behavior in speed and usability with the cursor being more accurate during resize. ([#3251](https://github.com/infor-design/enterprise/issues/3251))
- `[Datagrid]` Improved the column resize behavior to work much better in RTL mode. ([#1924](https://github.com/infor-design/enterprise/issues/1924))
- `[Datagrid]` Fixed a bug where if a filter row column is frozen the mask and editor options would not be applied. ([#2553](https://github.com/infor-design/enterprise-ng/issues/2553))
- `[Datagrid]` Fixed an issue where when using rowTemplate/expandableRows and frozenColumns on both sides the right side did not render properly. ([#2867](https://github.com/infor-design/enterprise/issues/2867))
- `[Datagrid]` Fixed an issue where height was not aligning to expandable row for frozen columns. ([#3516](https://github.com/infor-design/enterprise/issues/3516))
- `[Datagrid]` Fixed hover color should not be similar to alternate rows when hovering in uplift high contrast. ([#3338](https://github.com/infor-design/enterprise/issues/3338))
- `[Datagrid]` Fixed a demo app issue filtering decimal fields in some examples. ([#3351](https://github.com/infor-design/enterprise/issues/3351))
- `[Datagrid]` Fixed an issue where some columns were disappear after resizing the browser or after changing themes. ([#3434](https://github.com/infor-design/enterprise/issues/3434))
- `[Datagrid]` Fixed an issue that the filter row type dropdowns did not close when the grid is scrolled. ([#3216](https://github.com/infor-design/enterprise/issues/3216))
- `[Datagrid]` Added an example showing the configuration needed to filter date time fields on just dates without the time part. ([#2865](https://github.com/infor-design/enterprise/issues/2865))
- `[Datagrid]` Changed the isFilter added value to datasets to a more unique value to avoid clashes. ([#2668](https://github.com/infor-design/enterprise/issues/2668))
- `[Datagrid]` Added a `getDataset` method that will return the current dataset without any added properties. ([#2668](https://github.com/infor-design/enterprise/issues/2668))
- `[Datagrid]` Fixed an issue that when reordering filter columns the filter values would disappear. ([#2565](https://github.com/infor-design/enterprise/issues/2565))
- `[Datagrid]` Fixed an issue that dropdown lists in filter rows did not close when scrolling. ([#2056](https://github.com/infor-design/enterprise/issues/2565))
- `[Datagrid]` Added a `filterType` option to the filter event data so the type can be determined. ([#826](https://github.com/infor-design/enterprise/issues/826))
- `[Datagrid]` Add options to `toolbar.filterRow` so that instead of true/false you can set `showFilter, clearFilter, runFilter` independently. ([#1479](https://github.com/infor-design/enterprise/issues/1479))
- `[Datagrid]` Added fixes to improve the usage of the textarea editor. ([#3417](https://github.com/infor-design/enterprise/issues/3417))
- `[Datagrid]` Fixed an issue where reset to default was not working properly. ([#3487](https://github.com/infor-design/enterprise/issues/3487))
- `[Datepicker]` Fixed an issue where setting date format with comma character was not working. ([#3008](https://github.com/infor-design/enterprise/issues/3008))
- `[Editor]` Made the link and image link fields required on the dialogs. ([#3008](https://github.com/infor-design/enterprise/issues/3008))
- `[Editor]` Fixed an issue where it was possible to clear text and end up with text outside the default paragraph seperator. ([#2268](https://github.com/infor-design/enterprise/issues/2268))
- `[Fileupload]` Fixed an issue where tabbing out of a fileupload in was causing the modal dialog to disappear. ([#3458](https://github.com/infor-design/enterprise/issues/3458))
- `[Form Compact Layout]` Added support for `form-compact-layout` the remaining components. ([#3008](https://github.com/infor-design/enterprise/issues/3329))
- `[Dropdown]` Fixed a bug that was causing the `selectValue()` method not to update the visual display of the in-page Dropdown element. ([#3432](https://github.com/infor-design/enterprise/issues/3432))
- `[Forms]` Fixed an issue where radio group was overlapping fields. ([#3466](https://github.com/infor-design/enterprise/issues/3466))
- `[Forms Compact]` Fixed an issue where fileupload was misaligned in RTL mode in uplift theme. ([#3483](https://github.com/infor-design/enterprise/issues/3483))
- `[Icons]` Fixed color inconsistencies of the icons when the fields are in readonly state. ([#3176](https://github.com/infor-design/enterprise/issues/3176))
- `[Input]` Added the ability to line up data labels with inputs by adding class `field-height` to the `data` element and placing it in a responsive grid. ([#987](https://github.com/infor-design/enterprise/issues/987))
- `[Input]` Added the ability to use standalone required spans, this will help on responsive fields if they are cut off. ([#3115](https://github.com/infor-design/enterprise/issues/3115))
- `[Input/Forms]` Added the ability to add a class to rows to align the fields on the bottom, this will line up fields if they have wrapping labels or long labels with required fields. To enable this add class `flex-align-bottom` to the grid `row`. ([#443](https://github.com/infor-design/enterprise/issues/443))
- `[Locale]` Fixed an issue where formatDate() method was not working for es-419. ([#3363](https://github.com/infor-design/enterprise/issues/3363))
- `[Locale]` Fixed an issue where setting language to `nb` would error. ([#3455](https://github.com/infor-design/enterprise/issues/3455))
- `[Locale]` Fixed incorrect time separators in the no, nn, and nn locales. ([#3468](https://github.com/infor-design/enterprise/issues/3468))
- `[Locale]` Added further separation of language from formatting in date oriented components (calendar, datepicker, timepicker ect). [3244](https://github.com/infor-design/enterprise/issues/3244))
- `[Locale]` Added support for `nn` locale and language, but this will change to no language as only this is translated as its the same. ([#3455](https://github.com/infor-design/enterprise/issues/3455))
- `[Locale]` Correct the month names in Russian locale and capitalized the day names. ([#3464](https://github.com/infor-design/enterprise/issues/3464))
- `[Module Tabs]` Fixed color tab indicator and small gap below when selected/opened for all color variations in uplift theme. ([#3312](https://github.com/infor-design/enterprise/issues/3312))
- `[Modal]` Fixed colors in dark mode for the primary disabled button and error and background contrast. ([#2754](https://github.com/infor-design/enterprise/issues/2754))
- `[Pie]` Fixed an issue where initial selection was getting error. ([#3157](https://github.com/infor-design/enterprise/issues/3157))
- `[Popupmenu]` Fixed an issue where list separators were disappearing when reduced the browser zoom level e.g. 70-80%. ([#3407](https://github.com/infor-design/enterprise/issues/3407))
- `[Radar Chart]` Fixed an issue where labels was cut off for some screen sizes. ([#3320](https://github.com/infor-design/enterprise/issues/3320))
- `[Searchfield]` Fixed a bug where changing filter results while the autocomplete is open may result in the menu being positioned incorrectly. ([#3243](https://github.com/infor-design/enterprise/issues/3243))
- `[Searchfield]` Fixed a bug in Toolbar Searchfields where a component configured with `collapsible: false` and `collapseSize` defined, the searchfield would incorrectly collapse. ([NG#719](https://github.com/infor-design/enterprise-ng/issues/719))
- `[Splitter]` Fixed an issue in the destroy function where the expand button was not removed. ([#3371](https://github.com/infor-design/enterprise/issues/3371))
- `[Swaplist]` Fixed an issue where top buttons were not aligned in Firefox. ([#3425](https://github.com/infor-design/enterprise/issues/3425))
- `[Textarea]` Fixed an issue where using `rows` stopped working, and fixed the autoGrow option to work better. ([#3471](https://github.com/infor-design/enterprise/issues/3471))
- `[Toolbar]` Fixed an issue where some `destroy()` methods being called in `teardown()` were not type-checking for the `destroy()` method, and sometimes would incorrectly try to call this on an object or data property defined as `button`. ([#3449](https://github.com/infor-design/enterprise/issues/3449))
- `[Tooltip/Popover]` Fixed incorrect placement when in RTL modes, as well as some broken styles on the RTL Popover. ([#3119](https://github.com/infor-design/enterprise/issues/3119))
- `[Validation/Checkboxes]` Fixed issues with making checkboxes required, the styling did not work for it and the scrollIntoView function and validation failed to fire. Note that to add required to the checkbox you need to add an extra span, adding a class to the label will not work because the checkbox is styled using the label already. ([#3147](https://github.com/infor-design/enterprise/issues/3147))
- `[Validation]` Fixed an issue where calling removeMessage would not remove a manually added error class. ([#3318](https://github.com/infor-design/enterprise/issues/3318))

(78 Issues Solved this release, Backlog Enterprise 336, Backlog Ng 77, 989 Functional Tests, 1246 e2e Test)

## v4.25.3

### v4.25.3 Fixes

- `[Bar]` Fixed an error rendering charts with only one dataset point. ([#3505](https://github.com/infor-design/enterprise/issues/3505))
- `[Datagrid]` Fixed an issue where date range filter was unable to filter data. ([#3503](https://github.com/infor-design/enterprise/issues/3503))
- `[Datagrid]` Fixed an issue where date range filter was not working. ([#3337](https://github.com/infor-design/enterprise/issues/3337))
- `[Datepicker]` Fixed an issue where date range with minimum range was not working. ([#3268](https://github.com/infor-design/enterprise/issues/3268))
- `[Datepicker]` Fixed an issue where date range was reverting to initial values after clearing. ([#1306](https://github.com/infor-design/enterprise/issues/1306))
- `[Field Filter]` Fixed an issue where switching to In Range filter type with a value in the field was causesing an error. ([#3515](https://github.com/infor-design/enterprise/issues/3515))
- `[Field Filter]` Fixed an issue where date range was not working after using other filter. ([#2764](https://github.com/infor-design/enterprise/issues/2764))

## v4.25.2

### v4.25.2 Fixes

- `[Fileupload]` Fixed an issue where tabbing out of a fileupload in was causing the modal dialog to disappear. ([#3458](https://github.com/infor-design/enterprise/issues/3458))

## v4.25.1

### v4.25.1 Fixes

- `[Datagrid]` Fixed a bug where if there was an editor datagrid might error when loading. ([#3313](https://github.com/infor-design/enterprise/issues/3313))
- `[Mask]` Fixed a bug where leading zeroes were not possible to apply against Number Masks on standard input fields that also handled formatting for thousands separators. ([#3315](https://github.com/infor-design/enterprise/issues/3315))
- `[General]` Improved the colors of windows chrome custom scrollbars in uplift themes. ([#3413](https://github.com/infor-design/enterprise/issues/3413))

## v4.25.0

### v4.25.0 Features

- `[Fields]` Added a form level class to toggle all fields in the form to a more compact (shorter) mode called `form-layout-compact`. Added and fixed existing components so that there is now the option to have more compact forms by using shorter fields. ([#3249](https://github.com/infor-design/enterprise/issues/3249))
- `[Tag]` Added a new style for linkable tags that will work for default, info, good, error, alert, and neutral styles. ([#3113](https://github.com/infor-design/enterprise/issues/3113))
- `[Multiselect]` Added Tag Display as a new style for interacting with selected results in Multiselect components. ([#3114](https://github.com/infor-design/enterprise/issues/3114))
- `[Popdown]` Added support for tabbing into and exit out of it. ([#3218](https://github.com/infor-design/enterprise/issues/3218))
- `[Colors]` Updated design system tokens to new colors for uplift and did a pass on all three theme variants. This impacts and improves many internal colors in components and charts. ([#3007](https://github.com/infor-design/enterprise/issues/3007))

### v4.25.0 Fixes

- `[About]` Added further indication for Microsoft Edge Chrome next to the underlying chrome version. ([#3073](https://github.com/infor-design/enterprise/issues/3073))
- `[About]` Fixed a bug where the browser language was shown as the locale name, we now show browser language and IDs language and locale separate. ([#2913](https://github.com/infor-design/enterprise/issues/2913))
- `[About]` Fixed a bug where the OS version was duplicated. ([#1650](https://github.com/infor-design/enterprise/issues/1650))
- `[Accordion]` Fixed inconsistency style of focus element after clicking on a certain accordion header. ([#3082](https://github.com/infor-design/enterprise/issues/3082))
- `[Accordion]` Fixed an issue that when all panes are expanded then they could no longer be closed. ([#701](https://github.com/infor-design/enterprise-ng/issues/3217))
- `[Application Menu]` Fixed minor usability issues when attempting to filter on application menus, display of hidden filtered children, and filtering reset when a Searchfield is blurred. ([#3285](https://github.com/infor-design/enterprise/issues/3285))
- `[Application Menu]` Fixed incorrect font-size/padding around list item headers' bullet points. ([#3364](https://github.com/infor-design/enterprise/issues/3364))
- `[Application Menu]` Tweaked some font colors on the Vibrant theme. ([#3400](https://github.com/infor-design/enterprise/issues/3400))
- `[Autocomplete]` Fixed an issue where selected event was not firing when its parent is partly overflowing. ([#3072](https://github.com/infor-design/enterprise/issues/3072))
- `[Calendar]` Fixed an issue setting the legend checked elements to false in the api. ([#3170](https://github.com/infor-design/enterprise/issues/3170))
- `[Datagrid]` Fixed an issue where the data after commit edit was not in sync for tree. ([#659](https://github.com/infor-design/enterprise-ng/issues/659))
- `[Datagrid]` Fixed an issue where the add row or load new data for grouping was not working. ([#2801](https://github.com/infor-design/enterprise/issues/2801))
- `[Datagrid]` Fixed an issue where time picker filter trigger icon and text was overlapping. ([#3062](https://github.com/infor-design/enterprise/issues/3062))
- `[Datagrid]` Fixed a bug where floating point math would cause the grouping sum aggregator to round incorrectly. ([#3233](https://github.com/infor-design/enterprise/issues/3233))
- `[Datagrid]` Fixed style issues in all theme and theme variants when using the list style including grouped headers and states. ([#3265](https://github.com/infor-design/enterprise/issues/3265))
- `[Datagrid]` Fixed issues with the stretch columns minimum width. ([#3308](https://github.com/infor-design/enterprise/issues/3308))
- `[Datagrid]` Fixed an issue where converting circular structure to JSON was throwing an error. ([#3309](https://github.com/infor-design/enterprise/issues/3309))
- `[Datagrid]` Fixed an issue where focus in date picker field was not aligning. ([#3350](https://github.com/infor-design/enterprise/issues/3350))
- `[Datagrid]` Added fixes for editing lookup fields, fixed the styling of the lookup editor and improved padding, also fixed the sort indicator color. ([#3160](https://github.com/infor-design/enterprise/issues/3160))
- `[Datagrid]` Fixed a bug that made selecting blank items in lists in a dropdown not possible. ([#3313](https://github.com/infor-design/enterprise/issues/3313))
- `[Editor]` Fixed an issue where line spacing was inconsistent. ([#3335](https://github.com/infor-design/enterprise/issues/3335))
- `[General]` Added detection for wkWebView which is paired with safari. This caused issues with all black text as this browser had previously been unknown. ([#3336](https://github.com/infor-design/enterprise/issues/3336))
- `[Homepage]` Fixed an issue where the DOM order was not working for triple width widgets. ([#3101](https://github.com/infor-design/enterprise/issues/3101))
- `[Locale]` Fixed an issue where enter all digits was not working for fr-FR. ([#3217](https://github.com/infor-design/enterprise/issues/3217))
- `[Locale]` Added the ability to set a 5 digit language (`fr-FR` and `fr-CA` vs `fr`) and added separate strings for `fr-CA` vs `fr-FR`. ([#3245](https://github.com/infor-design/enterprise/issues/3245))
- `[Locale]` Changed incorrect Chinese locale year formats to the correct format as noted by translators. For example `2019年 12月`. ([#3081](https://github.com/infor-design/enterprise/issues/3081))
- `[Locale]` Corrected and added the firstDayofWeek setting for every locale. ([#3060](https://github.com/infor-design/enterprise/issues/3060))
- `[Mask]` Fixed an issue when applying Masks to input fields configured for numbers, where errors would be thrown when the Mask attempted to overwrite the input field value. ([#3315](https://github.com/infor-design/enterprise/issues/3315))
- `[Modal]` Fixed an issue where the returns focus to button after closing was not working. ([#3166](https://github.com/infor-design/enterprise/issues/3166))
- `[Multiselect]` Adjusted the placeholder color as it was too dark. ([#3276](https://github.com/infor-design/enterprise/issues/3276))
- `[Pie]` Fixed cut off line labels when something other than value is used. ([#3143](https://github.com/infor-design/enterprise/issues/3143))
- `[Popupmenu]` Switched the `attachToBody` setting to be true by default. ([#3331](https://github.com/infor-design/enterprise/issues/3331))
- `[Searchfield]` Fixed an issue where multiselect items' checkboxes and text were misaligned in RTL mode. ([#1811](https://github.com/infor-design/enterprise/issues/1811))
- `[Searchfield]` Fixed placeholder text alignment issues on Vibrant theme in Firefox. ([#3055](https://github.com/infor-design/enterprise/issues/3055))
- `[Scrollbar]` Fixed styles for windows chrome to work with all themes. ([#3172](https://github.com/infor-design/enterprise/issues/3172))
- `[Searchfield]` Fixed an overlapping text in searchfield when close icon button is showed. ([#3135](https://github.com/infor-design/enterprise/issues/3135))
- `[Tabs]` Fixed an issue where scroll was not working on mobile view for scrollable-flex layout. ([#2931](https://github.com/infor-design/enterprise/issues/2931))

(47 Issues Solved this release, Backlog Enterprise 374, Backlog Ng 96, 980 Functional Tests, 1196 e2e Test)

## v4.24.0

### v4.24.0 Important Changes

- `[Icons]` Reversed a change in previous versions to make alert icons all have a white background as this caused issues. Concerning alert icons there are now the following `icon-[name]` - which will have transparent background, in Uplift these are linear in style, in soho these are solid in style. We also add a `icon-[name]-alert` for alert icons with a white background. If you need a white background you can use these otherwise we have restored the functionality from the 4.21 version, you might need a white background in calendar icons. Also the pending icon is fixed and now orange. ([#3052](https://github.com/infor-design/enterprise/issues/3052))
- `[Datagrid]` Changed the way tables are rendered to avoid gaps at the end of the grid and fix the sizes so they work in resize. This is done by using css position: sticky for headers. It has a few consequences. The spaceColumn option which was never completed was removed. The stretchColumn option is still working but is less important now and defaults to no stretch. IE 11 will now no longer support sticky headers because it does not support css position sticky, so it will degrade in functionality. This improves all issues with columns getting out of alignment. ([#2825](https://github.com/infor-design/enterprise/issues/2825))

### v4.24.0 Deprecation

### v4.24.0 Features

- `[Datagrid]` Added support to get only changed values as return array for get modified rows method. ([#2958](https://github.com/infor-design/enterprise/issues/2958))
- `[Editor]` Replaced the `h3` and `h4` buttons with a more robust Fontpicker component. ([#2722](https://github.com/infor-design/enterprise/issues/2722))
- `[Spinbox]` Standardized Spinbox field sizes to match other input field sizes, added responsive form (fluid) functionality for Spinbox, and reworked the standard size of the Spinbox to match other form fields. ([#1344](https://github.com/infor-design/enterprise/issues/1344))

### v4.24.0 Fixes

- `[All]` Removed the property `-webkit-text-fill-color` from usage throughout out our codebase, except for one rule that changes it to `unset` if it's present. ([#3041](https://github.com/infor-design/enterprise/issues/3041))
- `[Application Menu]` Fixed issue in application menu where scrollbar is visible even if it's not needed in uplift theme. ([#3134](https://github.com/infor-design/enterprise/issues/3134))
- `[Datagrid]` Fixed an issue where the hide pager on one page setting was not working correctly when applying a filter. ([#2676](https://github.com/infor-design/enterprise/issues/2676))
- `[Datagrid]` Fixed an issue where if the grid is initialized with an empty array then updateColumns is used the resetColumns function failed. ([#690](https://github.com/infor-design/enterprise-ng/issues/690))
- `[Datagrid]` Fixed an issue where the dirty cell indicator was not updating after remove row. ([#2960](https://github.com/infor-design/enterprise/issues/2960))
- `[Datagrid]` Fixed an issue where the method getModifiedRows was not working, it had duplicate entries for the same row. ([#2908](https://github.com/infor-design/enterprise/issues/2908))
- `[Datagrid]` Fixed an issue where the personalized columns were not working when toggle columns and drag drop. ([#3004](https://github.com/infor-design/enterprise/issues/3004))
- `[Datagrid]` Fixed an issue where the grouping filter was not working after do sort. ([#3012](https://github.com/infor-design/enterprise/issues/3012))
- `[Datagrid]` Fixed an issue where the editable single column was not working. ([#3023](https://github.com/infor-design/enterprise/issues/3023))
- `[Datagrid]` Fixed an issue where when hovering a parent row the same row index in the child row will show the hover state. ([#2227](https://github.com/infor-design/enterprise/issues/2227))
- `[Datagrid]` Fixed an issue where the focus state for action button formatter was not working correctly. ([#3006](https://github.com/infor-design/enterprise/issues/3006))
- `[Datagrid]` Fixed an issue where the personalization dialog was not centered on IE 11. ([#3175](https://github.com/infor-design/enterprise/issues/3175))
- `[Datagrid]` Fixed an issue finally so that all columns will always align and will never come out of alignment. ([#2835](https://github.com/infor-design/enterprise/issues/2835))
- `[Datagrid]` Fixed an issue where in some cases when there is no data you could not scroll right. ([#2363](https://github.com/infor-design/enterprise/issues/2363))
- `[Datagrid]` Fixed an issue where in some cases where you could not scroll right over the empty message. ([#2864](https://github.com/infor-design/enterprise/issues/2864))
- `[Datagrid]` Fixed an issue where the IOS text would appear very large on group headers. ([#2224](https://github.com/infor-design/enterprise/issues/2224))
- `[Datagrid]` Fixed an issue where in some cases where if you have one column and are in edit mode resizing the page behaved strangely. ([#3193](https://github.com/infor-design/enterprise/issues/3193))
- `[Datagrid]` Changed the rendering of columns so that there will never be a gap on the left side, changed the default of stretchColumn to null which will fill. ([#1818](https://github.com/infor-design/enterprise/issues/1818))
- `[Datagrid]` Fixed an issue that hyperlinks in the datagrid would redirect. ([#3207](https://github.com/infor-design/enterprise/issues/3207))
- `[Datagrid]` Changed the behavior of column resizing to use "fit" during resize, which means adjacent columns only will be resized. ([#605](https://github.com/infor-design/enterprise/issues/605))
- `[Datagrid]` Fixed an issue that resizing the last column would create a gap. ([#1671](https://github.com/infor-design/enterprise/issues/1671))
- `[Datepicker]` Fixed missing background color on disable dates and adjusted the colors in all themes. ([#2910](https://github.com/infor-design/enterprise/issues/2910))
- `[Datepicker]` Fixed a layout issue on the focus state on colored/legend days. ([#2910](https://github.com/infor-design/enterprise/issues/2910))
- `[Datepicker]` Fixed an issue where the calendar layout was not working on ie11. ([#3226](https://github.com/infor-design/enterprise/issues/3226))
- `[Dropdown]` Fix a bug where a dropdown in a datagrid cell would sometimes not display the correct value when selected. ([#2919](https://github.com/infor-design/enterprise/issues/2919))
- `[Dropdown]` Fix a layout issue in RTL on the badges example. ([#3150](https://github.com/infor-design/enterprise/issues/3150))
- `[Editor]` Corrected CSP errors and broken images in the Editor Preview when inserting the default image. ([#2937](https://github.com/infor-design/enterprise/issues/2937))
- `[Editor]` Fixes issues with Editors configured to use Flex Toolbar, where toolbar buttons were not properly triggering selected events, and overflowed items were not triggering editor actions as expected. ([#2938](https://github.com/infor-design/enterprise/issues/2938))
- `[Editor]` The Editor now uses the same routine for stripping disallowed tags and attributes from pasted content when it transitions from the Source View to the Preview. This makes it impossible to paste/type HTML tags containing a `style` property with CSS rules that are not allowed to be applied to inline Editor elements, such as `font-family`. ([#2987](https://github.com/infor-design/enterprise/issues/2987))
- `[Editor]` Fixed a problem in Safari that would cause scrolling to occur inside Flex Toolbars unexpectedly. ([#3033](https://github.com/infor-design/enterprise/issues/3033))
- `[Editor]` Fixed many memory leaks related to view swapping and `destroy()` in the Editor. ([#3112](https://github.com/infor-design/enterprise/issues/3112))
- `[EmptyMessage]` Added a fix so that click will only fire on the button part of the empty message. ([#3139](https://github.com/infor-design/enterprise/issues/3139))
- `[Header]` Update the header placeholder text color to match better. ([#3040](https://github.com/infor-design/enterprise/issues/3040))
- `[Locale]` Fixed a problem in fi-FI where some date formats where incorrect with one digit days. ([#3019](https://github.com/infor-design/enterprise/issues/3019))
- `[Locale]` Added new conversion methods for gregorian to umalqura dates and vice versa with Locale. The fromGregorian and togregorian methods were in two separate locations ar-SA and ar-EG. These new methods gregorianToUmalqura and umalquraToGregorian now moved to to one location in locale and removed the maxDate on them. ([#3051](https://github.com/infor-design/enterprise/issues/3051))
- `[Locale]` Fixed an issue when formatting with `SSS` in the format string, the leading zeros were incorrectly removed from the millisecond output. ([#2696](https://github.com/infor-design/enterprise/issues/2696))
- `[Locale/Datagrid]` Fixed an issue in the datagrid/locale that meant if a string is provided in the current locale for a number it wont parse correctly if the decimal format is a `,` (such as nl-NL). ([#3165](https://github.com/infor-design/enterprise/issues/3165))
- `[Locale]` Fixed an issue when loading en-XX locales where some data may be mixed with en-US. ([#3208](https://github.com/infor-design/enterprise/issues/3208))
- `[Mask]` Fixed a Safari bug where certain masked values would not trigger a "change" event on the input field. ([#3002](https://github.com/infor-design/enterprise/issues/3002))
- `[Modal]` Added a new setting `overlayOpacity` that give the user to control the opacity level of the modal/message dialog overlay. ([#2975](https://github.com/infor-design/enterprise/issues/2975))
- `[Popover]` Fixed an issue where the content was disappearing when change themes on IE11. ([#2954](https://github.com/infor-design/enterprise/issues/2954))
- `[Progress]` Added the ability to init the progress and update it to zero, this was previously not working. ([#3020](https://github.com/infor-design/enterprise/issues/3020))
- `[Sparkline Chart]` Fixed an issue where an error was thrown while a sparkline chart was present during a theme chnage. ([#3159](https://github.com/infor-design/enterprise/issues/3159))
- `[Tabs Module]` Fixed missing ellipsis and spacing issue on mobile view in searchfield of tabs module when resizing the browser. ([#2940](https://github.com/infor-design/enterprise/issues/2940))
- `[Toast]` Fixed an issue where the saved position was not working for whole app. ([#3025](https://github.com/infor-design/enterprise/issues/3025))
- `[Tree]` Fixed an issue where the nodes were not rendering. ([#3194](https://github.com/infor-design/enterprise/issues/3194))

### v4.24.0 Chores & Maintenance

- `[Demoapp]` Allow the query params that affect theming/personalization (theme/variant/colors) to be appended/adjusted on the browser's URL without affecting other query parameters, or adding unnecessary paramters that weren't changed.
- `[Toolbar Searchfield]` Increased the amount of text shown when the Searchfield is not expanded, and appears similar to a button.  Also modified some styles in all themes to make alignment of the text better between the Searchfield and buttons when the Searchfield is not expanded. ([#2944](https://github.com/infor-design/enterprise/issues/2944))

(74 Issues Solved this release, Backlog Enterprise 374, Backlog Ng 85, 974 Functional Tests, 1191 e2e Test)

## v4.23.0

### v4.23.0 Deprecation

- `[Icons]` We added per theme empty state icons for both uplift (vibrant) and soho (subtle) themes. Because of this `svg-empty.html` is now deprecated. Please use the theme based files `theme-soho-svg-empty.html` and `theme-uplift-svg-empty.html`. ([#426](https://github.com/infor-design/design-system/issues/426))

### v4.23.0 Features

- `[Accordion]` Added a new setting `expanderDisplay` that can display all expander button icons in the classic style, or with all "chevron" or "plus-minus"-style icons.  Deprecated the legacy `displayChevron` setting in favor of this change. ([#2900](https://github.com/infor-design/enterprise/issues/2900))
- `[Calendar / Day View]` A new component Week View was created, you can configure it to show a single day as well, or several days so we now have a day view. ([#2780](https://github.com/infor-design/enterprise/issues/2780))
- `[Calendar / Week View]` A new component Week View was added. You can show events in a series of days. This is also integrated into view switcher in the calendar component. ([#1757](https://github.com/infor-design/enterprise/issues/1757))
- `[Empty Messages]` Added a new icon `empty-no-users`. ([#3046](https://github.com/infor-design/enterprise/issues/3046))
- `[Locale]` Added updated translation files for 16 in house languages. ([#3049](https://github.com/infor-design/enterprise/issues/3049))
- `[Modal]` Added a new setting `overlayOpacity` that gives the developer ability to control the opacity level of the modal/message dialog overlay. ([#2975](https://github.com/infor-design/enterprise/issues/2975))

### v4.23.0 Fixes

- `[Accordion]` Fixed the font color when hovered on uplift high contrast. ([#3042](https://github.com/infor-design/enterprise/issues/3042))
- `[Autocomplete]` Fixed memory leaks by preventing re-rendering of an open autocomplete list from attaching new events, adding multiple `aria-polite` elements, etc. ([#2888](https://github.com/infor-design/enterprise/issues/2888))
- `[Calendar]` Pass calendar tooltip settings down to week-view component. ([#3179](https://github.com/infor-design/enterprise/issues/3179))
- `[Calendar]` Fixed disabled legend label color on vibrant/uplift with dark Variant theme. ([#2965](https://github.com/infor-design/enterprise/issues/2965))
- `[Calendar]` Fixed missing arrow and scrolling issues in the event popup. ([#2962](https://github.com/infor-design/enterprise/issues/2962))
- `[Contextual Action Panel]` Fixed an issue where the CAP close but beforeclose event not fired. ([#2826](https://github.com/infor-design/enterprise/issues/2826))
- `[Context Menu]` Fixed a placement bug that would cut the size of the menu to an unusable size in small viewport displays. ([#2899](https://github.com/infor-design/enterprise/issues/2899))
- `[Contextual Action Panel]` Fixed placement of `(X)` close button on both standard and Flex toolbars when using the `showCloseBtn` setting. ([#2834](https://github.com/infor-design/enterprise/issues/2834))
- `[Datagrid]` Fixed column headers font color in uplift high contrast. ([#2830](https://github.com/infor-design/enterprise/issues/2830))
- `[Datagrid]` Fixed an issue where the tree children expand and collapse was not working. ([#633](https://github.com/infor-design/enterprise-ng/issues/633))
- `[Datagrid]` Fixed an issue where the pager was not updating with updated method. ([#2759](https://github.com/infor-design/enterprise/issues/2759))
- `[Datagrid]` Fixed an issue where the browser contextmenu was not showing by default. ([#2842](https://github.com/infor-design/enterprise/issues/2842))
- `[Datagrid]` Fixed an issue where string include zeroes not working with text filter. ([#2854](https://github.com/infor-design/enterprise/issues/2854))
- `[Datagrid]` Fixed an issue where the select all button for multiselect grouping was not working. ([#2895](https://github.com/infor-design/enterprise/issues/2895))
- `[Datagrid]` Fixed an issue where the select children for tree was not working. ([#2961](https://github.com/infor-design/enterprise/issues/2961))
- `[Datepicker]` Fixed an issue where the selected date was getting cleared and creating js error after changing month or year in Umalqura date and Calendar. ([#3093](https://github.com/infor-design/enterprise/issues/3093))
- `[Datepicker]` Fixed an issue where the validation after body re-initialize was not working. ([#2410](https://github.com/infor-design/enterprise/issues/2410))
- `[Datepicker]` Fixed an issue where the islamic-umalqura calendar was not working, when used with user vs settings locale and translate data was not loading from parent locale. ([#2878](https://github.com/infor-design/enterprise/issues/2878))
- `[Datepicker]` Fixed layout issues in RTL mode, also the buttons are switched the to the opposite side now. ([#3068](https://github.com/infor-design/enterprise/issues/3068))
- `[Dropdown]` Fixed an issue where the dropdown icons are misaligned in IE11 in the Uplift theme. ([#2826](https://github.com/infor-design/enterprise/issues/2912))
- `[Dropdown]` Fixed an issue where the placeholder was incorrectly renders when initially set selected item. ([#2870](https://github.com/infor-design/enterprise/issues/2870))
- `[Dropdown]` Fixed placement logic when dropdown's flip, as well as a visual bug with checkmark/icon placement on some browsers. ([#3058](https://github.com/infor-design/enterprise/issues/3058))
- `[Dropdown]` Fixed an issue where it was possible to inject xss when clearing the typeahead. ([#650](https://github.com/infor-design/enterprise-ng/issues/650))
- `[Field Filter]` Fixed an issues where the icons are not vertically centered, and layout issues when opening the dropdown in a smaller height browser. ([#2951](https://github.com/infor-design/enterprise/issues/2951))
- `[Header]` Fixed an iOS bug where the theme switcher wasn't working after Popupmenu lifecycle changes. ([#2986](https://github.com/infor-design/enterprise/issues/2986))
- `[Header Tabs]` Added a more distinct style to selected header tabs. ([infor-design/design-system#422](https://github.com/infor-design/design-system/issues/422))
- `[Hierarchy]` Fixed the border color on hierarchy cards. ([#423](https://github.com/infor-design/design-system/issues/423))
- `[Locale]` Fixed an issue where the parseDate method was not working for leap year. ([#2737](https://github.com/infor-design/enterprise/issues/2737))
- `[Locale]` Fixed an issue where some culture files does not have a name property in the calendar. ([#2880](https://github.com/infor-design/enterprise/issues/2880))
- `[Locale]` Fixed an issue where cultures with a group of space was not parsing correctly. ([#2959](https://github.com/infor-design/enterprise/issues/2959))
- `[Locale]` Fixed a problem loading nb-NO locale where it would fail to find translations and possibly error. ([#3035](https://github.com/infor-design/enterprise/issues/3035))
- `[Lookup]` Fixed missing X button in searchfield on a mobile viewport. ([#2948](https://github.com/infor-design/enterprise/issues/2948))
- `[Message]` Fixed an issue with an extra scroll bar, updated padding. ([#2964](https://github.com/infor-design/enterprise/issues/2964))
- `[Modal]` Fixed a layout issue when using 2 or more buttons on some smaller devices. ([#3014](https://github.com/infor-design/enterprise/issues/3014))
- `[Monthview]` Fixed an issue that the month/year text will reset when pressing cancel. ([#3080](https://github.com/infor-design/enterprise/issues/3080))
- `[Monthview]` Fixed a layout issue on the header in IE 11. ([#2862](https://github.com/infor-design/enterprise/issues/2862))
- `[Pie]` Fixed an issue where legends in pie chart gets cut off on mobile view. ([#902](https://github.com/infor-design/enterprise/issues/902))
- `[Popupmenu]` In mobile settings (specifically iOS), input fields will now allow for text input when also being assigned a context menu. ([#2613](https://github.com/infor-design/enterprise/issues/2613))
- `[Popupmenu]` Fixed an issue where the destroy event was bubbling up to other parent components. ([#2809](https://github.com/infor-design/enterprise/issues/2809))
- `[Popupmenu]` Fixed an issue where checkable menu items were not causing a popupmenu list to become properly formatted to fit the checkmarks when generated as part of a Flex Toolbar.  Also reworked the selection system to better handle selectable sections. ([#2989](https://github.com/infor-design/enterprise/issues/2809))
- `[Toolbar]` Fixed a bug where the dropdown/toolbar menu is being cut off on iOS device. ([#2800](https://github.com/infor-design/enterprise/issues/2800))
- `[Tooltip]` Fixed a personalization bug on Dark Themes where text colors were sometimes illegible when using certain color configurations. ([#3011](https://github.com/infor-design/enterprise/issues/3011))

### v4.23.0 Chores & Maintenance

- `[Build System]` Created separate sets linting rules for demoapp, source code, and tests, as well as a base set of rules for all environments. ([#2662](https://github.com/infor-design/enterprise/issues/2662))

(70 Issues Solved this release, Backlog Enterprise 378, Backlog Ng 82, 939 Functional Tests, 1136 e2e Test)

## v4.22.0

### v4.22.0 Deprecation

- `[Icons]` The alert icons now all have a white background allowing them to appear on colored areas. There was previously a special `-solid` version of the icons created that is now not needed, if you used the `icon-<name>-solid` icon change it to just `icon-<name>`. ([#396](https://github.com/infor-design/design-system/issues/396))

### v4.22.0 Features

- `[Build]` Replaced UglifyES in the minification script with Terser ([#2660](https://github.com/infor-design/enterprise/issues/2660))
- `[Build]` Added the Locale culture files to the minification script. `.min.js` versions of each locale are now available in the `dist/` folder. ([#2660](https://github.com/infor-design/enterprise/issues/2660))
- `[Calendar / Weekview]` Added a new week-view component that can be used standalone and ability switch to calendar week view in calendar. ([#1757](https://github.com/infor-design/enterprise/issues/1757))
- `[Application Menu]` Improved design of the App Menu Accordion's hierarchy, among other visual improvements, in the Uplift theme. ([#2739](https://github.com/infor-design/enterprise/issues/2739))
- `[Calendar]` Fixed layout issues in uplift theme. ([#2907](https://github.com/infor-design/enterprise/issues/2907))
- `[Charts]` Added support for context menu event with charts. ([#2699](https://github.com/infor-design/enterprise/issues/2699))
- `[Checkboxes]` Fixed layout issues when in grid rows. ([#2907](https://github.com/infor-design/enterprise/issues/2907))
- `[Contextual Action Panel]` Added support for passing in a full range of settings to the underlying Modal component API. ([#2433](https://github.com/infor-design/enterprise/issues/2433))
- `[Export]` Added support for separator to use custom string or object type with Export to CSV. ([#2490](https://github.com/infor-design/enterprise/issues/2490))
- `[Locale]` Added support for fetching minified culture files. ([#2660](https://github.com/infor-design/enterprise/issues/2660))
- `[Locale]` Added new translations for missing entries. ([#2896](https://github.com/infor-design/enterprise/issues/2896))
- `[Locale]` Fixed a bug that the language would reset when opening some components if a seperate language is used. ([#2982](https://github.com/infor-design/enterprise/issues/2982))
- `[Modal]` Added support for a "fullsize" sheet display at all times, or simply beneath the responsive breakpoint. ([#2433](https://github.com/infor-design/enterprise/issues/2433))
- `[Tabs-Vertical]` Added the ability to personalize Vertical Tabs in accordance with theming. ([#2824](https://github.com/infor-design/enterprise/issues/2824))
- `[Wizard]` Added support for short labels. If short labels not supplied it will add ellipsis to text and tooltip. ([#2604](https://github.com/infor-design/enterprise/issues/2604))

### v4.22.0 Fixes

- `[Accordion]` Fixed a Safari bug where accordion headers would not lose focus when another accordion header was clicked. ([#2851](https://github.com/infor-design/enterprise/issues/2851))
- `[Application Menu]` Fixed an issue where footer toolbar area was overlapping to menu content. ([#2552](https://github.com/infor-design/enterprise/issues/2552))
- `[Application Menu]` Fixed an issue where tooltip was showing white text on white background which makes text to be unreadable. ([#2811](https://github.com/infor-design/enterprise/issues/2811))
- `[Application Menu]` Fixed a bug where application menus were not dismissed when clicking directly on Popupmenu triggers in a mobile setting. ([#2831](https://github.com/infor-design/enterprise/issues/2831))
- `[Application Menu]` Fixed an issue on mobile where the body was scroll bouncing when dragging/scrolling in the app menu. ([#2434](https://github.com/infor-design/enterprise/issues/2434))
- `[Bar Chart]` Fixed an issue where labels were overwritten when use more then one chart on page. ([#2723](https://github.com/infor-design/enterprise/issues/2723))
- `[Buttons]` Adjust the contrast of buttons (tertiary) on uplift theme. ([#396](https://github.com/infor-design/design-system/issues/396))
- `[Calendar]` Fixed an issue where the upcoming event description was overlapping the upcoming duration when text is too long, adjust width of spinbox count and fixed alignment of all day checkbox in uplift light theme. ([#2778](https://github.com/infor-design/enterprise/issues/2778))
- `[Datagrid]` Fixed an issue where if you have duplicate Id's the columns many become misaligned. ([#2687](https://github.com/infor-design/enterprise/issues/2687))
- `[Datagrid]` Made the text all white on the targeted achievement formatter. ([#2730](https://github.com/infor-design/enterprise/issues/2730))
- `[Datagrid]` Fixed keyword search so that it will again work with client side paging. ([#2797](https://github.com/infor-design/enterprise/issues/2797))
- `[Datagrid]` Fixed an issue where the header and cells do not align perfectly. ([#2849](https://github.com/infor-design/enterprise/issues/2849))
- `[Datagrid]` Fixed an issue where actions menu was not opening after reload the data. ([#2876](https://github.com/infor-design/enterprise/issues/2876))
- `[Datepicker]` Moved the today button to the datepicker header and adding a setting to hide it if wanted. ([#2704](https://github.com/infor-design/enterprise/issues/2704))
- `[FieldSet]` Fixed an issue where the fieldset text in chart completion overlap when resizing the browser. ([#2610](https://github.com/infor-design/enterprise/issues/2610))
- `[Datepicker]` Fixed a bug in datepicker where the destroy method does not readd the masking functionality. [2832](https://github.com/infor-design/enterprise/issues/2832))
- `[Field Options]` Fixed an issue where the option menu is misaligned in full length input field in uplift theme. ([#2765](https://github.com/infor-design/enterprise/issues/2765))
- `[Icons]` Added and updated the following icons: icon-new, icon-calculator, icon-save-new, icon-doc-check. ([#391](https://github.com/infor-design/design-system/issues/391))
- `[Icons]` Added and updated the following icons: icon-bed, icon-user-clock, icon-phone-filled, icon-phone-empty. ([#419](https://github.com/infor-design/design-system/issues/419))
- `[Listview]` Fixed an issue where empty message would not be centered if the listview in a flex container. ([#2716](https://github.com/infor-design/enterprise/issues/2716))
- `[Locale/Initialize]` Fixed an issue where opening some components like Contextual Action Panel would change the current locale because it calls initialize when it loads. ([#2873](https://github.com/infor-design/enterprise/issues/2873))
- `[Mask]` Added an example showing how to user percent format with the locale. ([#434](https://github.com/infor-design/enterprise/issues/434))
- `[Modal]` Fixed an issue where encoded html would not be recoded on the title. ([#246](https://github.com/infor-design/enterprise/issues/246))
- `[Modal]` Fixed an issue where the page content behind the modal is still scrollable while the modal window is open on iOS devices. ([#2678](https://github.com/infor-design/enterprise/issues/2678))
- `[Popupmenu]` Prevent popupmenus from closing after exit and reentry to the popupmenu submenu structure. ([#2702](https://github.com/infor-design/enterprise/issues/2702))
- `[Swaplist]` Fixed an issue where passed data for searched items were not syncing for beforeswap event. ([#2819](https://github.com/infor-design/enterprise/issues/2819))
- `[Tabs]` Add more padding to the count styles. ([#2744](https://github.com/infor-design/enterprise/issues/2744))
- `[Tabs]` Fixed the disabled tab color. ([#396](https://github.com/infor-design/design-system/issues/396))
- `[Tabs-Module]` Fixed styling and appearance issues on an example page demonstrating the Go Button alongside a Searchfield with Categories. ([#2745](https://github.com/infor-design/enterprise/issues/2745))
- `[Tabs-Multi]` Fixed an issue where tooltip was not showing when hovering a tab with cut-off text. ([#2747](https://github.com/infor-design/enterprise/issues/2747))
- `[Toolbar Flex]` Fixed a bug in toolbar flex where the title is getting truncated even if there's enough space for it. ([#2810](https://github.com/infor-design/enterprise/issues/2810))
- `[Validation]` Fixed an issue where if the mask is set to use a time other than the default time for the locale, this was not taken into account in validation. ([#2821](https://github.com/infor-design/enterprise/issues/2821))

### v4.22.0 Chores & Maintenance

- `[Demo App]` Changed the theme switch to call the page refresh. ([#2743](https://github.com/infor-design/enterprise/issues/2743))
- `[Export]` Added support for separator to use custom string or object type with Export to CSV. ([#2490](https://github.com/infor-design/enterprise/issues/2490))

(53 Issues Solved this release, Backlog Enterprise 342, Backlog Ng 81, 892 Functional Tests, 909 e2e Test)

## v4.21.0

### v4.21.0 Deprecation

- `[Icons]` Removed the hardcoded red color of the `icon-flag` so it can be used as a normal icon. If red is desired please add an additional class of `icon-flag icon-error`. ([#2548](https://github.com/infor-design/enterprise/issues/2548))

### v4.21.0 Features

- `[Calendar]` Added the ability to show tooltip on event and event icon and the ability to fire a context menu event. ([#2518](https://github.com/infor-design/enterprise/issues/2518))
- `[Datagrid]` Added the ability to use frozen columns with tree grid. ([#2102](https://github.com/infor-design/enterprise/issues/2102))
- `[Datagrid]` Added support for a fixed row size, this can be used in some cases like frozen columns where rows may have a different size than the three row heights (normal, short, medium). ([#2101](https://github.com/infor-design/enterprise/issues/2101))
- `[Datagrid]` Added filter row editor options to api setting. ([#2648](https://github.com/infor-design/enterprise/issues/2648))
- `[Datagrid]` Fixed an issue that alert text is cut off when using the textEllipsis option. ([#2773](https://github.com/infor-design/enterprise/issues/2773))
- `[Editor]` Added events to trigger on view change. ([#2430](https://github.com/infor-design/enterprise/issues/2430))
- `[Homepage]` Added a parameter to the `resize` event that provides metadata about the Homepage's state, including a calculated container height. ([#2446](https://github.com/infor-design/enterprise/issues/2446))
- `[Locale]` Added support for big numbers (18.6) to formatNumber and parseNumber. ([#1800](https://github.com/infor-design/enterprise/issues/1800))

### v4.21.0 Fixes

- `[Application Menu]` Fixed an indentation issue with child elements in an accordion in the Angular application (enterprise-ng). ([#2616](https://github.com/infor-design/enterprise/issues/2616))
- `[AppMenu/Accordion]` Improved performance on Angular by not calling siftFor on the app menu build. ([#2767](https://github.com/infor-design/enterprise/issues/2767))
- `[AppMenu/Accordion]` Fixed a bug where the busy indicator would immediately close. ([#2767](https://github.com/infor-design/enterprise/issues/2767))
- `[Button]` Fixed an issue where updated method was not teardown and re-init. ([#2304](https://github.com/infor-design/enterprise/issues/2304))
- `[Circle Pager]` Fixed a bug where it was not showing on mobile view. ([#2589](https://github.com/infor-design/enterprise/issues/2589))
- `[Contextual Action Panel]` Fixed an issue where if the title is longer, there will be an overflow causing a white space on the right on mobile view. ([#2605](https://github.com/infor-design/enterprise/issues/2605))
- `[Custom Builds]` Fixed a problem where including components with extra punctuation (periods, etc) may cause a build to fail. ([#1322](https://github.com/infor-design/enterprise/issues/1322))
- `[Datagrid]` Fixed an issue where key navigation was not working for inlineEditor. ([#2157](https://github.com/infor-design/enterprise/issues/2157))
- `[Datagrid]` Fixed a bug where calling update rows in the filter callback will cause an infinite loop. ([#2526](https://github.com/infor-design/enterprise/issues/2526))
- `[Datagrid]` Fixed a bug where the value would clear when using a lookup editor with a mask on new rows. ([#2305](https://github.com/infor-design/enterprise/issues/2305))
- `[Datagrid]` Fixed a bug where horizontal scrolling would not work when in a card/widget. ([#1785](https://github.com/infor-design/enterprise/issues/1785))
- `[Datagrid]` Fixed an issue where dirty and row status on the same cell would cause a UI issue. ([#2641](https://github.com/infor-design/enterprise/issues/2641))
- `[Datagrid]` Changed the onKeyDown callback to fire on any key. ([#536](https://github.com/infor-design/enterprise-ng/issues/536))
- `[Datagrid]` Added a more descriptive aria-label to checkboxes if the required descriptors exist. ([#2031](https://github.com/infor-design/enterprise-ng/issues/2031))
- `[Datagrid]` Added an announcement of the selection state of a row. ([#2535](https://github.com/infor-design/enterprise/issues/2535))
- `[Datagrid]` Fixed filtering on time columns when time is a string. ([#2535](https://github.com/infor-design/enterprise/issues/2535))
- `[Datagrid]` Fixed icon layout issues on the filter row in medium rowHeight mode. ([#2709](https://github.com/infor-design/enterprise/issues/2709))
- `[Datagrid]` Fixed an issue where short row height was misaligning in Uplift theme. ([#2717](https://github.com/infor-design/enterprise/issues/2717))
- `[Datagrid]` Fixed an issue where new row and dirty cell were not working when combined. ([#2729](https://github.com/infor-design/enterprise/issues/2729))
- `[Dropdown]` Fixed an issue where tooltip on all browsers and ellipsis on firefox, ie11 was not showing with long text after update. ([#2534](https://github.com/infor-design/enterprise/issues/2534))
- `[Editor]` Fixed an issue where clear formatting was causing to break while switch mode on Firefox. ([#2424](https://github.com/infor-design/enterprise/issues/2424))
- `[Empty Message]` Fixed padding and alignment issues, the icon is now centered better. ([#2424](https://github.com/infor-design/enterprise/issues/2733))
- `[Fileupload Advanced]` Added custom errors example page. ([#2620](https://github.com/infor-design/enterprise/issues/2620))
- `[Flex Toolbar]` Fixed a lifecycle problem that was preventing Menu Buttons with a `removeOnDestroy` setting from opening. ([#2664](https://github.com/infor-design/enterprise/issues/2664))
- `[Homepage]` Fixed an issue where dynamically added widget was not positioning correctly. ([#2425](https://github.com/infor-design/enterprise/issues/2425))
- `[Icons]` Fixed an issue with partially invisible empty messages in uplift theme. ([#2474](https://github.com/infor-design/enterprise/issues/2474))
- `[Icons (Component)]` Fixed a bug where it was possible to store a full base-tag prefixed URL in the `use` setting, which shouldn't be possible. ([PR#2738](https://github.com/infor-design/enterprise/pull/2738))
- `[Locale]` Fixed a bug where getCulturePath does not work if the sohoxi.js file name has a hash part. ([#2637](https://github.com/infor-design/enterprise/issues/2637))
- `[Locale]` Fixed a bug found when using NG8 that the default us locale causes issues. It is now an official requirement that you set a locale for all components that require locale information. ([#2640](https://github.com/infor-design/enterprise/issues/2640))
- `[Locale]` Fixed an occurrence where an nonstandard locale filename was not correctly processed. ([#2684](https://github.com/infor-design/enterprise/issues/2684))
- `[Lookup]` Fixed memory leak issues after destroy. ([#2494](https://github.com/infor-design/enterprise/issues/2494))
- `[Modal]` Fixed memory leak issues after destroy. ([#2497](https://github.com/infor-design/enterprise/issues/2497))
- `[Popupmenu]` Fixed DOM leak where many arrows could be inserted in the DOM. ([#568](https://github.com/infor-design/enterprise-ng/issues/568))
- `[Pager]` Fixed a bug where clicking disabled buttons caused a refresh of the page in NG. ([#2170](https://github.com/infor-design/enterprise/issues/2170))
- `[Slider]` Updated the color variant logic to match new uplift theming. ([#2647](https://github.com/infor-design/enterprise/issues/2647))
- `[Tabs]` Fixed a memory leak caused by removing a tab. ([#2686](https://github.com/infor-design/enterprise/issues/2686))
- `[Toast]` Fixed memory leak issues after destroy. ([#2634](https://github.com/infor-design/enterprise/issues/2634))
- `[Toolbar]` Fixed the conditions for when `noSearchfieldReinvoke` destroys an inner Searchfield that's been previously invoked. ([PR#2738](https://github.com/infor-design/enterprise/pull/2738))
- `[Uplift Theme]` Various improvements to the Dark/Contrast variants, with a focus on passing WCAG ([#2541](https://github.com/infor-design/enterprise/issues/2541)) ([#2588](https://github.com/infor-design/enterprise/issues/2588))

### v4.21.0 Chores & Maintenance

- `[Custom Builds]` Improved Sass builder's ability to code split and include partials once. ([#1038](https://github.com/infor-design/enterprise/issues/1038))

(61 Issues Solved this release, Backlog Enterprise 335, Backlog Ng 76, 867 Functional Tests, 880 e2e Test)

## v4.20.0

### v4.20.0 Deprecation

- `[ListFilter]` Deprecated `startsWith` in favor of `wordStartsWith`, due to the addition of the `phraseStartsWith` filterMode. ([#1606](https://github.com/infor-design/enterprise/issues/1606))
- `[Popdown]` Deprecated `Popdown` in favor of `Popover`. Both components have similar functionality and we want to trim the code logic down. ([#2468](https://github.com/infor-design/enterprise/issues/2468))
- `[StepProcess]` Deprecated `StepProcess` as the component is no longer commonly used. We will remove it within 3-6 versions. ([#1476](https://github.com/infor-design/enterprise/issues/1476))
- `[CompositeForm]` Deprecated `CompositeForm` as the component is no longer commonly used. We will remove it within 3-6 versions. ([#1476](https://github.com/infor-design/enterprise/issues/1476))
- `[FieldOptions]` Deprecated `FieldOptions` as the component is no longer commonly used. We will remove it within 3-6 versions. ([#1476](https://github.com/infor-design/enterprise/issues/1476))

### v4.20.0 Features

- `[Datagrid]` Added support to resize column widths after a value change via the stretchColumnOnChange setting. ([#2174](https://github.com/infor-design/enterprise/issues/2174))
- `[Datagrid]` Added a Sort Function to the datagrid column to allow the value to be formatted for the sort. ([#2274](https://github.com/infor-design/enterprise/issues/2274)))
- `[Datagrid]` Added placeholder functionality to Lookup, Dropdown, and Decimal Formatters. ([#2408](https://github.com/infor-design/enterprise/issues/2408)))
- `[Datagrid]` Added support to restrict the size of a column with minWidth and maxWidth setting on the column. ([#2313](https://github.com/infor-design/enterprise/issues/2313))
- `[Datagrid]` Automatically remove nonVisibleCellError when a row is removed. ([#2436](https://github.com/infor-design/enterprise/issues/2436))
- `[Datagrid]` Fixed header alignment with textOverflow ellipsis setting. ([#2351](https://github.com/infor-design/enterprise/issues/2351))
- `[Datagrid]` Fixed an issue where code-block editor focus was not working. ([#526](https://github.com/infor-design/enterprise-ng/issues/526))
- `[Datagrid]` Automatically remove nonVisibleCellError when a row is removed. ([#2436](https://github.com/infor-design/enterprise/issues/2436))
- `[Datagrid]` Add a fix to show ellipsis text on lookups in the datagrid filter. ([#2122](https://github.com/infor-design/enterprise/issues/2122))
- `[Datagrid]` Made grouping work better with editable, including fixes to addRow, removeRow, messages, and dirty indication. ([#1851](https://github.com/infor-design/enterprise/issues/1851))
- `[Datagrid]` Changed the beforeCommitCellEdit event into a function on the column that is synchronous. ([#2442](https://github.com/infor-design/enterprise/issues/2442))
- `[Datagrid]` Fixed a bug that the selected event would fire when no rows are deselected and on initial load. ([#2472](https://github.com/infor-design/enterprise/issues/2472))
- `[Datagrid]` Removed a white background from the colorpicker editor in high contrast theme. ([#1574](https://github.com/infor-design/enterprise/issues/1574))
- `[Datepicker]` Made the showMonthYearPicker option true by default and added a newly designed panel to select the year and day. ([#1958](https://github.com/infor-design/enterprise/issues/1958))
- `[Datepicker]` Fixed a layout issue in IE 11 with the datepicker title. ([#2598](https://github.com/infor-design/enterprise/issues/2598))
- `[Datepicker]` Fixed issues with the mask when using the range picker. ([#2597](https://github.com/infor-design/enterprise/issues/2597))
- `[Dropdown]` Fixed an issue where ellipsis was not working when use firefox new tab. ([#2236](https://github.com/infor-design/enterprise/issues/2236))
- `[Form Compact]` Added checkboxes/radios, and improved visual style. ([#2193](https://github.com/infor-design/enterprise/issues/2193))
- `[Images]` Created an additional image class to apply focus state without coercing width and height. ([#2025](https://github.com/infor-design/enterprise/issues/2025))
- `[ListFilter]` Added `phraseStartsWith` filterMode for only matching a search term against the beginning of a string. ([#1606](https://github.com/infor-design/enterprise/issues/1606))
- `[Multiselect]` Changed interactions in filtered lists to no longer reset text inside the search input and the contents of the list. ([#920](https://github.com/infor-design/enterprise/issues/920))
- `[Toast]` Added api settings for drag drop and save position. ([#1876](https://github.com/infor-design/enterprise/issues/1876))
- `[Uplift Theme]` Various minor improvements. ([#2318](https://github.com/infor-design/enterprise/issues/2318))

### v4.20.0 Fixes

- `[Alerts]` Removed dirty tracker from the page due to layout issues. ([#1679](https://github.com/infor-design/enterprise/issues/1679))
- `[App Menu]` Fixed an issue where the lower toolbar inverts left and right keyboard actions. ([#2240](https://github.com/infor-design/enterprise/issues/2240))
- `[Bar Chart]` Fixed an issue where the tooltip would not show. ([#2097](https://github.com/infor-design/enterprise/issues/2097))
- `[Calendar]` Added more information to the onMonthRendered callback. ([#2419](https://github.com/infor-design/enterprise/issues/2419))
- `[Calendar]` Changed updated method so it can reinit the calendar with new data. ([#2419](https://github.com/infor-design/enterprise/issues/2419))
- `[Calendar]` Fixed stack exceeded error in angular using updated and legend. ([#2419](https://github.com/infor-design/enterprise/issues/2419))
- `[Calendar]` Added an eventclick and eventdoubleclick information to the onMonthRendered callback. ([#2419](https://github.com/infor-design/enterprise/issues/2419))
- `[Calendar]` Allow Validation of the Calendar Popup. ([#1742](https://github.com/infor-design/enterprise/issues/1742))
- `[Calendar]` Prevent double click from reopening the event popup. ([#1705](https://github.com/infor-design/enterprise/issues/1705))
- `[Calendar]` Enable vertical scrolling at short window sizes in monthview. ([#2489](https://github.com/infor-design/enterprise/issues/2489))
- `[Charts]` Made fixes so all charts change color in uplift theme. ([#2058](https://github.com/infor-design/enterprise/issues/2058))
- `[Charts]` Fixes dynamic tooltips on a bar chart. ([#2447](https://github.com/infor-design/enterprise/issues/2447))
- `[Colorpicker]` Fixed colorpicker left and right keys advanced oppositely in right-to-left mode. ([#2352](https://github.com/infor-design/enterprise/issues/2352))
- `[Column Chart]` Fixed an issue where the tooltip would not show. ([#2097](https://github.com/infor-design/enterprise/issues/2097))
- `[Datagrid]` Fixes an issue where method selectedRows() was returning incorrect information when new row added via addRow(). ([#1794](https://github.com/infor-design/enterprise/issues/1794))
- `[Datagrid]` Fixed the text width functions for better auto sized columns when using editors and special formatters. ([#2270](https://github.com/infor-design/enterprise/issues/2270))
- `[Datagrid]` Fixes the alignment of the alert and warning icons on a lookup editor. ([#2175](https://github.com/infor-design/enterprise/issues/2175))
- `[Datagrid]` Fixes tooltip on the non displayed table errors. ([#2264](https://github.com/infor-design/enterprise/issues/2264))
- `[Datagrid]` Fixes an issue with alignment when toggling the filter row. ([#2332](https://github.com/infor-design/enterprise/issues/2332))
- `[Datagrid]` Fixes an issue where method setFilterConditions() were not working for multiselect filter. ([#2414](https://github.com/infor-design/enterprise/issues/2414))
- `[Datagrid]` Fixes an error on tree grid when using server-side paging. ([#2132](https://github.com/infor-design/enterprise/issues/2132))
- `[Datagrid]` Fixed an issue where autocompletes popped up on cell editors. ([#1575](https://github.com/infor-design/enterprise/issues/1575))
- `[Datagrid]` Fixes reset columns to set the correct hidden status. ([#2315](https://github.com/infor-design/enterprise/issues/2315))
- `[Datagrid]` Fixes the filtering of null values. ([#2336](https://github.com/infor-design/enterprise/issues/2336))
- `[Datagrid]` Fixed an issue where performance was significantly slower for export methods. ([#2291](https://github.com/infor-design/enterprise/issues/2291))
- `[Datagrid]` Fixes a bug that stopped the search in datagrid personalization from working. ([#2299](https://github.com/infor-design/enterprise/issues/2299))
- `[Datagrid]` Fixes an error on tree grid when using server-side paging. ([#2132](https://github.com/infor-design/enterprise/issues/2132))
- `[Datagrid]` Fixed an issue where autocompletes popped up on cell editors. ([#1575](https://github.com/infor-design/enterprise/issues/1575))
- `[Datagrid]` Fixes the filtering of null values. ([#2336](https://github.com/infor-design/enterprise/issues/2336))
- `[Datagrid]` Fixed an issue where performance was significantly slower for export methods. ([#2291](https://github.com/infor-design/enterprise/issues/2291))
- `[Datagrid]` Fixed an issue where source would not fire on sorting. ([#2390](https://github.com/infor-design/enterprise/issues/2390))
- `[Datagrid]` Fixes the styling of non editable checkbox cells so they look disabled. ([#2340](https://github.com/infor-design/enterprise/issues/2340))
- `[Datagrid]` Changed the dynamic column tooltip function to pass the row and more details. This changes the order of parameters but since this feature is new did not consider this a breaking change. If you are using this please take note. ([#2333](https://github.com/infor-design/enterprise/issues/2333))
- `[Datagrid]` Fixed a bug is the isEditable column callback in editable tree grid where some data was missing in the callback. ([#2357](https://github.com/infor-design/enterprise/issues/2357))
- `[Datepicker]` Removed the advanceMonths option as the dropdowns for this are no longer there in the new design. ([#970](https://github.com/infor-design/enterprise/issues/970))
- `[Datepicker]` Fixed an issue where range selection was not working. ([#2569](https://github.com/infor-design/enterprise/issues/2569))
- `[Datepicker]` Fixed some issue where footer buttons were not working properly with range selection. ([#2595](https://github.com/infor-design/enterprise/issues/2595))
- `[Datepicker]` Fixed an issue where time was not updating after change on range selection. ([#2599](https://github.com/infor-design/enterprise/issues/2599))
- `[Datagrid]` Fixed a bug where deselect all would not deselect some rows when using grouping. ([#1796](https://github.com/infor-design/enterprise/issues/1796))
- `[Datagrid]` Fixed a bug where summary counts in grouping would show even if the group is collapsed. ([#2221](https://github.com/infor-design/enterprise/issues/2221))
- `[Datagrid]` Fixed issues when using paging (client side) and removeRow. ([#2590](https://github.com/infor-design/enterprise/issues/2590))
- `[Demoapp]` When displaying Uplift theme, now shows the correct alternate fonts for some locales when switching via the `locale` query string. ([#2365](https://github.com/infor-design/enterprise/issues/2365))
- `[Dropdown]` Fixed a memory leak when calling destroy. ([#2493](https://github.com/infor-design/enterprise/issues/2493))
- `[Editor]` Fixed a bug where tab or shift tab would break out of the editor when doing an indent/outdent. ([#2421](https://github.com/infor-design/enterprise/issues/2421))
- `[Editor]` Fixed a bug where the dirty indicator would be hidden above. ([#2577](https://github.com/infor-design/enterprise/issues/2577))
- `[Fieldfilter]` Fixed an issue where fields were getting wrap to second line on iPhone SE. ([#1861](https://github.com/infor-design/enterprise/issues/1861))
- `[Fieldfilter]` Fixed an issue where Dropdown was not switching mode on example page. ([#2288](https://github.com/infor-design/enterprise/issues/2288))
- `[Field Options]` Fixed an issue where input example was not working. ([#2348](https://github.com/infor-design/enterprise/issues/2348))
- `[Homepages]` Fixed an issue where personalize and chart text colors were not working with hero. ([#2097](https://github.com/infor-design/enterprise/issues/2097))
- `[Images]` Fixed an issue where images were not tabbable or receiving a visual focus state. ([#2025](https://github.com/infor-design/enterprise/issues/2025))
- `[Listview]` Fixed a bug that caused the listview to run initialize too many times. ([#2179](https://github.com/infor-design/enterprise/issues/2179))
- `[Lookup]` Added `autocomplete="off"` to lookup input fields to prevent browser interference. ([#2366](https://github.com/infor-design/enterprise/issues/2366))
- `[Lookup]` Fixed a bug that caused a filter to reapply when reopening the modal. ([#2566](https://github.com/infor-design/enterprise/issues/2566))
- `[Lookup]` Fixed a bug that caused a selections to reapply when reopening the modal. ([#2568](https://github.com/infor-design/enterprise/issues/2568))
- `[Locale]` Fixed race condition when using initialize and loading locales with a parent locale. ([#2540](https://github.com/infor-design/enterprise/issues/2540))
- `[Lookup]` Fixed a double scrollbar when the modal needs to be scrolled. ([#2586](https://github.com/infor-design/enterprise/issues/2586))
- `[Modal]` Fixed an issue where the modal component would disappear if its content had a checkbox in it in RTL. ([#332](https://github.com/infor-design/enterprise-ng/issues/332))
- `[Modal]` Fixed an issue where tabbing was very slow on large DOMs in IE 11. ([#2607](https://github.com/infor-design/enterprise/issues/2607))
- `[Personalization]` Fixed an issue where the text color was too dark. Changed the text color to be more readable in high contrast mode. ([#2539](https://github.com/infor-design/enterprise/issues/2539))
- `[Personalization]` Updated some of the colors to more readable in contrast mode. ([#2097](https://github.com/infor-design/enterprise/issues/2097))
- `[Personalization]` Fixes an issue where text color was too dark. ([#2476](https://github.com/infor-design/enterprise/issues/2476))
- `[Pager]` Fixed an issue where click was not firing on any of the buttons with ie11. ([#2560](https://github.com/infor-design/enterprise/issues/2560))
- `[Pager]` Added a complete Popupmenu settings object for configuring the Page Size Selector Button, and deprecated the `attachPageSizeMenuToBody` setting in favor of `pageSizeMenuSettings.attachToBody`. ([#2356](https://github.com/infor-design/enterprise/issues/2356))
- `[Pager]` Fixed memory leak when using the `attachToBody` setting to change the menu's render location. ([#2482](https://github.com/infor-design/enterprise/issues/2482))
- `[Popdown]` Fixed usability issue where the Popdown could close prematurely when attempting to use inner components, such as Dropdowns. ([#2092](https://github.com/infor-design/enterprise/issues/2092))
- `[Popover]` Correctly align the popover close button. ([#1576](https://github.com/infor-design/enterprise/issues/1576))
- `[Popover]` Fixed an issue where buttons inside the popover would overflow at smaller screen sizes. ([#2271](https://github.com/infor-design/enterprise/issues/2271))
- `[Popupmenu]` Fixed an issue where js error was showing after removing a menu item. ([#414](https://github.com/infor-design/enterprise-ng/issues/414))
- `[Popupmenu]` Fixed a layout issue on disabled checkboxes in multiselect popupmenus. ([#2340](https://github.com/infor-design/enterprise/issues/2340))
- `[Popupmenu]` Fixed a bug on IOS that prevented menu scrolling. ([#645](https://github.com/infor-design/enterprise/issues/645))
- `[Popupmenu]` Fixed a bug on IOS that prevented some submenus from showing. ([#1928](https://github.com/infor-design/enterprise/issues/1928))
- `[Popupmenu]` Added a type-check during building/rebuilding of submenus that prevents an error when a submenu `<ul>` tag is not present. ([#2458](https://github.com/infor-design/enterprise/issues/2458))
- `[Scatter Plot]` Fixed the incorrect color on the tooltips. ([#1066](https://github.com/infor-design/enterprise/issues/1066))
- `[Stepprocess]` Fixed an issue where a newly enabled step is not shown. ([#2391](https://github.com/infor-design/enterprise/issues/2391))
- `[Searchfield]` Fixed an issue where the close icon on a searchfield is inoperable. ([#2578](https://github.com/infor-design/enterprise/issues/2578))
- `[Searchfield]` Fixed strange alignment of text/icons on the Uplift theme. ([#2612](https://github.com/infor-design/enterprise/issues/2612))
- `[Tabs]` Fixed the more tabs button to style as disabled when the tabs component is disabled. ([#2347](https://github.com/infor-design/enterprise/issues/2347))
- `[Tabs]` Added the select method inside the hide method to ensure proper focusing of the selected tab. ([#2346](https://github.com/infor-design/enterprise/issues/2346))
- `[Tabs]` Added an independent count for adding new tabs and their associated IDs to prevent duplication. ([#2345](https://github.com/infor-design/enterprise/issues/2345))
- `[Toolbar]` Fixed memory leaks. ([#2496](https://github.com/infor-design/enterprise/issues/2496))
- `[Toolbar]` Fixed an issue where `noSearchfieldReinvoke` was not being respected during the teardown method, causing lifecycle issues in Angular. ([#2691](https://github.com/infor-design/enterprise/issues/2691))
- `[Toolbar Flex]` Removed a 100% height on the toolbar which caused issues when nested in some situations. ([#474](https://github.com/infor-design/enterprise-ng/issues/474))
- `[Listview]` Fixed search to work when not using templates. ([#466](https://github.com/infor-design/enterprise-ng/issues/466))

### v4.20.0 Chores & Maintenance

- `[Build]` Add a file verification tool to the build process to ensure all necessary files are present. ([#2384](https://github.com/infor-design/enterprise/issues/2384))
- `[Demo App]` Add the uplift theme to the theme switcher menu. ([#2335](https://github.com/infor-design/enterprise/issues/2335))
- `[Demo App]` Fixed routing issues that could cause 500 errors or crash the Demoapp. ([#2343](https://github.com/infor-design/enterprise/issues/2343))
- `[Demo App]` Fixed an issue where the sorting was wrong on compressor data. ([#2390](https://github.com/infor-design/enterprise/issues/2390))

(95 Issues Solved this release, Backlog Enterprise 296, Backlog Ng 79, 852 Functional Tests, 865 e2e Test)

## v4.19.3

- `[Datagrid]` Fixes the multiselect filter on header from reloading during serverside filtering. ([#2383](https://github.com/infor-design/enterprise/issues/2383))
- `[Datagrid]` Fixed an issue where contextmenu was not opening with first click. ([#2398](https://github.com/infor-design/enterprise/issues/2398))
- `[Datagrid / Tooltip]` Fixed an error on some datagrid cells when tooltips are attached. ([#2403](https://github.com/infor-design/enterprise/issues/2403))

## v4.19.2

- `[Build]` Fixes missing minified files in the build and a missing svg-extended.html deprecated file for backwards compatibility. ([Teams](https://bit.ly/2FlzYCT))

## v4.19.0

### v4.19.0 Deprecations

- `[CSS]` The Soho light theme CSS file has been renamed from `light-theme.css` to `theme-soho-light.css` ([1972](https://github.com/infor-design/enterprise/issues/1972))
- `[CSS]` The Soho dark theme CSS file has been renamed from `dark-theme.css` to `theme-soho-dark.css` ([1972](https://github.com/infor-design/enterprise/issues/1972))
- `[CSS]` The Soho high-contrast theme CSS file has been renamed from `high-contrast-theme.css` to `theme-soho-contrast.css` ([1972](https://github.com/infor-design/enterprise/issues/1972))
- `[Datagrid]` The older savedColumns method has been deprecated since 4.10 and is now removed. Use saveUserSettings instead. ([#1766](https://github.com/infor-design/enterprise/issues/1766))

### v4.19.0 Features

- `[App Menu]` Improved style of personalized app menu. ([#2195](https://github.com/infor-design/enterprise/pull/2195))
- `[Column]` Added support to existing custom tooltip content in the callback setting. ([#1909](https://github.com/infor-design/enterprise/issues/1909))
- `[Contextual Action Panel]` Fixed an issue where the close button was misaligned. ([#1943](https://github.com/infor-design/enterprise/issues/1943))
- `[Datagrid]` Added support for disabling rows by data or a dynamic function, rows are disabled from selection and editing. ([#1614](https://github.com/infor-design/enterprise/issues/1614))
- `[Datagrid]` Fixes a column alignment issue when resizing and sorting columns that were originally set to percentage width. ([#1797](https://github.com/infor-design/enterprise/issues/1797))
- `[Datagrid]` Fixes a column alignment issue when there are duplicate column ids. ([#1797](https://github.com/infor-design/enterprise/issues/1797))
- `[Datagrid]` Fixes a column alignment by clearing a cache to help prevent column misalignment from randomly happening. ([#1797](https://github.com/infor-design/enterprise/issues/1797))
- `[Datagrid]` Fixes an issue that caused the active page to not restore correctly when saving user settings, . ([#1766](https://github.com/infor-design/enterprise/issues/1766))
- `[Datagrid]` Fixes an issue with dropdown filters when the ids are numbers. ([#1879](https://github.com/infor-design/enterprise/issues/1879))
- `[Datagrid]` Fixed alignment issues in the new uplift theme. ([#2212](https://github.com/infor-design/enterprise/issues/2212))
- `[Datagrid]` Fixes Datagrid time filtering for string type dates. ([#2281](https://github.com/infor-design/enterprise/issues/2281))
- `[Form Compact]` Adds support for Datepicker, Timepicker, Lookup, and File Uploader fields. ([#1955](https://github.com/infor-design/enterprise/issues/1955))
- `[Keyboard]` Added a new API that you can call at anytime to see what key is being pressed at the moment. ([#1906](https://github.com/infor-design/enterprise/issues/1906))
- `[Targeted/Completion Chart]` Added back the ability to inline svg icons and hyperlinks. ([#2152](https://github.com/infor-design/enterprise/issues/2152))
- `[Themes]` Added support for multiple themes in the demo app and renamed distribute Uplift (only) theme files. ([#1972](https://github.com/infor-design/enterprise/issues/1972))

### v4.19.0 Fixes

- `[App Menu]` Fixed an issue where the menu would not be entirely colored if short. ([#2062](https://github.com/infor-design/enterprise/issues/2062))
- `[App Menu]` Changed the scroll area to the outside when using a footer. ([#2062](https://github.com/infor-design/enterprise/issues/2062))
- `[App Menu]` Expandable area updates within application menu. ([#1982](https://github.com/infor-design/enterprise/pull/1982))
- `[App Menu]` Fixed an issue where role switcher was not clickable with long title. ([#2060](https://github.com/infor-design/enterprise/issues/2060))
- `[App Menu]` Fixed an issue where it was not possible to manually add a filter field that you can control on your own. Caveat to this is if you set filterable: false it will no longer remove the filter field from the DOM, if you do that you must now do it manually. ([#2066](https://github.com/infor-design/enterprise/issues/2066))
- `[App Menu]` Added support for mobile when dismissOnClickMobile setting is true to dismiss application menu when a role is selected. ([#2520](https://github.com/infor-design/enterprise/issues/2520))
- `[App Menu]` Fixed an issue with the logo which was positioned badly when scrolling. ([#2116](https://github.com/infor-design/enterprise/issues/2116))
- `[Calendar]` Fixed some bugs having a calendar month along or just a legend, fixed the clicking of upcoming days and added a dblclick even emitter. ([#2149](https://github.com/infor-design/enterprise/issues/2149))
- `[Colorpicker]` Fixed an issue where the colorpicker label is cut off in extra small input field. ([#2023](https://github.com/infor-design/enterprise/issues/2023))
- `[Colorpicker]` Fixed an issue where the colorpickers are not responsive at mobile screen sizes. ([#1995](https://github.com/infor-design/enterprise/issues/1995))
- `[Colorpicker]` Fixed an issue where the text is not visible on IE11 after choosing a color. ([#2134](https://github.com/infor-design/enterprise/issues/2134))
- `[Completion Chart]` Cleaned up excessive padding in some cases. ([#2171](https://github.com/infor-design/enterprise/issues/2171))
- `[Context Menu]` Fixes a bug where a left click on the originating field would not close a context menu opened with a right click. ([#1992](https://github.com/infor-design/enterprise/issues/1992))
- `[Contextual Action Panel]` Fixed an issue where the CAP title is too close to the edge at small screen sizes. ([#2249](https://github.com/infor-design/enterprise/issues/2249))
- `[Datagrid]` Fixed an issue where using the context menu with datagrid was not properly destroyed which being created multiple times. ([#392](https://github.com/infor-design/enterprise-ng/issues/392))
- `[Datagrid]` Fixed charts in columns not resizing correctly to short row height. ([#1930](https://github.com/infor-design/enterprise/issues/1930))
- `[Datagrid]` Fixed an issue for xss where console.log was not sanitizing and make grid to not render. ([#1941](https://github.com/infor-design/enterprise/issues/1941))
- `[Datagrid]` Fixed charts in columns not resizing correctly to short row height. ([#1930](https://github.com/infor-design/enterprise/issues/1930))
- `[Datagrid]` Fixed a layout issue on primary buttons in expandable rows. ([#1999](https://github.com/infor-design/enterprise/issues/1999))
- `[Datagrid]` Fixed a layout issue on short row grouped header buttons. ([#2005](https://github.com/infor-design/enterprise/issues/2005))
- `[Datagrid]` Fixed an issue where disabled button color for contextual toolbar was not applying. ([#2150](https://github.com/infor-design/enterprise/issues/2150))
- `[Datagrid]` Fixed an issue for xss where console.log was not sanitizing and make grid to not render. ([#1941](https://github.com/infor-design/enterprise/issues/1941))
- `[Datagrid]` Added an onBeforeSelect call back that you can return false from to disable row selection. ([#1906](https://github.com/infor-design/enterprise/issues/1906))
- `[Datagrid]` Fixed an issue where header checkbox was not sync after removing selected rows. ([#2226](https://github.com/infor-design/enterprise/issues/2226))
- `[Datagrid]` Fixed an issue where custom filter conditions were not setting up filter button. ([#2234](https://github.com/infor-design/enterprise/issues/2234))
- `[Datagrid]` Fixed an issue where pager was not updating while removing rows. ([#1985](https://github.com/infor-design/enterprise/issues/1985))
- `[Datagrid]` Adds a function to add a visual dirty indictaor and a new function to get all modified rows. Modified means either dirty, in-progress or in error. Existing API's are not touched. ([#2091](https://github.com/infor-design/enterprise/issues/2091))
- `[Datagrid]` Fixes an error when saving columns if you have a lookup column. ([#2279](https://github.com/infor-design/enterprise/issues/2279))
- `[Datagrid]` Fixed a bug with column reset not working sometimes. ([#1921](https://github.com/infor-design/enterprise/issues/1921))
- `[Datagrid]` Fixed grouped headers not sorting when selectable is multiselect. ([#2251](https://github.com/infor-design/enterprise/issues/2251))
- `[Datagrid]` Fixed a bug where the sort indicator disappeared when changing pages. ([#2228](https://github.com/infor-design/enterprise/issues/2228))
- `[Datagrid]` Fixed rendering on modals with single columns. ([#1923](https://github.com/infor-design/enterprise/issues/1923))
- `[Datagrid]` Fixed double firing of popupmenu events. ([#2140](https://github.com/infor-design/enterprise/issues/2140))
- `[Datagrid]` Fixed incorrect pattern in filterConditions. ([#2159](https://github.com/infor-design/enterprise/issues/2159))
- `[Datepicker]` Fixed an issue loading on IE 11. ([#2183](https://github.com/infor-design/enterprise-ng/issues/2183))
- `[Dropdown]` Fixed the dropdown appearing misaligned at smaller screen sizes. ([#2248](https://github.com/infor-design/enterprise/issues/2248))
- `[Editor]` Fixed an issue where button state for toolbar buttons were wrong when clicked one after another. ([#391](https://github.com/infor-design/enterprise/issues/391))
- `[Hierarchy]` Fixed a bug where the hierarchy will only partially load with two instances on a page. ([#2205](https://github.com/infor-design/enterprise/issues/2205))
- `[Field Options]` Fixed an issue where field options were misaligning, especially spin box was focusing outside of the field. ([#1862](https://github.com/infor-design/enterprise/issues/1862))
- `[Field Options]` Fixed a border alignment issue. ([#2107](https://github.com/infor-design/enterprise/issues/2107))
- `[Fileuploader]` Fixed an issue where the fileuploader icon and close icon were misplaced and not visible in RTL after uploading a file. ([#2098](https://github.com/infor-design/enterprise/issues/2098))
- `[Fileuploader]` Fixed an issue where backspace in IE11 caused the browser to go back instead of removing the uploaded file from the input. ([#2184](https://github.com/infor-design/enterprise/issues/2184))
- `[Input]` Improved alignment of icons in the uplift theme input components. ([#2072](https://github.com/infor-design/enterprise/issues/2072))
- `[Listview]` Improved accessibility when configured as selectable (all types), as well as re-enabled accessibility e2e tests. ([#403](https://github.com/infor-design/enterprise/issues/403))
- `[Locale]` Synced up date and time patterns with the CLDR several time patterns in particular were corrected. ([#2022](https://github.com/infor-design/enterprise/issues/2022))
- `[Locale]` Fixed an issue loading duplicate locales such as en-GB where the strings are copies, before you might get undefined strings. ([#2216](https://github.com/infor-design/enterprise/issues/2216))
- `[Locale]` Added support for es-419 locale. ([#2204](https://github.com/infor-design/enterprise/issues/2204))
- `[Locale]` Restored functionality for dynamically changing fonts for some languages. ([#2144](https://github.com/infor-design/enterprise/issues/2144))
- `[Modal]` Fixed a demoapp issue where the select all checkbox wasn't selecting all. ([2225](https://github.com/infor-design/enterprise/issues/2225))
- `[Monthview]` Fixed an issue where the previous and next buttons were not correctly reversed in right-to-left mode. ([1910](https://github.com/infor-design/enterprise/issues/1910))
- `[Personalization]` Changed the default turquoise personalization to a darker one. ([#2063](https://github.com/infor-design/enterprise/issues/2063))
- `[Personalization]` Changed the default turquoise personalization to a darker one. ([#2063](https://github.com/infor-design/enterprise/issues/2063))
- `[Personalization]` Added a default option to the personalization color pickers. ([#2063](https://github.com/infor-design/enterprise/issues/2063))
- `[Personalization]` Added more classes and examples for the personalization colors so that you can personalize certain form elements. ([#2120](https://github.com/infor-design/enterprise/issues/2120))
- `[Personalization]` Added several form examples with buttons and completion chart that can be personalized. ([#1963](https://github.com/infor-design/enterprise/issues/1963))
- `[Personalization]` Added an example of normal tabs behaving like header tabs in a personalized area. ([#1962](https://github.com/infor-design/enterprise/issues/1962))
- `[Personalization]` Added completion chart and alerts to the list of header items that will work when personalized. ([#2171](https://github.com/infor-design/enterprise/issues/2171))
- `[Personalization]` Fixed a bug where the overlay would not disappear when manually loading stylesheets. ([#2258](https://github.com/infor-design/enterprise/issues/2258))
- `[Popupmenu]` Fixed an issue where disabled submenus were opening on mouseover. ([#1863](https://github.com/infor-design/enterprise/issues/1863))
- `[Radios]` Fixed an issue where in `RTL` the radio seems visually separate from it's label. ([#2096](https://github.com/infor-design/enterprise/issues/2096))
- `[Summary Form]` Updated to improve readability. ([#1765](https://github.com/infor-design/enterprise/issues/1765))
- `[Targeted Achievement]` Updated to work in uplift theme. ([#2220](https://github.com/infor-design/enterprise/issues/2220))
- `[Timepicker]` Fixed an issue where AM/PM dropdown tooltip was displaying on android devices. ([#1446](https://github.com/infor-design/enterprise/issues/1446))
- `[Timepicker]` Fixed an issue where dropdown popup was out of position on android devices. ([#2021](https://github.com/infor-design/enterprise/issues/2021))
- `[Timepicker]` Updated the Swedish translation for Set Time. ([#2153](https://github.com/infor-design/enterprise/issues/2153))
- `[Tree]` Fixed an issue where children property null was breaking tree to not render. ([#1908](https://github.com/infor-design/enterprise/issues/1908))

### v4.19.0 Chores & Maintenance

- `[General]` Updated to jquery 3.4.1 to fix a jquery bug seen occasionally. ([#2109](https://github.com/infor-design/enterprise/issues/2109))
- `[General]` Fixed relative links in several markdown files.
- `[Demo App]` Fixed CSP and handling of image paths for better support of images in examples on IDS demo sites (demo.design.infor.com). ([#1888](https://github.com/infor-design/enterprise/issues/1888))
- `[Personalize]` Separated personalization styles into standalone file for improved maintainability. ([#2127](https://github.com/infor-design/enterprise/issues/2127))

(84 Issues Solved this release, Backlog Enterprise 311, Backlog Ng 79, 839 Functional Tests, 876 e2e Test)

## v4.18.2

### v4.18.2 Fixes

- `[Autocomplete]` Fixed an XSS injection issue. ([#502](https://github.com/infor-design/enterprise-ng/issues/502)).
- `[Dropdown]` Fixed an XSS injection issue. ([#503](https://github.com/infor-design/enterprise-ng/issues/503)).

## v4.18.1

### v4.18.1 Fixes

- `[Input]` Added backwards-compatibility for previous accessibility changes to labels. ([#2118](https://github.com/infor-design/enterprise/issues/2118)). Additional information can be found in the [Form Component documentation](https://github.com/infor-design/enterprise/blob/4.18.x/src/components/form/readme.md#field-labels).

## v4.18.0

### v4.18.0 Features

- `[App Menu]` Added support for personalization by adding the `is-personalizable` class the menu will now change colors along with headers ([#1847](https://github.com/infor-design/enterprise/issues/1847))
- `[App Menu]` Added a special role switcher dropdown to change the menu role. ([#1935](https://github.com/infor-design/enterprise/issues/1935))
- `[Personalize]` Added classes for the personalization colors so that you can personalize certain form elements. ([#1847](https://github.com/infor-design/enterprise/issues/1847))
- `[Expandable Area]` Added example of a standalone button the toggles a form area. ([#1935](https://github.com/infor-design/enterprise/issues/1935))
- `[Datagrid]` Added support so if there are multiple inputs within an editor they work with the keyboard tab key. ([#355](https://github.com/infor-design/enterprise-ng/issues/355))
- `[Datagrid]` Fixed an error on IE when doing an excel export. ([#2018](https://github.com/infor-design/enterprise/issues/2018))
- `[Editor]` Added a JS setting and CSS styles to support usage of a Flex Toolbar ([#1120](https://github.com/infor-design/enterprise/issues/1120))
- `[Header]` Added a JS setting and CSS styles to support usage of a Flex Toolbar ([#1120](https://github.com/infor-design/enterprise/issues/1120))
- `[Mask]` Added a setting for passing a locale string, allowing Number masks to be localized.  This enables usage of the `groupSize` property, among others, from locale data in the Mask. ([#440](https://github.com/infor-design/enterprise/issues/440))
- `[Masthead]` Added CSS styles to support usage of a Flex Toolbar ([#1120](https://github.com/infor-design/enterprise/issues/1120))
- `[Notification]` Added example of a Widget/Card with notification and add code to truncate the text (via ellipsis) if it is lengthy. ([#1881](https://github.com/infor-design/enterprise/issues/1881))
- `[Theme/Colors]` Added new component for getting theme and color information. This is used throughout the code. There was a hidden property `Soho.theme`, if you used this in some way you should now use `Soho.theme.currentTheme`. ([#1866](https://github.com/infor-design/enterprise/issues/1866))

### v4.18.0 Fixes

- `[App Menu]` Fixed some accessibility issues on the nav menu. ([#1721](https://github.com/infor-design/enterprise/issues/1721))
- `[Busy Indicator]` Fixed a bug that causes a javascript error when the busy indicator is used on the body tag. ([#1918](https://github.com/infor-design/enterprise/issues/1918))
- `[Css/Sass]` Fixed an issue where the High Contrast theme and Uplift theme were not using the right tokens. ([#1897](https://github.com/infor-design/enterprise/pull/1897))
- `[Colors]` Fixed the color palette demo page to showcase the correct hex values based on the current theme ([#1801](https://github.com/infor-design/enterprise/issues/1801))
- `[Contextual Action Panel]` Fixed an issue where cap modal would only open the first time. ([#1993](https://github.com/infor-design/enterprise/issues/1993))
- `[Datepicker]` Fixed an issue in NG where the custom validation is removed during the teardown of a datepicker.([NG #411](https://github.com/infor-design/enterprise-ng/issues/411))
- `[Datagrid]` Fixed an issue where lookup filterConditions were not rendering. ([#1873](https://github.com/infor-design/enterprise/issues/1873))
- `[Datagrid]` Fixed an issue where when using filtering and server side paging the filter operations would cause two ajax requests. ([#2069](https://github.com/infor-design/enterprise/issues/2069))
- `[Datagrid]` Fixed issue where header columns are misaligned with body columns on load. ([#1892](https://github.com/infor-design/enterprise/issues/1892))
- `[Datagrid]` Fixed an issue where filtering was missing translation. ([#1900](https://github.com/infor-design/enterprise/issues/1900))
- `[Datagrid]` Fixed an issue with the checkbox formatter where string based 1 or 0 would not work as a dataset source. ([#1948](https://github.com/infor-design/enterprise/issues/1948))
- `[Datagrid]` Fixed a bug where text would be misaligned when repeatedly toggling the filter row. ([#1969](https://github.com/infor-design/enterprise/issues/1969))
- `[Datagrid]` Added an example of expandOnActivate on a customer editor. ([#353](https://github.com/infor-design/enterprise-ng/issues/353))
- `[Datagrid]` Added ability to pass a function to the tooltip option for custom formatting. ([#354](https://github.com/infor-design/enterprise-ng/issues/354))
- `[Datagrid]` Fixed `aria-checked` not toggling correctly on selection of multiselect checkbox. ([#1961](https://github.com/infor-design/enterprise/issues/1961))
- `[Datagrid]` Fixed incorrectly exported CSV/Excel data. ([#2001](https://github.com/infor-design/enterprise/issues/2001))
- `[Dropdown]` Changed the way dropdowns work with screen readers to be a collapsible listbox.([#404](https://github.com/infor-design/enterprise/issues/404))
- `[Dropdown]` Fixed an issue where multiselect dropdown unchecking "Select All" was not getting clear after close list with Safari browser.([#1882](https://github.com/infor-design/enterprise/issues/1882))
- `[Dropdown]` Added an example of a color dropdown showing palette colors as icons.([#2013](https://github.com/infor-design/enterprise/issues/2013))
- `[Datagrid]` Fixed a misalignment of the close icon on mobile. ([#2018](https://github.com/infor-design/enterprise/issues/2018))
- `[List/Detail]` Removed some legacy CSS code that was causing text inside of inline Toolbar Searchfields to become transparent. ([#2075](https://github.com/infor-design/enterprise/issues/2075))
- `[Listbuilder]` Fixed an issue where the text was not sanitizing. ([#1692](https://github.com/infor-design/enterprise/issues/1692))
- `[Lookup]` Fixed an issue where the tooltip was using audible text in the code block component. ([#354](https://github.com/infor-design/enterprise-ng/issues/354))
- `[Locale]` Fixed trailing zeros were getting ignored when displaying thousands values. ([#404](https://github.com/infor-design/enterprise/issues/1840))
- `[MenuButton]` Improved the way menu buttons work with screen readers.([#404](https://github.com/infor-design/enterprise/issues/404))
- `[Message]` Added an audible announce of the message type.([#964](https://github.com/infor-design/enterprise/issues/964))
- `[Message]` Change audible announce of message type added in #964 to an option that is strictly audible.([#2120](https://github.com/infor-design/enterprise/issues/2120))
- `[Modal]` Changed text and button font colors to pass accessibility checks.([#964](https://github.com/infor-design/enterprise/issues/964))
- `[Multiselect]` Fixed an issue where previous selection was still selected after clear all by "Select All" option. ([#2003](https://github.com/infor-design/enterprise/issues/2003))
- `[Notifications]` Fixed a few issues with notification background colors by using the corresponding ids-identity token for each. ([1857](https://github.com/infor-design/enterprise/issues/1857), [1865](https://github.com/infor-design/enterprise/issues/1865))
- `[Notifications]` Fixed an issue where you couldn't click the close icon in Firefox. ([1573](https://github.com/infor-design/enterprise/issues/1573))
- `[Radios]` Fixed the last radio item was being selected when clicking on the first when displayed horizontal. ([#1878](https://github.com/infor-design/enterprise/issues/1878))
- `[Signin]` Fixed accessibility issues. ([#421](https://github.com/infor-design/enterprise/issues/421))
- `[Skiplink]` Fixed a z-index issue on skip links over the nav menu. ([#1721](https://github.com/infor-design/enterprise/issues/1721))
- `[Slider]` Changed the demo so the tooltip will hide when resizing the page. ([#2033](https://github.com/infor-design/enterprise/issues/2033))
- `[Stepprocess]` Fixed rtl style issues. ([#413](https://github.com/infor-design/enterprise/issues/413))
- `[Swaplist]` Fixed disabled styling on swap header buttons. ([#2019](https://github.com/infor-design/enterprise/issues/2019))
- `[Tabs]` Fixed an issue where focus was changed after enable/disable tabs. ([#1934](https://github.com/infor-design/enterprise/issues/1934))
- `[Tabs-Module]` Fixed an issue where the close icon was outside the searchfield. ([#1704](https://github.com/infor-design/enterprise/issues/1704))
- `[Toolbar]` Fixed issues when tooltip shows on hover of toolbar ([#1622](https://github.com/infor-design/enterprise/issues/1622))
- `[Validation]` Fixed an issue where the isAlert settings set to true, the border color, control text color, control icon color was displaying the color for the alert rather than displaying the default color. ([#1922](https://github.com/infor-design/enterprise/issues/1922))

### v4.18.0 Chore & Maintenance

- `[Buttons]` Updated button disabled states with corresponding ids-identity tokens. ([1914](https://github.com/infor-design/enterprise/issues/1914)
- `[Docs]` Added a statement on supporting accessibility. ([#1540](https://github.com/infor-design/enterprise/issues/1540))
- `[Docs]` Added the supported screen readers and some notes on accessibility. ([#1722](https://github.com/infor-design/enterprise/issues/1722))

(50 Issues Solved this release, Backlog Enterprise 294, Backlog Ng 80, 809 Functional Tests, 803 e2e Test)

## v4.17.1

### v4.17.1 Fixes

- `[Datagrid]` Fixed an issue where the second to last column was having resize issues with frozen column sets.(<https://github.com/infor-design/enterprise/issues/1890>)
- `[Datagrid]` Re-align icons and items in the datagrid's "short header" configuration.(<https://github.com/infor-design/enterprise/issues/1880>)
- `[Locale]` Fixed incorrect "groupsize" for `en-US` locale.(<https://github.com/infor-design/enterprise/issues/1907>)

### v4.17.1 Chores & Maintenance

- `[Demoapp]` Fixed embedded icons example with missing icons.(<https://github.com/infor-design/enterprise/issues/1889>)
- `[Demoapp]` Fixed notification demo examples.(<https://github.com/infor-design/enterprise/issues/1893>, <https://github.com/infor-design/enterprise/pull/1896>)

(5 Issues Solved this patch release)

## v4.17.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.17.0 Future Deprecation

- `[Mask]` Using legacy mask options is now deprecated (was starting 4.3.2) and we will remove this in approximately 6 months from the code base. This means using the `data-mask` option and the `mode` as well as legacy patterns in favor of the newer settings and regexes. ([#439](https://github.com/infor-design/enterprise/issues/439))

### v4.17.0 Features

- `[Datagrid]` Added support for ellipsis to header text. ([#842](https://github.com/infor-design/enterprise/issues/842))
- `[Datagrid]` Added support to cancel `rowactivated` event. Now it will trigger the new event `beforerowactivated` which will wait/sync to cancel or proceed to do `rowactivated` event. ([#1021](https://github.com/infor-design/enterprise/issues/1021))
- `[Datagrid]` Added option to align grouped headers text. ([#1714](https://github.com/infor-design/enterprise/issues/1714))
- `[Datagrid]` Tabbing through a new row moves focus to next line for a lookup column. ([#1822](https://github.com/infor-design/enterprise/issues/1822))
- `[Datagrid]` Validation tooltip does not wrap words correctly across multiple lines. ([#1829](https://github.com/infor-design/enterprise/issues/1829))
- `[Dropdown]` Added support to make dropdown readonly fields optionally not tab-able. ([#1591](https://github.com/infor-design/enterprise/issues/1591))
- `[Form Compact]` Implemented design for field-heavy forms. This design is experimental, likely not production ready, and subject to change without notice. ([#1699](https://github.com/infor-design/enterprise/issues/1699))
- `[Hierarchy]` Changed the newer stacked layout to support mutiple root elements. ([#1677](https://github.com/infor-design/enterprise/issues/1677))
- `[Locale]` Added support for passing in `locale` or `language` to the `parse` and `format` and `translation` functions so they will work without changing the current locale or language. ([#462](https://github.com/infor-design/enterprise/issues/462))
- `[Locale]` Added support for setting a specific group size other than the ones in the locale. This includes using no group size. ([#462](https://github.com/infor-design/enterprise/issues/462))
- `[Locale]` Added support for showing timezones in the current language with a fall back for IE 11. ([#592](https://github.com/infor-design/enterprise/issues/592))
- `[Locale]` Added support for different group sizes. This was previously not working correctly for locales like hi-IN (using 3, 2 group sizes) and en-US (using 3, 0 group sizes). We will later make this work on masks on a separate issue. ([#441](https://github.com/infor-design/enterprise/issues/441))
- `[Locale]` Its now possible to add new locales in by adding them to the `defaultLocales` and `supportedLocales` sets. ([#402](https://github.com/infor-design/enterprise/issues/402))
- `[Locale]` Added an example to show extending locales with new strings and an api method to make it easier. because of the way this is split, if your directly adding to `Locale.cultures` you will need to adjust your code to extend from `Locale.languages` instead. ([#402](https://github.com/infor-design/enterprise/issues/402))
- `[Locale]` Added support for having a different language and locale. This is done by calling the new `setLanguage` function. ([#1552](https://github.com/infor-design/enterprise/issues//1552))
- `[Locale / Mask]` Added limited initial support for some unicode languages. This means you can convert to and from numbers typed in Devangari, Arabic, and Chinese (Financial and Simplified). ([#439](https://github.com/infor-design/enterprise/issues/439))
- `[Locale]` Added support for passing a `locale` other the the current locale to calendar, monthview, datepicker and timepicker. ([#462](https://github.com/infor-design/enterprise/issues/462))
- `[Mask]` It is now possible to type numbers in unicode such as Devangari, Arabic, and Chinese (Financial and Simplified) into the the masks that involve numbers. ([#439](https://github.com/infor-design/enterprise/issues/439))
- `[Modal]` Added an option to dictate the maximum width of the modal. ([#1802](https://github.com/infor-design/enterprise/issues/1802))
- `[Icons]` Add support for creating an svg file for the Uplift theme's (alpha) new icons from ids-identity@2.4.0 assets. ([#1759](https://github.com/infor-design/enterprise/issues/1759))
- `[Radar]` Added support to three label sizes (name, abbrName, shortName). ([#1553](https://github.com/infor-design/enterprise/issues/1553))

### v4.17.0 Fixes

- `[Accordion]` Fixed a bug where some truncated text elements were not generating a tooltip. ([#1736](https://github.com/infor-design/enterprise/issues/1736))
- `[Builder]` Cropped Header for Builder Panel When Text is Long. ([#1814](https://github.com/infor-design/enterprise/issues/1814))
- `[Calendar]` Event model title color is not correct if the modal is opened and another event is selected. ([#1739](https://github.com/infor-design/enterprise/issues/1739))
- `[Calendar]` Modal is still displayed after changing months. ([#1741](https://github.com/infor-design/enterprise/issues/1741))
- `[Calendar]` Changing some event spans is causing missing dates on the dialogs. ([#1708](https://github.com/infor-design/enterprise/issues/1708))
- `[Composite Form]` Fix a bug in IE11 where composite form content overflows to the lower container. ([#1768](https://github.com/infor-design/enterprise/issues/1768))
- `[Datagrid]` Added a fix where the column is next to the edge of the browser and the filter dropdown popup overflow the page.([#1604](https://github.com/infor-design/enterprise/issues/1604))
- `[Datagrid]` Added a fix to allow the commit of a cell edit after tabbing into a cell once having clicked into a previous cell.([#1608](https://github.com/infor-design/enterprise/issues/1608))
- `[Datagrid]` Stretch column not working in Edge browser. ([#1716](https://github.com/infor-design/enterprise/issues/1716))
- `[Datagrid]` Fixed a bug where the source callback was not called when filtering. ([#1688](https://github.com/infor-design/enterprise/issues/1688))
- `[Datagrid]` Fixed a bug where filtering Order Date with `is-not-empty` on a null value would not correctly filter out results. ([#1718](https://github.com/infor-design/enterprise/issues/1718))
- `[Datagrid]` Fixed a bug where when using the `disableClientSideFilter` setting the filtered event would not be called correctly. ([#1689](https://github.com/infor-design/enterprise/issues/1689))
- `[Datagrid]` Fixed a bug where hidden columns inside a colspan were aligning incorrectly. ([#1764](https://github.com/infor-design/enterprise/issues/1764))
- `[Dropdown]` Fixed a layout error on non inline fields with errors. ([#1770](https://github.com/infor-design/enterprise/issues/1770))
- `[Dropdown]` Fixed a bug where the dropdown did not close when tabbing if using the `noSearch` setting. ([#1731](https://github.com/infor-design/enterprise/issues/1731))
- `[Modal]` Fixed a bug where the modal can overflow the page. ([#1802](https://github.com/infor-design/enterprise/issues/1802))
- `[Radio Button]` Fixed a rendering problem on the selected state of Radio Buttons used inside of Accordion components. ([#1568](https://github.com/infor-design/enterprise/issues/1568))
- `[Radio Button]` Fixed a z-index issue that was causing radio buttons to sometimes display over top of page sections where they should have instead scrolled beneath. ([#1014](https://github.com/infor-design/enterprise/issues/1014))

### v4.17.0 Chore & Maintenance

- `[Css/Sass]` Replaced font-size numerical declarations with their ids-identity token counterpart. ([#1640](https://github.com/infor-design/enterprise/issues/1640))
- `[Demoapp]` Removed query parameter for changing fonts. ([#1747](https://github.com/infor-design/enterprise/issues/1747))
- `[Build]` Added a process to notify developers that things are being deprecated or going away. Documented the current deprecations in this system and made [notes for developers](https://github.com/infor-design/enterprise/blob/master/docs/CODING-STANDARDS.md#deprecations). ([#1747](https://github.com/infor-design/enterprise/issues/1747))

(30 Issues Solved this release, Backlog Enterprise 224, Backlog Ng 59, 785 Functional Tests, 793 e2e Test)

## v4.16.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.16.0 Features

- `[Busy Indicator]` Made a fix to make it possible to use a busy indicator on a modals. ([#827](https://github.com/infor-design/enterprise/issues/827))
- `[Datagrid]` Added an option to freeze columns from scrolling on the left and/or right. The new option is called `frozenColumns`. See notes on what works and doesnt with frozen column in the datagrid docs frozen column section. ([#464](https://github.com/infor-design/enterprise/issues/464))
- `[Editor]` Added new state called "preview" a non editable mode to editor. Where it only shows the HTML with no toolbar, borders etc. ([#1413](https://github.com/infor-design/enterprise/issues/1413))
- `[Field Filter]` Added support to get and set filter type programmatically. ([#1181](https://github.com/infor-design/enterprise/issues/1181))
- `[Hierarchy]` Add print media styles to decrease ink usage and increase presentability for print format. Note that you may need to enable the setting to print background images, both Mac and PC have a setting for this. ([#456](https://github.com/infor-design/enterprise/issues/456))
- `[Hierarchy]` Added a new "stacked" layout to eventually replace the current layouts. This works better responsively and prevents horizontal scrolling. ([#1629](https://github.com/infor-design/enterprise/issues/1629))
- `[Pager]` Added a "condensed" page size selector button for use on pagers in smaller containers, such as the list side of the list/detail pattern. ([#1459](https://github.com/infor-design/enterprise/issues/1459))

### v4.16.0 Future Deprecation

- `[Hierarchy]` The following options are now deprecated and will be removed approximately 2019-05-15. `paging` and `mobileView`. ([#1629](https://github.com/infor-design/enterprise/issues/1629))
- `[Hierarchy]` Stacked layout will become the default layout in favor of the existing horizontal layout, so the horizontal layout is now considered deprecated and will be removed approximately 2019-05-15. ([#1629](https://github.com/infor-design/enterprise/issues/1629))

### v4.16.0 Fixes

- `[Application Menu]` Fixed the truncation of long text in an accordion element in the application menu by adding a tooltip to truncated elements. ([#457](https://github.com/infor-design/enterprise/issues/457))
- `[Calendar]` Disable the new event modal when no template is defined. ([#1700](https://github.com/infor-design/enterprise/issues/1700))
- `[Dropdown]` Fixed a bug where the ellipsis was not showing on long text in some browsers. ([#1550](https://github.com/infor-design/enterprise/issues/1550))
- `[Datagrid]` Fixed a bug in equals filter on multiselect filters. ([#1586](https://github.com/infor-design/enterprise/issues/1586))
- `[Datagrid]` Fixed a bug where incorrect data is shown in the events in tree grid. ([#315](https://github.com/infor-design/enterprise-ng/issues/315))
- `[Datagrid]` Fixed a bug where when using minWidth on a column and sorting the column will become misaligned. ([#1481](https://github.com/infor-design/enterprise/issues/1481))
- `[Datagrid]` Fixed a bug where when resizing the last column may become invisible. ([#1456](https://github.com/infor-design/enterprise/issues/1456))
- `[Datagrid]` Fixed a bug where a checkbox column will become checked when selecting if there is no selection checkbox. ([#1641](https://github.com/infor-design/enterprise/issues/1641))
- `[Datagrid]` Fixed a bug where the last column would sometimes not render fully for buttons with longer text. ([#1246](https://github.com/infor-design/enterprise/issues/1246))
- `[Datagrid]` Fixed a bug where showMonthYearPicker did not work correctly on date filters. ([#1532](https://github.com/infor-design/enterprise-ng/issues/1532))
- `[Validation]` Fixed a bug in removeError where the icon is sometimes not removed. ([#1556](https://github.com/infor-design/enterprise/issues/1556))
- `[Datepicker]` Fixed the range picker to clear when changing months in a filter. ([#1537](https://github.com/infor-design/enterprise/issues/1537))
- `[Datepicker]` Fixed disabled dates example to validate again on disabled dates. ([#1445](https://github.com/infor-design/enterprise/issues/1445))
- `[Datagrid]` Fixed a Date Editor bug when passing a series of zeroes to a datagrid cell with an editable date. ([#1020](https://github.com/infor-design/enterprise/issues/1020))
- `[Dropdown]` Fixed a bug where a dropdown will never reopen if it is closed by clicking a menu button. ([#1670](https://github.com/infor-design/enterprise/issues/1670))
- `[Icons]` Established missing icon sourcing and sizing consistency from ids-identity icon/svg assets. ([PR#1628](https://github.com/infor-design/enterprise/pull/1628))
- `[Listview]` Addressed performance issues with paging on all platforms, especially Windows and IE/Edge browsers. As part of this, reworked all components that integrate with the Pager component to render their contents based on a dataset, as opposed to DOM elements. ([#922](https://github.com/infor-design/enterprise/issues/922))
- `[Lookup]` Fixed a bug with settings: async, server-side, and single select modes.  The grid was not deselecting the previously selected value when a new row was clicked.  If the value is preselected in the markup, the lookup modal will no longer close prematurely. ([PR#1654](https://github.com/infor-design/enterprise/issues/1654))
- `[Pager]` Made it possible to set and persist custom tooltips on first, previous, next and last pager buttons. ([#922](https://github.com/infor-design/enterprise/issues/922))
- `[Pager]` Fixed propagation of the `pagesizes` setting when using `updated()`. Previously the array was deep extended instead of being replaced outright. ([#1466](https://github.com/infor-design/enterprise/issues/1466))
- `[Tree]` Fixed a bug when calling the disable or enable methods of the tree. This was not working with ie11. ([PR#1600](https://github.com/infor-design/enterprise/issues/1600))
- `[Stepprocess]` Fixed a bug where the step folder was still selected when it was collapsed or expanded. ([#1633](https://github.com/infor-design/enterprise/issues/1633))
- `[Swaplist]` Fixed a bug where items were not able to drag anymore after make the search. ([#1703](https://github.com/infor-design/enterprise/issues/1703))
- `[Toolbar Flex]` Added the ability to pass in a `beforeOpen` callback to the More Actions menu (fixes a bug where it wasn't possible to dynamically add content to the More Actions menu in same way that was possible on the original Toolbar component)
- `[Toolbar Flex]` Fixed a bug where selected events were not bubbling up for a menu button on a flex toolbar. ([#1709](https://github.com/infor-design/enterprise/issues/1709))
- `[Stepprocess]` Disabled step selected when using the next or previous button. ([#1697](https://github.com/infor-design/enterprise/issues/1697))
- `[Tree]` Fixed a bug when calling the disable or enable methods of the tree. This was not working with ie11. ([PR#1600](https://github.com/infor-design/enterprise/issues/1600))

### v4.16.0 Chore & Maintenance

- `[Demo App]` Removed the search icon from the header on test pages as it doesn't function. ([#1449](https://github.com/infor-design/enterprise/issues/1449))
- `[Demo App]` Added a fix for incorrect links when running on windows. ([#1549](https://github.com/infor-design/enterprise/issues/1549))
- `[Docs]` Added a fix to prevent the documentation generator from failing intermittently. ([#1377](https://github.com/infor-design/enterprise/issues/1377))

(29 Issues Solved this release, Backlog Enterprise 203, Backlog Ng 69, 735 Functional Tests, 670 e2e Test)

## v4.15.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.15.0 Features

- `[Datagrid]` Added support for lookup in the datagrid filter. ([#653](https://github.com/infor-design/enterprise/issues/653))
- `[Datagrid]` Added support for masks on lookup editors. ([#406](https://github.com/infor-design/enterprise/issues/406))
- `[Validation]` When using legacy mode validation, made the icon dim if the text was on top of it. ([#644](https://github.com/infor-design/enterprise/issues/644))
- `[Calendar]` Now possible to edit events both with the API and by clicking/double clicking events. And other improvements. ([#1436](https://github.com/infor-design/enterprise/issues/1436))
- `[Datagrid]` Added new methods to clear dirty cells on cells, rows, and all. ([#1303](https://github.com/infor-design/enterprise/issues/1303))
- `[Tree]` Added several improvements: the ability to show a dropdown on the tree node, the ability to add nodes in between current nodes, the ability to set checkboxes for selection only on some nodes, and the ability to customize icons. ([#1364](https://github.com/infor-design/enterprise/issues/1364))
- `[Datagrid]` Added the ability to display or hide the new row indicator with a new `showNewIndicator` option. ([#1589](https://github.com/infor-design/enterprise/issues/1589))

### v4.15.0 Fixes

- `[Icons]` Icons with the word `confirm` have been changed to `success`. This is partially backwards compatible for now. We deprecated `confirm` and will remove in the next major version so rename your icons. Example `icon-confirm` to `icon-success`. ([#963](https://github.com/infor-design/enterprise/issues/963))
- `[Icons]` The alert icons now have a white background allowing them to appear on colored sections. There are now two versions, for example: `icon-error` and `icon-error-solid`. These are used in calendar. ([#1436](https://github.com/infor-design/enterprise/issues/1436))
- `[Circle Pager]` Made significant improvements to resizing, especially on tabs. ([#1284](https://github.com/infor-design/enterprise/issues/1284))
- `[Datagrid]` In high contrast mode the background is now white when editing cells. ([#1421](https://github.com/infor-design/enterprise/issues/1421))
- `[Dropdown]` Fixed an issue where filter did not work in no-search mode with the Caps Lock key. ([#1500](https://github.com/infor-design/enterprise/issues/1500))
- `[Popupmenu]` Fixed an issue when using the same menu on multiple inputs wherein destroying one instance actually destroyed all instances. ([#1025](https://github.com/infor-design/enterprise/issues/1025))
- `[Swaplist]` Fixed a bug where Shift+M did not work when typing in the search. ([#1408](https://github.com/infor-design/enterprise/issues/1408))
- `[Popupmenu]` Fixed a bug in immediate mode where right click only worked the first time. ([#1507](https://github.com/infor-design/enterprise/issues/1507))
- `[Editor]` Fixed a bug where clear formatting did not work in safari. ([#911](https://github.com/infor-design/enterprise/issues/911))
- `[Colorpicker]` Fixed a bug in Angular where the picker did not respond correctly to `editable=false` and `disabled=true`. ([#257](https://github.com/infor-design/enterprise-ng/issues/257))
- `[Locale]` Fixed a bug where the callback did not complete on nonexistent locales. ([#1267](https://github.com/infor-design/enterprise/issues/1267))
- `[Calendar]` Fixed a bug where event details remain when filtering event types. ([#1436](https://github.com/infor-design/enterprise/issues/1436))
- `[Busy Indicator]` Fixed a bug where the indicator closed when clicking on accordions. ([#281](https://github.com/infor-design/enterprise-ng/issues/281))
- `[Datagrid Tree]` Fixed the need for unique IDs on the tree nodes. ([#1361](https://github.com/infor-design/enterprise/issues/1361))
- `[Editor]` Improved the result of pasting bullet lists from MS Word. ([#1351](https://github.com/infor-design/enterprise/issues/1351))
- `[Hierarchy]` Fixed layout issues in the context menu in RTL mode. ([#1310](https://github.com/infor-design/enterprise/issues/1310))
- `[Datagrid]` Added a setting `allowChildExpandOnMatch` that optionally determines if a search/filter will show and allow nonmatching children to be shown. ([#1422](https://github.com/infor-design/enterprise/issues/1422))
- `[Datagrid]` If a link is added with a href it will now be followed when clicking, rather than needing to use the click method setting on columns. ([#1473](https://github.com/infor-design/enterprise/issues/1473))
- `[Datagrid Tree]` Fixed a bug where Expand/Collapse text is added into the +/- cell. ([#1145](https://github.com/infor-design/enterprise/issues/1145))
- `[Dropdown]` Fixed a bug in NG where two dropdowns in different components would cause each other to freeze. ([#229](https://github.com/infor-design/enterprise-ng/issues/229))
- `[Editor]` Verified a past fix where editor would not work with all buttons when in a modal. ([#408](https://github.com/infor-design/enterprise/issues/408))
- `[Datagrid Tree]` Fixed a bug in `updateRow` that caused the indent of the tree grid to collapse. ([#405](https://github.com/infor-design/enterprise/issues/405))
- `[Empty Message]` Fixed a bug where a null empty message would not be possible. This is used to show no empty message on initial load delays. ([#1467](https://github.com/infor-design/enterprise/issues/1467))
- `[Lookup]` Fixed a bug where nothing is inserted when you click a link editor in the lookup. ([#1315](https://github.com/infor-design/enterprise/issues/1315))
- `[About]` Fixed a bug where the version would not show when set. It would show the IDS version. ([#1414](https://github.com/infor-design/enterprise/issues/1414))
- `[Datagrid]` Fixed a bug in `disableClientSort` / `disableClientFilter`. It now retains visual indicators on sort and filter. ([#1248](https://github.com/infor-design/enterprise/issues/1248))
- `[Tree]` Fixed a bug where selected nodes are selected again after loading child nodes. ([#1270](https://github.com/infor-design/enterprise/issues/1270))
- `[Input]` Fixed a bug where inputs that have tooltips will not be selectable with the cursor. ([#1354](https://github.com/infor-design/enterprise/issues/1354))
- `[Accordion]` Fixed a bug where double clicking a header will open and then close the accordion. ([#1314](https://github.com/infor-design/enterprise/issues/1314))
- `[Datagrid]` Fixed a bug on hover with taller cells where the hover state would not cover the entire cell. ([#1490](https://github.com/infor-design/enterprise/issues/1490))
- `[Editor]` Fixed a bug where the image would still be shown if you press the Esc key and cancel the image dialog. ([#1489](https://github.com/infor-design/enterprise/issues/1489))
- `[Datagrid Lookup]` Added additional missing event info for ajax requests and filtering. ([#1486](https://github.com/infor-design/enterprise/issues/1486))
- `[Tabs]` Added protection from inserting HTML tags in the add method (XSS). ([#1462](https://github.com/infor-design/enterprise/issues/1462))
- `[App Menu]` Added better text wrapping for longer titles. ([#1116](https://github.com/infor-design/enterprise/issues/1116))
- `[Contextual Action Panel]` Fixed some examples so that they reopen more than one time. ([#1116](https://github.com/infor-design/enterprise/issues/506))
- `[Searchfield]` Fixed a border styling issue on longer labels in the search. ([#1500](https://github.com/infor-design/enterprise/issues/1500))
- `[Tabs Multi]` Improved the experience on mobile by collapsing the menus a bit. ([#971](https://github.com/infor-design/enterprise/issues/971))
- `[Lookup]` Fixed missing ellipsis menu on mobile devices. ([#1068](https://github.com/infor-design/enterprise/issues/1068))
- `[Accordion]` Fixed incorrect font size on p tags in the accordion. ([#1116](https://github.com/infor-design/enterprise/issues/1116))
- `[Line Chart]` Fixed and improved the legend text on mobile viewport. ([#609](https://github.com/infor-design/enterprise/issues/609))

### v4.15.0 Chore & Maintenance

- `[General]` Migrated sass to use IDS color variables. ([#1435](https://github.com/infor-design/enterprise/issues/1435))
- `[Angular]` Added all settings from 4.13 in time for future 5.1.0 ([#274](https://github.com/infor-design/enterprise-ng/issues/274))
- `[General]` Fixed some incorrect layouts. ([#1357](https://github.com/infor-design/enterprise/issues/1357))
- `[Targeted Achievement]` Removed some older non working examples. ([#520](https://github.com/infor-design/enterprise/issues/520))

(50 Issues Solved this release, Backlog Enterprise 294, Backlog Ng 80, 809 Functional Tests, 716 e2e Test)

## v4.14.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.14.0 Features

- `[Datepicker/Monthview]` Added a setting for the day of week the calendar starts that can be used outside of the Locale setting. ([#1179](https://github.com/infor-design/enterprise/issues/1179))
- `[Datagrid]` Made the tree datagrid work a lot better with filtering. ([#1281](https://github.com/infor-design/enterprise/issues/1281))
- `[Autocomplete/SearchField]` Added a caseSensitive filtering option. ([#385](https://github.com/infor-design/enterprise/issues/385))
- `[Datagrid]` Added an option `headerAlign` to set alignment on the header different than the rows. ([#420](https://github.com/infor-design/enterprise/issues/420))
- `[Message]` Added the ability to use certain formatter html tags in the message content. ([#379](https://github.com/infor-design/enterprise/issues/379))

### v4.14.0 Fixes

- `[Swaplist]` Fixed a bug that if you drag really fast everything disappears. ([#1195](https://github.com/infor-design/enterprise/issues/1195))
- `[Hierarchy]` Fixed a bug that part of the profile menu is cut off. ([#931](https://github.com/infor-design/enterprise/issues/931))
- `[Datagrid/Dropdown]` Fixed a bug that part of the dropdown menu is cut off. ([#1420](https://github.com/infor-design/enterprise/issues/1420))
- `[Modal]` Fixed bugs where with certain field types modal validation was not working. ([#1213](https://github.com/infor-design/enterprise/issues/1213))
- `[Dropdown]` Fixed a regression where the tooltip was not showing when data is overflowed. ([#1400](https://github.com/infor-design/enterprise/issues/1400))
- `[Tooltip]` Fixed a bugs where a tooltip would show up in unexpected places. ([#1396](https://github.com/infor-design/enterprise/issues/1396))
- `[Datagrid/Dropdown]` Fixed a bug where an error would occur if showSelectAll is used. ([#1360](https://github.com/infor-design/enterprise/issues/1360))
- `[Datagrid/Tooltip]` Fixed a bugs where a tooltip would show up in the header unexpectedly. ([#1395](https://github.com/infor-design/enterprise/issues/1395))
- `[Popupmenu]` Fixed incorrect highlighting on disabled list items.  ([#982](https://github.com/infor-design/enterprise/issues/982))
- `[Contextual Action Panel]` Fixed issues with certain styles of invoking the CAP where it would not reopen a second time. ([#1139](https://github.com/infor-design/enterprise/issues/1139))
- `[Spinbox]` Added a fix so the page will not zoom when click + and - on mobile devices. ([#1070](https://github.com/infor-design/enterprise/issues/1070))
- `[Splitter]` Removed the tooltip from the expand/collapse button as it was superfluous. ([#1180](https://github.com/infor-design/enterprise/issues/1180))
- `[Datagrid]` Added a fix so the last column when stretching will do so with percentage so it will stay when the page resize or the menu opens/closes. ([#1168](https://github.com/infor-design/enterprise/issues/1168))
- `[Datagrid]` Fixed bugs in the server side and filtering example. ([#396](https://github.com/infor-design/enterprise/issues/396))
- `[Datagrid]` Fixed a bug in applyFilter with datefields. ([#1269](https://github.com/infor-design/enterprise/issues/1269))
- `[Datagrid]` Fixed a bug in updateCellNode where sometimes it did not work. ([#1122](https://github.com/infor-design/enterprise/issues/1122))
- `[Hierarchy]` Made the empty image ring the same color as the left edge. ([#932](https://github.com/infor-design/enterprise/issues/932))
- `[Datagrid/Dropdown]` Fixed an issue that tab did not close dropdown editors. ([#1198](https://github.com/infor-design/enterprise/issues/1198))
- `[Datagrid/Dropdown]` Fixed a bug that if you click open a dropdown editor then you cannot use arrow keys to select. ([#1387](https://github.com/infor-design/enterprise/issues/1387))
- `[Datagrid/Dropdown]` Fixed a bug that if a smaller number of items the menu would be too short. ([#1298](https://github.com/infor-design/enterprise/issues/1298))
- `[Searchfield]` Fixed a bug that the search field didnt work in safari. ([#225](https://github.com/infor-design/enterprise/issues/225))
- `[Datagrid/Dropdown]` Fixed a bug that source is used the values may be cleared out when opening the list. ([#1185](https://github.com/infor-design/enterprise/issues/1185))
- `[Personalization]` Fixed a bug that when calling initialize the personalization would reset. ([#1231](https://github.com/infor-design/enterprise/issues/1231))
- `[Tabs]` Fixed the alignment of the closing icon. ([#1056](https://github.com/infor-design/enterprise/issues/1056))
- `[Dropdown]` Fixed list alignment issues on mobile. ([#1069](https://github.com/infor-design/enterprise/issues/1069))
- `[Dropdown]` Fixed issues where the listbox would not close on mobile. ([#1119](https://github.com/infor-design/enterprise/issues/1119))
- `[Dropdown]` Fixed a bug where modals would close on url hash change. ([#1207](https://github.com/infor-design/enterprise/issues/1207))
- `[Contextual Action Panel]` Fixed an issue where buttons would occasionally be out of view. ([#283](https://github.com/infor-design/enterprise/issues/283))
- `[Empty Message]` Added a new icon to indicate using the search function. ([#1325](https://github.com/infor-design/enterprise/issues/1325))
- `[Searchfield]` Added a fix for landscape mode on mobile. ([#1102](https://github.com/infor-design/enterprise/issues/1102))
- `[Datagrid]` Added a fix for hard to read fields in high contrast mode. ([#1193](https://github.com/infor-design/enterprise/issues/1193))

### v4.14.0 Chore & Maintenance

- `[General]` Fixed problems with the css mapping where the line numbers were wrong in the map files. ([#962](https://github.com/infor-design/enterprise/issues/962))
- `[Docs]` Added setting so themes can be shown in the documentation pages. ([#1327](https://github.com/infor-design/enterprise/issues/1327))
- `[Docs]` Made links to example pages open in a new window. ([#1132](https://github.com/infor-design/enterprise/issues/1132))

(43 Issues Solved this release, Backlog Enterprise 181, Backlog Ng 64, 682 Functional Tests, 612 e2e Test)

## v4.13.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.13.0 Features

- `[Calendar]` Added some new features such as upcoming events view, RTL, keyboard support and fixed styling issues and bugs. ([#1221](https://github.com/infor-design/enterprise/issues/1221))
- `[Flex Toolbar]` Added search field integration, so that the search field is mainly close to being able to replace the legacy toolbar. ([#269](https://github.com/infor-design/enterprise/issues/269))
- `[Bar]` Added short, medium label support for adapting the chart to responsive views. ([#1094](https://github.com/infor-design/enterprise/issues/1094))
- `[Textarea]` Added maxLength option to prevent typing over a set maximum. ([#1046](https://github.com/infor-design/enterprise/issues/1046))
- `[Textarea]` Added maxGrow option to prevent growing when typing over a set max. ([#1147](https://github.com/infor-design/enterprise/issues/1147))
- `[Datagrid]` If using the `showDirty` option the indication will now be on each cell. ([#1183](https://github.com/infor-design/enterprise/issues/1183))
- `[Datepicker]` Added an option `useCurrentTime` that will insert current time instead of noon time with date and timepickers. ([#1087](https://github.com/infor-design/enterprise/issues/1087))
- `[General]` Included an IE 11 polyfill for ES6 Promises, this is a new dependency in the package.json you should include. ([#1172](https://github.com/infor-design/enterprise/issues/1172))
- `[General]` Add translations in 38 languages including new support for Slovak (sk-SK). ([#557](https://github.com/infor-design/enterprise/issues/557))

### v4.13.0 Fixes

- `[Tooltips]` Fixed an important bug where tooltips would stick around in the page on the top corner. ([#1273](https://github.com/infor-design/enterprise/issues/1273))
- `[Tooltips]` Fixed some contrast issues on the high contrast theme. ([#1249](https://github.com/infor-design/enterprise/issues/1249))
- `[Tooltips]` Fixed a bug where Toolbar "More Actions" menu buttons could incorrectly display a tooltip overlapping an open menu. ([#1242](https://github.com/infor-design/enterprise/issues/1242))
- `[Datepicker / Timepicker]` Removed the need to use the customValidation setting. You can remove this option from your code. The logic will pick up if you added customValidation to your input by adding a data-validate option. You also may need to add `date` or `availableDate` validation to your  data-validate attribute if these validations are desired along with your custom or required validation. ([#862](https://github.com/infor-design/enterprise/issues/862))
- `[Menubutton]` Added a new setting `hideMenuArrow` you can use for buttons that don't require an arrow, such as menu buttons. ([#1088](https://github.com/infor-design/enterprise/issues/1088))
- `[Dropdown]` Fixed issues with destroy when multiple dropdown components are on the page. ([#1202](https://github.com/infor-design/enterprise/issues/1202))
- `[Datagrid]` Fixed alignment issues when using filtering with some columns that do not have a filter. ([#1124](https://github.com/infor-design/enterprise/issues/1124))
- `[Datagrid]` Fixed an error when dynamically adding context menus. ([#1216](https://github.com/infor-design/enterprise/issues/1216))
- `[Datagrid]` Added an example of dynamic intermediate paging and filtering. ([#396](https://github.com/infor-design/enterprise/issues/396))
- `[Dropdown]` Fixed alignment issues on mobile devices. ([#1069](https://github.com/infor-design/enterprise/issues/1069))
- `[Datepicker]` Fixed incorrect assumptions, causing incorrect umalqura calendar calculations. ([#1189](https://github.com/infor-design/enterprise/issues/1189))
- `[Datepicker]` Fixed an issue where the dialog would not close on click out if opening the time dropdown components first. ([#1278](https://github.com/infor-design/enterprise/issues/))
- `[General]` Added the ability to stop renderLoop. ([#214](https://github.com/infor-design/enterprise/issues/214))
- `[Datepicker]` Fixed an issue reselecting ranges with the date picker range option. ([#1197](https://github.com/infor-design/enterprise/issues/1197))
- `[Editor]` Fixed bugs on IE with background color option. ([#392](https://github.com/infor-design/enterprise/issues/392))
- `[Colorpicker]` Fixed issue where the palette is not closed on enter key / click. ([#1050](https://github.com/infor-design/enterprise/issues/1050))
- `[Accordion]` Fixed issues with context menus on the accordion. ([#639](https://github.com/infor-design/enterprise/issues/639))
- `[Searchfield]` Made no results appear not clickable. ([#329](https://github.com/infor-design/enterprise/issues/329))
- `[Datagrid]` Added an example of groups and paging. ([#435](https://github.com/infor-design/enterprise/issues/435))
- `[Editor]` Fixed the dirty indicator when using toolbar items. ([#910](https://github.com/infor-design/enterprise/issues/910))
- `[Datagrid]` Fixed a bug that made tooltips disappear when a lookup editor is closed. ([#1186](https://github.com/infor-design/enterprise/issues/1186))
- `[Datagrid]` Fixed a bug where not all rows are removed in the removeSelected function. ([#1036](https://github.com/infor-design/enterprise/issues/1036))
- `[Datagrid]` Fixed bugs in activateRow and deactivateRow in some edge cases. ([#948](https://github.com/infor-design/enterprise/issues/948))
- `[Datagrid]` Fixed formatting of tooltips on the header and filter. ([#955](https://github.com/infor-design/enterprise/issues/955))
- `[Datagrid]` Fixed wrong page number when saving the page number in localstorage and reloading. ([#798](https://github.com/infor-design/enterprise/issues/798))
- `[Tree]` Fixed issues when expanding and collapsing after dragging nodes around. ([#1183](https://github.com/infor-design/enterprise/issues/1183))
- `[ContextualActionPanel]` Fixed a bug where the CAP will be closed if clicking an accordion in it. ([#1138](https://github.com/infor-design/enterprise/issues/1138))
- `[Colorpicker]` Added a setting (customColors) to prevent adding default colors if totally custom colors are used. ([#1135](https://github.com/infor-design/enterprise/issues/1135))
- `[AppMenu]` Improved contrast in high contrast theme. ([#1146](https://github.com/infor-design/enterprise/issues/1146))
- `[Searchfield]` Fixed issue where ascenders/descenders are cut off. ([#1101](https://github.com/infor-design/enterprise/issues/1101))
- `[Tree]` Added sortstop and sortstart events. ([#1003](https://github.com/infor-design/enterprise/issues/1003))
- `[Searchfield]` Fixed some alignment issues in different browsers. ([#1106](https://github.com/infor-design/enterprise/issues/1106))
- `[Searchfield]` Fixed some contrast issues in different browsers. ([#1104](https://github.com/infor-design/enterprise/issues/1104))
- `[Searchfield]` Prevent multiple selected events from firing. ([#1259](https://github.com/infor-design/enterprise/issues/1259))
- `[Autocomplete]` Added a beforeOpen setting ([#398](https://github.com/infor-design/enterprise/issues/398))
- `[Toolbar]` Fixed an error where toolbar tried to focus a DOM item that was removed. ([#1177](https://github.com/infor-design/enterprise/issues/1177))
- `[Dropdown]` Fixed a problem where the bottom of some lists is cropped. ([#909](https://github.com/infor-design/enterprise/issues/909))
- `[General]` Fixed a few components so that they could still initialize when hidden. ([#230](https://github.com/infor-design/enterprise/issues/230))
- `[Datagrid]` Fixed missing tooltips on new row. ([#1081](https://github.com/infor-design/enterprise/issues/1081))
- `[Lookup]` Fixed a bug using select all where it would select the previous list. ([#295](https://github.com/infor-design/enterprise/issues/295))
- `[Datagrid]` Fixed missing summary row on initial render in some cases. ([#330](https://github.com/infor-design/enterprise/issues/330))
- `[Button]` Fixed alignment of text and icons. ([#973](https://github.com/infor-design/enterprise/issues/973))
- `[Datagrid]` Fixed missing source call when loading last page first. ([#1162](https://github.com/infor-design/enterprise/issues/1162))
- `[SwapList]` Made sure swap list will work in all cases and in angular. ([#152](https://github.com/infor-design/enterprise/issues/152))
- `[Toast]` Fixed a bug where some toasts on certain urls may not close. ([#1305](https://github.com/infor-design/enterprise/issues/1305))
- `[Datepicker / Lookup]` Fixed bugs where they would not load on tabs. ([#1304](https://github.com/infor-design/enterprise/issues/1304))

### v4.13.0 Chore & Maintenance

- `[General]` Added more complete visual tests. ([#978](https://github.com/infor-design/enterprise/issues/978))
- `[General]` Cleaned up some of the sample pages start at A, making sure examples work and tests are covered for better QA (on going). ([#1136](https://github.com/infor-design/enterprise/issues/1136))
- `[General]` Upgraded to ids-identity 2.0.x ([#1062](https://github.com/infor-design/enterprise/issues/1062))
- `[General]` Cleanup missing files in the directory listings. ([#985](https://github.com/infor-design/enterprise/issues/985))
- `[Angular 1.0]` We removed the angular 1.0 directives from the code and examples. These are no longer being updated. You can still use older versions of this or move on to Angular 7.x ([#1136](https://github.com/infor-design/enterprise/issues/1136))
- `[Uplift]` Included the uplift theme again as alpha for testing. It will show with a watermark and is only available via the personalize api or url params in the demo app. ([#1224](https://github.com/infor-design/enterprise/issues/1224))

(69 Issues Solved this release, Backlog Enterprise 199, Backlog Ng 63, 662 Functional Tests, 659 e2e Test)

## v4.12.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.12.0 Features

- `[General]` The ability to make custom/smaller builds has further been improved. We improved the component matching, made it possible to run the tests on only included components, fixed the banner, and improved the terminal functionality. Also removed/deprecated the older mapping tool. ([#417](https://github.com/infor-design/enterprise/issues/417))
- `[Message]` Added the ability to have different types (Info, Confirm, Error, Alert). ([#963](https://github.com/infor-design/enterprise/issues/963))
- `[General]` Further fixes to for xss issues. ([#683](https://github.com/infor-design/enterprise/issues/683))
- `[Pager]` Made it possible to use the pager as a standalone component. ([#250](https://github.com/infor-design/enterprise/issues/250))
- `[Editor]` Added a clear formatting button. ([#473](https://github.com/infor-design/enterprise/issues/473))
- `[Datepicker]` Added an option to show the time as current time instead of midnight. ([#889](https://github.com/infor-design/enterprise/issues/889))
- `[About]` Dialog now shows device information. ([#684](https://github.com/infor-design/enterprise/issues/684))

### v4.12.0 Fixes

- `[Datagrid Tree]` Fixed incorrect data on activated event. ([#412](https://github.com/infor-design/enterprise/issues/412))
- `[Datagrid]` Improved the export function so it works on different locales. ([#378](https://github.com/infor-design/enterprise/issues/378))
- `[Tabs]` Fixed a bug where clicking the x on tabs with a dropdowns would incorrectly open the dropdown. ([#276](https://github.com/infor-design/enterprise/issues/276))
- `[Datagrid]` Changed the `settingschange` event so it will only fire once. ([#903](https://github.com/infor-design/enterprise/issues/903))
- `[Listview]` Improved rendering performance. ([#430](https://github.com/infor-design/enterprise/issues/430))
- `[General]` Fixed issues when using base tag, that caused icons to disappear. ([#766](https://github.com/infor-design/enterprise/issues/766))
- `[Empty Message]` Made it possible to assign code to the button click if used. ([#667](https://github.com/infor-design/enterprise/issues/667))
- `[Datagrid]` Added translations for the new tooltip. ([#227](https://github.com/infor-design/enterprise/issues/227))
- `[Dropdown]` Fixed contrast issue in high contrast theme. ([#945](https://github.com/infor-design/enterprise/issues/945))
- `[Datagrid]` Reset to default did not reset dropdown columns. ([#847](https://github.com/infor-design/enterprise/issues/847))
- `[Datagrid]` Fixed bugs in keyword search highlighting with special characters. ([#849](https://github.com/infor-design/enterprise/issues/849))
- `[Datagrid]` Fixed bugs that causes NaN to appear in date fields. ([#891](https://github.com/infor-design/enterprise/issues/891))
- `[Dropdown]` Fixed issue where validation is not trigger on IOS on click out. ([#659](https://github.com/infor-design/enterprise/issues/659))
- `[Lookup]` Fixed bug in select all in multiselect with paging. ([#926](https://github.com/infor-design/enterprise/issues/926))
- `[Modal]` Fixed bug where the modal would close if hitting enter on a checkbox and inputs. ([#320](https://github.com/infor-design/enterprise/issues/320))
- `[Lookup]` Fixed bug trying to reselect a second time. ([#296](https://github.com/infor-design/enterprise/issues/296))
- `[Tabs]` Fixed behavior when closing and disabling tabs. ([#947](https://github.com/infor-design/enterprise/issues/947))
- `[Dropdown]` Fixed layout issues when using icons in the dropdown. ([#663](https://github.com/infor-design/enterprise/issues/663))
- `[Datagrid]` Fixed a bug where the tooltip did not show on validation. ([#1008](https://github.com/infor-design/enterprise/issues/1008))
- `[Tabs]` Fixed issue with opening spillover on IOS. ([#619](https://github.com/infor-design/enterprise/issues/619))
- `[Datagrid]` Fixed bugs when using `exportable: false` in certain column positions. ([#787](https://github.com/infor-design/enterprise/issues/787))
- `[Searchfield]` Removed double border. ([#328](https://github.com/infor-design/enterprise/issues/328))

### v4.12.0 Chore & Maintenance

- `[Masks]` Added missing and more documentation, cleaned up existing docs. ([#1033](https://github.com/infor-design/enterprise/issues/1033))
- `[General]` Based on design site comments, we improved some pages and fixed some missing links. ([#1034](https://github.com/infor-design/enterprise/issues/1034))
- `[Bar Chart]` Added test coverage. ([#848](https://github.com/infor-design/enterprise/issues/848))
- `[Datagrid]` Added full api test coverage. ([#242](https://github.com/infor-design/enterprise/issues/242))

(55 Issues Solved this release, Backlog Enterprise 185, Backlog Ng 50, 628 Functional Tests, 562 e2e Test)

## v4.11.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.11.0 Features

- `[General]` It is now possible to make custom builds. With a custom build you specify a command with a list of components that you use. This can be used to reduce the bundle size for both js and css. ([#417](https://github.com/infor-design/enterprise/issues/417))
- `[Calendar]` Added more features including: a readonly view, ability for events to span days, tooltips and notifications ([#417](https://github.com/infor-design/enterprise/issues/417))
- `[Lookup]` Added the ability to select across pages, even when doing server side paging. ([#375](https://github.com/infor-design/enterprise/issues/375))
- `[Datagrid]` Improved tooltip performance, and now tooltips show on cells that are not fully displayed. ([#447](https://github.com/infor-design/enterprise/issues/447))

### v4.11.0 Fixes

- `[Dropdown]` The onKeyDown callback was not firing if CTRL key is used. This is fixed. ([#793](https://github.com/infor-design/enterprise/issues/793))
- `[Tree]` Added a small feature to preserve the tree node states on reload. ([#792](https://github.com/infor-design/enterprise/issues/792))
- `[Tree]` Added a disable/enable method to disable/enable the whole tree. ([#752](https://github.com/infor-design/enterprise/issues/752))
- `[App Menu]` Fixed a bug clearing the search filter box. ([#702](https://github.com/infor-design/enterprise/issues/702))
- `[Column Chart]` Added a yAxis option, you can use to format the yAxis in custom ways. ([#627](https://github.com/infor-design/enterprise/issues/627))
- `[General]` More fixes to use external ids tokens. ([#708](https://github.com/infor-design/enterprise/issues/708))
- `[Datagrid]` Fixed an error calling selectRows with an integer. ([#756](https://github.com/infor-design/enterprise/issues/756))
- `[Tree]` Fixed a bug that caused newly added rows to not be draggable. ([#618](https://github.com/infor-design/enterprise/issues/618))
- `[Dropdown / Multiselect]` Re-added the ability to have a placeholder on the component. ([#832](https://github.com/infor-design/enterprise/issues/832))
- `[Datagrid]` Fixed a bug that caused dropdown filters to not save on reload of page (saveUserSettings) ([#791](https://github.com/infor-design/enterprise/issues/791))
- `[Dropdown]` Fixed a bug that caused an unneeded scrollbar. ([#786](https://github.com/infor-design/enterprise/issues/786))
- `[Tree]` Added drag events and events for when the data is changed. ([#801](https://github.com/infor-design/enterprise/issues/801))
- `[Datepicker]` Fixed a bug updating settings, where time was not changing correctly. ([#305](https://github.com/infor-design/enterprise/issues/305))
- `[Tree]` Fixed a bug where the underlying dataset was not synced up. ([#718](https://github.com/infor-design/enterprise/issues/718))
- `[Lookup]` Fixed incorrect text color on chrome. ([#762](https://github.com/infor-design/enterprise/issues/762))
- `[Editor]` Fixed duplicate ID's on the popup dialogs. ([#746](https://github.com/infor-design/enterprise/issues/746))
- `[Dropdown]` Fixed misalignment of icons on IOS. ([#657](https://github.com/infor-design/enterprise/issues/657))
- `[Demos]` Fixed a bug that caused RTL pages to sometimes load blank. ([#814](https://github.com/infor-design/enterprise/issues/814))
- `[Modal]` Fixed a bug that caused the modal to close when clicking an accordion on the modal. ([#747](https://github.com/infor-design/enterprise/issues/747))
- `[Tree]` Added a restoreOriginalState method to set the tree back to its original state. ([#751](https://github.com/infor-design/enterprise/issues/751))
- `[Datagrid]` Added an example of a nested datagrid with scrolling. ([#172](https://github.com/infor-design/enterprise/issues/172))
- `[Datagrid]` Fixed column alignment issues on grouped column examples. ([#147](https://github.com/infor-design/enterprise/issues/147))
- `[Datagrid]` Fixed bugs when dragging and resizing grouped columns. ([#374](https://github.com/infor-design/enterprise/issues/374))
- `[Validation]` Fixed a bug that caused validations with changing messages to not go away on correction. ([#640](https://github.com/infor-design/enterprise/issues/640))
- `[Datagrid]` Fixed bugs in actionable mode (enter was not moving down). ([#788](https://github.com/infor-design/enterprise/issues/788))
- `[Bar Charts]` Fixed bug that caused tooltips to occasionally not show up. ([#739](https://github.com/infor-design/enterprise/issues/739))
- `[Dirty]` Fixed appearance/contrast on high contrast theme. ([#692](https://github.com/infor-design/enterprise/issues/692))
- `[Locale]` Fixed incorrect date time format. ([#608](https://github.com/infor-design/enterprise/issues/608))
- `[Dropdown]` Fixed bug where filtering did not work with CAPS lock on. ([#608](https://github.com/infor-design/enterprise/issues/608))
- `[Accordion]` Fixed styling issue on safari. ([#282](https://github.com/infor-design/enterprise/issues/282))
- `[Dropdown]` Fixed a bug on mobile devices, where the list would close on scrolling. ([#656](https://github.com/infor-design/enterprise/issues/656))

### v4.11.0 Chore & Maintenance

- `[Textarea]` Added additional test coverage. ([#337](https://github.com/infor-design/enterprise/issues/337))
- `[Tree]` Added additional test coverage. ([#752](https://github.com/infor-design/enterprise/issues/752))
- `[Busy Indicator]` Added additional test coverage. ([#233](https://github.com/infor-design/enterprise/issues/233))
- `[Docs]` Added additional information for developers on how to use IDS. ([#721](https://github.com/infor-design/enterprise/issues/721))
- `[Docs]` Added Id's and test notes to all pages. ([#259](https://github.com/infor-design/enterprise/issues/259))
- `[Docs]` Fixed issues on the wizard docs. ([#824](https://github.com/infor-design/enterprise/issues/824))
- `[Accordion]` Added additional test coverage. ([#516](https://github.com/infor-design/enterprise/issues/516))
- `[General]` Added sass linter (stylelint). ([#767](https://github.com/infor-design/enterprise/issues/767))

(53 Issues Solved this release, Backlog Enterprise 170, Backlog Ng 41, 587 Functional Tests, 458 e2e Test)

## v4.10.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.10.0 Features

- `[Tooltips]` Will now activate on longpress on mobile devices. ([#400](https://github.com/infor-design/enterprise/issues/400))
- `[Contextmenu]` Will now activate on longpress on mobile devices (except when on inputs). ([#245](https://github.com/infor-design/enterprise/issues/245))
- `[Locale]` Added support for zh-Hant and zh-Hans. ([#397](https://github.com/infor-design/enterprise/issues/397))
- `[Tree]` Greatly improved rendering and expanding performance. ([#251](https://github.com/infor-design/enterprise/issues/251))
- `[General]` Internally all of the sass is now extended from [IDS Design tokens]( https://github.com/infor-design/design-system) ([#354](https://github.com/infor-design/enterprise/issues/354))
- `[Calendar]` Added initial readonly calendar. At the moment the calendar can only render events and has a filtering feature. More will be added next sprint. ([#261](https://github.com/infor-design/enterprise/issues/261))

### v4.10.0 Fixes

- `[Dropdown]` Minor Breaking Change for Xss reasons we removed the ability to set a custom hex color on icons in the dropdown. You can still pass in one of the alert colors from the colorpallette (fx alert, good, info). This was not even shown in the examples so may not be missed. ([#256](https://github.com/infor-design/enterprise/issues/256))
- `[Popupmenu]` Fixed a problem in popupmenu, if it was opened in immediate mode, submenus will be cleared of their text when the menu is eventually closed. ([#701](https://github.com/infor-design/enterprise/issues/701))
- `[Editor]` Fixed xss injection problem on the link dialog. ([#257](https://github.com/infor-design/enterprise/issues/257))
- `[Spinbox]` Fixed a height / alignment issue on spinboxes when used in short height configuration. ([#547](https://github.com/infor-design/enterprise/issues/547))
- `[Datepicker / Mask]` Fixed an issue in angular that caused using backspace to not save back to the model. ([#51](https://github.com/infor-design/enterprise-ng/issues/51))
- `[Field Options]` Fixed mobile support so they now work on touch better on IOS and Android. ([#555](https://github.com/infor-design/enterprise-ng/issues/555))
- `[Tree]` Tree with + and - for the folders was inversed visually. This was fixed, update your svg.html ([#685](https://github.com/infor-design/enterprise-ng/issues/685))
- `[Modal]` Fixed an alignment issue with the closing X on the top corner. ([#662](https://github.com/infor-design/enterprise-ng/issues/662))
- `[Popupmenu]` Fixed a visual flickering when opening dynamic submenus. ([#588](https://github.com/infor-design/enterprise/issues/588))
- `[Tree]` Added full unit and functional tests. ([#264](https://github.com/infor-design/enterprise/issues/264))
- `[Lookup]` Added full unit and functional tests. ([#344](https://github.com/infor-design/enterprise/issues/344))
- `[Datagrid]` Added more unit and functional tests. ([#242](https://github.com/infor-design/enterprise/issues/242))
- `[General]` Updated the develop tools and sample app to Node 10. During this update we set package-lock.json to be ignored in .gitignore ([#540](https://github.com/infor-design/enterprise/issues/540))
- `[Modal]` Allow beforeOpen callback to run optionally whether you have content or not passed back. ([#409](https://github.com/infor-design/enterprise/issues/409))
- `[Datagrid]` The lookup editor now supports left, right, and center align on the column settings. ([#228](https://github.com/infor-design/enterprise/issues/228))
- `[Mask]` When adding prefixes and suffixes (like % and $) if all the rest of the text is cleared, these will also now be cleared. ([#433](https://github.com/infor-design/enterprise/issues/433))
- `[Popupmenu]` Fixed low contrast selection icons in high contrast theme. ([#410](https://github.com/infor-design/enterprise/issues/410))
- `[Header Popupmenu]` Fixed missing focus state. ([#514](https://github.com/infor-design/enterprise/issues/514))
- `[Datepicker]` When using legends on days, fixed a problem that the hover states are shown incorrectly when changing month. ([#514](https://github.com/infor-design/enterprise/issues/514))
- `[Listview]` When the search field is disabled, it was not shown with disabled styling, this is fixed. ([#422](https://github.com/infor-design/enterprise/issues/422))
- `[Donut]` When having 4 or 2 sliced the tooltip would not show up on some slices. This is fixed. ([#482](https://github.com/infor-design/enterprise/issues/482))
- `[Datagrid]` Added a searchExpandableRow option so that you can control if data in expandable rows is searched/expanded. ([#480](https://github.com/infor-design/enterprise/issues/480))
- `[Multiselect]` If more items then fit are selected the tooltip was not showing on initial load, it only showed after changing values. This is fixed. ([#633](https://github.com/infor-design/enterprise/issues/633))
- `[Tooltip]` An example was added showing how you can show tooltips on disabled buttons. ([#453](https://github.com/infor-design/enterprise/issues/453))
- `[Modal]` A title with brackets in it was not escaping the text correctly. ([#246](https://github.com/infor-design/enterprise/issues/246))
- `[Modal]` Pressing enter when on inputs such as file upload no longer closes the modal. ([#321](https://github.com/infor-design/enterprise/issues/321))
- `[Locale]` Sent out translations so things like the Editor New/Same window dialog will be translated in the future. ([#511](https://github.com/infor-design/enterprise/issues/511))
- `[Nested Datagrid]` Fixed focus issues, the wrong cell in the nest was getting focused. ([#371](https://github.com/infor-design/enterprise/issues/371))

(44 Issues Solved this release, Backlog Enterprise 173, Backlog Ng 44, 565 Functional Tests, 426 e2e Test)

## v4.9.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.9.0 Features

- `[Datagrid]` Changed the way alerts work on rows. It now no longer requires an extra column. The rowStatus column will now be ignored so can be removed. When an alert / error / info message is added to the row the whole row will highlight. ([Check out the example.](https://bit.ly/2LC33iJ) ([#258](https://github.com/infor-design/enterprise/issues/258))
- `[Modal]` Added an option `showCloseBtn` which when set to true will show a X button on the top left corner. ([#358](https://github.com/infor-design/enterprise/issues/358))
- `[Multiselect / Dropdown]` Added the ability to see the search term during ajax requests. ([#267](https://github.com/infor-design/enterprise/issues/267))
- `[Scatterplot]` Added a scatter plot chart similar to a bubble chart but with shapes. ([Check out the example.](https://bit.ly/2K9N59M) ([#341](https://github.com/infor-design/enterprise/issues/341))
- `[Toast]` Added an option `allowLink` which when set to true will allow you to specify a `<a>` in the message content to add a link to the message. ([#341](https://github.com/infor-design/enterprise/issues/341))

### v4.9.0 Fixes

- `[Accordion]` Fixed an issue that prevented a right click menu from working on the accordion. ([#238](https://github.com/infor-design/enterprise/issues/238))
- `[Charts]` Fixed up missing empty states and selection methods so they work on all charts. ([#265](https://github.com/infor-design/enterprise/issues/265))
- `[Datagrid]` Fixed the performance of pasting from excel. ([#240](https://github.com/infor-design/enterprise/issues/240))
- `[Datagrid]` The keyword search will now clear when reloading data. ([#307](https://github.com/infor-design/enterprise/issues/307))
- `[Docs]` Fixed several noted missing pages and broken links in the docs. ([#244](https://github.com/infor-design/enterprise/issues/244))
- `[Dropdown]` Fixed bug in badges configuration. ([#270](https://github.com/infor-design/enterprise/issues/270))
- `[Flex Layout]` Fixed field-flex to work better on IE. ([#252](https://github.com/infor-design/enterprise/issues/252))
- `[Editor]` Fixed bug that made it impossible to edit the visual tab. ([#478](https://github.com/infor-design/enterprise/issues/478))
- `[Editor]` Fixed a bug with dirty indicator that caused a messed up layout. ([#241](https://github.com/infor-design/enterprise/issues/241))
- `[Lookup]` Fixed it so that select will work correctly when filtering. ([#248](https://github.com/infor-design/enterprise/issues/248))
- `[Header]` Fixed missing `More` tooltip on the header. ([#345](https://github.com/infor-design/enterprise/issues/345))
- `[Validation]` Added fixes to prevent `error` and `valid` events from going off more than once. ([#237](https://github.com/infor-design/enterprise/issues/237))
- `[Validation]` Added fixes to make multiple messages work better. There is now a `getMessages()` function that will return all erros on a field as an array. The older `getMessage()` will still return a string. ([#237](https://github.com/infor-design/enterprise/issues/237))
- `[Validation]` Fixed un-needed event handlers when using fields on a tab. ([#332](https://github.com/infor-design/enterprise/issues/332))

### v4.9.0 Chore & Maintenance

- `[Blockgrid]` Added full test coverage ([#234](https://github.com/infor-design/enterprise/issues/234))
- `[CAP]` Fixed some examples that would not close ([#283](https://github.com/infor-design/enterprise/issues/283))
- `[Datepicker]` Added full test coverage ([#243](https://github.com/infor-design/enterprise/issues/243))
- `[Datagrid]` Fixed an example so that it shows how to clear a dropdown filter. ([#254](https://github.com/infor-design/enterprise/issues/254))
- `[Docs]` Added TEAMS.MD for collecting info on the teams using ids. If you are not in the list let us know or make a pull request. ([#350](https://github.com/infor-design/enterprise/issues/350))
- `[Listview]` Fixed some links in the sample app that caused some examples to fail. ([#273](https://github.com/infor-design/enterprise/issues/273))
- `[Tabs]` Added more test coverage ([#239](https://github.com/infor-design/enterprise/issues/239))
- `[Toast]` Added full test coverage ([#232](https://github.com/infor-design/enterprise/issues/232))
- `[Testing]` Added visual regression tests, and more importantly a system for doing them via CI. ([#255](https://github.com/infor-design/enterprise/issues/255))

(34 Issues Solved this release, Backlog Enterprise 158, Backlog Ng 41, 458 Functional Tests, 297 e2e Test)

## v4.8.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.8.0 Features

- `[Datagrid]` Added an example of Nested Datagrids with ([basic nested grid support.](https://bit.ly/2lGKM4a)) ([#SOHO-3474](https://jira.infor.com/browse/SOHO-3474))
- `[Datagrid]` Added support for async validation. ([#SOHO-7943](https://jira.infor.com/browse/SOHO-7943))
- `[Export]` Extracted excel export code so it can be run outside the datagrid. ([#SOHO-7246](https://jira.infor.com/browse/SOHO-7246))

### v4.8.0 Fixes

- `[Searchfield / Toolbar Searchfield]` Merged code between them so there is just one component. This reduced code and fixed many bugs. ([#161](https://github.com/infor-design/enterprise/pull/161))
- `[Datagrid]` Fixed issues using expand row after hiding/showing columns. ([#SOHO-8103](https://jira.infor.com/browse/SOHO-8103))
- `[Datagrid]` Fixed issue that caused nested grids in expandable rows to hide after hiding/showing columns on the parent grid. ([#SOHO-8102](https://jira.infor.com/browse/SOHO-8102))
- `[Datagrid]` Added an example showing Math rounding on numeric columns ([#SOHO-5168](https://jira.infor.com/browse/SOHO-5168))
- `[Datagrid]` Date editors now maintain date format correctly. ([#SOHO-5861](https://jira.infor.com/browse/SOHO-5861))
- `[Datagrid]` Fixed alignment off sort indicator on centered columns. ([#SOHO-7444](https://jira.infor.com/browse/SOHO-7444))
- `[Datagrid]` Behavior Change - Sorting clicking now no longer refocuses last cell. ([#SOHO-7682](https://jira.infor.com/browse/SOHO-7682))
- `[Datagrid]` Fixed formatter error that showed NaN on some number cells. ([#SOHO-7839](https://jira.infor.com/browse/SOHO-7682))
- `[Datagrid]` Fixed a bug rendering last column in some situations. ([#SOHO-7987](https://jira.infor.com/browse/SOHO-7987))
- `[Datagrid]` Fixed incorrect data in context menu event. ([#SOHO-7991](https://jira.infor.com/browse/SOHO-7991))
- `[Dropdown]` Added an onKeyDown option so keys can be overriden. ([#SOHO-4815](https://jira.infor.com/browse/SOHO-4815))
- `[Slider]` Fixed step slider to work better jumping across steps. ([#SOHO-6271](https://jira.infor.com/browse/SOHO-6271))
- `[Tooltip]` Will strip tooltip markup to prevent xss. ([#SOHO-6522](https://jira.infor.com/browse/SOHO-6522))
- `[Contextual Action Panel]` Fixed alignment issue on x icon. ([#SOHO-6612](https://jira.infor.com/browse/SOHO-6612))
- `[Listview]` Fixed scrollbar size when removing items. ([#SOHO-7402](https://jira.infor.com/browse/SOHO-7402))
- `[Navigation Popup]` Fixed a bug setting initial selected value. ([#SOHO-7411](https://jira.infor.com/browse/SOHO-7411))
- `[Grid]` Added a no-margin setting for nested grids with no indentation. ([#SOHO-7495](https://jira.infor.com/browse/SOHO-7495))
- `[Grid]` Fixed positioning of checkboxes in the grid. ([#SOHO-7979](https://jira.infor.com/browse/SOHO-7979))
- `[Tabs]` Fixed bug calling add in NG applications. ([#SOHO-7511](https://jira.infor.com/browse/SOHO-7511))
- `[Listview]` Selected event now contains the dataset row. ([#SOHO-7512](https://jira.infor.com/browse/SOHO-7512))
- `[Multiselect]` Fixed incorrect showing of delselect button in certain states. ([#SOHO-7535](https://jira.infor.com/browse/SOHO-7535))
- `[Search]` Fixed bug where highlight search terms where not shown in bold. ([#SOHO-7796](https://jira.infor.com/browse/SOHO-7796))
- `[Multiselect]` Improved performance on select all. ([#SOHO-7816](https://jira.infor.com/browse/SOHO-7816))
- `[Spinbox]` Fixed problem where you could arrow up in a readonly spinbox. ([#SOHO-8025](https://jira.infor.com/browse/SOHO-8025))
- `[Dropdown]` Fixed bug selecting two items with same value. ([#SOHO-8029](https://jira.infor.com/browse/SOHO-8029))
- `[Modal]` Fixed incorrect enabling of submit on validating modals. ([#SOHO-8042](https://jira.infor.com/browse/SOHO-8042))
- `[Modal]` Fixed incorrect closing of modal on enter key. ([#SOHO-8059](https://jira.infor.com/browse/SOHO-8059))
- `[Rating]` Allow decimal values for example 4.3. ([#SOHO-8063](https://jira.infor.com/browse/SOHO-8063))
- `[Datepicker]` Prevent datepicker from scrolling to the top of the browser. ([#SOHO-8107](https://jira.infor.com/browse/SOHO-8107))
- `[Tag]` Fixed layout on Right-To-Left. ([#SOHO-8120](https://jira.infor.com/browse/SOHO-8120))
- `[Listview]` Fixed missing render event. ([#SOHO-8129](https://jira.infor.com/browse/SOHO-8129))
- `[Angular Datagrid]` Fixed maskOptions input definition. ([#SOHO-8131](https://jira.infor.com/browse/SOHO-8131))
- `[Datepicker]` Fixed several bugs on the UmAlQura Calendar. ([#SOHO-8147](https://jira.infor.com/browse/SOHO-8147))
- `[Datagrid]` Fixed bug on expanding and collapsing multiple expandable rows. ([#SOHO-8154](https://jira.infor.com/browse/SOHO-8154))
- `[Pager]` Fixed focus state clicking page numbers. ([#SOHO-4528](https://jira.infor.com/browse/SOHO-4528))
- `[SearchField]` Fixed bug initializing search field with text. ([#SOHO-4820](https://jira.infor.com/browse/SOHO-4820))
- `[ColorPicker]` Fixed bug with incorrect cursor on readonly color picker. ([#SOHO-8030](https://jira.infor.com/browse/SOHO-8030))
- `[Pie]` Fixed ui glitch on mobile when pressing slices. ([#SOHO-8141](https://jira.infor.com/browse/SOHO-8141))

### v4.8.0 Chore & Maintenance

- `[Npm Package]` Added back sass files in correct folder structure. ([#SOHO-7583](https://jira.infor.com/browse/SOHO-7583))
- `[Menu Button]` Added button functional and e2e tests. ([#SOHO-7600](https://jira.infor.com/browse/SOHO-7600))
- `[Textarea]` Added Textarea functional and e2e tests. ([#SOHO-7929](https://jira.infor.com/browse/SOHO-7929))
- `[ListFilter]` Added ListFilter functional and e2e tests. ([#SOHO-7975](https://jira.infor.com/browse/SOHO-7975))
- `[Colorpicker]` Added Colorpicker functional and e2e tests. ([#SOHO-8078](https://jira.infor.com/browse/SOHO-8078))
- `[Site / Docs]` Fixed a few broken links ([#SOHO-7993](https://jira.infor.com/browse/SOHO-7993))

(62 Jira Issues Solved this release, Backlog Dev 186, Design 110, Unresolved 349, Test Count 380 Functional, 178 e2e )

## v4.7.0

- [Full Jira Release Notes](https://bit.ly/2HyT3zF)
- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.7.0 Features

- `[Github]` The project was migrated to be open source on github with a new workflow and testing suite.
- `[Tag]` Added a Tag angular component. ([#SOHO-8005](https://jira.infor.com/browse/SOHO-8006))
- `[Validate]` Exposed validate and removeMessage methods. ([#SOHO-8003](https://jira.infor.com/browse/SOHO-8003))
- `[General]` Upgrade to Angular 6 ([#SOHO-7927](https://jira.infor.com/browse/SOHO-7927))
- `[General]` Introduced nightly versions in npm ([#SOHO-7804](https://jira.infor.com/browse/SOHO-7804))
- `[Multiselect]` A tooltip now shows if more content is selected than fits in the input. ([#SOHO-7799](https://jira.infor.com/browse/SOHO-7799))
- `[Datepicker]` Added an option to restrict moving to months that are not available to select from. ([#SOHO-7384](https://jira.infor.com/browse/SOHO-7384))
- `[Validation]` Added and icon alert([#SOHO-7225](https://jira.infor.com/browse/SOHO-7225)
- `[General]` Code is now available on ([public npm](https://www.npmjs.com/package/ids-enterprise)) ([#SOHO-7083](https://jira.infor.com/browse/SOHO-7083))

### v4.7.0 Fixes

- `[Lookup]` Fixed existing example that shows using an autocomplete on a lookup. ([#SOHO-8070](https://jira.infor.com/browse/SOHO-8070))
- `[Lookup]` Fixed existing example that shows creating a customized dialog on the lookup ([#SOHO-8069](https://jira.infor.com/browse/SOHO-8069))
- `[Lookup]` Fixed existing example that incorrectly showed a checkbox column. ([#SOHO-8068](https://jira.infor.com/browse/SOHO-8068))
- `[Line Chart]` Fixed an error when provoking the tooltip. ([#/SOHO-8051](https://jira.infor.com/browse/SOHO-8051))
- `[Module Tabs]` Fixed a bug toggling the menu on mobile. ([#/SOHO-8043](https://jira.infor.com/browse/SOHO-8043))
- `[Autocomplete]` Fixed a bug that made enter key not work to select. ([#SOHO-8036](https://jira.infor.com/browse/SOHO-8036))
- `[Tabs]` Removed an errant scrollbar that appeared sometimes on IE ([#SOHO-8034](https://jira.infor.com/browse/SOHO-8034))
- `[Datagrid]` The drill down click event now currently shows the right row information in the event data. ([#SOHO-8023](https://jira.infor.com/browse/SOHO-8023))
- `[Datagrid]` Fixed a broken nested data example. ([#SOHO-8019](https://jira.infor.com/browse/SOHO-8019))
- `[Datagrid]` Fixed a broken paging example. ([#SOHO-8013](https://jira.infor.com/browse/SOHO-8013))
- `[Datagrid]` Hyperlinks now can be clicked when in a datagrid expandable row. ([#SOHO-8009](https://jira.infor.com/browse/SOHO-8009))
- `[Popupmenu]` Removed extra padding on icon menus ([#SOHO-8006](https://jira.infor.com/browse/SOHO-8006))
- `[Spinbox]` Range limits now work correctly ([#SOHO-7999](https://jira.infor.com/browse/SOHO-7999))
- `[Dropdown]` Fixed not working filtering on nosearch option. ([#SOHO-7998](https://jira.infor.com/browse/SOHO-7998))
- `[Hierarchy]` Children layout and in general layouts where improved. ([#SOHO-7992](https://jira.infor.com/browse/SOHO-7992))
- `[Buttons]` Fixed layout issues on mobile. ([#SOHO-7982](https://jira.infor.com/browse/SOHO-7982))
- `[Datagrid]` Fixed format initialization issue ([#SOHO-7982](https://jira.infor.com/browse/SOHO-7982))
- `[Lookup]` Fixed a problem that caused the lookup to only work once. ([#SOHO-7971](https://jira.infor.com/browse/SOHO-7971))
- `[Treemap]` Fix a bug using `fixture.detectChanges()`. ([#SOHO-7969](https://jira.infor.com/browse/SOHO-7969))
- `[Textarea]` Fixed a bug that made it possible for the count to go to a negative value. ([#SOHO-7952](https://jira.infor.com/browse/SOHO-7952))
- `[Tabs]` Fixed a bug that made extra events fire. ([#SOHO-7948](https://jira.infor.com/browse/SOHO-7948))
- `[Toolbar]` Fixed a with showing icons and text in the overflowmenu. ([#SOHO-7942](https://jira.infor.com/browse/SOHO-7942))
- `[DatePicker]` Fixed an error when restricting dates. ([#SOHO-7922](https://jira.infor.com/browse/SOHO-7922))
- `[TimePicker]` Fixed sort order of times in arabic locales. ([#SOHO-7920](https://jira.infor.com/browse/SOHO-7920))
- `[Multiselect]` Fixed initialization of selected items. ([#SOHO-7916](https://jira.infor.com/browse/SOHO-7916))
- `[Line Chart]` Solved a problem clicking lines to select. ([#SOHO-7912](https://jira.infor.com/browse/SOHO-7912))
- `[Hierarchy]` Improved RTL version ([#SOHO-7888](https://jira.infor.com/browse/SOHO-7888))
- `[Datagrid]` Row click event now shows correct data when using Groups ([#SOHO-7861](https://jira.infor.com/browse/SOHO-7861))
- `[Modal]` Fixed cut of border on checkboxe focus states. ([#SOHO-7856](https://jira.infor.com/browse/SOHO-7856))
- `[Colorpicker]` Fixed cropped labels when longer ([#SOHO-7817](https://jira.infor.com/browse/SOHO-7817))
- `[Label]` Fixed cut off Thai characters ([#SOHO-7814](https://jira.infor.com/browse/SOHO-7814))
- `[Colorpicker]` Fixed styling issue on margins ([#SOHO-7776](https://jira.infor.com/browse/SOHO-7776))
- `[Hierarchy]` Fixed several layout issues and changed the paging example to show the back button on the left. ([#SOHO-7622](https://jira.infor.com/browse/SOHO-7622))
- `[Bar Chart]` Fixed RTL layout issues ([#SOHO-5196](https://jira.infor.com/browse/SOHO-5196))
- `[Lookup]` Made delimiter an option / changable ([#SOHO-4695](https://jira.infor.com/browse/SOHO-4695))

### v4.7.0 Chore & Maintenance

- `[Timepicker]` Added functional and e2e tests ([#SOHO-7809](https://jira.infor.com/browse/SOHO-7809))
- `[General]` Restructured the project to clean up and separate the demo app from code. ([#SOHO-7803](https://jira.infor.com/browse/SOHO-7803))

(56 Jira Issues Solved this release, Backlog Dev 218, Design 101, Unresolved 391, Test Count 232 Functional, 117 e2e )

## v4.6.0

- [Full Jira Release Notes](https://bit.ly/2jodbem)
- [Npm Package](http://npm.infor.com)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.6.0 Key New Features

- `[Treemap]` New Component Added
- `[Website]` Launch of new docs site <https://design.infor.com/code/ids-enterprise/latest>
- `[Security]` Ids Now passes CSP (Content Security Policy) Compliance for info see <docs/SECURITY.md>.
- `[Toolbar]` New ["toolbar"](http://usalvlhlpool1.infor.com/4.6.0/components/toolbar-flex/list)
    - Based on css so it is much faster.
    - Expect a future breaking change from flex-toolbar to this toolbar when all features are implemented.
    - As of now collapsible search is not supported yet.

### v4.6.0 Behavior Changes

- `[App Menu]` Now automatically closes when items are clicked on mobile devices.

### v4.6.0 Improvements

- `[Angular]` Validation now allows dynamic functions.
- `[Editor]` Added a clear method.
- `[Locale]` Map iw locale to Hebrew.
- `[Locale]` Now defaults locals with no country. For example en maps to en-US es and es-ES.
- `[Color Picker]` Added option to clear the color.
- `[Angular]` Allow Formatters, Editors to work with Soho. without the migration script.
- `[Added a new labels example <http://usalvlhlpool1.infor.com/4.6.0/components/form/example-labels.html>
- `[Angular]` Added new Chart Wrappers (Line, Bar, Column ect ).
- `[Datagrid]` Added file up load editor.
- `[Editor]` Its possible to put a link on an image now.

### v4.6.0 Code Updates / Breaking Changes

- `[Templates]` The internal template engine changed for better XSS security as a result one feature is no longer supported. If you have a delimiter syntax to embed html like `{{& name}}`, change this to be `{{{name}}}`.
- `[jQuery]` Updated from 3.1.1 to 3.3.1.

### v4.6.0 Bug Fixes

- `[Angular]` Added fixes so that the `soho.migrate` script is no longer needed.
- `[Angular Datagrid]` Added filterWhenTyping option.
- `[Angular Popup]` Expose close, isOpen and keepOpen.
- `[Angular Linechart]` Added "xAxis" and "yAxis" options.
- `[Angular Treemap]` Added new wrapper.
- `[Angular Rating]` Added a rating wrapper.
- `[Angular Circle Page]` Added new wrapper.
- `[Checkbox]` Fixed issue when you click the top left of the page, would toggle the last checkbox.
- `[Composite Form]` Fixed broken swipe.
- `[Colorpicker]` Fixed cases where change did not fire.
- `[Colorpicker]` Added short field option.
- `[Completion Chart]` Added more colors.
- `[Datagrid]` Fixed some misaligned icons on short row height.
- `[Datagrid]` Fixed issue that blank dropdown filter items would not show.
- `[Datagrid]` Added click arguments for more information on editor clicks and callback data.
- `[Datagrid]` Fixed wrong data on events on second page with expandable row.
- `[Datagrid]` Fixed focus / filter bugs.
- `[Datagrid]` Fixed bug with filter dropdowns on IOS.
- `[Datagrid]` Fixed column alignment when scrolling and RTL.
- `[Datagrid]` Fixed NaN error when using the colspan example.
- `[Datagrid]` Made totals work correctly when filtering.
- `[Datagrid]` Fixed issue with focus when multiple grids on a page.
- `[Datagrid]` Removed extra rows from the grid export when using expandable rows.
- `[Datagrid]` Fixed performance of select all on paging client side.
- `[Datagrid]` Fixed text alignment on header when some columns are not filterable.
- `[Datagrid]` Fixed wrong cursor on non actionable rows.
- `[Hierarchy]` Fixed layout issues.
- `[Mask]` Fixed issue when not using decimals in the pattern option.
- `[Modal]` Allow editor and dropdown to properly block the submit button.
- `[Menu Button]` Fixed beforeOpen so it also runs on submenus.
- `[Message]` Fixed XSS vulnerability.
- `[Pager]` Added fixes for RTL.
- `[List Detail]` Improved amount of space the header takes
- `[Multiselect]` Fixed problems when using the tab key well manipulating the multiselect.
- `[Multiselect]` Fixed bug with select all not working correctly.
- `[Multiselect]` Fixed bug with required validation rule.
- `[Spinbox]` Fixed issue on short field versions.
- `[Textarea]` Fixed issue with counter when in angular and on a modal.
- `[Toast]` Fixed XSS vulnerability.
- `[Tree]` Fixed checkbox click issue.
- `[Lookup]` Fixed issue in the example when running on Edge.
- `[Validation]` Fixed broken form submit validation.
- `[Vertical Tabs]` Fix cut off header.

(98 Jira Issues Solved this release, Backlog Dev 388, Design 105, Unresolved 595, Test Coverage 6.66%)

## v4.5.0

### v4.5.0 Key New Features

- `[Font]` Experimental new font added from IDS as explained.
- `[Datagrid]` Added support for pasting from excel.
- `[Datagrid]` Added option to specify which column stretches.

### v4.5.0 Behavior Changes

- `[Search Field]` `ESC` incorrectly cleared the field and was inconsistent. The proper key is `ctrl + backspace` (PC )/ `alt + delete` (mac) to clear all field contents. `ESC` no longer does anything.

### v4.5.0 Improvements

- `[Datagrid]` Added support for a two line title on the header.
- `[Dropdown]` Added onKeyPress override for custom key strokes.
- `[Contextual Action Panel]` Added an option to add a right side close button.
- `[Datepicker]` Added support to select ranges.
- `[Maintenence]` Added more unit tests.
- `[Maintenence]` Removed jsHint in favor of Eslint.

### v4.5.0 Code Updates / Breaking Changes

- `[Swaplist]` changed custom events `beforeswap and swapupdate` data (SOHO-7407). From `Array: list-items-moved` to `Object: from: container-info, to: container-info and items: list-items-moved`. It now uses data in a more reliable way

### v4.5.0 Bug Fixes

- `[Angular]` Added new wrappers for Radar, Bullet, Line, Pie, Sparkline.
- `[Angular Dropdown]` Fixed missing data from select event.
- `[Colorpicker]` Added better translation support.
- `[Compound Field]` Fixed layout with some field types.
- `[Datepicker]` Fixed issues with validation in certain locales.
- `[Datepicker]` Not able to validate on MMMM.
- `[Datagrid]` Fixed bug that filter did not work when it started out hidden.
- `[Datagrid]` Fixed issue with context menu not opening repeatedly.
- `[Datagrid]` Fixed bug in indeterminate paging with smaller page sizes.
- `[Datagrid]` Fixed error when editing some numbers.
- `[Datagrid]` Added support for single line markup.
- `[Datagrid]` Fixed exportable option, which was not working for both csv and xls export.
- `[Datagrid]` Fixed column sizing logic to work better with alerts and alerts plus text.
- `[Datagrid]` Fixed bug when reordering rows with expandable rows.
- `[Datagrid]` Added events for opening and closing the filter row.
- `[Datagrid]` Fixed bugs on multiselect + tree grid.
- `[Datagrid]` Fixed problems with missing data on click events when paging.
- `[Datagrid]` Fixed problems editing with paging.
- `[Datagrid]` Fixed Column alignment calling updateDataset.
- `[Datagrid]` Now passes sourceArgs for the filter row.
- `[Dropdown]` Fixed cursor on disabled items.
- `[Editor]` Added paste support for links.
- `[Editor]` Fixed bug that prevented some shortcut keys from working.
- `[Editor]` Fixed link pointers in readonly mode.
- `[Expandable Area]` Fixed bug when not working on second page.
- `[General]` Some ES6 imports missing.
- `[Personalization]` Added support for cache bust.
- `[Locale]` Fixed some months missing in some cultures.
- `[Listview]` Removed redundant resize events.
- `[Line]` Fixed problems updating data.
- `[Mask]` Fixed bug on alpha masks that ignored the last character.
- `[Modal]` Allow enter key to be stopped for forms.
- `[Modal]` Allow filter row to work if a grid is on a modal.
- `[Fileupload]` Fixed bug when running in Contextual Action Panel.
- `[Searchfield]` Fixed wrong width.
- `[Step Process]` Improved layout and responsive.
- `[Step Process]` Improved wrapping of step items.
- `[Targeted Achievement]` Fixed icon alignment.
- `[Timepicker]` Fixed error calling removePunctuation.
- `[Text Area]` Adding missing classes for use in responsive-forms.
- `[Toast]` Fixed missing animation.
- `[Tree]` Fixed a bug where if the callback is not async the node wont open.
- `[Track Dirty]` Fixed error when used on a file upload.
- `[Track Dirty]` Did not work to reset dirty on editor and Multiselect.
- `[Validation]` Fixed more extra events firing.

(67 Jira Issues Solved this release, Backlog Dev 378, Design 105, Unresolved 585, Test Coverage 6% )
