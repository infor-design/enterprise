# What's New with Enterprise

## v4.18.0

### v4.18.0 Features

- `[App Menu]` Added support for personalization by adding the `is-personalizable` class the menu will now change colors along with headers ([#1847](https://github.com/infor-design/enterprise/issues/1847))
- `[App Menu]` Added a special role switcher dropdown to change the menu role. ([#1935](https://github.com/infor-design/enterprise/issues/1935))
- `[Personalize]` Added classes for the personalization colors so that you can personalize certain form elements. ([#1847](https://github.com/infor-design/enterprise/issues/1847))
- `[Expandable Area]` Added example of a standalone button the toggles a form area. ([#1935](https://github.com/infor-design/enterprise/issues/1935))
- `[Datagrid]` Added support so if there are multiple inputs within an editor they work with the keyboard tab key. ([#355](https://github.com/infor-design/enterprise-ng/issues/355))
- `[Editor]` Added a JS setting and CSS styles to support usage of a Flex Toolbar ([#1120](https://github.com/infor-design/enterprise/issues/1120))
- `[Header]` Added a JS setting and CSS styles to support usage of a Flex Toolbar ([#1120](https://github.com/infor-design/enterprise/issues/1120))
- `[Mask]` Added a setting for passing a locale string, allowing Number masks to be localized.  This enables usage of the `groupSize` property, among others, from locale data in the Mask. ([#440](https://github.com/infor-design/enterprise/issues/440))
- `[Masthead]` Added CSS styles to support usage of a Flex Toolbar ([#1120](https://github.com/infor-design/enterprise/issues/1120))
- `[Theme/Colors]` Added new component for getting theme and color information. This is used throughout the code. There was a hidden property `Soho.theme`, if you used this in some way you should now use `Soho.theme.currentTheme`. ([#1866](https://github.com/infor-design/enterprise/issues/1866))

### v4.18.0 Fixes

- `[App Menu]` Fixed some accessibility issues on the nav menu. ([#1721](https://github.com/infor-design/enterprise/issues/1721))
- `[Busy Indicator]` Fixed a bug that causes a javascript error when the busy indicator is used on the body tag. ([#1918](https://github.com/infor-design/enterprise/issues/1918))
- `[Css/Sass]` Fixed an issue where the High Contrast theme and Uplift theme were not using the right tokens. ([#1897](https://github.com/infor-design/enterprise/pull/1897))
- `[Colors]` Fixed the color palette demo page to showcase the correct hex values based on the current theme ([#1801](https://github.com/infor-design/enterprise/issues/1801))
- `[Datepicker]` Fixed an issue in NG where the custom validation is removed during the teardown of a datepicker.([NG #411](https://github.com/infor-design/enterprise-ng/issues/411))
- `[Datagrid]` Fixed an issue where lookup filterConditions were not rendering. ([#1873](https://github.com/infor-design/enterprise/issues/1873))
- `[Datagrid]` Fixed issue where header columns are misaligned with body columns on load. ([#1892](https://github.com/infor-design/enterprise/issues/1892))
- `[Datagrid]` Fixed an issue where filtering was missing translation. ([#1900](https://github.com/infor-design/enterprise/issues/1900))
- `[Datagrid]` Fixed an issue with the checkbox formatter where string based 1 or 0 would not work as a dataset source. ([#1948](https://github.com/infor-design/enterprise/issues/1948))
- `[Datagrid]` Fixed a bug where text would be misaligned when repeatedly toggling the filter row. ([#1969](https://github.com/infor-design/enterprise/issues/1969))
- `[Datagrid]` Added an example of expandOnActivate on a customer editor. ([#353](https://github.com/infor-design/enterprise-ng/issues/353))
- `[Datagrid]` Added ability to pass a function to the tooltip option for custom formatting. ([#354](https://github.com/infor-design/enterprise-ng/issues/354))
- `[Dropdown]` Changed the way dropdowns work with screen readers to be a collapsible listbox.([#404](https://github.com/infor-design/enterprise/issues/404))
- `[Dropdown]` Fixed an issue where multiselect dropdown unchecking "Select All" was not getting clear after close list with Safari browser.([#1882](https://github.com/infor-design/enterprise/issues/1882))
- `[Listbuilder]` Fixed an issue where the text was not sanitizing. ([#1692](https://github.com/infor-design/enterprise/issues/1692))
- `[Lookup]` Fixed an issue where the tooltip was using audible text in the code block component. ([#354](https://github.com/infor-design/enterprise-ng/issues/354))
- `[Locale]` Fixed trailing zeros were getting ignored when displaying thousands values. ([#404](https://github.com/infor-design/enterprise/issues/1840))
- `[MenuButton]` Improved the way menu buttons work with screen readers.([#404](https://github.com/infor-design/enterprise/issues/404))
- `[Message]` Added an audible announce of the message type.([#964](https://github.com/infor-design/enterprise/issues/964))
- `[Modal]` Changed text and button font colors to pass accessibility checks.([#964](https://github.com/infor-design/enterprise/issues/964))
- `[Notifications]` Fixed a few issues with notification background colors by using the corresponding ids-identity token for each. ([1857](https://github.com/infor-design/enterprise/issues/1857), [1865](https://github.com/infor-design/enterprise/issues/1865))
- `[Notifications]` Fixed an issue where you couldn't click the close icon in Firefox. ([1573](https://github.com/infor-design/enterprise/issues/1573))
- `[Radios]` Fixed the last radio item was being selected when clicking on the first when displayed horizontal. ([#1878](https://github.com/infor-design/enterprise/issues/1878))
- `[Signin]` Fixed accessibility issues. ([#421](https://github.com/infor-design/enterprise/issues/421))
- `[Skiplink]` Fixed a z-index issue on skip links over the nav menu. ([#1721](https://github.com/infor-design/enterprise/issues/1721))
- `[Stepprocess]` Fixed rtl style issues. ([#413](https://github.com/infor-design/enterprise/issues/413))
- `[Tabs]` Fixed an issue where focus was changed after enable/disable tabs. ([#1934](https://github.com/infor-design/enterprise/issues/1934))
- `[Tabs-Module]` Fixed an issue where the close icon was outside the searchfield. ([#1704](https://github.com/infor-design/enterprise/issues/1704))
- `[Toolbar]` Fixed issues when tooltip shows on hover of toolbar ([#1622](https://github.com/infor-design/enterprise/issues/1622))
- `[Validation]` Fixed an issue where the isAlert settings set to true, the border color, control text color, control icon color was displaying the color for the alert rather than displaying the default color. ([#1922](https://github.com/infor-design/enterprise/issues/1922))

### v4.18.0 Chore & Maintenance

- `[Buttons]` Updated button disabled states with corresponding ids-identity tokens. ([1914](https://github.com/infor-design/enterprise/issues/1914)
- `[Docs]` Added a statement on supporting accessibility. ([#1540](https://github.com/infor-design/enterprise/issues/1540))
- `[Docs]` Added the supported screen readers and some notes on accessibility. ([#1722](https://github.com/infor-design/enterprise/issues/1722))

(nn Issues Solved this release, Backlog Enterprise nn, Backlog Ng nn, nn Functional Tests, nn e2e Test)

## v4.17.1

### v4.17.1 Fixes

- `[Datagrid]` Fixed an issue where the second to last column was having resize issues with frozen column sets.(<https://github.com/infor-design/enterprise/issues/1890>)
- `[Datagrid]` Re-align icons and items in the datagrid's "short header" configuration.(<https://github.com/infor-design/enterprise/issues/1880>)
- `[Locale]` Fixed incorrect "groupsize" for `en-US` locale.(<https://github.com/infor-design/enterprise/issues/1907>)

### v4.17.1 Chorse & Maintenance

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
- `[Veracode]` Made additional fixes and mitigated in veracode. ([#1723](https://github.com/infor-design/enterprise/issues/1723))

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
- `[Demo App]` Removed response headers for less Veracode errors. ([#959](https://github.com/infor-design/enterprise/issues/959))
- `[Angular 1.0]` We removed the angular 1.0 directives from the code and examples. These are no longer being updated. You can still use older versions of this or move on to Angular 7.x ([#1136](https://github.com/infor-design/enterprise/issues/1136))
- `[Uplift]` Included the uplift theme again as alpha for testing. It will show with a watermark and is only available via the personalize api or url params in the demo app. ([#1224](https://github.com/infor-design/enterprise/issues/1224))

(69 Issues Solved this release, Backlog Enterprise 199, Backlog Ng 63, 662 Functional Tests, 659 e2e Test)

## v4.12.0

- [Npm Package](https://www.npmjs.com/package/ids-enterprise)
- [IDS Enterprise Angular Change Log](https://github.com/infor-design/enterprise-ng/blob/master/docs/CHANGELOG.md)

### v4.12.0 Features

- `[General]` The ability to make custom/smaller builds has further been improved. We improved the component matching, made it possible to run the tests on only included components, fixed the banner, and improved the terminal functionality. Also removed/deprecated the older mapping tool. ([#417](https://github.com/infor-design/enterprise/issues/417))
- `[Message]` Added the ability to have different types (Info, Confirm, Error, Alert). ([#963](https://github.com/infor-design/enterprise/issues/963))
- `[General]` Further fixes to pass veracode scans. Now passing conditionally. ([#683](https://github.com/infor-design/enterprise/issues/683))
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

- `[General]` Changed the code to pass Veracode scans. The IDS components now pass ISO at 86 rating. The rest of the flaws are mitigated with fixes such as stripping tags. As a result we went fairly aggressive with what we strip. If teams are doing something special we don't have tests for there is potential for customizations being stripped. ([#256](https://github.com/infor-design/enterprise/issues/256))
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
