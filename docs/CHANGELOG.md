# What's New with Enterprise

## v4.99.0

### v4.99.0 Features

- `[Calendar]` Added `customSort`. ([#8836](https://github.com/infor-design/enterprise/issues/8836))
- `[Datagrid]` Added `scrollRowIntoView`. ([NG#1761](https://github.com/infor-design/enterprise-ng/issues/1761))
- `[FileuploadAdvanced]` Added beforefileupload event in handleFileUpload method. ([#8904](https://github.com/infor-design/enterprise/issues/8904))
- `[Listview]` Added compact layout in listview. ([#8959](https://github.com/infor-design/enterprise/issues/8959))
- `[Modal]` Added promise option for `beforeclose` event. ([#8779](https://github.com/infor-design/enterprise/issues/8779))
- `[Module Tabs]` Updated tab colors. ([#8831](https://github.com/infor-design/enterprise/issues/8831))
- `[Notification]` Added a callback function setting to be called when the notification is closed. ([#8767](https://github.com/infor-design/enterprise/issues/8767))

### v4.99.0 Fixes

- `[Autocomplete]` Fixed a bug where autocomplete items are not shown when press key down. ([#8943](https://github.com/infor-design/enterprise-/issues/8943))
- `[ContextualToolbar]` Fixed datagrid hover color for contextual toolbar when a row is selected. ([#8980](https://github.com/infor-design/enterprise-/issues/8980))
- `[Datagrid]` Fixed a bug where filters would error in some cases in an angular app. ([#1791](https://github.com/infor-design/enterprise-ng/issues/1791))
- `[Datagrid]` Fixed a bug in compact mode where datagrid filters doesn't extend all throughout the parents width. ([#8900](https://github.com/infor-design/enterprise-/issues/8900))
- `[Datagrid]` Fixed data return by select event on datagrid when having filter on. ([#8905](https://github.com/infor-design/enterprise/issues/8905))
- `[Datagrid]` Optimize the initial loading of datagrids with filterable setting. ([#8935](https://github.com/infor-design/enterprise/issues/8935))
- `[Datagrid]` Adjusted the padding of expandable detail rows in datagrid. ([#8950](https://github.com/infor-design/enterprise/issues/8950))
- `[Datagrid]` Remove modification in calculateTextWidth that had incorrect selectors. ([#8938](https://github.com/infor-design/enterprise/issues/8938))
- `[Datagrid]` Updated styles so pager works on cards. ([NG#1756](https://github.com/infor-design/enterprise-ng/issues/1756))
- `[Datagrid]` Fixed a bug where text is misaligned in action dropdown . ([#8957](https://github.com/infor-design/enterprise-ng/issues/8957))
- `[Datagrid]` Fixed auto sizing on columns in tree grid. ([#8646](https://github.com/infor-design/enterprise/issues/8646))
- `[Dropdown]` Removed excess space on dropdown-wrapper class. ([#8894](https://github.com/infor-design/enterprise/issues/8894))
- `[Datagrid]` Fixed special characters being encoded in editor. ([#8963](https://github.com/infor-design/enterprise/issues/8963))
- `[Datagrid]` Fixed selected filters being cleared when changing row size. ([NG#1759](https://github.com/infor-design/enterprise-ng/issues/1759))
- `[General]` Upgrade dependencies, this involved updating sass and test dependencies with a few css deprecations that were fixed. ([#8947](https://github.com/infor-design/enterprise-ng/issues/8947))
- `[Locale]` Fixed translation issue of `small` into Spanish. ([#8962](https://github.com/infor-design/enterprise-wc/issues/8962)
- `[Locale]` Fixed translation issue of `Available` into Thai and Italian. ([#8786](https://github.com/infor-design/enterprise-wc/issues/8786)
- `[Message]` Updated docs in settings. ([#8839](https://github.com/infor-design/enterprise/issues/8839))
- `[ModuleNav]` Fixed a bug where the tooltip was not showing when collapsed by default. ([NG#1678](https://github.com/infor-design/enterprise-ng/issues/1678))
- `[Swaplist]` Improved the size of the swaplist's drop area when there is no existing items. ([#8956](https://github.com/infor-design/enterprise/issues/8956))
- `[Toolbar]` Fixed uncaught error when destroying the toolbar. ([#8946](https://github.com/infor-design/enterprise/issues/8946))
- `[Tabs]` Fixed a bug where focus state is undefined when using breadcrumbs startup. ([#8910](https://github.com/infor-design/enterprise/issues/8910))
- `[Validation]` Add guards for new setting in case it is undefined. ([#8981](https://github.com/infor-design/enterprise/issues/8981))
- `[Datagrid]` Fixed the filterWhenTyping feature, so that any input change (including backspace or cut/paste which previously did nothing) will update the search results. ([#9007](https://github.com/infor-design/enterprise/issues/9007))

## v4.98.3

### v4.98.3 Fixes

- `[ContextualToolbar]` Fixed datagrid hover color for contextual toolbar when a row is selected. ([#8980](https://github.com/infor-design/enterprise-/issues/8980))

## v4.98.2

### v4.98.2 Fixes

- `[Validation]` Add guards for new setting in case it is undefined. ([#8981](https://github.com/infor-design/enterprise/issues/8981))

## v4.98.1

### v4.98.1 Fixes

- `[Tabs]` Fixed a bug where focus state is undefined when using breadcrumbs startup. ([#8910](https://github.com/infor-design/enterprise/issues/8910))

## v4.98.0

### v4.98.0 Features

- `[Busy Indicator]` Added circular loading type. ([#8662](https://github.com/infor-design/enterprise/issues/8662))
- `[Datagrid]` Add the ability for isEditable on selection checkbox columns to disable row selection. ([#8915](https://github.com/infor-design/enterprise-ng/issues/8915))
- `[Datagrid]` Add the ability for isEditable on selection checkbox columns to disable row selection on tree grid with child selection. ([#1](https://github.com/infor-design/enterprise/issues/8915))
- `[Pie Chart]` Fixed alignment bug in chart on RTL. ([NG#1736](https://github.com/infor-design/enterprise-ng/issues/1736))
- `[Mask]` Added setting `allowTrailingDecimalZeros` to always display decimals in input mask. ([NG#1715](https://github.com/infor-design/enterprise-ng/issues/1715))
- `[Tab]` Selecting tabs in overflow menu will move the tab to a visible space. ([#8016](https://github.com/infor-design/enterprise/issues/8016))

### v4.98.0 Fixes

- `[Button]` Fixed a bug where disabled button are not properly rendered in widgets. ([#8893](https://github.com/infor-design/enterprise/issues/8893))
- `[Calendar]` Fixed `selectDay` being called twice on clicking events. ([#8769](https://github.com/infor-design/enterprise/issues/8769))
- `[Button]` Fixed primary buttons on header flex toolbar. ([#8669](https://github.com/infor-design/enterprise/issues/8669))
- `[Cards]` Fixed a bug selected and deselected event are not triggered on action. ([NG#1731](https://github.com/infor-design/enterprise-ng/issues/1731))
- `[Datagrid]` Fixed demo app problem on the example page, not able to drag. ([#8920](https://github.com/infor-design/enterprise/issues/8920))
- `[Datagrid]` Fixed selecting issue on inline editor by adding `selectOnEdit` setting. ([#8870](https://github.com/infor-design/enterprise/issues/8870))
- `[Datagrid]` Fixed a bug in search keyword not functioning properly when using special characters. ([#8864](https://github.com/infor-design/enterprise/issues/8864))
- `[Datagrid]` Fixed layout issue on switch in personalization dialog. ([#8913](https://github.com/infor-design/enterprise/issues/8913))
- `[Datagrid]` Fixed asterisk being cut off when `textOverflow` is set to ellipsis. ([NG#1651](https://github.com/infor-design/enterprise-ng/issues/1651))
- `[Datagrid]` Fixed an error expanding rows with frozen columns. ([#8889](https://github.com/infor-design/enterprise/issues/8889))
- `[Datagrid]` Fixed incorrect layouts on the personalization dialog in RTL mode. ([#8924](https://github.com/infor-design/enterprise/issues/8924))
- `[Datagrid]` Refresh pager when `applyFilter` is called. ([#8744](https://github.com/infor-design/enterprise/issues/8744))
- `[Datagrid]` Fixed issue on selecting rows in group. ([NG#1740](https://github.com/infor-design/enterprise-ng/issues/1740))
- `[Datepicker]` Fixed a bug where the readonly button could be hovered. ([#8923](https://github.com/infor-design/enterprise/issues/8923))
- `[Modal]` Removed accordion fixed width when used in modal. ([NG#1719](https://github.com/infor-design/enterprise-ng/issues/1719))
- `[Tab]` Selecting an item in the `appmenu` accordion will also select the corresponding assigned tab to it (via `tab-id`). ([NG#1665](https://github.com/infor-design/enterprise-ng/issues/1665))
- `[Tab]` Selecting tabs in overflow menu will move the tab to a visible space. ([#8880](https://github.com/infor-design/enterprise/issues/8880))
- `[Text]` Selecting text was not showing up in safari. ([#8926](https://github.com/infor-design/enterprise/issues/8926))
- `[Switch]` Fix issue of not being able to click the label. ([#8896](https://github.com/infor-design/enterprise/issues/8896))

## v4.97.0

### v4.97.0 Features

- `[Datagrid]` Added searched event for toolbar search. ([#8814](https://github.com/infor-design/enterprise/issues/8814))
- `[Datagrid]` Added setting `overrideTabbing` to disable tabbing sequence of datagrid which will allow custom tabbing from users. ([#8825](https://github.com/infor-design/enterprise/issues/8825))
- `[Weekview]` Added settings `showOvernightBothDays` and `overnightLabel` to customize overnight days. ([#8630](https://github.com/infor-design/enterprise/issues/8630))
- `[Tabs Vertical]` Added settings `moduleTabsTooltips` available for tabs vertical to for showing tooltips. ([#8846](https://github.com/infor-design/enterprise/issues/8846))
- `[Tests]` Changed test framework to playwright. ([#8549](https://github.com/infor-design/enterprise-wc/issues/8549))
- `[Switch]` Update switch design. ([#8852](https://github.com/infor-design/enterprise/issues/8852))

### v4.97.0 Fixes

- `[Autocomplete]` Fixed losing focus on keydown. ([#8618](https://github.com/infor-design/enterprise/issues/8618))
- `[Calendar]` Fixed `selectDay` being called twice on clicking events. ([#8769](https://github.com/infor-design/enterprise/issues/8769))
- `[Charts]` Fixed a bug where the `charts.setSelected()` method was not working in multiple charts in a single page. ([#NG#1671](https://github.com/infor-design/enterprise-ng/issues/1671))
- `[Datagrid]` Fixed incorrect updates in commitCellEditUtil. ([#8850](https://github.com/infor-design/enterprise/issues/8850))
- `[Datagrid]` Fixed a bug where button gets focus always during editing of lookup field. ([#8758](https://github.com/infor-design/enterprise/issues/8758))
- `[Datagrid]` Added `cellLayout` setting to remove datagrid cell layout from expandable rows. ([NG#1524](https://github.com/infor-design/enterprise-ng/issues/1524))
- `[Datagrid]` Fixed cell value from argument passed on hyperlink click. ([#8762](https://github.com/infor-design/enterprise/issues/8762))
- `[Datagrid]` Fixed issue with textEllipsis in right aligned number columns. ([#8821](https://github.com/infor-design/enterprise/issues/8821))
- `[DataGrid]` Fixed bug with non refreshed tooltip in filter row conditions. ([#8773](https://github.com/infor-design/enterprise/issues/8773))
- `[Datepicker]` Fixed bug with week numbers not aligned properly with first day of week. ([#8720](https://github.com/infor-design/enterprise/issues/8720))
- `[Datepicker]` Fixed buttons truncated when using other languages. ([#8787](https://github.com/infor-design/enterprise/issues/8787))
- `[Donut]` Fixed bug where chart is cut off on bottom legend placement mode. ([#8755](https://github.com/infor-design/enterprise/issues/8755))
- `[Dropdown]` Fixed no results text still displaying after removing filter text. ([#8768](https://github.com/infor-design/enterprise/issues/8768))
- `[Grid]` Fixed an issue where module nav would change grid styles. ([#8828](https://github.com/infor-design/enterprise/issues/8828))
- `[Masthead]` Fixed size of image avatar. ([#8788](https://github.com/infor-design/enterprise/issues/8788))
- `[ModuleNav]` Fixed icon layout issue. ([#8788](https://github.com/infor-design/enterprise/issues/8788))
- `[ModuleNav]` Fixed `zindex` issue on the overlay in mobile mode. ([#8817](https://github.com/infor-design/enterprise/issues/8817))
- `[Multiselect]` Fixed bug in multiselect noted in RTL mode. ([#8811](https://github.com/infor-design/enterprise/issues/8811))
- `[NotificationBadge]` Fixed notification badge disappearance in toolbar on mobile view. ([#8812](https://github.com/infor-design/enterprise/issues/8812))
- `[Popupmenu]` Fixed bug in popupmenu when heading element is added in NG. ([NG#1700](https://github.com/infor-design/enterprise-ng/issues/1700))
- `[Tabs]` Fixed example page for disabling dismissible tags. ([NG#1697](https://github.com/infor-design/enterprise-ng/issues/1697))
- `[Timepicker]` Fixed bug in using custom format that has no separator. ([NG#1691](https://github.com/infor-design/enterprise-ng/issues/1691))

## v4.96.0

### v4.96.0 Features

- `[Calendar]` Added new setting `slideSelect` to allow users to select from span of range in creating an event. ([#8243](https://github.com/infor-design/enterprise/issues/8243))
- `[Calendar]` Added new setting `showTooltip` and `tooltipSettings` to display event information on event hover. ([#8453](https://github.com/infor-design/enterprise/issues/8453))
- `[ContextualActionPanel/Modal]` Added new settings `propagateStyle` and `compactPanel`. ([NG#1594](https://github.com/infor-design/enterprise-ng/issues/1594))
- `[Validation]` Added `truncated` setting to truncate and have a tooltip on validation messages. ([#7909](https://github.com/infor-design/enterprise/issues/7909))

### v4.96.0 Fixes

- `[About]` Removed `isMobile` in about spec. ([#8502](https://github.com/infor-design/enterprise/issues/8502))
- `[AppMenu]` Fixed hover state on menu button in app menu. ([#8723](https://github.com/infor-design/enterprise/issues/8723))
- `[Autocomplete]` Fixed autocomplete not properly highlighted on key down. ([#8618](https://github.com/infor-design/enterprise/issues/8618))
- `[Bar-Stacked/Column-Stacked]` Fixed an error encountered when having many records inside the graph. ([NG#1675](https://github.com/infor-design/enterprise-ng/issues/1675))
- `[Button]` Fixed different buttons stylings in personalization inside of content form. ([#8714](https://github.com/infor-design/enterprise/issues/8714))
- `[Calendar]` Fixed `monthrendered` being executed twice in week view and day view. ([#8469](https://github.com/infor-design/enterprise/issues/8469))
- `[Calendar]` Fixed calendar event popup render in mobile view. ([#8675](https://github.com/infor-design/enterprise/issues/8675))
- `[Datagrid]` Fixed `loadData` and `updateDataset` API to render the correct pager and it's data. ([#8677](https://github.com/infor-design/enterprise/issues/8677))
- `[Datagrid]` Fixed an error in expandable rows where paging causes to render white html. ([NG#1656](https://github.com/infor-design/enterprise-ng/issues/1656))
- `[Datagrid]` Fixed dropdown keys not properly triggering when using keyboard. ([#8745](https://github.com/infor-design/enterprise/issues/8745))
- `[Datagrid]` Fixed cell changed trigger event on number and string comparison. ([#8719](https://github.com/infor-design/enterprise/issues/8719))
- `[Datagrid]` Fixed styling issue with one cell and frozen columns. ([#8728](https://github.com/infor-design/enterprise/issues/8728))
- `[Datagrid]` Fixed add row not triggering after cell commit. ([#8624](https://github.com/infor-design/enterprise/issues/8624))
- `[Datagrid]` Fixed an error that occurred in some situations. ([#8709](https://github.com/infor-design/enterprise/issues/8709))
- `[Datagrid]` Fixed an error that occurred when clicking on a dropdown cell after calling `updated` method. ([NG#1644](https://github.com/infor-design/enterprise-ng/issues/1644))
- `[Datagrid]` Fixed a bug where date would be cleared after updating cell on different locales. ([NG#1710](https://github.com/infor-design/enterprise-ng/issues/1710))
- `[Datepicker]` Fixed focus date not properly assigned when calendar is used as datepicker. ([#8585](https://github.com/infor-design/enterprise/issues/8585))
- `[Dropdown]` Fixed dropdown height when `showTags` is set to true. ([#8566](https://github.com/infor-design/enterprise/issues/8566))
- `[Dropdown]` Fixed RTL alignments and border colors for field filter. ([#8659](https://github.com/infor-design/enterprise/issues/8659))
- `[FileuploadAdvanced]` Added fileupload-advanced in homepage widget. ([#7892](https://github.com/infor-design/enterprise/issues/7892))
- `[Grid]` Updated style adjustment on screen width for when module nav is expanded. ([#8485](https://github.com/infor-design/enterprise/issues/8485))
- `[Icons]` Added new icons `trend-left` and `trend-right`. ([#8403](https://github.com/infor-design/enterprise/issues/8403))
- `[Icons]` Added new icons `user-remove`, `trending-down`, `snooze`  and `trending-up`. ([#8403](https://github.com/infor-design/enterprise/issues/8403))
- `[Locale]` Fixed issue parsing BitInt sized numbers. ([#8737](https://github.com/infor-design/enterprise/issues/8737))
- `[Lookup]` Fixed bug on lookup not using minWidth settings. ([#8626](https://github.com/infor-design/enterprise/issues/8626))
- `[Lookup]` Fixed a bug where tooltip was not showing after selecting an item in lookup. ([#1646](https://github.com/infor-design/enterprise-ng/issues/1646))
- `[Listview]` Fixed positioning of list alert icons in RTL mode. ([#8724](https://github.com/infor-design/enterprise/issues/8724))
- `[Module Nav]` Fixed module nav switcher text was not vertically aligned. ([#8736](https://github.com/infor-design/enterprise/issues/8736))
- `[Module Nav]` Fixed module nav refreshing selected in accordion when closing then opening. ([#8527](https://github.com/infor-design/enterprise/issues/8527))
- `[Monthview]` Fixed monthview not updating after changing activeDate. ([NG#1659](https://github.com/infor-design/enterprise-ng/issues/1659))
- `[Popup Menu]` Fixed bug on popupmenu showing behind app menu on mobile. ([#8582](https://github.com/infor-design/enterprise/issues/8582))
- `[Popup Menu]` Fixed bug on popupmenu not opening on second right click. ([#8637](https://github.com/infor-design/enterprise/issues/8637))
- `[Spinbox]` Fixed bug where `updateVal` did not consider the min/max settings when updating. ([NG#1681](https://github.com/infor-design/enterprise-ng/issues/1681))
- `[Tabs]` Fixed the focus state border bottom being cut off in horizontal tabs. ([#8644](https://github.com/infor-design/enterprise/issues/8644))

## v4.95.0

### v4.95.0 Important Changes

- `[General]` Using googleapis CDN for the design system fonts is no longer recommended due to global cross border data protection requirements. It is now recommended to download, embed, and serve the font locally with your application. Target completion for fix: with next major product release (Oct. 2024). See [typography docs](https://github.com/infor-design/enterprise/blob/main/src/components/typography/readme.md#font-family) for details and config. ([#8635](https://github.com/infor-design/enterprise/issues/8635))

### v4.95.0 Features

- `[About]` Added copy to clipboard button. ([#8438](https://github.com/infor-design/enterprise/issues/8438))
- `[Homepage]` Added setting for background images. ([#8600](https://github.com/infor-design/enterprise/issues/8600))
- `[Buttons]` Added new button styles for a sleeker look. With no ripple effect and reduced padding and some color and focus changes. ([#8557](https://github.com/infor-design/enterprise/issues/8557))
- `[Locale]` Fixed incorrect `nn-NO` and `no-NO` locales. ([#8647](https://github.com/infor-design/enterprise/issues/8647))
- `[Modal]` Added a new setting `buttonsetTextWidth` to specify the width of the buttons in the modal. Tooltips are now automatically added when text within the buttons is truncated. ([#8639](https://github.com/infor-design/enterprise/issues/8639))
- `[Module Nav]` Added setting `disableSwitcher` to disable nav switcher. ([#8381](https://github.com/infor-design/enterprise/issues/8381))
- `[TabsModule]` Added setting called `equalTabWidth` to make tabs equal of width. ([#6990](https://github.com/infor-design/enterprise/issues/6990))
- `[Timeline]` Added fix to timeline layout. ([#8586](https://github.com/infor-design/enterprise/issues/8586))

### v4.95.0 Fixes

- `[Avatar/AppMenu]` Fixed size of the avatar on app menu. ([#8631](https://github.com/infor-design/enterprise/issues/8631))
- `[Button]` Fixed unneeded timeout in performAnimation. ([#8541](https://github.com/infor-design/enterprise/issues/8541))
- `[Cards]` Fixed title and button regression and position. ([#8602](https://github.com/infor-design/enterprise/issues/8602))
- `[Calendar]` Fixed custom colors render of events. ([#7826](https://github.com/infor-design/enterprise/issues/7826))
- `[Calendar]` Fixed modal button and input positions. ([#8657](https://github.com/infor-design/enterprise/issues/8657))
- `[Contextual Action Panel]` Fixed added padding on contextual action panel. ([#8553](https://github.com/infor-design/enterprise/issues/8553))
- `[Dropdown/Lookup]` Add option to remove margin in dropdown and lookup wrapper.([#8492](https://github.com/infor-design/enterprise/issues/8492))
- `[Datagrid]` Fixed bug with invisible columns when frozen. ([#8617](https://github.com/infor-design/enterprise/issues/8617))
- `[Datagrid]` Fixed selected row color in dark theme. ([#8467](https://github.com/infor-design/enterprise/issues/8467))
- `[Datagrid]` Fixed xss handling in lookup. ([#8561](https://github.com/infor-design/enterprise/issues/8561))
- `[Datagrid]` Fixed an error parsing some dates. ([#8627](https://github.com/infor-design/enterprise/issues/8627))
- `[Datagrid]` Fixed unable to use the left/right arrow keys on the text in an editable cell. ([#8457](https://github.com/infor-design/enterprise/issues/8457))
- `[Datagrid]` Fixed and documented `serialize` callback on columns. ([#8663](https://github.com/infor-design/enterprise/issues/8663))
- `[Datagrid]` Fixed search icon misalignment in dropdown cells. ([#8515](https://github.com/infor-design/enterprise/issues/8515))
- `[Datagrid]` Fixed search icon misalignment in dropdown cells. ([#8515](https://github.com/infor-design/enterprise/issues/8515))
- `[Datagrid]` Fixed an error editing on non first page in server side paging datagrid. ([#8537](https://github.com/infor-design/enterprise-ng/issues/1672))
- `[Datepicker]` Fixed focus date not properly assigned when calendar is used as datepicker. ([#8585](https://github.com/infor-design/enterprise/issues/8585))

- `[FieldFilter]` Added Default Field Filter Reset example page. ([NG#1641](https://github.com/infor-design/enterprise-ng/issues/1641))
- `[Forms]` Fixed fileupload layout in compact form. ([#8537](https://github.com/infor-design/enterprise/issues/8537))
- `[General]` Removed dups in sass packages thus reducing css file size. ([#8653](https://github.com/infor-design/enterprise/issues/8653))
- `[Header]` Fixed default color, and changed to flex layout by default. This is to allow for ids-breadcrumb to work. ([#2178](https://github.com/infor-design/enterprise-wc/issues/2178))
- `[Homepage]` Fixed bug that caused errors on resize when no widgets. ([#8611](https://github.com/infor-design/enterprise/issues/8611))
- `[Homepage]` Fixed a bug where the homepage height was incorrect. ([#8640](https://github.com/infor-design/enterprise/issues/8640))
- `[Lookup]` Fixed bug on lookup not using minWidth settings. ([#8626](https://github.com/infor-design/enterprise/issues/8626))
- `[Month Picker]` Fixed cursor for down button. ([#7315](https://github.com/infor-design/enterprise/issues/7315))\
- `[Pager]` Fixed misaligned hover state in RTL. ([#8508](https://github.com/infor-design/enterprise/issues/8508))
- `[Personalization]` Fixed bug with wrong colors in landmark form examples. ([#8625](https://github.com/infor-design/enterprise/issues/8625))
- `[Personalization]` Fixed bug with wrong colors on buttons in the sub header. ([#8610](https://github.com/infor-design/enterprise/issues/8610))
- `[Searchfield]` Fixed misalignment in clear icon on mobile. ([#8332](https://github.com/infor-design/enterprise/issues/8332))
- `[Tabs]` Fixed error of undefined handling in tabs activate. ([NG#1615](https://github.com/infor-design/enterprise-ng/issues/1615))
- `[Tabs]` Fixed error in tab popup. ([#8596](https://github.com/infor-design/enterprise/issues/8596))
- `[Tabs]` Fixed change hash not working in more button. ([#8536](https://github.com/infor-design/enterprise/issues/8536))
- `[Translations]` Added new translations fixing links in upload files. ([#8489](https://github.com/infor-design/enterprise/issues/8489))
- `[WeekView]` Fixed render of events on day view for non all-day events. ([#8530](https://github.com/infor-design/enterprise/issues/8530))
- `[WeekView]` Added start end hour example page. ([#8490](https://github.com/infor-design/enterprise/issues/8490))

## v4.94.0

### v4.94.0 Features

- `[Datagrid]` Added setting `showEditorIcons` to always display icon without hover. ([#8439](https://github.com/infor-design/enterprise/issues/8439))
- `[Datagrid]` Disabled filter dropdown if selection is only one. ([NG#1570](https://github.com/infor-design/enterprise-ng/issues/1570))
- `[Homepage]` Added row height style classes for widgets. ([#8211](https://github.com/infor-design/enterprise/issues/8211))
- `[Lookup]` Added placeholder setting in toolbar. ([#8416](https://github.com/infor-design/enterprise/issues/8416))
- `[Modal]` Added setting `draggable` to be able to drag modals. ([#7019](https://github.com/infor-design/enterprise/issues/7019))

### v4.94.0 Fixes

- `[Avatar]` Is no longer round by default. To use it in module nav add the new `square` class. ([#8539](https://github.com/infor-design/enterprise/issues/8539))
- `[Hierarchy]` Fixed broken size on avatars on hierarchy. ([#8584](https://github.com/infor-design/enterprise/issues/8584))
- `[Bar]` Fixed axis label visibility by adding font-size in `axis-labels` container. ([#8431](https://github.com/infor-design/enterprise/issues/8431))
- `[Button]` Added start and stop methods for generative timeout. ([#8541](https://github.com/infor-design/enterprise/issues/8541))
- `[Calendar]` Fixed event icon not properly rendered across week view mode. ([#8456](https://github.com/infor-design/enterprise/issues/8456))
- `[Calendar]` Fixed inconsistencies in border colors of events in calendar. ([#8452](https://github.com/infor-design/enterprise/issues/8452))
- `[Calendar]` Fixed height calculation of homepage. ([NG#1478](https://github.com/infor-design/enterprise-ng/issues/1478))
- `[Count]` Fixed misalignment in card header icon. ([#8448](https://github.com/infor-design/enterprise/issues/8448))
- `[Datagrid]` Fixed datagrid unable to have resize handle when using different column structure such as single lines. ([#8417](https://github.com/infor-design/enterprise/issues/8417))
- `[Datagrid]` Removed escaping HTML for cell nodes. ([#8516](https://github.com/infor-design/enterprise/issues/8516))
- `[Datagrid]` Fixed missing headers in frozen columns. ([NG#1590](https://github.com/infor-design/enterprise-ng/issues/1590))
- `[Datagrid]` Select event is not triggered when clicking a hyperlink. ([#8498](https://github.com/infor-design/enterprise/issues/8498))
- `[Datagrid]` Fixed searchfield icon alignment in filter. ([#8504](https://github.com/infor-design/enterprise/issues/8504))
- `[Datagrid/Card]` When in a card/widget the size of the datagrid would be incorrect and the pager would be moved to the wrong place. Now on default widget size the widget will contain the pager correctly. You may need css for custom sized widgets or non default widget sizes. ([#8496](https://github.com/infor-design/enterprise/issues/8372))
- `[Datepicker]` Added action in args passed on selected event. ([#8433](https://github.com/infor-design/enterprise/issues/8433))
- `[Forms]` Fixed fileupload layout in compact form. ([#8537](https://github.com/infor-design/enterprise/issues/8537))
- `[Homepage]` Fixed the resize issues of bar, column, donut and line when using in homepage. ([#8410](https://github.com/infor-design/enterprise/issues/8410))
- `[ModuleNav]` Fixed 6th level header accordion alignment. ([#8460](https://github.com/infor-design/enterprise/issues/8460))
- `[Radio]` Fixed alignment in short form of radio button. ([#8193](https://github.com/infor-design/enterprise/issues/8193))
- `[Radio]` Fixed alignment in datagrid radio button. ([#8349](https://github.com/infor-design/enterprise/issues/8349))
- `[Searchfield]` Fixed cut-off searchfield button. ([#8333](https://github.com/infor-design/enterprise/issues/8333))
- `[Searchfield]` Fixed clear button misalignment in RTL. ([#8342](https://github.com/infor-design/enterprise/issues/8342))
- `[Tabs]` Added guards on possible undefined objects. ([#8419](https://github.com/infor-design/enterprise/issues/8419))
- `[Tabs]` Fixed `beforeactivated` event not cancelling activation of tabs properly. ([NG#1578](https://github.com/infor-design/enterprise-ng/issues/1578))
- `[TabsHeader]` Fixed tooltip not showing properly when there is an ellipsis in tabs. ([#8446](https://github.com/infor-design/enterprise/issues/8446))
- `[Textarea]` Fixed the character count message in textarea.([#8449](https://github.com/infor-design/enterprise/issues/8449))
- `[Timeline]` Fixed alignment in widget.([#8524](https://github.com/infor-design/enterprise/issues/8524))
- `[Toolbar]` Fixed button shapes in toolbar. ([#8523](https://github.com/infor-design/enterprise/issues/8523))
- `[ToolbarFlex]` Fixed more button throwing error when click two times. ([#8430](https://github.com/infor-design/enterprise/issues/8430))

## v4.93.0

### v4.93.0 Features

- `[Calendar]` Added event tree option for calendar. ([3870](https://github.com/infor-design/enterprise/issues/3870))
- `[Contextual Action Panel]` Added content details and back button arrow. ([#8112](https://github.com/infor-design/enterprise/issues/8112))
- `[Datagrid]` Added data automation id of the column's filter operator. ([#8372](https://github.com/infor-design/enterprise/issues/8372))
- `[Datagrid]` Fix problems parsing dates in certain date formats. ([#8479](https://github.com/infor-design/enterprise/issues/8479))
- `[Locale]` Added `dateTimestamp` date format. ([#8373](https://github.com/infor-design/enterprise/issues/8373))
- `[Donut/Pie]` Added a legend title in donut and pie chart legends. ([#7933](https://github.com/infor-design/enterprise/issues/7933))
- `[Locale]` Added `dateTimestamp` date format. ([#8373](https://github.com/infor-design/enterprise/issues/8373))

### v4.93.0 Fixes

- `[Checkboxes]` Fixed RTL alignment for dirty tracker and required label. ([#8308](https://github.com/infor-design/enterprise/issues/8308))
- `[Colorpicker]` Fixed RTL alignment for color picker. ([#8306](https://github.com/infor-design/enterprise/issues/8306))
- `[Datagrid]` Fixed a bug unable to use the left/right arrow keys on the text in an editable cell. ([#8457](https://github.com/infor-design/enterprise/issues/8457))
- `[Datagrid]` Fixed series of misalignment in RTL for datagrid small row height. ([#8293](https://github.com/infor-design/enterprise/issues/8293))
- `[Datagrid]` Fixed a bug in datagrid cell where readonly background color was not recognizable. ([#8459](https://github.com/infor-design/enterprise/issues/8459))
- `[Datagrid]` Fixed a bug where the text moves upward when the cell is focused. ([#8472](https://github.com/infor-design/enterprise/issues/8472))
- `[Datagrid]` Fixed cell editable not getting focused on click. ([#8408](https://github.com/infor-design/enterprise/issues/8408))
- `[Datagrid]` Fixed wrong cell focus on blur in tree grid. ([NG#1616](https://github.com/infor-design/enterprise-ng/issues/1616))
- `[Datagrid]` Fixed cell editable not getting focused on click. ([#8408](https://github.com/infor-design/enterprise/issues/8408))
- `[Datagrid]` Fixed cell value replacing special characters on cell change. ([#8285](https://github.com/infor-design/enterprise/issues/8285))
- `[Datepicker]` Fixed datepicker popover footer button position in RTL. ([#8400](https://github.com/infor-design/enterprise/issues/8400))
- `[Datepicker]` Fixed increment/decrement and today key being activated in range mode. ([#8363](https://github.com/infor-design/enterprise/issues/8363))
- `[Docs]` Changed `attributes` property type to array/object. ([#8228](https://github.com/infor-design/enterprise/issues/8228))
- `[Fileupload]` Fixed padding in fileupload so that text and clear icon won't overlap. ([#8428](https://github.com/infor-design/enterprise/issues/8428))
- `[Header]` Fixed border line of search field in mobile view non collapsible. ([#7112](https://github.com/infor-design/enterprise/issues/7112))
- `[Lookup]` Fixed unexpected multiselect selecting lookup when entering manual input. ([NG#1635](https://github.com/infor-design/enterprise-ng/issues/1635))
- `[Masthead]` Fixed incorrect color on hover. ([#8391](https://github.com/infor-design/enterprise/issues/8391))
- `[Multiselect]` Fixed misaligned `x` buttons. ([#8421](https://github.com/infor-design/enterprise/issues/8421))
- `[Multiselect]` Fixed misaligned dropdown trigger in RTL. ([#8305](https://github.com/infor-design/enterprise/issues/8305))
- `[Lookup]` Fixed close button icon in lookup modal RTL. ([#8303](https://github.com/infor-design/enterprise/issues/8303))
- `[Masthead]` Fixed incorrect color on hover. ([8391](https://github.com/infor-design/enterprise/issues/8391))
- `[Masthead]` Fixed incorrectly visible `audible` spans. ([#8422](https://github.com/infor-design/enterprise/issues/8422))
- `[Modal]` Fixed a bug where hitting the escape button in a modal with subcomponents popover caused a crash. ([#8344](https://github.com/infor-design/enterprise/issues/8344))
- `[Modal]` Fixed a bug where the colorpicker did not close when hitting the escape key in the modal datagrid. ([#8411](https://github.com/infor-design/enterprise/issues/8411))
- `[Modal]` Fixed a bug where parent modal closes instead of currently active modal when pressing the escape key. ([NG#1639](https://github.com/infor-design/enterprise/issues/1639))
- `[Multiselect]` Fixed misaligned `x` buttons. ([8421](https://github.com/infor-design/enterprise/issues/8421))
- `[Pie]` Fixed an error encountered when having many records inside the graph. ([#8422](https://github.com/infor-design/enterprise/issues/8422))
- `[Popupmenu]` Fixed a bug where single select check items were getting deselected. ([8422](https://github.com/infor-design/enterprise/issues/8422))
- `[Searchfield]` Fixed alignment issues in go button.([#8334](https://github.com/infor-design/enterprise/issues/8334))
- `[Searchfield]` Fixed alignment issues in clear button.([#8399](https://github.com/infor-design/enterprise/issues/8399))
- `[Slider]` Fixed visibility of slider ticks inside of a modal.([#8397](https://github.com/infor-design/enterprise/issues/8397))
- `[Spinbox]` Fixed the position of number value in RTL. ([#8307](https://github.com/infor-design/enterprise/issues/8307))
- `[Tabs]` Fixed undefined errors when tabs vertical are set to no initial tabs. ([#8488](https://github.com/infor-design/enterprise/issues/8488))
- `[Tabs]` Fixed add tab button focus. ([#8294](https://github.com/infor-design/enterprise/issues/8294))
- `[TabsHeader]` Added fixes for the focus state and minor layout issue in left and right to left. ([#8405](https://github.com/infor-design/enterprise/issues/8405))
- `[TabsHeader]` Added setting `maxWidth` for tabs for long titles. ([#8434](https://github.com/infor-design/enterprise/issues/8434))
- `[TabsModule]` Added setting `maxWidth` for tabs for long titles. ([#8017](https://github.com/infor-design/enterprise/issues/8017))
- `[TabsModule]` Fixed alabaster in tabs module. ([#8404](https://github.com/infor-design/enterprise/issues/8404))
- `[Tree]` Added escape HTML in `updateNode`. ([#8427](https://github.com/infor-design/enterprise/issues/8427))
- `[Tooltip]` Allowed tooltip to be shown by fixing expression error when having special characters. ([#8017](https://github.com/infor-design/enterprise/issues/8017))

## v4.92.3

### v4.92.3 Fixes

- `[Datagrid]` Fixed cell editable not getting focused on click. ([8408](https://github.com/infor-design/enterprise/issues/8408))
- `[Datagrid]` Fixed cell value replacing special characters on cell change. ([8285](https://github.com/infor-design/enterprise/issues/8285))
- `[Popupmenu]` Fixed a bug where single select check items were getting deselected. ([8422](https://github.com/infor-design/enterprise/issues/8422))
- `[TabsHeader]` Added setting `maxWidth` for tabs for long titles. ([#8434](https://github.com/infor-design/enterprise/issues/8434))

## v4.92.2

### v4.92.2 Fixes

- `[Datagrid]` Fixed cell editable not getting focused on click. ([#8408](https://github.com/infor-design/enterprise/issues/8408))
- `[Masthead]` Fixed incorrect color on hover. ([8391](https://github.com/infor-design/enterprise/issues/8391))
- `[TabsHeader]` Added fixes for the focus state and minor layout issue in left and right to left. ([#8405](https://github.com/infor-design/enterprise/issues/8405))

## v4.92.1

### v4.92.1 Features

- `[Icons]` Added new icon `widgets-smart-panel`. ([#8403](https://github.com/infor-design/enterprise/issues/8403))
- `[Icons]` Fixed spaces in `icon-user-status-unknown` icon. ([#8403](https://github.com/infor-design/enterprise/issues/8403))

## v4.92.0

### v4.92.0 Features

- `[Avatar]` Added a new `avatar` class that can show initials and can be used in the module nav guest area. ([#8374](https://github.com/infor-design/enterprise/issues/8374))
- `[BusyIndicator]` Added loading indicator for AI action. ([#8312](https://github.com/infor-design/enterprise/issues/8312))
- `[Button]` Added Generative AI button type. ([#8310](https://github.com/infor-design/enterprise/issues/8310))
- `[Calendar]` Added new design for selected, hover, focused and current day in Calendar Monthview, Week View and Day View. ([#5065](https://github.com/infor-design/enterprise/issues/5065))
- `[Calendar]` Added feature of updating legends and disabled dates on before render of month. ([#8248](https://github.com/infor-design/enterprise/issues/8248))
- `[Datagrid]` Added option to disable tooltip in columns. ([#8252](https://github.com/infor-design/enterprise/issues/8252))
- `[Editor]` Added AI icon button in editor. ([#8311](https://github.com/infor-design/enterprise/issues/8311))
- `[Header]` Added an example configuration with both a hamburger and a back button. ([#8327](https://github.com/infor-design/enterprise/issues/8327))
- `[Icons]` Added new icons which are more substantial in look. ([#8129](https://github.com/infor-design/enterprise/issues/8129))
- `[Lookup]` Added css setting for lookup. ([#8206](https://github.com/infor-design/enterprise/issues/8206))

### v4.92.0 Fixes

- `[Bar Chart]` Fixed thrown errors when having duplicate sets in the dataset for bar chart. ([#8209](https://github.com/infor-design/enterprise/issues/8209))
- `[Cards]` Fixed widget header alignment with the parent. ([#8351](https://github.com/infor-design/enterprise/issues/8351))
- `[Cards]` Fixed title alignment for bordered and borderless. ([#8212](https://github.com/infor-design/enterprise/issues/8212))
- `[Checkbox]` Fixed focus border style. ([#8015](https://github.com/infor-design/enterprise/issues/8015))
- `[Contextual Action Panel]` Fixed alignments of searchfield icons in RTL. ([#8208](https://github.com/infor-design/enterprise/issues/8208))
- `[Datagrid]` Fixed frozen columns getting out of sync when columnReorder is set to true. ([#8198](https://github.com/infor-design/enterprise/issues/8198))
- `[Datagrid]` Replaced the toolbar with a flex toolbar for the editable example. ([#8093](https://github.com/infor-design/enterprise/issues/8093))
- `[Datagrid]` Fixed Hyperlink Formatter cssClass string resolution. ([#8340](https://github.com/infor-design/enterprise/issues/8340))
- `[Datagrid]` Fixed contextual toolbar auto hide when performing action. ([#8352](https://github.com/infor-design/enterprise/issues/8352))
- `[Dropdown]` Fixed handling for null, undefined objects passed to updateItemIcon method. ([#8353](https://github.com/infor-design/enterprise/issues/8353))
- `[Datagrid]` Fixed Hyperlink Formatter `cssClass` string resolution. ([#8340](https://github.com/infor-design/enterprise/issues/8340))
- `[Datagrid]` Fixed position of icons in trigger fields in datagrid editors. ([#8379](https://github.com/infor-design/enterprise/issues/8379))
- `[Dropdown]` Fixed handling for null, undefined objects passed to updateItemIcon method. ([#8353](https://github.com/infor-design/enterprise/issues/8353))
- `[Datagrid]` Fixed contextual toolbar auto hide when performing action. ([#8352](https://github.com/infor-design/enterprise/issues/8352))
- `[Fieldset]` Changed padding in reset for better compatibility. ([#1756](https://github.com/infor-design/enterprise-wc/issues/1756))
- `[Header]` Fixed bottom border styles in dark mode. ([#8152](https://github.com/infor-design/enterprise/issues/8152))
- `[Header/Personalization]` The default color is now alabaster (white) instead of azure. ([#7861](https://github.com/infor-design/enterprise/issues/7861))
- `[Link]` Changed selected border color for link card. ([#8225](https://github.com/infor-design/enterprise/issues/8225))
- `[Fieldset]` Changed padding in reset for better compatibility. ([#1756](https://github.com/infor-design/enterprise-wc/issues/1756))
- `[Homepage]` Adjusted top and bottom padding of the widgets. ([#8362](https://github.com/infor-design/enterprise-wc/issues/8362))
- `[Locale]` Changed all `zh` locales time format as suggested by native speakers. ([#8313](https://github.com/infor-design/enterprise/issues/8313))
- `[Lookup]` Fixed clear button in keyword search not updating search results on click. ([#8258](https://github.com/infor-design/enterprise/issues/8258))
- `[Masthead]` Fixed incorrect color on hover. ([8391](https://github.com/infor-design/enterprise/issues/8391))
- `[Mask]` Alternative approach for checking instance of RegExp if `instanceof RegExp` returns false. ([8365](https://github.com/infor-design/enterprise/issues/8365))
- `[Modal]` Fixed a bug where the modal would shift up when toggling a switch inside of it. ([#8018](https://github.com/infor-design/enterprise/issues/8018))
- `[Modal]` Fixed a bug where textarea field is bigger than other fields on screen widths less that 400px. ([#8125](https://github.com/infor-design/enterprise/issues/8125))
- `[Process Indicator]` Adjusted alignment of icon in compact process indicator. ([#8241](https://github.com/infor-design/enterprise/issues/8241))
- `[Popover]` Fixed string rendering issues for content. ([#1609](https://github.com/infor-design/enterprise/issues/1609))
- `[Pager]` Added `showPager` and `hidePager` method to show and hide the pager bar. ([#8094](https://github.com/infor-design/enterprise/issues/8094))
- `[Process Indicator]` Adjusted alignment of icon in compact process indicator. ([#8241](https://github.com/infor-design/enterprise/issues/8241))
- `[Scatterplot]` Fixed legend position to be centered inside the div parent. ([#8194](https://github.com/infor-design/enterprise/issues/8194))
- `[Searchfield]` Fixed compact size height. ([NG#1605](https://github.com/infor-design/enterprise-ng/issues/1605))
- `[Searchfield]` Updated hover color for header searchfield clear icon. ([#8223](https://github.com/infor-design/enterprise/issues/8223))
- `[Tabs]` Fixed size in close button of tab list. ([#8274](https://github.com/infor-design/enterprise/issues/8274))
- `[Tabs]` Adjusted icon alignment and color for searchfield in tabs. ([#8272](https://github.com/infor-design/enterprise/issues/8272))
- `[Tabs]` Fixed tabs add tab button focus. ([#8275](https://github.com/infor-design/enterprise/issues/8275))
- `[Tabs]` Added setting to disable error icon in validation. ([#8254](https://github.com/infor-design/enterprise/issues/8254))
- `[Tabs]` Fixed UI issues on counts. ([#8385](https://github.com/infor-design/enterprise/issues/8385))
- `[Tabs Header]` Fixed focus border not visible in classic contrast alabaster. ([#8265](https://github.com/infor-design/enterprise/issues/8265))
- `[Tabs Module]` Fixed more button not visible in alabaster. ([#8271](https://github.com/infor-design/enterprise/issues/8271))
- `[Tabs Vertical]` Fixed focus state outline when having scrollable. ([#8269](https://github.com/infor-design/enterprise/issues/8269))
- `[Widgets]` Removed small invisible border on borderless widget. ([#8380](https://github.com/infor-design/enterprise/issues/8380))

## v4.91.0

### v4.91.0 Features

- `[Dates]` Added a new `twoDigitYear` setting to set the switch over for two digit years. ([#8061](https://github.com/infor-design/enterprise/issues/8061))
- `[ModuleNav]` Added a new "guest" section and some new settings to toggle the search and module switcher section. ([#8232](https://github.com/infor-design/enterprise/issues/8232))
- `[ModuleNav]` Added `attributes` setting (for automation id) in the module nav switcher. ([#8270](https://github.com/infor-design/enterprise/issues/8270))

### v4.91.0 Fixes

- `[Accordion]` Fixed a bug where focus border was not fully shown in sub header. ([#8109](https://github.com/infor-design/enterprise/issues/8109))
- `[Breadcrumb]` Fixed a bug where overflow menu items don't fire a callback function. ([#8154](https://github.com/infor-design/enterprise/issues/8154))
- `[Cards/Widget]` Fixed vertical alignment of detail title in cards/widget. ([#8235](https://github.com/infor-design/enterprise/issues/8235))
- `[Charts]` Improved the positioning of chart legend color. ([#8159](https://github.com/infor-design/enterprise/issues/8159))
- `[Circlepager]` Fixed the positioning of the next and previous buttons. ([#8266](https://github.com/infor-design/enterprise/issues/8266))
- `[Bar Chart]` Displayed the x-axis ticks for the bar grouped when single group. ([#7976](https://github.com/infor-design/enterprise/issues/7976))
- `[Button]` Fixed wrong hover color on button. ([#8220](https://github.com/infor-design/enterprise/issues/8220))
- `[BusyIndicator]` Fixed updated method of busy indicator throwing error when calling with no parameters. ([#8257](https://github.com/infor-design/enterprise/issues/8257))
- `[Datagrid]` Fixed rendering issues on filter range when selected by render default. ([#8147](https://github.com/infor-design/enterprise/issues/8147))
- `[Datagrid]` Fixed the contextual toolbar not hiding after performing button actions. ([NG#1580](https://github.com/infor-design/enterprise-ng/issues/1580))
- `[Datagrid]` Fixed a bug where dropdown remains open when scrolling and modal is closed. ([#8127](https://github.com/infor-design/enterprise/issues/8127))
- `[Datagrid]` Fixed extra space increase on editable fields when clicking in and out of it. ([#8155](https://github.com/infor-design/enterprise/issues/8155))
- `[Datagrid]` Added `contentWidth` column setting to set width in formatters. ([#8132](https://github.com/infor-design/enterprise/issues/8132))
- `[Datagrid]` Fixed tab key navigation when using actionable mode when having editor. ([#8141](https://github.com/infor-design/enterprise/issues/8141))
- `[Datagrid]` Fixed tab key navigation when using actionable mode when having formatter. ([#8245](https://github.com/infor-design/enterprise/issues/8245))
- `[Datagrid]` Fixed invisible color on required icon in datagrid. ([#8260](https://github.com/infor-design/enterprise/issues/8260))
- `[Datagrid]` Fixed disabled color for colorpicker. ([#8218](https://github.com/infor-design/enterprise/issues/8218))
- `[Datagrid]` Fixed dropdown icon misalignment in extra small row height. ([#8216](https://github.com/infor-design/enterprise/issues/8216))
- `[Dropdown]` Fixed a bug where list is broken when empty icon is in the first option. ([#8105](https://github.com/infor-design/enterprise/issues/8105))
- `[Message]` Fixed success icon alignment in message header. ([#8240](https://github.com/infor-design/enterprise/issues/8240))
- `[ModuleNav]` Removed usage guidance from readme.md to support updated doc site structure. ([#8282](https://github.com/infor-design/enterprise/issues/8282))
- `[Pager]` Fixed double call on update pager when using keydown. ([#8156](https://github.com/infor-design/enterprise/issues/8156))
- `[Pie/Donut]` Fixed rendering issues when having bordered class in the widget. ([#8164](https://github.com/infor-design/enterprise/issues/8164))
- `[Personalization]` Removed box shadow on selected tabs. ([#8086](https://github.com/infor-design/enterprise/issues/8086))
- `[Popupmenu]` Fixed a bug where menu buttons did not close when toggled. ([#8232](https://github.com/infor-design/enterprise/issues/8232))
- `[Searchfield]` Fixed styling issues in RTL. ([#6982](https://github.com/infor-design/enterprise/issues/6982))
- `[Searchfield]` Fixed searchfield stylings in RTL and in mobile viewport. ([#8103](https://github.com/infor-design/enterprise/issues/8103))

## v4.90.0

### v4.90.0 Features

### v4.90.0 Fixes

- `[About]` Removed operating system field. ([#8118](https://github.com/infor-design/enterprise/issues/8118))
- `[Accordion]` Fixed a bug where the plus-minus icon shows ellipsis on mobile viewport. ([#8044](https://github.com/infor-design/enterprise/issues/8044))
- `[Badges]` Adjusted color and positioning of dismissible button in multiselect dropdown tags. ([#8036](https://github.com/infor-design/enterprise/issues/8036))
- `[Breadcrumb]` Fixed misaligned item in RTL in Safari browser. ([#8167](https://github.com/infor-design/enterprise/issues/8167))
- `[BusyIndicator]` Fixed unescaped html strings not rendering properly. ([#8189](https://github.com/infor-design/enterprise/issues/8189))
- `[Button]` Adjusted personalize button hover colors. ([#8035](https://github.com/infor-design/enterprise/issues/8035))
- `[Calendar]` Added additional check on triggering `eventclick` to avoid executing twice. ([#8051](https://github.com/infor-design/enterprise/issues/8051))
- `[Colorpicker]` Updated color palette for colorpicker. ([#8165](https://github.com/infor-design/enterprise/issues/8165))
- `[ColumnChart]` Fixed position of rotate feature of column chart in RTL. ([#8010](https://github.com/infor-design/enterprise/issues/8010))
- `[ContextualActionPanel]` Fixed close button layout for RTL. ([#8166](https://github.com/infor-design/enterprise/issues/8166))
- `[ContextualActionPanel]` Removed 'Run' button from vertical examples. ([#8120](https://github.com/infor-design/enterprise/issues/8120))
- `[Datagrid]` Fixed a bug where error icon was not showing in the correct position in RTL mode. ([#8022](https://github.com/infor-design/enterprise/issues/8022))
- `[Datagrid]` Fixed a bug where the drag handle was overlapping the header text in firefox. ([#8012](https://github.com/infor-design/enterprise/issues/8012))
- `[Datagrid]` Adjusted hover styling for search and expand buttons. ([#8078](https://github.com/infor-design/enterprise/issues/8078))
- `[Datagrid]` Fixed issue where cells with custom component are changed on update row. ([NG#1564](https://github.com/infor-design/enterprise-ng/issues/1564))
- `[Datagrid]` Fixed misalignment on date cells when selected. ([#8021](https://github.com/infor-design/enterprise/issues/8021))
- `[Datagrid]` Fixed an issue where the new row did not display an error tooltip on the first cell. ([#8071](https://github.com/infor-design/enterprise/issues/8071))
- `[Datagrid]` Fixed an issue where script values are executed on updating cell. ([#8083](https://github.com/infor-design/enterprise/issues/8083))
- `[Datagrid]` Fixed an issue where dirty tracker will appear even no change was made from the cell. ([#8020](https://github.com/infor-design/enterprise/issues/8020))
- `[Dropdown]` Fixed a bug where values containing double quotes threw an error. ([#8179](https://github.com/infor-design/enterprise/issues/8179))
- `[Homepage]` Improve hover animation after resize. ([#8201](https://github.com/infor-design/enterprise/issues/8201))
- `[Fileupload]` Added condition to not allow for input clearing for readonly and disabled. ([#8024](https://github.com/infor-design/enterprise/issues/8024))
- `[Locale]` Added new locales from the translation team. ([#8196](https://github.com/infor-design/enterprise/issues/8196))
- `[Modal]` Adjusted modal title spacing to avoid icon from cropping. ([#8031](https://github.com/infor-design/enterprise/issues/8031))
- `[Datagrid]` Added ability for expandable and summary rows to be updated after cell update. ([#8058](https://github.com/infor-design/enterprise/issues/8058))
- `[Tabs]` Changed all azure components like header and header tabs to be alabaster by default. ([#7861](https://github.com/infor-design/enterprise/issues/7861))

## v4.89.0

### v4.89.0 Features

- `[Icons]` Added new icon designs. ([#8129](https://github.com/infor-design/enterprise/issues/8129))
- `[Tabs]` Changed all azure components like header and header tabs to be alabaster by default. ([#7861](https://github.com/infor-design/enterprise/issues/7861))
- `[Timepicker]` Remove `disabled` prop in trigger button on enable call. ([NG#1567](https://github.com/infor-design/enterprise-ng/issues/1567))
- `[Modal]` Fixed the searchfield size when settings has title in toolbar. ([#8025](https://github.com/infor-design/enterprise/issues/8025))
- `[Page-Patterns]` Fixed background on hovered selected tab. ([#8088](https://github.com/infor-design/enterprise/issues/8088))
- `[ProcessIndicator]` Fixed icon alignment in RTL. ([#8168](https://github.com/infor-design/enterprise/issues/8168))
- `[Popupmenu]` Added fix for icon size in new. ([#8175](https://github.com/infor-design/enterprise/issues/8175))
- `[Popupmenu]` Fixed submenu icon is overlapped with the item label in RTL. ([#8172](https://github.com/infor-design/enterprise/issues/8172))
- `[Popupmenu]` Fixed popupmenu submenu not closing in some scenarios. ([#8043](https://github.com/infor-design/enterprise/issues/8043))
- `[Popupmenu]` Added fix for extra space in submenu text. ([#8161](https://github.com/infor-design/enterprise/issues/8161))
- `[Searchfield]` Fixed animation of collapsible searchfield. ([#8076](https://github.com/infor-design/enterprise/issues/8076))
- `[Searchfield]` Adjusted height so that focus is fully seen. ([#8085](https://github.com/infor-design/enterprise/issues/8085))
- `[Searchfield]` Fixed border and height for searchfield with categories in RTL. ([#8101](https://github.com/infor-design/enterprise/issues/8101))
- `[Searchfield]` Fixed border radius for searchfield with dropdown in RTL. ([#8102](https://github.com/infor-design/enterprise/issues/8102))
- `[Splitter]` Fixed position of splitter when using in modal. ([#8005](https://github.com/infor-design/enterprise/issues/8005))
- `[Tabs Header]` Fixed gradient color for personalizable overflowing header tabs. ([#8110](https://github.com/infor-design/enterprise/issues/8110))
- `[Tabs-Module]` Removed padding in embedded mode. ([#8060](https://github.com/infor-design/enterprise/issues/8060))
- `[Timepicker]` Removed `disabled` prop in trigger button on enable call. ([NG#1567](https://github.com/infor-design/enterprise-ng/issues/1567))
- `[Datagrid]` Added ability for expandable and summary rows to be updated after cell update. ([#8058](https://github.com/infor-design/enterprise/issues/8058))

### v4.89.0 Fixes

- `[Accordion]` Adjusted rules of accordion top border to be consistent whether open or closed. ([#7978](https://github.com/infor-design/enterprise/issues/7978))
- `[BarStacked]` Fixed the uneven legend spaces. ([#7874](https://github.com/infor-design/enterprise/issues/7874))
- `[Button]` Adjusted rule for primary button styling when hovered in new version. ([#7977](https://github.com/infor-design/enterprise/issues/7977))
- `[Button]` Adjusted rule for button styling on contextual action toolbars. ([#8084](https://github.com/infor-design/enterprise/issues/8084))
- `[Cards]` Adjusted menu button positioning for no header. ([#8081](https://github.com/infor-design/enterprise/issues/8081))
- `[Circlepager]` Fixed a bug causing a visual glitch when resizing the circle pager. ([#7894](https://github.com/infor-design/enterprise/issues/7894))
- `[Datagrid]` Fixed the position of empty message without icon in the datagrid. ([#7854](https://github.com/infor-design/enterprise/issues/7854))
- `[Datagrid]` Space between text in rows are not trimmed as default. ([#7849](https://github.com/infor-design/enterprise/issues/7849))
- `[Datagrid]` Added option to use for flex toolbar. ([#7928](https://github.com/infor-design/enterprise/issues/7928))
- `[Datagrid]` Whitespace should be shown on cell when expanded. ([#7848](https://github.com/infor-design/enterprise/issues/7848))
- `[Datagrid]` Additional check for modal width. ([#7923](https://github.com/infor-design/enterprise/issues/7923))
- `[Datagrid]` Additional check for select row when datagrid has grouping and filter. ([NG#1549](https://github.com/infor-design/enterprise-ng/issues/1549))
- `[Datepicker]` Adjusted sizing of monthview popup to better accommodate smaller dimensions. ([#7974](https://github.com/infor-design/enterprise/issues/7974))
- `[Datepicker]` Fixed datepicker prematurely closing after selecting a date when having a time format. ([#7916](https://github.com/infor-design/enterprise/issues/7916))
- `[Dropdown]` Fixed a bug where the text and dropdown icon were overlapping on smaller viewports. ([#8000](https://github.com/infor-design/enterprise/issues/8000))
- `[EmptyMessage]` Fixed empty message card content to center position. ([#7883](https://github.com/infor-design/enterprise/issues/7883))
- `[General]` Adjusted the reset for spans. ([#1513](https://github.com/infor-design/enterprise/issues/7854))
- `[Module Nav]` Fixed a bug where the settings was behind the main module nav element. ([#8063](https://github.com/infor-design/enterprise/issues/8063))
- `[Module Nav]` Fixed a bug where the accordion in the page container inherited module nav accordion styles. ([#8040](https://github.com/infor-design/enterprise/issues/7884))
- `[Pie/Donut]` Fixed the displayed legend when selecting a different one. ([#7845](https://github.com/infor-design/enterprise/issues/7845))
- `[Pie/Donut]` Fixed a bug in clicking legends causing to change whole list to the last clicked legend name. ([#8139](https://github.com/infor-design/enterprise/issues/8139))
- `[Pie/Donut]` Fixed a bug in where legends can be clicked if selectable settings set to false. ([#8140](https://github.com/infor-design/enterprise/issues/8140))
- `[Popupmenu]` Fixed shared menu not closing and opening correctly. ([NG#1552](https://github.com/infor-design/enterprise-ng/issues/1552))
- `[ProcessIndicator]` Adjusted icon sizing to remove gaps between separators. ([#7982](https://github.com/infor-design/enterprise/issues/7982))
- `[Radios]` Adjusted styling of checked disabled radio button. ([#8082](https://github.com/infor-design/enterprise/issues/8082))
- `[Searchfield]` Adjusted icon colors in classic. ([#7947](https://github.com/infor-design/enterprise/issues/7947))
- `[Searchfield]` Adjusted width on mobile. ([#6831](https://github.com/infor-design/enterprise/issues/6831))
- `[Slider]` Added handling of slider touch events. ([#7957](https://github.com/infor-design/enterprise/issues/7957))
- `[Spinbox]` Adjusted spinbox wrapper sizing to stop increment button from overflowing in classic. ([#7988](https://github.com/infor-design/enterprise/issues/7988))
- `[Tabs]` Fixed alabaster design issues in header, tab, tab-header, tabs-module, tabs-multi components. ([#7922](https://github.com/infor-design/enterprise/issues/7922))
- `[Tabs]` Adjusted placement of icons in tab list spillover. ([#7970](https://github.com/infor-design/enterprise/issues/7970))
- `[Tabs]` Fixed the focus state of radio button not fully shown in tabs. ([#7955](https://github.com/infor-design/enterprise/issues/7955))
- `[Targeted-Achievement]` Fixed waring color not displaying properly. ([#7891](https://github.com/infor-design/enterprise/issues/7891))
- `[Treemap]` Adjusted label styling in RTL. ([#6891](https://github.com/infor-design/enterprise/issues/6891))
- `[Validation]` Fixed the position of exclamation points of validation in non english localization. ([#5119](https://github.com/infor-design/enterprise/issues/5119))
- `[Weekview]` Added overnight event view when end time goes to next day. ([#7840](https://github.com/infor-design/enterprise/issues/7840))
- `[Weekview]` Fixed an issue with the week change when clicking the `Today` button. ([#7792](https://github.com/infor-design/enterprise/issues/7792))
- `[Weekview]` Fixed selected day keeps getting restarted when changing theme or mode in mobile view. ([#7927](https://github.com/infor-design/enterprise/issues/7927))
- `[Weekview]` Use abbreviated month names when in mobile size. ([#7924](https://github.com/infor-design/enterprise/issues/7924))

## v4.88.0

### v4.88.0 Features

- `[Checkbox]` Changed color of checkbox in dark mode. ([#7991](https://github.com/infor-design/enterprise/issues/7991))
- `[Form/Label]` Implemented a form layout designed to facilitate an inline design within a responsive-form container. ([#7764](https://github.com/infor-design/enterprise/issues/7764))
- `[Homepages]` Changed incorrect width on quad widgets. ([#8056](https://github.com/infor-design/enterprise/issues/8056))
- `[Module Nav]` Added usage guidance to docs. ([#7869](https://github.com/infor-design/enterprise/issues/7869))
- `[Module Nav]` Added mobile behaviors. ([#7804](https://github.com/infor-design/enterprise/issues/7804))
- `[Module Nav]` Fixed an alignment issue. ([#7934](https://github.com/infor-design/enterprise/issues/7934))
- `[Module Nav]` Added mobile click to close setting, and made breakpoints fire on resize, added hamburger logic and new mobile states per phone vs bigger. ([#8019](https://github.com/infor-design/enterprise/issues/8019))

### v4.88.0 Fixes

- `[Accordion]` Updated selected header text color. ([#7769](https://github.com/infor-design/enterprise/issues/7769))
- `[ApplicationMenu]` Fixed an issue where the hover button background color was incorrect. ([#7933](https://github.com/infor-design/enterprise/issues/7782))
- `[Bar]` Fixed overlapping and cropped axis labels (left & right) when horizontal bar label is lengthy. ([#7614](https://github.com/infor-design/enterprise/issues/7614))
- `[Breadcrumb]` Updated hover color for breadcrumb in header. ([#7801](https://github.com/infor-design/enterprise/issues/7801))
- `[Build]` Fixed wrong filename in build download. ([#7992](https://github.com/infor-design/enterprise/issues/7992))
- `[Button]` Updated hover color for header and CAP. ([#7944/7943](https://github.com/infor-design/enterprise/issues/7944))
- `[Button]` Fixed stylings for button menu and secondary combo. ([#7783](https://github.com/infor-design/enterprise/issues/7783))
- `[Button]` Formatted the appending of a cssClass property to include a prefix whitespace. ([#7852](https://github.com/infor-design/enterprise/issues/7852))
- `[Card/Widget]` Fixed a bug where the button action was not aligned properly in RTL mode. ([#7843](https://github.com/infor-design/enterprise/issues/7843))
- `[Card/Widget]` Fixed inconsistency in widget size. ([#7896](https://github.com/infor-design/enterprise/issues/7896))
- `[Calendar]` Fixed legend colors for selected days of week. ([#7800](https://github.com/infor-design/enterprise/issues/7800))
- `[Calendar]` Added check on setting current date so it doesn't override provided date settings. ([#7806](https://github.com/infor-design/enterprise/issues/7806))
- `[Calendar]` Adjusted indentation to avoid button overlapping. ([#7966](https://github.com/infor-design/enterprise/issues/7966))
- `[Card]` Fixed issues when using both card and tabs component. ([#7915](https://github.com/infor-design/enterprise/issues/7915))
- `[Card/Widget]` Fixed inconsistency in widget size. ([#7896](https://github.com/infor-design/enterprise/issues/7896))
- `[Chart]` Fixed on focus border being off in chart legend items. ([#7850](https://github.com/infor-design/enterprise/issues/7850))
- `[Column]` Fixed the size of the chart titles in columns. ([#7889](https://github.com/infor-design/enterprise/issues/7889))
- `[Column]` Fixed an error loading on windows and a warning. ([#7941](https://github.com/infor-design/enterprise/issues/7941))
- `[Contextmenu]` Changed color of checkbox in dark mode. ([#7991](https://github.com/infor-design/enterprise/issues/7991))
- `[Datagrid]` Fixed a bug where the validation icon position was not correct in RTL (Right-to-Left) mode. ([#7768](https://github.com/infor-design/enterprise/issues/7768))
- `[Datagrid]` Added undefined check for column settings to avoid errors in spacer. ([#7807](https://github.com/infor-design/enterprise/issues/7807))
- `[Datagrid]` Added Placeholder for Datagrid Date Field. ([NG#1531](https://github.com/infor-design/enterprise-ng/issues/1531))
- `[Datagrid]` Adjusted positioning of `drilldown` button. ([#7014](https://github.com/infor-design/enterprise/issues/7014))
- `[Datagrid]` Added a test page for column filter locale settings. ([#7554](https://github.com/infor-design/enterprise/issues/7554)
- `[Datagrid]` Adjusted positioning of `drilldown` button. ([#7014](https://github.com/infor-design/enterprise/issues/7014))
- `[Datagrid]` Fixed a bug where expanded rows showed as activated. ([#7979](https://github.com/infor-design/enterprise/issues/7979))
- `[Dropdown]` Fix on dropdown not focusing in mobile. ([#7815](https://github.com/infor-design/enterprise/issues/7815))
- `[Dropdown]` Fixed on dropdown not focusing in mobile. ([#7815](https://github.com/infor-design/enterprise/issues/7815))
- `[Dropdown]` Fixed dropdown position when expanded on corners. ([NG#1541](https://github.com/infor-design/enterprise-ng/issues/1541))
- `[Dropdown]` Fixed display render when the option has no icon. ([#7813](https://github.com/infor-design/enterprise/issues/7813))
- `[Editor]` Fixed editor text not changing to other font headers after changing colors. ([#7793](https://github.com/infor-design/enterprise/issues/7793))
- `[Editor]` Fixed editor text not changing to other font headers in some scenarios after changing colors in Firefox. ([#7796](https://github.com/infor-design/enterprise/issues/7796))
- `[Fieldfilter]` Fixed uneven focus border for clear button. Adjusted day focus border sizing. Fixed misaligned datepicker short field. ([#7919](https://github.com/infor-design/enterprise/issues/7919))
- `[Icons]` Fixed icon pipeline, made icons downloadable and added new empty state icons and a few standard icons. ([#518](https://github.com/infor-design/design-system/issues/518))
- `[Homepage]` Added better default color for hero now that its white. ([#7938](https://github.com/infor-design/enterprise/issues/7938))
- `[Line]` Fixed bottom spacing issue in RTL. ([#7776](https://github.com/infor-design/enterprise/issues/7776))
- `[Listview]` Adjusted searchfield in listview when inside modal to fix alignment. ([NG#1547](https://github.com/infor-design/enterprise-ng/issues/1547))
- `[Lookup]` Fixed count text positioning. ([#7905](https://github.com/infor-design/enterprise/issues/7905))
- `[Module Nav]` Updated examples to closer reflect usage guidance. ([#7870](https://github.com/infor-design/enterprise/issues/7870))
- `[Modal]` Added overflow in modal body for horizontal scroll. ([#7827](https://github.com/infor-design/enterprise/issues/7827))
- `[Popover]` Added scrollable class for popover. ([#7678](https://github.com/infor-design/enterprise/issues/7678))
- `[Popupmenu]` Fixed placement of shared popupmenu. ([NG#1546](https://github.com/infor-design/enterprise-ng/issues/1546))
- `[Radios]` Adjusted the styling of the checked and unchecked radio button. ([#7899](https://github.com/infor-design/enterprise/issues/7899))
- `[Searchfield]` Fixed no results text should not be selected. ([#7756](https://github.com/infor-design/enterprise/issues/7756))
- `[Searchfield]` Fixed on go button misalignment. ([#7910](https://github.com/infor-design/enterprise/issues/7910))
- `[Searchfield]` Adjusted position and hover color for custom button. ([#7832](https://github.com/infor-design/enterprise/issues/7832))
- `[Searchfield]` Fix on go button misalignment. ([#7910](https://github.com/infor-design/enterprise/issues/7910))
- `[Searchfield]` Fix ability to select and delete text in firefox. Adjusted custom button positioning. ([#7962](https://github.com/infor-design/enterprise/issues/7962))
- `[Searchfield]` Fixed on go button misalignment. ([#7910](https://github.com/infor-design/enterprise/issues/7910))
- `[Tabs]` Fixed the focus alignment in tabs for RTL. ([#7772](https://github.com/infor-design/enterprise/issues/7772))
- `[Tabs]` Added fixes for zoom issue on vertical tabs. ([#8046](https://github.com/infor-design/enterprise/issues/8046))
- `[Toolbar]` Added additional selectors and colors for dark theme dropdown label. ([#7897](https://github.com/infor-design/enterprise/issues/7897))
- `[Tree]` Fixed Cross-Site Scripting (XSS) when setting up tree node. ([#7631](https://github.com/infor-design/enterprise/issues/7631))
- `[Weekview]` Adjusted the positioning of text within the footer cell to keep it centered. Adjusted calendar icon position to be better aligned. ([#7926](https://github.com/infor-design/enterprise/issues/7926))
- `[Weekview]` Added event modal on `doubleclick`. ([#7824](https://github.com/infor-design/enterprise/issues/7824))

## v4.87.0

### v4.87.0 Features

- `[Datagrid]` Has a new design with a soft grey header. The white header background option is removed and this is now the default. ([#7814](https://github.com/infor-design/enterprise/issues/7814))
- `[Datagrid]` Fix the datagrid filter color when disabled. ([#7908](https://github.com/infor-design/enterprise/issues/7908))
- `[Icons]` Fixed shape and markup of status icons. Note: May need to update your code. ([#7747](https://github.com/infor-design/enterprise/issues/7661))
- `[Masthead]` Set height of masthead to 40px. ([#7857](https://github.com/infor-design/enterprise/issues/7857))
- `[Popover]` Improved popover title style and position, excluding the 'alternate' class. ([#7676](https://github.com/infor-design/enterprise/issues/7676))
- `[Radios]` Added hitbox feature for mobile devices. ([#7659](https://github.com/infor-design/enterprise/issues/7659))
- `[Timepicker]` Fix issue with `enable` function. ([#7887](https://github.com/infor-design/enterprise/issues/7887))
- `[Typography]` Added `text-wrap` class. ([#7497](https://github.com/infor-design/enterprise/issues/7497))

### v4.87.0 Fixes

- `[Badges/Alerts/Tags/Icons]` Added docs and clearer examples. ([#7661](https://github.com/infor-design/enterprise-ng/issues/7661))
- `[Bar]` Fixed an issue where the x-axis labels on the bar chart were not visible. ([#7797](https://github.com/infor-design/enterprise/issues/7797))
- `[Badges/Tags/]` Changed border radius to 12px. ([#7862](https://github.com/infor-design/enterprise-ng/issues/7862))
- `[Calendar]` Fixed uncaught error in `cordova` apps. ([#7818](https://github.com/infor-design/enterprise/issues/7818))
- `[Circlepager]` Fixed circle pager's position inside of a card. ([#7724](https://github.com/infor-design/enterprise/issues/7724))
- `[Color]` Fixed on Slate's personalization header text color. ([#7811](https://github.com/infor-design/enterprise-ng/issues/7811))
- `[Calendar]` Fixed uncaught error in `cordova` apps. ([#7818](https://github.com/infor-design/enterprise/issues/7818))
- `[ColorPicker]` Fixed color selection on color picker. ([#7760](https://github.com/infor-design/enterprise-ng/issues/7760))
- `[Column-Stacked]` Corrected the misalignment of legend labels. ([#7722](https://github.com/infor-design/enterprise/issues/7722))
- `[Dropdown]` Adjusted dropdown text in Firefox. ([#7763](https://github.com/infor-design/enterprise/issues/7763))
- `[Datagrid]` Fixed bug where default filter wasn't honored for date or time columns. ([#7766](https://github.com/infor-design/enterprise/issues/7766))
- `[Datagrid]` Fixed datagrid column filter not open after a series of simultaneous clicking of column filters. ([#7750](https://github.com/infor-design/enterprise/issues/7750))
- `[Datagrid]` Added expanded default for expandable formatter. ([#7680](https://github.com/infor-design/enterprise/issues/7680))
- `[Datepicker]` Fixed bug where date range selected is not properly rendered in some scenarios. ([#7528](https://github.com/infor-design/enterprise/issues/7528))
- `[Datepicker]` Added a new `listcontextmenu` event that fires on right click of menu items. ([#7822](https://github.com/infor-design/enterprise/issues/7822))
- `[Editor]` Re-fixed an xss issue in editor (iframes not permitted). ([#7590](https://github.com/infor-design/enterprise/issues/7590))
- `[Editor]` Added swatch bar on colorpicker button. ([#7571](https://github.com/infor-design/enterprise/issues/7571))
- `[Editor]` Fixed fonts selection selection on editor. ([#7762](https://github.com/infor-design/enterprise-ng/issues/7762))
- `[Editor]` Changed the header color from dark to grey and other minor style improvements. ([#7606](https://github.com/infor-design/enterprise-ng/issues/7606))
- `[FieldFilter]` Fixed Dropdown border not rendered properly. ([#7600](https://github.com/infor-design/enterprise/issues/7600))
- `[Fileupload]` Fixed a bug where validation is not triggered after clearing the input. ([#7645](https://github.com/infor-design/enterprise/issues/7645))
- `[FileuploadAdvanced]` Fixed Close Button not rendered properly. ([#7604](https://github.com/infor-design/enterprise/issues/7604))
- `[FileuploadAdvanced]` Changed file upload copy. ([#7787](https://github.com/infor-design/enterprise/issues/7787))
- `[Header]` Changed toolbar to flex-toolbar in header. ([#7479](https://github.com/infor-design/enterprise/issues/7479))
- `[Homepage]` Changed selector so multiple hero banners in a page will work. ([#7819](https://github.com/infor-design/enterprise/issues/7819))
- `[Icon]` Adjusted width of icons. ([#7616](https://github.com/infor-design/enterprise/issues/7616))
- `[Hyperlink]` Fixed hyperlink focus style in completion chart. ([#7731](https://github.com/infor-design/enterprise/issues/7731))
- `[Icon]` Adjusted width of icons. ([#7616](https://github.com/infor-design/enterprise/issues/7616))
- `[Images]` Fixed incorrect image size. ([#7616](https://github.com/infor-design/enterprise/issues/7616))
- `[ListView]` Fix the hyperlinks in lists to have an underline. ([#7616](https://github.com/infor-design/enterprise/issues/7838))
- `[ModuleNav]` Added css to constrain images to 32px. ([#7820](https://github.com/infor-design/enterprise-ng/issues/7820))
- `[ModuleNav]` Fixed missing tooltip on the settings button. ([#1525](https://github.com/infor-design/enterprise-ng/issues/1525))
- `[ModuleNav]` Added `enableOutsideClick()` feature to collapse/hide menu via content click. ([#7786](https://github.com/infor-design/enterprise/issues/7786))
- `[ModuleNav]` Fixed missing tooltip on the settings button. ([NG#1525](https://github.com/infor-design/enterprise-ng/issues/1525))
- `[ModuleNav/Dropdown]` Added support for external URLs to the Dropdown component's list, as well as support for setting these in Module Nav Switcher. ([NG#1533](https://github.com/infor-design/enterprise-ng/issues/1533))
- `[ModuleNav]` Reduced item padding so more items can fit in the menu before scrolling occurs. ([#7770](https://github.com/infor-design/enterprise/issues/7770))
- `[ModuleNav]` Fixed issues in dark mode. ([#7753](https://github.com/infor-design/enterprise/issues/7753))
- `[ModuleNav]` Added option/example to disable search in the dropdown menu ([NG#1535](https://github.com/infor-design/enterprise-ng/issues/1535))
- `[ModuleNav]` Added option/example to disable search in the dropdown menu ([#1535](https://github.com/infor-design/enterprise-ng/issues/1535))
- `[Number]` Added additional check for `formatNumber`. ([#7752](https://github.com/infor-design/enterprise/issues/7752))
- `[Popover]` Fixes on issues with textarea and datagrid in popover when opening and closing. ([#7677](https://github.com/infor-design/enterprise/issues/7677))
- `[Popover]` Fixes on issues with textarea and datagrid in popover when opening and closing. ([#7677](https://github.com/infor-design/enterprise/issues/7677))
- `[Pager]` Fixed pager `pagesizes` default settings cannot be overridden with custom settings. ([#7629](https://github.com/infor-design/enterprise/issues/7629))
- `[Popover]` Fixed popover having issues on simultaneous clicks. ([#7679](https://github.com/infor-design/enterprise/issues/7679))
- `[Popover]` Fixed where popover connected on click will not close on click (it just reopened). ([#7679](https://github.com/infor-design/enterprise/issues/7679))
- `[Sparkline]` Fixed median fill on dark theme. ([#7717](https://github.com/infor-design/enterprise/issues/7717))
- `[Searchfield]` Adjusted height for go button. ([#6695](https://github.com/infor-design/enterprise/issues/6695))
- `[Tabs]` Fixed alabaster design issues in tabs, tab-headers, tabs-module, tabs-multi components. ([#7803](https://github.com/infor-design/enterprise/issues/7803))
- `[Tooltip]` Fixed in `extraClass` example page for tooltip. ([#7669](https://github.com/infor-design/enterprise/issues/7669))
- `[WeekView]` Fixed bug where going to next didn't render the complete week. ([#7684](https://github.com/infor-design/enterprise/issues/7684))
- `[WeekView]` Fixed the response of render on breakpoint in week view. ([#7727](https://github.com/infor-design/enterprise/issues/7727))

## v4.86.0

### v4.86.0 Features

- `[Dropdown/ModuleNav]` Added no results text when filtering and no items are found. ([#7662](https://github.com/infor-design/enterprise/issues/7662))

### v4.86.0 Fixes

- `[Accordion/ModuleNav/Appmenu]` Focus does not focus the expander buttons only the parent items. ([#7626](https://github.com/infor-design/enterprise/issues/7626))
- `[Bar]` Fixed a bug where the bottom axis label was cut off. ([#7612](https://github.com/infor-design/enterprise/issues/7612))
- `[Bar]` Fixed incorrect legend position on stacked charts. ([#7693](https://github.com/infor-design/enterprise/issues/7693))
- `[Button]` Fixed a bug where submenu icons were not aligned correctly. ([#7626](https://github.com/infor-design/enterprise/issues/7626))
- `[Button/Header]` Fixed some colors in dark mode. ([7586](https://github.com/infor-design/enterprise/issues/7586))
- `[Cards]` Fixed alignments and positioning of other elements inside a card widget. ([#7589](https://github.com/infor-design/enterprise/issues/7589))
- `[Column-Stacked]` Fixed a regression bug where the stacked column chart was not rendering correctly. ([#7644](https://github.com/infor-design/enterprise/issues/7644))
- `[Datagrid]` Fixed button icon background hover color when rows are selected. ([#7607](https://github.com/infor-design/enterprise/issues/7607))
- `[Datagrid]` Fixed a bug in datagrid where default operator for lookup is not rendered properly. ([#7530](https://github.com/infor-design/enterprise/issues/7530))
- `[Datagrid]` Changed `updateColumns` to update column groups when null or empty. ([#7720](https://github.com/infor-design/enterprise/issues/7720))
- `[Datepicker]` Fixed a bug in datepicker range not rendering properly in modal IOS. ([#7603](https://github.com/infor-design/enterprise/issues/7603))
- `[Dropdown/ModuleNav]` Fixed indents and UI improvements. ([#7662](https://github.com/infor-design/enterprise/issues/7662))
- `[Dropdown/ModuleNav]` Fixed indents and UI improvements and added empty states. ([#7662](https://github.com/infor-design/enterprise/issues/7662))
- `[Editor]` Fixed an issue where an editor with an initial value containing `<br \>` tags were being seen as dirty when `resetdirty` is called. ([#7483](https://github.com/infor-design/enterprise/issues/7483))
- `[Editor]` Fixed a bug where pasting an html table into the editor wouldn't show the borders. ([#7463](https://github.com/infor-design/enterprise/issues/7463))
- `[FileUpload]` Fixed the alignment of the close button and file icon button. ([#7570](https://github.com/infor-design/enterprise/issues/7570))
- `[Homepage]` In some cases the new background color did not fill all the way in the page. ([#7696](https://github.com/infor-design/enterprise/issues/7696))
- `[Icons]` Removed `phone-linear` in some examples as the icon is now called `phone`. ([#7747](https://github.com/infor-design/enterprise/issues/7747))
- `[Locale]` Updated all internal strings in local files to sentence case. Updated translations will follow in a month. ([#7683](https://github.com/infor-design/enterprise/issues/7711))
- `[Modal]` On some devices the overflow/scrolling is still missing on modal and contents can break out the bottom of the modal. ([#7711](https://github.com/infor-design/enterprise/issues/7711))
- `[Layouts]` Removed some older layouts and examples from page layouts. ([#7733](https://github.com/infor-design/enterprise/issues/7733))
- `[Message]` Fixed alignment issue on the icons. ([#7746](https://github.com/infor-design/enterprise/issues/7746))
- `[ModuleNav]` Fixed rounding and `zindex` issues. ([#7654](https://github.com/infor-design/enterprise/issues/7654))
- `[ModuleNav]` Added an option to set the icon to false initially. ([#7740](https://github.com/infor-design/enterprise/issues/7740))
- `[Notification]` Updated color styles when notification is in sub header. ([#7623](https://github.com/infor-design/enterprise/issues/7623))
- `[Page-Patterns]` Fixed the width of the search field in page pattern example. ([#7561](https://github.com/infor-design/enterprise/issues/7561))
- `[Popupmenu]` Fixed the behavior of the component when having submenus in NG. ([#7556](https://github.com/infor-design/enterprise/issues/7556))
- `[Tabs]` Fixed an error in tabs where it is not sortable in NG. ([NG#1480](https://github.com/infor-design/enterprise-ng/issues/1480))
- `[Tabs Header]` Fixed colors of disabled in dark mode. ([#7465](https://github.com/infor-design/enterprise/issues/7465))
- `[Tooltip]` Fixed an error in tooltip where some string is unrecognizable. ([NG#1499](https://github.com/infor-design/enterprise-ng/issues/1499))
- `[Tooltip]` Fixed invisible links on hover on tooltips in contrast mode. ([7737](https://github.com/infor-design/enterprise/issues/7737))
- `[WeekView]` Fixed bug where agenda variant ignored `showAllDay` setting. ([#7700](https://github.com/infor-design/enterprise/issues/7700))

## v4.85.0

### v4.85.0 Features

- `[Colors]` Added new slate color palette with lower range colors. Some elements are updated. ([#7624](https://github.com/infor-design/enterprise/issues/7624))
- `[Stats]` Added a new component called stats similar to counts. We would like counts deprecated so please use stats in place of counts now as it has a cleaner UI. ([#7506](https://github.com/infor-design/enterprise/issues/7506))

### v4.85.0 Fixes

- `[Accordion]` Updated color style for accordion selected panel. ([#7593](https://github.com/infor-design/enterprise/issues/7593))
- `[Applicationmenu]` Fixed menu items cannot be seen properly when using alabaster. ([#7609](https://github.com/infor-design/enterprise/issues/7609))
- `[Applicationmenu]` Fixed bottom border color cannot be seen properly. ([#7565](https://github.com/infor-design/enterprise/issues/7565))
- `[Button]` Adjusted the left and right paddings of the button from `30px` to `32px`. ([#7508](https://github.com/infor-design/enterprise/issues/7508))
- `[Card]` Fixed widget size for subtitle examples. ([#7580](https://github.com/infor-design/enterprise/issues/7580))
- `[Card]` Fixed height for card button. ([#7637](https://github.com/infor-design/enterprise/issues/7637))
- `[Card]` Updated hover style for button in listview. ([#7636](https://github.com/infor-design/enterprise/issues/7636))
- `[Chart]` Added setting to force legend to popup. ([#7453](https://github.com/infor-design/enterprise/issues/7453))
- `[Column-Stacked]` Improved the column stacked and labels to be aligned correctly. ([#7266](https://github.com/infor-design/enterprise/issues/7266))
- `[ContextualActionPanel]` Fixed overflow issues on mobile view. ([#7585](https://github.com/infor-design/enterprise/issues/7585))
- `[Datagrid]` Fixed on incorrect row updates on adding a new row to the next page. ([#7486](https://github.com/infor-design/enterprise/issues/7486))
- `[Datagrid]` Fixed disabled filter columns in datagrid. ([#7467](https://github.com/infor-design/enterprise/issues/7467))
- `[Datagrid]` Fixed a bug where the select all checkbox was not clickable. ([#7499](https://github.com/infor-design/enterprise/issues/7499))
- `[Datagrid]` Fixed a bug in datepicker filter icon's hover state and alignment. ([#7562](https://github.com/infor-design/enterprise/issues/7562))
- `[Datagrid]` Fixed a bug where disabled buttons in cells were `hoverable`. ([#7611](https://github.com/infor-design/enterprise/issues/7611))
- `[Dropdown]` Fixed a bug in dropdown where `mouseenter` and keydown triggers simultaneous. ([#7464](https://github.com/infor-design/enterprise/issues/7464))
- `[Editor]` Fixed an xss issue in editor (iframes not permitted). ([#7590](https://github.com/infor-design/enterprise/issues/7590))
- `[Homepage]` Fixed invisible edit options and vertical dragging/resizing. ([#7579](https://github.com/infor-design/enterprise/issues/7579))
- `[Icons]` Fixed size of icons and made them 80x80. ([#1369](https://jira.infor.com/browse/IDS-1360))
- `[Listview/Card]` Fixed the UI of listview search with filters. ([#7546](https://github.com/infor-design/enterprise/issues/7546))
- `[Listview]` Adjusted overflow styles for list views in cards. ([#7557](https://github.com/infor-design/enterprise/issues/7557))
- `[Locale]` Fixed a bug using extend translations on some languages (`fr-CA/pt-BR`). ([#7491](https://github.com/infor-design/enterprise/issues/7491))
- `[Locale/Multiselect]` Changed text from selected to selection as requested by translators. ([#5886](https://github.com/infor-design/enterprise/issues/5886))
- `[Lookup]` Fixed a bug in lookup width not responsive in grid system. ([#7205](https://github.com/infor-design/enterprise/issues/7205))
- `[MonthView]` Added event triggers for when monthview is expanded and collapsed. ([#7605](https://github.com/infor-design/enterprise/issues/7605))
- `[Modal]` Fixed icon alignment in the title. ([#7639](https://github.com/infor-design/enterprise/issues/7639))
- `[Modal]` Added ID check in event triggers. ([#7475](https://github.com/infor-design/enterprise/issues/7475))
- `[Module Nav]` Added new settings for configuration of accordion, and auto-initialization of child components. ([NG#1477](https://github.com/infor-design/enterprise-ng/issues/1477))
- `[Module Nav Switcher]` Made compatibility improvements for the Module Nav Switcher NG component. ([NG#1477](https://github.com/infor-design/enterprise-ng/issues/1477))
- `[Multiselect]` Fixed a bug where the multiselect dropdown icon was overlapping the field. ([#7502](https://github.com/infor-design/enterprise/issues/7502))
- `[Popupmenu]` Fixed the placement of popup when parent element is outside of viewport. ([#5018](https://github.com/infor-design/enterprise/issues/5018))
- `[SearchField]` Fixed x alignment on older toolbar example. ([#7572](https://github.com/infor-design/enterprise/issues/58875726))
- `[Splitter]` Added new design changes and more examples. Note that the collapse button is no longer supported for now. ([#7542](https://github.com/infor-design/enterprise/issues/7542))
- `[Toolbar]` Fixed a bug where search icon was not aligned properly. ([#7642](https://github.com/infor-design/enterprise/issues/7642))
- `[Toolbar Flex]` Updated popupmenu color styles. ([#7383](https://github.com/infor-design/enterprise/issues/7383))
- `[Tooltip]` Improved consistency of tooltip size between text and text with icon. ([#7509](https://github.com/infor-design/enterprise/issues/7509))
- `[Tooltip]` Changed response method in beforeShow to allow passing true instead of content explicitly ([#7594](https://github.com/infor-design/enterprise/issues/7594))
- `[Toast]` Changed background color in dark mode for better contrast. ([#7648](https://github.com/infor-design/enterprise/issues/7648))
