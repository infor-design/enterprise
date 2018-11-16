# What's New with Enterprise

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

### v4.13.0 Fixes

- `[Datepicker / Timepicker]` Removed the need to use the customValidation setting. You can remove this option from your code. The logic will pick up if you added customValidation to your input by adding a data-validate option. You also may need to add `date` or `availableDate` validation to your  data-validate attribute if these validations are desired along with your custom or required validation. ([#862](https://github.com/infor-design/enterprise/issues/862))
- `[Menubutton]` Added a new setting `hideMenuArrow` you can use for buttons that dont require an arrow, such as menu buttons. ([#1088](https://github.com/infor-design/enterprise/issues/1088))
- `[Dropdown]` Fixed issues with destroy when multiple dropdowns are on the page. ([#1202](https://github.com/infor-design/enterprise/issues/1202))
- `[Datagrid]` Fixed alignment issues when using filtering with some columns that do not have a filter. ([#1124](https://github.com/infor-design/enterprise/issues/1124))
- `[Datagrid]` Fixed an error when dynamically adding context menus. ([#1216](https://github.com/infor-design/enterprise/issues/1216))
- `[Datagrid]` Added an example of dynamic intermediate paging and filtering. ([#396](https://github.com/infor-design/enterprise/issues/396))
- `[Dropdown]` Fixed alignment issues on mobile devices. ([#1069](https://github.com/infor-design/enterprise/issues/1069))
- `[Datepicker]` Fixed incorrect assumptions, causing incorrect umalqura calendar calculations. ([#1189](https://github.com/infor-design/enterprise/issues/1189))
- `[General]` Added the ability to stop renderLoop. ([#214](https://github.com/infor-design/enterprise/issues/214))
- `[Datepicker]` Fixed an issue reselecting ranges with the date picker range option. ([#1197](https://github.com/infor-design/enterprise/issues/1197))
- `[Editor]` Fixed bugs on IE with background color option. ([#392](https://github.com/infor-design/enterprise/issues/392))
- `[Colorpicker]` Fixed issue where the palette is not closed on enter key / click. ([#1050](https://github.com/infor-design/enterprise/issues/1050))
- `[Accordion]` Fixed issues with context menus on the accordion. ([#639](https://github.com/infor-design/enterprise/issues/639))
- `[Searchfield]` Made no results appear unclickable. ([#329](https://github.com/infor-design/enterprise/issues/329))
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

### v4.13.0 Chore & Maintenance

- `[General]` Added more complete visual tests. ([#978](https://github.com/infor-design/enterprise/issues/978))
- `[General]` Cleaned up some of the sample pages start at A, making sure examples work and tests are covered for better QA (on going). ([#1136](https://github.com/infor-design/enterprise/issues/1136))
- `[General]` Upgraded to ids-identity 2.0.x ([#1062](https://github.com/infor-design/enterprise/issues/1062))
- `[General]` Cleanup missing files in the directory listings. ([#985](https://github.com/infor-design/enterprise/issues/985))
- `[Demo App]` Removed response headers for less veracode errors. ([#959](https://github.com/infor-design/enterprise/issues/959))
- `[Angular 1.0]` We removd the angular 1.0 directives from the code and examples. These are no longer being updated. You can still use older versions of this or move on to Angular 7.x ([#1136](https://github.com/infor-design/enterprise/issues/1136))

(60 Issues Solved this release, Backlog Enterprise 196, Backlog Ng 63, 653 Functional Tests, 607 e2e Test)

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
