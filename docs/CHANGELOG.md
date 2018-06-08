## <a name="version-4.7.0">4.7.0</a>

[Full Jira Release Notes](https://bit.ly/2HyT3zF)\
[Npm Package](https://www.npmjs.com/package/ids-enterprise)\
[Angular Components Change Log](https://github.com/infor-design/enterprise-ng/blob/master/CHANGELOG.md)

### <a name="version-4.7.0-features">Features</a>
- `[Github]` The project was migrated to this github repo. And now Open source. We have all new builds running a functional and e2e test suite and improved developer workflow.
- `[Tag]` Added a Tag angular component ([#SOHO-8005](https://jira.infor.com/browse/SOHO-8006))
- `[Validate]` Exposed validate and removeMessage methods. ([#SOHO-8003](https://jira.infor.com/browse/SOHO-8003))
- `[General]` Upgrade to Angular 6 ([#SOHO-7927](https://jira.infor.com/browse/SOHO-7927))
- `[General]` Introduced nightly versions in npm ([#SOHO-7804](https://jira.infor.com/browse/SOHO-7804))
- `[Multiselect]` A tooltip now shows if more content is selected than fits in the input. ([#SOHO-7799](https://jira.infor.com/browse/SOHO-7799))
- `[Datepicker]` Added an option to restrict moving to months that are not available to select from. ([#SOHO-7384](https://jira.infor.com/browse/SOHO-7384))
- `[Validation]` Added and icon alert([#SOHO-7225](https://jira.infor.com/browse/SOHO-7225)
- `[General]` Code is now available on ([public npm](https://www.npmjs.com/package/ids-enterprise)) ([#SOHO-7083](https://jira.infor.com/browse/SOHO-7083))

### <a name="version-4.7.0-fixes">Fixes</a>

- `[Lookup]` Fixed existing example that shows using an autocomplete on a lookup. ([#SOHO-8070](https://jira.infor.com/browse/SOHO-8070))
- `[Lookup]` Fixed existing example that shows creating a customized dialog on the lookup ([#SOHO-8069](https://jira.infor.com/browse/SOHO-8069))
- `[Lookup]` Fixed existing example that incorrectly showed a checkbox column. ([#SOHO-8068](https://jira.infor.com/browse/SOHO-8068))
- `[Line Chart]` Fixed an error when provoking the tooltip. ([#/SOHO-8051](https://jira.infor.com/browse/SOHO-8051))
- `[Module Tabs]` Fixed a bug toggling the menu on mobile ([#/SOHO-8043](https://jira.infor.com/browse/SOHO-8043))
- `[Autocomplete]` Fixed a bug that made enter key not work to select. ([#SOHO-8036](https://jira.infor.com/browse/SOHO-8036))
- `[Tabs]` Removed an errant scrollbar that appeared sometimes on IE ([#SOHO-8034](https://jira.infor.com/browse/SOHO-8034))
- `[Datagrid]` The drill down click event now currently shows the right row information in the event data. ([#SOHO-8023](https://jira.infor.com/browse/SOHO-8023))
- `[Datagrid]` Fixed a broken nested data example. ([#SOHO-8019](https://jira.infor.com/browse/SOHO-8019))
- `[Datagrid]` Fixed a broken paging example. ([#SOHO-8013](https://jira.infor.com/browse/SOHO-8013))
- `[Datagrid]` Hyperlinks now can be clicked when in a datagrid expandable row. ([#SOHO-8009](https://jira.infor.com/browse/SOHO-8009))
- `[Popupmenu]` Removed extra padding on icon menus ([#SOHO-8006](https://jira.infor.com/browse/SOHO-8006))
- `[Spinbox]` Range limits now work correctly ([#SOHO-7999](https://jira.infor.com/browse/SOHO-7999))
- `[Dropdown]` Fixed not working filtering on nosearch option ([#SOHO-7998](https://jira.infor.com/browse/SOHO-7998))
- `[Hierarchy]` Children layout and in general layouts where improved ([#SOHO-7992](https://jira.infor.com/browse/SOHO-7992))
- `[Buttons]` Fixed layout issues on mobile. ([#SOHO-7982](https://jira.infor.com/browse/SOHO-7982))
- `[Datagrid]` Fixed format initialization issue ([#SOHO-7982](https://jira.infor.com/browse/SOHO-7982))
- `[Lookup]` Fixed a problem that caused the lookup to only work once. ([#SOHO-7971](https://jira.infor.com/browse/SOHO-7971))
- `[Treemap]` Fix a bug using `fixture.detectChanges()` ([#SOHO-7969](https://jira.infor.com/browse/SOHO-7969))
- `[Textarea]` Fixed a bug that made it possible for the count to go to a negative value. ([#SOHO-7952](https://jira.infor.com/browse/SOHO-7952))
- `[Tabs]` Fixed a bug that made extra events fire. ([#SOHO-7948](https://jira.infor.com/browse/SOHO-7948))
- `[Toolbar]` Fixed a with showing icons and text in the overflowmenu. ([#SOHO-7942](https://jira.infor.com/browse/SOHO-7942))
- `[DatePicker]` Fixed an error when restricting dates. ([#SOHO-7922](https://jira.infor.com/browse/SOHO-7922))
- `[TimePicker]` Fixed sort order of times in arabic locales. ([#SOHO-7920](https://jira.infor.com/browse/SOHO-7920))
- `[Multiselect]` Fixed initialization of selected items ([#SOHO-7916](https://jira.infor.com/browse/SOHO-7916))
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

### <a name="version-4.7.0-chores">Chore & Maintenance</a>
- `[Timepicker]` Added functional and e2e tests ([#SOHO-7809](https://jira.infor.com/browse/SOHO-7809))
- `[General]` Restructured the project to clean up and seperate the demo app from code. ([#SOHO-7803](https://jira.infor.com/browse/SOHO-7803))

(56 Jira Issues Solved this release, Backlog Dev 218, Design 101, Unresolved 391, Test Count 232 Functional, 117 e2e )

## <a name="version-4.6.0">4.6.0</a>

[Full Jira Release Notes](https://bit.ly/2jodbem)\
[Npm Package](http://npm.infor.com)\
[Angular Components Change Log](https://github.com/infor-design/enterprise-ng/blob/master/CHANGELOG.md)\
[Example Site](http://usalvlhlpool1.infor.com/4.6.0/components/)

### <a name="version-4.6.0-key-new-features">Key New Features</a>
- `[Treemap]` New Component Added
- `[Website]` Launch of new docs site https://design.infor.com/code/ids-enterprise/latest
- `[Security]` Ids Now passes CSP (Content Security Policy) Compliance for info see docs/SECURITY.md
- `[Toolbar]` We added an updated toolbar to eventually replace the current one. This toolbar is much faster as it uses mainly css http://usalvlhlpool1.infor.com/4.6.0/components/toolbar-flex/list this can be used now but note we will eventually replace so expect a future breaking change from flex-toolbar to toolbar when all features are implemented. As of now collapsible search is not supported yet.

### <a name="version-4.6.0-behavior-changes">Behavior Changes</a>
- `[App Menu]` Now automatically closes when items are clicked on mobile devices

### <a name="version-4.6.0-improvements">Improvements</a>
- `[Angular]` Validation now allows dynamic functions
- `[Editor]` Added a clear method
- `[Locale]` Map iw locale to Hebrew
- `[Locale]` Now defaults locals with no country. For example en maps to en-US es and es-ES.
- `[Color Picker]` Added option to clear the color
- `[Angular]` Allow Formatters, Editors to work with Soho. without the migration script.
- `[Added a new labels example http://usalvlhlpool1.infor.com/4.6.0/components/form/example-labels.html
- `[Angular]` Added new Chart Wrappers (Line, Bar, Column ect )
- `[Datagrid]` Added file up load editor
- `[Editor]` Its possible to put a link on an image now

### <a name="version-4.6.0-breaking-changes">Code Updates / Breaking Changes</a>
- `[Templates]` The internal template engine changed for better XSS security as a result one feature is no longer supported.
If you have a delimiter syntax to embed html such as `{{& name}}` please change this to the `{{{name}}}` alternate syntax.
- `[jQuery]` Updated from 3.1.1 to 3.3.1

### <a name="version-4.6.0-bug-fixes">Bug Fixes</a>
- `[Angular]` Added fixes so that the soho.migrate script is no longer needed.
- `[Angular Datagrid]` Added filterWhenTyping option
- `[Angular Popup]` Expose close, isOpen and keepOpen
- `[Angular Linechart]` Added "xAxis" and "yAxis" options
- `[Angular Treemap]` Added new wrapper
- `[Angular Rating]` Added a rating wrapper.
- `[Angular Circle Page]` Added new wrapper
- `[Checkbox]` Fixed issue when you click the top left of the page, would toggle the last checkbox.
- `[Composite Form]` Fixed broken swipe.
- `[Colorpicker]` Fixed cases where change did not fire
- `[Colorpicker]` Added short field option
- `[Completion Chart]` Added more colors
- `[Datagrid]` Fixed some misaligned icons on short row height
- `[Datagrid]` Fixed issue that blank dropdown filter items would not show.
- `[Datagrid]` Added click arguments for more information on editor clicks and call back data.
- `[Datagrid]` Fixed wrong data on events on second page with expandable row
- `[Datagrid]` Fixed focus / filter bugs
- `[Datagrid]` Fixed bug with filter dropdowns on IOS
- `[Datagrid]` Fixed column alignment when scrolling and RTL
- `[Datagrid]` Fixed NaN error when using the colspan example
- `[Datagrid]` Made totals work correctly when filtering
- `[Datagrid]` Fixed issue with focus when multiple grids on a page
- `[Datagrid]` Removed extra rows from the grid export when using expandable rows
- `[Datagrid]` Fixed performance of select all on paging client side
- `[Datagrid]` Fixed text alignment on header when some columns are not filterable
- `[Datagrid]` Fixed wrong cursor on non actionable rows.
- `[Hierarchy]` Fixed layout issues
- `[Mask]` Fixed issue when not using decimals in the pattern option.
- `[Modal]` Allow editor and dropdown to properly block the submit button.
- `[Menu Button]` Fixed beforeOpen so it also runs on submenus.
- `[Message]` Fixed XSS vulnerability
- `[Pager]` Added fixes for RTL
- `[List Detail]` Improved amount of space the header takes
- `[Multiselect]` Fixed problems when using the tab key well manipulating the multiselect
- `[Multiselect]` Fixed bug with select all not working correctly
- `[Multiselect]` Fixed bug with required validation rule.
- `[Spinbox]` Fixed issue on short field versions
- `[Textarea]` Fixed issue with counter when in angular and on a modal
- `[Toast]` Fixed XSS vulnerability
- `[Tree]` Fixed checkbox click issue
- `[Lookup]` Fixed issue in the example when running on Edge
- `[Validation]` Fixed broken form submit validation
- `[Vertical Tabs]` Fix cut off header

(98 Jira Issues Solved this release, Backlog Dev 388, Design 105, Unresolved 595, Test Coverage 6.66%)

## <a name="version-4.5.0">4.5.0</a>

[Full Jira Release Notes](https://bit.ly/2GlnGJ1)\
[Npm Package](http://npm.infor.com)\
[Angular Components Change Log](https://github.com/infor-design/enterprise-ng/blob/master/CHANGELOG.md)\
[Example Site](http://usalvlhlpool1.infor.com/4.5.0/components/)

### <a name="version-4.5.0-key-new-features">Key New Features</a>
- `[font]` Experimental new font added from IDS. You can enable the new font as explained on http://bit.ly/2p2sjjZ
- `[Datagrid]` Added support for pasting from excel
- `[Datagrid]` Added option to specify which column stretches

### <a name="version-4.5.0-behavior-changes">Behavior Changes</a>
- `[Search Field]` ESC incorrectly cleared the field and was inconsistent. The proper key is ctrl + backspace (PC )/ alt + delete (mac) to clear all field contents. ESC no longer does anything.

### <a name="version-4.5.0-improvements">Improvements</a>
- `[Datagrid]` Added support for a two line title on the header
- `[Dropdown]` Added onKeyPress override for custom key strokes
- `[Datepicker]` Added support to select ranges
- `[More unit tests
- `[Contextual Action Panel]` Added an option to add a right side close button.
- `[Removed jsHint in favor of Eslint

### <a name="version-4.5.0-breaking-changes">Code Updates / Breaking Changes</a>
- `[Swaplist]` changed custom events `beforeswap and swapupdate` data from `Array: list-items-moved` to `Object: from: container-info, to: container-info and items: list-items-moved` to use data more reliable way by the (SOHO-7407).

### <a name="version-4.5.0-bug-fixes">Bug Fixes</a>
- `[Angular]` Added new wrappers for Radar, Bullet, Line, Pie, Sparkline
- `[Angular Dropdown]` Fixed missing data from select event
- `[Colorpicker]` Added better translation support
- `[Compound Field]` Fixed layout with some field types
- `[Datepicker]` Fixed issues with validation in certain locales
- `[Datepicker]` Not able to validate on MMMM
- `[Datagrid]` Fixed bug that filter did not work when it started out hidden.
- `[Datagrid]` Fixed issue with context menu not opening repeatedly
- `[Datagrid]` Fixed bug in indeterminate paging with smaller page sizes
- `[Datagrid]` Fixed error when editing some numbers
- `[Datagrid]` Added support for single line markup
- `[Datagrid]` Fixed exportable option, which was not working for both csv and xls export
- `[Datagrid]` Fixed column sizing logic to work better with alerts and alerts + text
- `[Datagrid]` Fixed bug when reordering rows with expandable rows
- `[Datagrid]` Added events for opening and closing the filter row.
- `[Datagrid]` Fixed bugs on multiselect + tree grid
- `[Datagrid]` Fixed problems with missing data on click events when paging
- `[Datagrid]` Fixed problems editing with paging
- `[Datagrid]` Fixed Column alignment calling updateDataset
- `[Datagrid]` Now passes sourceArgs for the filter row
- `[Dropdown]` Fixed cursor on disabled items
- `[Editor]` Added paste support for links
- `[Editor]` Fixed bug that prevented some shortcut keys from working.
- `[Editor]` Fixed link pointers in readonly mode
- `[Expandable Area]` Fixed bug when not working on second page
- `[General]` Some ES6 imports missing
- `[Personalization]` Added support for cache bust
- `[Locale]` Fixed some months missing in some cultures
- `[Listview]` Removed redundant resize events
- `[Line]` Fixed problems updating data
- `[Mask]` Fixed bug on alpha masks that ignored the last character
- `[Modal]` Allow enter key to be stopped for forms. Allow filter row to work if a grid is on a modal.
- `[Fileupload]` Fixed bug when running in Contextual Action Panel
- `[Searchfield]` Fixed wrong width
- `[Step Process]` Improved layout and responsive
- `[Step Process]` Improved wrapping of step items
- `[Targeted Achievement]` Fixed icon alignment
- `[Timepicker]` Fixed error calling removePunctuation
- `[Text Area]` Adding missing classes for use in responsive-forms.
- `[Toast]` Fixed missing animation
- `[Toolbar]` Added
- `[Tree]` Fixed a bug where if the callback is not async the node wont open.
- `[Track Dirty]` Fixed error when used on a file upload
- `[Track Dirty]` Did not work to reset dirty on editor and Multiselect
- `[Validation]` Fixed more extra events firing

(67 Jira Issues Solved this release, Backlog Dev 378, Design 105, Unresolved 585, Test Coverage 6% )
