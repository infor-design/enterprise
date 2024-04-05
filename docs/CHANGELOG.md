# What's New with Enterprise

## v4.95.0

## v4.95.0 Features

- `[Module Nav]` Added setting `disableSwitcher` to disable nav switcher. ([#8381](https://github.com/infor-design/enterprise/issues/8381))

## v4.95.0 Fixes

- `[Contextual Action Panel]` Fixed added padding on contextual action panel. ([#8553](https://github.com/infor-design/enterprise/issues/8553))
- `[Forms]` Fixed fileupload layout in compact form. ([#8537](https://github.com/infor-design/enterprise/issues/8537))

## v4.94.0

## v4.94.0 Features

- `[Datagrid]` Added setting `showEditorIcons` to always display icon without hover. ([#8439](https://github.com/infor-design/enterprise/issues/8439))
- `[Datagrid]` Disabled filter dropdown if selection is only one. ([NG#1570](https://github.com/infor-design/enterprise-ng/issues/1570))
- `[Homepage]` Added row height style classes for widgets. ([#8211](https://github.com/infor-design/enterprise/issues/8211))
- `[Lookup]` Added placeholder setting in toolbar. ([#8416](https://github.com/infor-design/enterprise/issues/8416))
- `[Modal]` Added setting `draggable` to be able to drag modals. ([#7019](https://github.com/infor-design/enterprise/issues/7019))

## v4.94.0 Fixes

- `[Avatar]` Is no longer round by default. To use it in module nav add the new `square` class. ([#8539](https://github.com/infor-design/enterprise/issues/8539))
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

## v4.93.0 Features

- `[Calendar]` Added event tree option for calendar. ([3870](https://github.com/infor-design/enterprise/issues/3870))
- `[Contextual Action Panel]` Added content details and back button arrow. ([#8112](https://github.com/infor-design/enterprise/issues/8112))
- `[Datagrid]` Added data automation id of the column's filter operator. ([#8372](https://github.com/infor-design/enterprise/issues/8372))
- `[Datagrid]` Fix problems parsing dates in certain date formats. ([#8479](https://github.com/infor-design/enterprise/issues/8479))
- `[Locale]` Added `dateTimestamp` date format. ([#8373](https://github.com/infor-design/enterprise/issues/8373))
- `[Donut/Pie]` Added a legend title in donut and pie chart legends. ([#7933](https://github.com/infor-design/enterprise/issues/7933))
- `[Locale]` Added `dateTimestamp` date format. ([#8373](https://github.com/infor-design/enterprise/issues/8373))

## v4.93.0 Fixes

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
- `[Multiselect]` Fixed misaligned `x` buttons. ([#8421](https://github.com/infor-design/enterprise/issues/8421))
- `[Popupmenu]` Fixed a bug where single select check items were getting deselected. ([#8422](https://github.com/infor-design/enterprise/issues/8422))
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

## v4.92.3 Fixes

- `[Datagrid]` Fixed cell editable not getting focused on click. ([8408](https://github.com/infor-design/enterprise/issues/8408))
- `[Datagrid]` Fixed cell value replacing special characters on cell change. ([8285](https://github.com/infor-design/enterprise/issues/8285))
- `[Popupmenu]` Fixed a bug where single select check items were getting deselected. ([8422](https://github.com/infor-design/enterprise/issues/8422))
- `[TabsHeader]` Added setting `maxWidth` for tabs for long titles. ([#8434](https://github.com/infor-design/enterprise/issues/8434))

## v4.92.2

## v4.92.2 Fixes

- `[Datagrid]` Fixed cell editable not getting focused on click. ([#8408](https://github.com/infor-design/enterprise/issues/8408))
- `[Masthead]` Fixed incorrect color on hover. ([8391](https://github.com/infor-design/enterprise/issues/8391))
- `[TabsHeader]` Added fixes for the focus state and minor layout issue in left and right to left. ([#8405](https://github.com/infor-design/enterprise/issues/8405))

## v4.92.1

## v4.92.1 Features

- `[Icons]` Added new icon `widgets-smart-panel`. ([#8403](https://github.com/infor-design/enterprise/issues/8403))
- `[Icons]` Fixed spaces in `icon-user-status-unknown` icon. ([#8403](https://github.com/infor-design/enterprise/issues/8403))

## v4.92.0

## v4.92.0 Features

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

## v4.92.0 Fixes

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

## v4.91.0 Features

- `[Dates]` Added a new `twoDigitYear` setting to set the switch over for two digit years. ([#8061](https://github.com/infor-design/enterprise/issues/8061))
- `[ModuleNav]` Added a new "guest" section and some new settings to toggle the search and module switcher section. ([#8232](https://github.com/infor-design/enterprise/issues/8232))
- `[ModuleNav]` Added `attributes` setting (for automation id) in the module nav switcher. ([#8270](https://github.com/infor-design/enterprise/issues/8270))

## v4.91.0 Fixes

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

## v4.89.1 (Preview)

## v4.89.1 (Preview) Fixes

- `[Personalization]` Fixed incorrect values in the `Soho.theme.personalizationColors` api. ([#8151](https://github.com/infor-design/enterprise/issues/8151))

## v4.90.0

## v4.90.0 Features

## v4.90.0 Fixes

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

## v4.89.0 (Preview)

## v4.89.0 (Preview) Features

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

## v4.89.0

## v4.89.0 Features

- `[Datagrid]` Added ability for expandable and summary rows to be updated after cell update. ([#8058](https://github.com/infor-design/enterprise/issues/8058))

## v4.89.0 Fixes

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

## v4.88.0 Features

- `[Checkbox]` Changed color of checkbox in dark mode. ([#7991](https://github.com/infor-design/enterprise/issues/7991))
- `[Form/Label]` Implemented a form layout designed to facilitate an inline design within a responsive-form container. ([#7764](https://github.com/infor-design/enterprise/issues/7764))
- `[Homepages]` Changed incorrect width on quad widgets. ([#8056](https://github.com/infor-design/enterprise/issues/8056))
- `[Module Nav]` Added usage guidance to docs. ([#7869](https://github.com/infor-design/enterprise/issues/7869))
- `[Module Nav]` Added mobile behaviors. ([#7804](https://github.com/infor-design/enterprise/issues/7804))
- `[Module Nav]` Fixed an alignment issue. ([#7934](https://github.com/infor-design/enterprise/issues/7934))
- `[Module Nav]` Added mobile click to close setting, and made breakpoints fire on resize, added hamburger logic and new mobile states per phone vs bigger. ([#8019](https://github.com/infor-design/enterprise/issues/8019))

## v4.88.0 Fixes

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

## v4.87.0 Features

- `[Datagrid]` Has a new design with a soft grey header. The white header background option is removed and this is now the default. ([#7814](https://github.com/infor-design/enterprise/issues/7814))
- `[Datagrid]` Fix the datagrid filter color when disabled. ([#7908](https://github.com/infor-design/enterprise/issues/7908))
- `[Icons]` Fixed shape and markup of status icons. Note: May need to update your code. ([#7747](https://github.com/infor-design/enterprise/issues/7661))
- `[Masthead]` Set height of masthead to 40px. ([#7857](https://github.com/infor-design/enterprise/issues/7857))
- `[Popover]` Improved popover title style and position, excluding the 'alternate' class. ([#7676](https://github.com/infor-design/enterprise/issues/7676))
- `[Radios]` Added hitbox feature for mobile devices. ([#7659](https://github.com/infor-design/enterprise/issues/7659))
- `[Timepicker]` Fix issue with `enable` function. ([#7887](https://github.com/infor-design/enterprise/issues/7887))
- `[Typography]` Added `text-wrap` class. ([#7497](https://github.com/infor-design/enterprise/issues/7497))

## v4.87.0 Fixes

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

## v4.86.0 Features

- `[Dropdown/ModuleNav]` Added no results text when filtering and no items are found. ([#7662](https://github.com/infor-design/enterprise/issues/7662))

## v4.86.0 Fixes

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

## v4.85.0 Features

- `[Colors]` Added new slate color palette with lower range colors. Some elements are updated. ([#7624](https://github.com/infor-design/enterprise/issues/7624))
- `[Stats]` Added a new component called stats similar to counts. We would like counts deprecated so please use stats in place of counts now as it has a cleaner UI. ([#7506](https://github.com/infor-design/enterprise/issues/7506))

## v4.85.0 Fixes

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

## v4.84.3 Fixes

- `[Applicationmenu]` Fixed bottom border color cannot be seen properly. ([#7565](https://github.com/infor-design/enterprise/issues/7565))
- `[ContextualActionPanel/Modal]` Fixed overflow issues on mobile view. ([#7585](https://github.com/infor-design/enterprise/issues/7585))
- `[Colors]` Added dark and contrast mode for app nav. ([#7624](https://github.com/infor-design/enterprise/issues/7624))
- `[Module Nav]` Added new settings for configuration of accordion, and auto-initialization of child components. ([NG#1477](https://github.com/infor-design/enterprise-ng/issues/1477))

## v4.84.2 Fixes

- `[Module Nav]` Added more fixes to support the angular wrapper. ([#7386](https://github.com/infor-design/enterprise/issues/7386))
- `[Card]` Fixed widget size for subtitle examples. ([#7580](https://github.com/infor-design/enterprise/issues/7580))
- `[Homepage]` Fixed invisible edit options and vertical dragging/resizing. ([#7579](https://github.com/infor-design/enterprise/issues/7579))

## v4.84.1

## v4.84.1 Fixes

- `[Dropdown]` Fixed an issue where Module Nav Role Switcher wasn't properly rendering the Dropdown pseudo-elements in Angular environments. ([NG #1477](https://github.com/infor-design/enterprise-ng/issues/1477))
- `[Module Nav]` Fixed an issue where it was not possible to disable filtering events. ([NG #1477](https://github.com/infor-design/enterprise-ng/issues/1477))
- `[Popupmenu]` Fixed some styling bugs when attached as a menu button menu in Module Nav components. ([NG #1477](https://github.com/infor-design/enterprise-ng/issues/1477))

## v4.84.0

## v4.84.0 Features

- `[Line Chart]` Added short and abbreviated name options for the data. ([#5906](https://github.com/infor-design/enterprise/issues/5906))
- `[Masked Input]` Added setting to retain value if maximum length is already reached. ([#7274](https://github.com/infor-design/enterprise/issues/7274))
- `[Module Nav]` Added the new Module Nav component. ([#7386](https://github.com/infor-design/enterprise/issues/7386))
- `[WeekView]` Added stacked view template for week view agenda variant. ([#7373](https://github.com/infor-design/enterprise/issues/7373))

## v4.84.0 Fixes

- `[Bar]` Added a setting called `defaultTickCount` (`5` as default) to automatically add ticks when there are no dataset values. ([#NG1463](https://github.com/infor-design/enterprise-ng/issues/1463))
- `[Busy Indicator]` Updated colors for busy indicator. ([#7098](https://github.com/infor-design/enterprise/issues/7098))
- `[Button]` Adjusted alignment for popupmenu icon buttons. ([#7408](https://github.com/infor-design/enterprise/issues/7408))
- `[Charts]` Improved the positioning of chart legend. ([#7452](https://github.com/infor-design/enterprise/issues/7452))
- `[Datagrid]` Fixed an issue where the table was not filling the entire datagrid container in firefox. ([#6956](https://github.com/infor-design/enterprise/issues/6956))
- `[Datagrid]` Fixed a bug where the colorpicker editor could not be toggles. ([#7362](https://github.com/infor-design/enterprise/issues/7362))
- `[Datagrid]` Clear `rowstatus` in tree node for clearRowError to work correctly. ([#6033](https://github.com/infor-design/enterprise/issues/6033))
- `[Datagrid]` Fixed an issue where `showColumn` was not functioning correctly with frozen columns. ([#7428](https://github.com/infor-design/enterprise/issues/7428))
- `[Datagrid]` Changed `enterkeykhint` behavior for filtering to filter with the virtual keyboard on mobile devices. ([#1489](https://github.com/infor-design/enterprise/issues/1489))
- `[Datagrid]` Fixed Pager not rendering correctly on page refresh. ([#6811](https://github.com/infor-design/enterprise/issues/6811))
- `[Dropdown]` Fixed the visibility of dropdown palette icons in dark mode. ([#7431](https://github.com/infor-design/enterprise/issues/7431))
- `[Dropdown]` Removed overflow none style for dropdown modal. ([#6033](https://github.com/infor-design/enterprise/issues/6033))
- `[Header]` Fix on header text not being readable due to color styles. ([#7466](https://github.com/infor-design/enterprise/issues/7466))
- `[Images]` Added class for images cursor pointer and make an example with click handler. ([#7007](https://github.com/infor-design/enterprise/issues/7007))
- `[Editor]` Fixed editor hover styles. ([#7535](https://github.com/infor-design/enterprise/issues/7535))
- `[Header]` Fixed an issue where the header text was difficult to read due to color styles. ([#7466](https://github.com/infor-design/enterprise/issues/7466))
- `[Header]` Fixed on header text not being readable due to color styles. ([#7466](https://github.com/infor-design/enterprise/issues/7466))
- `[Locale]` Added Comma translate option for locale for generating lists. ([#5887](https://github.com/infor-design/enterprise/issues/5887))
- `[Lookup]` Added undefined check for lookup values when updating grid. ([#7403](https://github.com/infor-design/enterprise/issues/7403))
- `[Listview]` Fixed invisible button on hover. ([#7544](https://github.com/infor-design/enterprise/issues/7544))
- `[Modal]` Fixed button alignment on modals. ([#7543](https://github.com/infor-design/enterprise/issues/7543))
- `[Tabs/Module]` Fixed a bug the personalization color was the same as the tab color (again). ([#7516](https://github.com/infor-design/enterprise/issues/7516))
- `[SearchField]` Fixed misaligned icons on toolbar search and pager buttons. ([#7527](https://github.com/infor-design/enterprise/issues/7527))
- `[Textarea]` Fixed an issue where the textarea was throwing an error. ([#7536](https://github.com/infor-design/enterprise/issues/7536))
- `[Toolbar]` Fixed x alignment on old toolbars. ([#7550](https://github.com/infor-design/enterprise/issues/7550))

## v4.83.0

## v4.83.0 Features

- `[Cards/Widgets]` Added new design and features for the cards/widget component, this includes different rounded corners and shadows. ([#7379](https://github.com/infor-design/enterprise/issues/7379))
- `[Cards/Widgets]` All icon buttons on cards should use a new icon please change `icon-more` to `icon-vertical-ellipsis`. ([#7379](https://github.com/infor-design/enterprise/issues/7379))
- `[CSS Utilities]` Added CSS utility classes to the library to provide a standardized and efficient way of achieving consistent styling. ([#7377](https://github.com/infor-design/enterprise/issues/7377))
- `[Homepage]` Changed the gutter size, banner size, and widget size for the homepage. ([#7445](https://github.com/infor-design/enterprise/issues/7445))
- `[Icons]` Icon updated for 16 icons, added new icons `change-department, shifting, shift-origin, shift-destination, swap-list-left, swap-list-right`. ([#7510](https://github.com/infor-design/enterprise/issues/7510))

## v4.83.0 Fixes

- `[Busy Indicator]` Updated colors for busy indicator. ([#7098](https://github.com/infor-design/enterprise/issues/7098))
- `[Builder]` Fixed subtitle text not shown properly. ([#7207](https://github.com/infor-design/enterprise/issues/7207))
- `[Builder]` Fixed a bug where subtitle text was not shown properly. ([#7207](https://github.com/infor-design/enterprise/issues/7207))
- `[Button]` Adjusted alignment for popupmenu icon buttons. ([#7408](https://github.com/infor-design/enterprise/issues/7408))
- `[Button]` Adjusted personalized colors. ([#7406](https://github.com/infor-design/enterprise/issues/7406))
- `[Datagrid]` Fix on unique ID generator for tooltips. ([#7393](https://github.com/infor-design/enterprise/issues/7393))
- `[Datagrid]` Made `clearRowStatus` in tree node for `clearRowError` work correctly. ([#6033](https://github.com/infor-design/enterprise/issues/6033))
- `[Datepicker]` Fixed validation not showing after component update. ([#7240](https://github.com/infor-design/enterprise/issues/7240))
- `[EmptyMessage]` Improved centering of widget and homepage contents for various widget sizes to enhance the overall user experience. ([#7360](https://github.com/infor-design/enterprise/issues/7360))
- `[Header]` Fixed header components not aligned and visibly shown properly. ([#7209](https://github.com/infor-design/enterprise/issues/7209))
- `[Header]` Fix on header text not being readable due to color styles. ([#7466](https://github.com/infor-design/enterprise/issues/7466))
- `[Icons]` Icons updated for 44 icons, added new `success-message` empty state and two new icons `vertical-ellipsis` and `microphone-filled`. ([#7394](https://github.com/infor-design/enterprise/issues/7394))
- `[Icons]` Icons updated for 44 icons, added new `success-message` empty state and two new icons: `vertical-ellipsis` and `microphone-filled`. ([#7394](https://github.com/infor-design/enterprise/issues/7394))
- `[Monthview]` Fixed on updated method creating duplicates. ([NG#1446](https://github.com/infor-design/enterprise-ng/issues/1446))
- `[Popupmenu]` Fix on popupmenu arrow not appearing when showArrow is true. ([#5061](https://github.com/infor-design/enterprise/issues/5061))
- `[Popupmenu]` Fixed a bug where the popupmenu arrow was not appearing despite `showArrow` being set to true. ([#5061](https://github.com/infor-design/enterprise/issues/5061))
- `[Popupmenu]` Fixed on popupmenu arrow not appearing when showArrow is true. ([#5061](https://github.com/infor-design/enterprise/issues/5061))
- `[Popupmenu]` Fixed popupmenu previous states not getting saved when called resize and update. ([#6601](https://github.com/infor-design/enterprise/issues/6601))
- `[Searchfield]` Fixed collapsible issues with search icon color and behavior. ([#7390](https://github.com/infor-design/enterprise/issues/7390))
- `[Popupmenu]` Fixed on popupmenu arrow not appearing when showArrow is true. ([#5061](https://github.com/infor-design/enterprise/issues/5061))
- `[Locale]` Added new translations. ([#1243](https://github.com/infor-design/enterprise/issues/7512)
- `[Monthview]` Fix on updated method creating duplicates. ([NG#1446](https://github.com/infor-design/enterprise-ng/issues/1446))
- `[Monthview]` Fixed on updated method creating duplicates. ([NG#1446](https://github.com/infor-design/enterprise-ng/issues/1446))
- `[Tabs Module]` Fixed closing an active tab in the overflow menu results in a blank screen. ([#7321](https://github.com/infor-design/enterprise/issues/7321))
- `[Toolbar]` Added hover style for contextual toolbar. ([#7459](https://github.com/infor-design/enterprise/issues/7459))
- `[Toolbar/Toolbar Flex]` Added hover state to buttons. ([#7327](https://github.com/infor-design/enterprise/issues/7327))
- `[Toolbar-Flex]` Fixed redundant aria-disabled in toolbar when element is disabled. ([#6339](https://github.com/infor-design/enterprise/issues/6339))
- `[Toolbar Flex]` Fixed buttons being not visible on window resize. ([#7421](https://github.com/infor-design/enterprise/issues/7421))
- `[Toolbar Flex]` Updated header examples and included header to use flex toolbar by default. ([#6837](https://github.com/infor-design/enterprise/issues/6837))

## v4.82.0

## v4.82.0 Features

- `[Card]` Added borderless class for cards. ([WC#1169](https://github.com/infor-design/enterprise-wc/issues/1169))

## v4.82.0 Fixes

- `[App Menu]` Colors should remain the same when changing theme colors. ([#7302](https://github.com/infor-design/enterprise/issues/7302))
- `[Badge]` Fixed success state badge color in new light theme. ([#7353](https://github.com/infor-design/enterprise/issues/7353))
- `[Bar]` Fixed items not being selected/deselected from the legend. ([#7330](https://github.com/infor-design/enterprise/issues/7330))
- `[Breadcrumb]` Updated breadcrumb hover color. ([#7337](https://github.com/infor-design/enterprise/issues/7337))
- `[Card]` Updated background color in classic high contrast. ([#7374](https://github.com/infor-design/enterprise/issues/7374))
- `[Card]` Fixed group-action unnecessary scroll bar. ([#7343](https://github.com/infor-design/enterprise/issues/7343))
- `[Count]` Fix personalize styles for instance count to adjust icon colors. ([6947](https://github.com/infor-design/enterprise/issues/6947))
- `[Column]` Fixed data chart and legend doesn't match up. ([#7199](https://github.com/infor-design/enterprise/issues/7199))
- `[Datagrid]` Fixed on styling in row status icon when first column is not a select column. ([NG#5913](https://github.com/infor-design/enterprise-ng/issues/5913))
- `[Datagrid]` Fixed table layout with a distinct hover background color for both activated and non-activated rows. ([#7320](https://github.com/infor-design/enterprise/issues/7369))
- `[Body]` Updated background color in classic high contrast. ([#7374](https://github.com/infor-design/enterprise/issues/7374))
- `[Card]` Fixed group-action unnecessary scroll bar. ([#7343](https://github.com/infor-design/enterprise/issues/7343))
- `[Datagrid]` Fixed header icon tooltip showing when undefined. ([#6929](https://github.com/infor-design/enterprise/issues/6929))
- `[Datagrid]` Fix on styling in row status icon when first column is not a select column. ([NG#5913](https://github.com/infor-design/enterprise-ng/issues/5913))
- `[Datagrid]` Fixed paging source argument is empty when re-assigning grid options. ([6947](https://github.com/infor-design/enterprise/issues/6947))
- `[Datagrid]` Changed pager type to initial when updating datagrid with paging setting. ([#7398](https://github.com/infor-design/enterprise/issues/7398))
- `[Datagrid]` Fixed datagrid toolbar to be able to show buttons more than two. ([6921](https://github.com/infor-design/enterprise/issues/6921))
- `[Editor]` Fixed links are not readable in dark mode. ([#7331](https://github.com/infor-design/enterprise/issues/7331))
- `[Field-Filter]` Fixed a bug in field filter where the design is not properly aligned on Modal. ([#7358](https://github.com/infor-design/enterprise/issues/7358))
- `[Header]` Fixed border in search field in the header. ([#7297](https://github.com/infor-design/enterprise/issues/7297))
- `[Header]` Fixed the font sizes and alignments. ([#7317](https://github.com/infor-design/enterprise/issues/7317))
- `[Listbuilder]` Fixed icon alignment on toolbar so that it's centered on focused. ([#7397](https://github.com/infor-design/enterprise/issues/7397))
- `[Listview]` Fixed the height restriction in listview when used in card. ([#7094](https://github.com/infor-design/enterprise/issues/7094))
- `[Lookup]` Fix in keyword search not filtering single comma. ([#7165](https://github.com/infor-design/enterprise/issues/7165))
- `[Lookup]` Fix in keyword search not filtering single quote. ([#7165](https://github.com/infor-design/enterprise/issues/7165))
- `[Notification]` Fix in example page of notification, updated parent element. ([#7391](https://github.com/infor-design/enterprise/issues/7391))
- `[Pager]` Fixed the pager's underline style to enhance its appearance when it is being hovered over. ([#7352](https://github.com/infor-design/enterprise/issues/7352))
- `[Personalization]` Changed default color back to azure and add alabaster in personalization colors. ([#7320](https://github.com/infor-design/enterprise/issues/7320))
- `[Personalization]` Fixed color changing doesn't add CSS class to the header in Safari browser. ([#7338](https://github.com/infor-design/enterprise/issues/7338))
- `[Personalization]` Adjusted header text/tabs colors. ([#7319](https://github.com/infor-design/enterprise/issues/7319))
- `[Personalization]` Additional fixes for default color back to azure and added alabaster in personalization colors. ([#7340](https://github.com/infor-design/enterprise/issues/7340))
- `[Popupmenu]` Fixed on popupmenu more icon not visible when open. ([#7383](https://github.com/infor-design/enterprise/issues/7383))
- `[Searchfield]` Fixed on misalignment in searchfield clear icon. ([#7382](https://github.com/infor-design/enterprise/issues/7382))
- `[Searchfield]` Fixed searchfield icon adjustments. ([#7387](https://github.com/infor-design/enterprise/issues/7387))
- `[SearchField]` Fixed undefined error on `toolbarFlexItem`. ([#7402](https://github.com/infor-design/enterprise/issues/7402))
- `[Tabs]` Fixed the alignment of focus in RTL view. ([#6992](https://github.com/infor-design/enterprise/issues/6992))
- `[Tabs Header]` Fixed the alignment of close button. ([#7273](https://github.com/infor-design/enterprise/issues/7273))
- `[Textarea]` Fixed track dirty when updated() method was triggered. ([NG#1429](https://github.com/infor-design/enterprise-ng/issues/1429))
- `[Timeline]` Fixed the alignment when timeline is inside a card. ([#7278](https://github.com/infor-design/enterprise/issues/7278))
- `[Timeline]` Fixed issue with timeline content exceeding allotted space when additional elements were added. ([#7299](https://github.com/infor-design/enterprise/issues/7299))
- `[Timeline]` Added test page to test scenario of timeline with no dates. ([#7298](https://github.com/infor-design/enterprise/issues/7298))
- `[Tooltip]` Added appendTo settings to fix tooltip positioning on the structure. ([#7220](https://github.com/infor-design/enterprise/issues/7220))
- `[Tooltip]` Fixed tooltip not on top of all elements when shown and manually moved. ([#7130](https://github.com/infor-design/enterprise/issues/7130))
- `[Tooltip]` Added appendTo settings to fix tooltip positioning on the structure. ([#7220](https://github.com/infor-design/enterprise/issues/7220))

## v4.81.0

## v4.81.0 Important Changes

- `[Docs]` Added action sheet to the doc site. ([#7230](https://github.com/infor-design/enterprise/issues/7230))
- `[General]` Project now uses node 18 (18.13.0) for development. All dependencies are updated. ([#6634](https://github.com/infor-design/enterprise/issues/6634))
- `[General]` Updated to d3.v7 which impacts all charts. ([#6634](https://github.com/infor-design/enterprise/issues/6634))
- `[Bar]` Fixed missing left axis label. ([#7181](https://github.com/infor-design/enterprise/issues/7181))
- `[Bar]` Fixed regressed long text example. ([#7183](https://github.com/infor-design/enterprise/issues/7183))
- `[Build]` Fixed build errors on windows. ([#7228](https://github.com/infor-design/enterprise/issues/7228))
- `[Icons]` Added new empty state icons, and in different and larger sizes. ([#7115](https://github.com/infor-design/enterprise/issues/7115))

## v4.81.0 Features

- `[Calendar]` Added `weekview` number on the monthview in datepicker. Use `showWeekNumber` to enable it. ([#5785](https://github.com/infor-design/enterprise/issues/5785))

## v4.81.0 Fixes

- `[Actionsheet]` Updated font and icon colors for classic actionsheet. ([#7012](https://github.com/infor-design/enterprise/issues/7012))
- `[Accordion]` Additional fix in accordion collapsing cards on expand bug. ([#6820](https://github.com/infor-design/enterprise/issues/6820))
- `[Alerts/Badges/Tags]` Updated warning and alert colors. ([#7162](https://github.com/infor-design/enterprise/issues/7162))
- `[App Menu]` Updated `appmenu` icon colors. ([#7303](https://github.com/infor-design/enterprise/issues/7303))
- `[Background]` Updated default background color in high contrast. ([#7261](https://github.com/infor-design/enterprise/issues/7261))
- `[Bar]` Fixed bug introduced by d3 changes with bar selection. ([#7182](https://github.com/infor-design/enterprise/issues/7182))
- `[Button]` Fixed icon button size and icon centering. ([#7201](https://github.com/infor-design/enterprise/issues/7201))
- `[Button]` Fixed disabled button color in classic version. ([#7185](https://github.com/infor-design/enterprise/issues/7185))
- `[Button]` Button adjustments for compact mode. ([#7161](https://github.com/infor-design/enterprise/issues/7161))
- `[Button]` Button adjustments for secondary menu in dark and contrast mode. ([#7221](https://github.com/infor-design/enterprise/issues/7221))
- `[ContextMenu]` Fixed a bug where wrong menu is displayed in nested menus on mobile device. ([NG#1417](https://github.com/infor-design/enterprise-ng/issues/1417))
- `[Datagrid]` Fixed re-rendering of the grid when `disableClientFilter` set to true. ([#7282](https://github.com/infor-design/enterprise/issues/7282))
- `[Datagrid]` Fixed a bug in datagrid where sorting is not working properly. ([#6787](https://github.com/infor-design/enterprise/issues/6787))
- `[Datagrid]` Fixed background color of lookups in filter row when in light mode. ([#7176](https://github.com/infor-design/enterprise/issues/7176))
- `[Datagrid]` Fixed a bug in datagrid where custom toolbar is being replaced with data grid generated toolbar. ([NG#1434](https://github.com/infor-design/enterprise-ng/issues/1434))
- `[Datagrid]` Fixed bug in Safari where dynamically switching from RTL to LTR doesn't update all the alignments. ([NG#1431](https://github.com/infor-design/enterprise-ng/issues/1431))
- `[Datagrid]` Fixed odd hover color when using row activation and is list. ([#7232](https://github.com/infor-design/enterprise/issues/7232))
- `[Datagrid]` Fixed dragging columns after a cancelled drop moves more than one column. ([#7017](https://github.com/infor-design/enterprise/issues/7017))
- `[Dropdown]` Fixed swatch default color in themes. ([#7108](https://github.com/infor-design/enterprise/issues/7108))
- `[Dropdown/Multiselect]` Fixed disabled options are not displayed as disabled when using ajax. ([#7150](https://github.com/infor-design/enterprise/issues/7150))
- `[EmptyMessage]` Updated the example page for widgets. ([#7033](https://github.com/infor-design/enterprise/issues/7033))
- `[Field-Filter]` Fixed a bug in field filter where the design is not properly aligned. ([#7001](https://github.com/infor-design/enterprise/issues/7001))
- `[Field-Filter]` Icon adjustments in Safari. ([#7264](https://github.com/infor-design/enterprise/issues/7264))
- `[Fileupload]` Icon adjustments in compact mode. ([#7149](https://github.com/infor-design/enterprise/issues/7149))
- `[Fileupload]` Icon adjustments in classic mode. ([#7265](https://github.com/infor-design/enterprise/issues/7265))
- `[Header]` Fixed a bug in `subheader` where the color its not appropriate on default theme. ([#7173](https://github.com/infor-design/enterprise/issues/7173))
- `[Header]` Changed the header from pseudo elements to actual icon. Please make the follow [change to your app menu icon](https://github.com/infor-design/enterprise/pull/7285/files#diff-4ee8ef8a5fe8ef128f558004ce5a73d8b2939256ea3c614ac26492078171529bL3-R5) to get the best output. ([#7163](https://github.com/infor-design/enterprise/issues/7163))
- `[Homepage/Personalize/Page-Patterns]` Fixed homepage hero widget, builder header, and other section of tabs with the new design and color combination. ([#7136](https://github.com/infor-design/enterprise/issues/7136))
- `[MenuButton]` Fixed some color on menu buttons. ([#7184](https://github.com/infor-design/enterprise/issues/7184))
- `[Modal]` Fixed alignment of tooltip error in modal. ([#7125](https://github.com/infor-design/enterprise/issues/7125))
- `[Hyperlink]` Changed hover color in dark theme. ([#7095](https://github.com/infor-design/enterprise/issues/7095))
- `[Icon]` Changed icon alert info color in dark theme. ([#7158](https://github.com/infor-design/enterprise/issues/7158))
- `[Icon]` Updated icon name in example page. ([#7269](https://github.com/infor-design/enterprise/issues/7269))
- `[Listview]` Added an additional translation for records selected in listview. ([#6528](https://github.com/infor-design/enterprise/issues/6528))
- `[Lookup]` Fixed a bug in lookup where items are not selected for async data. ([NG#1409](https://github.com/infor-design/enterprise-ng/issues/1409))
- `[Listview]` Fixed overflow in listview when there is a search bar included. ([#7015](https://github.com/infor-design/enterprise/issues/7015))
- `[Personalization]` Added color mapping in personalization. ([#7073](https://github.com/infor-design/enterprise/issues/7073))
- `[Personalization]` Fixed style changed when changing the modes and colors. ([#7171](https://github.com/infor-design/enterprise/issues/7171))
- `[Personalization]` Fix default values in the personalization API. ([#7167](https://github.com/infor-design/enterprise/issues/7167))
- `[Personalization]` Fix header tabs/header colors for a variation when header tabs are not in header element. ([#7153](https://github.com/infor-design/enterprise/issues/7153) [#7211](https://github.com/infor-design/enterprise/issues/7211) [#7212](https://github.com/infor-design/enterprise/issues/7212) [#7217](https://github.com/infor-design/enterprise/issues/7217) [#7218](https://github.com/infor-design/enterprise/issues/7218))
- `[Personalization]` Fix secondary button color in header. ([#7204](https://github.com/infor-design/enterprise/issues/7204))
- `[Popupmenu]` Fix on inverse colors not showing in popupmenu in masthead. ([#7005](https://github.com/infor-design/enterprise/issues/7005))
- `[Searchfield]` Custom button adjustments in mobile. ([#7134](https://github.com/infor-design/enterprise/issues/7134))
- `[Searchfield]` Go button adjustments for flex toolbar. ([#6014](https://github.com/infor-design/enterprise/issues/6014))
- `[Searchfield]` Collapse button adjustments in mobile. ([#7164](https://github.com/infor-design/enterprise/issues/7164))
- `[Searchfield]` Collapse button adjustments in header. ([#7210](https://github.com/infor-design/enterprise/issues/7210))
- `[Slider]` Fixed sliding and dropping the handle outside of the component doesn't trigger the change event. ([#7028](https://github.com/infor-design/enterprise/issues/7028))
- `[Tabs]` Changed header tabs disabled color to darker color. ([#7219](https://github.com/infor-design/enterprise/issues/7219))
- `[Tabs]` Fixed incorrect fade out color in horizontal header tabs. ([#7244](https://github.com/infor-design/enterprise/issues/7244))
- `[Timepicker]` Fixed 24h time validation. ([#7188](https://github.com/infor-design/enterprise/issues/7188))
- `[Toolbar]` Fixed buttons aren't going in the overflow menu if placed after search field. ([#7194](https://github.com/infor-design/enterprise/issues/7194))
- `[Typography]` Updated documentation to align usage guidance. ([#7187](https://github.com/infor-design/enterprise/issues/7187))

## v4.80.1 Fixes

- `[Button]` Fixed button status colors disabled in toolbar/toolbar flex in alabaster and personalize colors. ([#7166](https://github.com/infor-design/enterprise/issues/7166))
- `[Dropdown]` Fixed swatch default color in themes. ([#7108](https://github.com/infor-design/enterprise/issues/7108))
- `[Hyperlink]` Changed hover color in dark theme. ([#7095](https://github.com/infor-design/enterprise/issues/7095))
- `[Timepicker]` Fixed field value when day period goes first in the time format. ([#7116](https://github.com/infor-design/enterprise/issues/7116))
- `[Datagrid]` Fixed background color of lookups in filter row when in light mode. ([#7176](https://github.com/infor-design/enterprise/issues/7176))
- `[Dropdown/Multiselect]` Fixed disabled options are not displayed as disabled when using ajax. ([#7150](https://github.com/infor-design/enterprise/issues/7150))
- `[Header]` Fixed a bug in `subheader` where the color its not appropriate on default theme. ([#7173](https://github.com/infor-design/enterprise/issues/7173))
- `[MenuButton]` Fixed some color on menu buttons. ([#7184](https://github.com/infor-design/enterprise/issues/7184))

## v4.80.0

## v4.80.0 Important Changes

- `[Personalization]` The default color is now alabaster (white) rather than the previous azure color. This effects header and tabs header as previously noted. ([#6979](https://github.com/infor-design/enterprise/issues/6979))
- `[Header]` Changed the default color from azure to alabaster. I.E. The default header color is now alabaster but can still be set to any of the other 8 colors. So far the older look azure can be used. ([#6979](https://github.com/infor-design/enterprise/issues/6979))
- `[Tabs Header]` Changed the default background color for tabs header to also use alabaster with the same ability to use any of the other 8 personalization colors. ([#6979](https://github.com/infor-design/enterprise/issues/6979))
- `[Button]` The style of all buttons (primary/tertiary and secondary) have been updated and changed, in addition we added new destructive buttons. ([#6977](https://github.com/infor-design/enterprise/issues/6977))
- `[Button]` Fixed button status colors disabled in toolbar/toolbar flex in alabaster and personalize colors. ([#7166](https://github.com/infor-design/enterprise/issues/7166))
- `[Datagrid]` Added ability to change the color of the header in datagrid between (`dark` or `light (alabaster)`). ([#7008](https://github.com/infor-design/enterprise/issues/7008))
- `[Searchfield]` Completed a design review of searchfield and enhanced it with updated several design improvements. ([#6707](https://github.com/infor-design/enterprise/issues/6707))

## v4.80.0 Features

- `[About]` Browser version for chrome no longer contains minor version. ([#7067](https://github.com/infor-design/enterprise/issues/7067))
- `[Lookup]` Added modal settings to lookup. ([#4319](https://github.com/infor-design/enterprise/issues/4319))
- `[Radar]` Converted Radar scripts to puppeteer. ([#6989](https://github.com/infor-design/enterprise/issues/6989))
- `[Colors]` Correct Status Colors.([#6993](https://github.com/infor-design/enterprise/issues/6993))
- `[Colors]` Re-add yellow alerts.([#6922](https://github.com/infor-design/enterprise/issues/6922))
- `[Chart]` Added 'info' and theme color options in settings.([#7084](https://github.com/infor-design/enterprise/issues/7084))
- `[Icons]` Added three new icons: `icon-paint-brush, icon-psych-precaution, icon-observation-precaution`. ([#7040](https://github.com/infor-design/enterprise/issues/7040))
- `[Icons]` Added four new icons: `up-down-chevron, approve-all, import-spreadsheet, microphone`. ([#7142](https://github.com/infor-design/enterprise/issues/7142))

## v4.80.0 Fixes

- `[Button]` Fixed a bug where buttons are not readable in dark mode in the new design. ([#7082](https://github.com/infor-design/enterprise/issues/7082))
- `[Checkbox]` Fixed a bug where checkbox labels not wrapping when using `form-responsive` class. ([#6826](https://github.com/infor-design/enterprise/issues/6826))
- `[Datagrid]` Fixed a bug in datagrid where icon is not aligned in custom card. ([#7000](https://github.com/infor-design/enterprise/issues/7000))
- `[Datagrid]` Fixed a bug where datepicker icon background color is incorrect upon hovering. ([#7053](https://github.com/infor-design/enterprise/issues/7053))
- `[Datagrid]` Fixed a bug in datagrid where dropdown filter does not render correctly. ([#7006](https://github.com/infor-design/enterprise/issues/7006))
- `[Datagrid]` Fixed a bug in datagrid where flex toolbar is not properly destroyed. ([NG#1423](https://github.com/infor-design/enterprise-ng/issues/1423))
- `[Datagrid]` Fixed a bug in datagrid in datagrid where the icon cause clipping issues. ([#7000](https://github.com/infor-design/enterprise/issues/7000))
- `[Datagrid]` Fixed a bug in datagrid where date cell is still in edit state after editing when using Safari. ([#6963](https://github.com/infor-design/enterprise/issues/6963))
- `[Datagrid]` Fixed a bug in datagrid where summary row become selected after selecting row one. ([#7128](https://github.com/infor-design/enterprise/issues/7128))
- `[Datagrid]` Updated dirty cell check in datagrid. ([#6893](https://github.com/infor-design/enterprise/issues/6893))
- `[Datepicker]` Fixed a bug in datagrid where disabled dates were not showing in Safari. ([#6920](https://github.com/infor-design/enterprise/issues/6920))
- `[Datepicker]` Fixed a bug where range display is malformed in RTL. ([#6933](https://github.com/infor-design/enterprise/issues/6933))
- `[Datepicker]` Fixed exception occurring in disable dates. ([#7086](https://github.com/infor-design/enterprise/issues/7086))
- `[Header]` Adjusted classic header colors. ([#7069](https://github.com/infor-design/enterprise/issues/7069))
- `[Lookup]` Adjusted width in lookup. ([#6924](https://github.com/infor-design/enterprise/issues/6924))
- `[Searchfield]` Searchfield enhancement bugfixes on colors. ([#7079](https://github.com/infor-design/enterprise/issues/7079))
- `[Searchfield]` Searchfield icon placement fixes in classic. ([#7134](https://github.com/infor-design/enterprise/issues/7134))
- `[Lookup]` Adjusted width in lookup. ([#6924](https://github.com/infor-design/enterprise/issues/6924))
- `[Lookup]` Fixed a bug where custom modal script gets error after closing the modal in the second time. ([#7057](https://github.com/infor-design/enterprise/issues/7057))
- `[Listview]` Fix on contextual button hover color. ([#7090](https://github.com/infor-design/enterprise/issues/7090))
- `[Searchfield]` Searchfield enhancement bugfixes on colors. ([#7079](https://github.com/infor-design/enterprise/issues/7079))
- `[Searchfield]` Fix on non-collapsible positioning and borders. ([#7111](https://github.com/infor-design/enterprise/issues/7111))
- `[Searchfield]` Adjust icon position and colors. ([#7106](https://github.com/infor-design/enterprise/issues/7106))
- `[Searchfield]` Adjust border colors in category. ([#7110](https://github.com/infor-design/enterprise/issues/7110))
- `[Splitter]` Store location only when save setting is set to true. ([#7045](https://github.com/infor-design/enterprise/issues/7045))
- `[Tabs]` Fixed a bug where add tab button is not visible in new default view. ([#7146](https://github.com/infor-design/enterprise/issues/7146))
- `[Tabs]` Fixed a bug where tab list is not viewable dark mode classic view. ([#7097](https://github.com/infor-design/enterprise/issues/7097))
- `[Tabs]` Fixed a bug in tabs header and swatch personalize colors. ([#7046](https://github.com/infor-design/enterprise/issues/7046))
- `[Tabs]` Added puppeteer scripts for tooltip title. ([#7003](https://github.com/infor-design/enterprise/issues/7003))
- `[Tabs Header]` Updated example page, recalibrated positioning and fixed theme discrepancies. ([#7085](https://github.com/infor-design/enterprise/issues/7085))
- `[Tabs Module]` Fixed a bug in go button where it was affected by the latest changes for button. ([#7037](https://github.com/infor-design/enterprise/issues/7037))
- `[Textarea]` Added paste event listener for textarea. ([NG#6924](https://github.com/infor-design/enterprise-ng/issues/1401))
- `[Toolbar]` Adjustment in title width. ([#7113](https://github.com/infor-design/enterprise/issues/7113))
- `[Toolbar Flex]` Fix on toolbar key navigation.([#7041](https://github.com/infor-design/enterprise/issues/7041))
- `[User Status Icons]` Now have a more visible fill and a stroke behind them. ([#7040](https://github.com/infor-design/enterprise/issues/7040))

## v4.70.0

## v4.70.0 Important Notes

- `[General]` Some elements are no longer hooked under `window` for example `Locale` `Formatters` and `Editors`. To resolve it using Locale.set as an example use the `Soho` namespace i.e. `Soho.Locale.set()`. ([#6634](https://github.com/infor-design/enterprise/issues/6634))

## v4.70.0 Features

- `[Checkbox]` Converted Checkbox scripts to puppeteer. ([#6936](https://github.com/infor-design/enterprise/issues/6936))
- `[Circlepager]` Converted `Circlepager` scripts to puppeteer. ([#6971](https://github.com/infor-design/enterprise/issues/6971))
- `[Icons]` Bumped `ids-identity` to get a new empty state icon `empty-no-search-result` and a new system icon `advance-settings`.([#6999](https://github.com/infor-design/enterprise/issues/6999))

## v4.70.0 Fixes

- `[Accordion]` Fixed a bug where expanded card closes in NG when opening accordion. ([#6820](https://github.com/infor-design/enterprise/issues/6820))
- `[Counts]` Fixed a bug in counts where two rows of labels cause misalignment. ([#6845](https://github.com/infor-design/enterprise/issues/6845))
- `[Counts]` Added example page for widget count with color background. ([#7234](https://github.com/infor-design/enterprise/issues/7234))
- `[Datagrid]` Fixed a bug in datagrid where expandable row input cannot edit the value. ([#6781](https://github.com/infor-design/enterprise/issues/6781))
- `[Datagrid]` Fixed a bug in datagrid where clear dirty cell does not work properly in frozen columns. ([#6952](https://github.com/infor-design/enterprise/issues/6952))
- `[Datagrid]` Adjusted date and timepicker icons in datagrid filter. ([#6917](https://github.com/infor-design/enterprise/issues/6917))
- `[Datagrid]` Fixed a bug where frozen column headers are not rendered on update. ([NG#1399](https://github.com/infor-design/enterprise-ng/issues/1399))
- `[Datagrid]` Added toolbar update on datagrid update. ([NG#1357](https://github.com/infor-design/enterprise-ng/issues/1357))
- `[Datepicker]` Added Firefox increment/decrement keys. ([#6877](https://github.com/infor-design/enterprise/issues/6877))
- `[Datepicker]` Fixed a bug in mask value in datepicker when update is called. ([NG#1380](https://github.com/infor-design/enterprise-ng/issues/1380))
- `[Dropdown]` Fixed a bug in dropdown where there is a null in a list when changing language to Chinese. ([#6916](https://github.com/infor-design/enterprise/issues/6916))
- `[Editor]` Fixed a bug in editor where insert image is not working properly when adding attributes. ([#6864](https://github.com/infor-design/enterprise/issues/6864))
- `[Editor]` Fixed a bug in editor where paste and plain text is not cleaning the text/html properly. ([#6892](https://github.com/infor-design/enterprise/issues/6892))
- `[Locale]` Fixed a bug in locale where same language translation does not render properly. ([#6847](https://github.com/infor-design/enterprise/issues/6847))
- `[Icons]` Fixed incorrect colors of new empty state icons. ([#6965](https://github.com/infor-design/enterprise/issues/6965))
- `[Popupmenu]` Fixed a bug in popupmenu where submenu and submenu items are not indented properly. ([#6860](https://github.com/infor-design/enterprise/issues/6860))
- `[Process Indicator]` Fix on extra line after final step. ([#6744](https://github.com/infor-design/enterprise/issues/6744))
- `[Searchfield]` Changed toolbar in example page to flex toolbar. ([#6737](https://github.com/infor-design/enterprise/issues/6737))
- `[Tabs]` Added tooltip on add new tab button. ([#6902](https://github.com/infor-design/enterprise/issues/6902))
- `[Tabs]` Adjusted header and tab colors in themes. ([#6673](https://github.com/infor-design/enterprise/issues/6673))
- `[Timepicker]` Filter method in datagrid is called on timepicker's change event. ([#6896](https://github.com/infor-design/enterprise/issues/6896))

## v4.69.0

## v4.69.0 Important Features

- `[Icons]` All icons have padding on top and bottom effectively making them 4px smaller by design. This change may require some UI corrections to css. ([#6868](https://github.com/infor-design/enterprise/issues/6868))
- `[Icons]` Over 60 new icons and 126 new industry focused icons. ([#6868](https://github.com/infor-design/enterprise/issues/6868))
- `[Icons]` The icon `save-closed` is now `save-closed-old` in the deprecated, we suggest not using this old icon. ([#6868](https://github.com/infor-design/enterprise/issues/6868))
- `[Icons]` Alert icons come either filled or not filled (outlined) filled alert icons like  `icon-alert-alert` are now `icon-success-alert` and `alert-filled` we suggest no longer using filled alert icons, use only the outlined ones. ([#6868](https://github.com/infor-design/enterprise/issues/6868))

## v4.69.0 Features

- `[Datagrid]` Added puppeteer script for extra class for tooltip. ([#6900](https://github.com/infor-design/enterprise/issues/6900))
- `[Header]` Converted Header scripts to puppeteer. ([#6919](https://github.com/infor-design/enterprise/issues/6919))
- `[Icons]` Added [enhanced and new empty states icons](https://main-enterprise.demo.design.infor.com/components/icons/example-empty-widgets.html) with a lot more color. These should replace existing ones but it is opt-in. ([#6868](https://github.com/infor-design/enterprise/issues/6868))
- `[Lookup]` Added puppeteer script for lookup double click apply enhancement. ([#6886](https://github.com/infor-design/enterprise/issues/6886))
- `[Stepchart]` Converted Stepchart scripts to puppeteer. ([#6940](https://github.com/infor-design/enterprise/issues/6940))

## v4.69.0 Fixes

- `[Datagrid]` Fixed a bug in datagrid where sorting is not working properly. ([#6787](https://github.com/infor-design/enterprise/issues/6787))
- `[Datagrid]` Fixed a bug in datagrid where add row is not working properly when using frozen columns. ([#6918](https://github.com/infor-design/enterprise/issues/6918))
- `[Datagrid]` Fixed a bug in datagrid where tooltip flashes continuously on hover. ([#5907](https://github.com/infor-design/enterprise/issues/5907))
- `[Datagrid]` Fixed a bug in datagrid where is empty and is not empty is not working properly. ([#5273](https://github.com/infor-design/enterprise/issues/5273))
- `[Datagrid]` Fixed a bug in datagrid where inline editor input text is not being selected upon clicking. ([NG#1365](https://github.com/infor-design/enterprise-ng/issues/1365))
- `[Datagrid]` Fixed a bug in datagrid where multiselect filter is not rendering properly. ([#6846](https://github.com/infor-design/enterprise/issues/6846))
- `[Datagrid]` Fixed a bug in datagrid where row shading is not rendered properly. ([#6850](https://github.com/infor-design/enterprise/issues/6850))
- `[Datagrid]` Fixed a bug in datagrid where icon is not rendering properly in small and extra small row height. ([#6866](https://github.com/infor-design/enterprise/issues/6866))
- `[Datagrid]` Fixed a bug in datagrid where sorting is not rendering properly when there is a previously focused cell. ([#6851](https://github.com/infor-design/enterprise/issues/6851))
- `[Datagrid]` Additional checks when updating cell so that numbers aren't converted twice. ([NG#1370](https://github.com/infor-design/enterprise-ng/issues/1370))
- `[Datagrid]` Additional fixes on dirty indicator not updating on drag columns. ([#6867](https://github.com/infor-design/enterprise/issues/6867))
- `[General]` Instead of optional dependencies use a custom command. ([#6876](https://github.com/infor-design/enterprise/issues/6876))
- `[Modal]` Fixed a bug where suppress key setting is not working. ([#6793](https://github.com/infor-design/enterprise/issues/6793))
- `[Searchfield]` Additional visual fixes in classic on go button in searchfield toolbar. ([#6686](https://github.com/infor-design/enterprise/issues/6686))
- `[Splitter]` Fixed on splitter not working when parent height changes dynamically. ([#6819](https://github.com/infor-design/enterprise/issues/6819))
- `[Toolbar Flex]` Added additional checks for destroying toolbar. ([#6844](https://github.com/infor-design/enterprise/issues/6844))

## v4.68.0

## v4.68.0 Features

- `[Button]` Added Protractor to Puppeteer conversion scripts. ([#6626](https://github.com/infor-design/enterprise/issues/6626))
- `[Calendar]` Added puppeteer script for show/hide legend. ([#6810](https://github.com/infor-design/enterprise/issues/6810))
- `[Colors]` Added puppeteer script for color classes targeting color & border color. ([#6801](https://github.com/infor-design/enterprise/issues/6801))
- `[Column]` Added puppeteer script for combined column chart. ([#6381](https://github.com/infor-design/enterprise/issues/6381))
- `[Datagrid]` Added additional setting in datagrid header for tooltip extra class. ([#6802](https://github.com/infor-design/enterprise/issues/6802))
- `[Datagrid]` Added `dblClickApply` setting in lookup for selection of item. ([#6546](https://github.com/infor-design/enterprise/issues/6546))

## v4.68.0 Fixes

- `[Bar Chart]` Fixed a bug in bar charts grouped, where arias are identical to each series. ([#6748](https://github.com/infor-design/enterprise/issues/6748))
- `[Datagrid]` Fixed a bug in datagrid where tooltip flashes continuously on hover. ([#5907](https://github.com/infor-design/enterprise/issues/5907))
- `[Datagrid]` Fixed a bug in datagrid where expandable row animation is not rendering properly. ([#6813](https://github.com/infor-design/enterprise/issues/6813))
- `[Datagrid]` Fixed a bug in datagrid where dropdown filter does not render correctly. ([#6834](https://github.com/infor-design/enterprise/issues/6834))
- `[Datagrid]` Fixed alignment issues in trigger fields. ([#6678](https://github.com/infor-design/enterprise/issues/6678))
- `[Datagrid]` Added a null guard in tree list when list is not yet loaded. ([#6816](https://github.com/infor-design/enterprise/issues/6816))
- `[Datagrid]` Added a setting `ariaDescribedBy` in the column to override `aria-describedby` value of the cells. ([#6530](https://github.com/infor-design/enterprise/issues/6530))
- `[Datagrid]` Allowed beforeCommitCellEdit event to be sent for Editors.Fileupload. ([#6821](https://github.com/infor-design/enterprise/issues/6821))]
- `[Datagrid]` Classic theme trigger field adjustments in datagrid. ([#6678](https://github.com/infor-design/enterprise/issues/6678))
- `[Datagrid]` Added null guard in tree list when list is not yet loaded. ([#6816](https://github.com/infor-design/enterprise/issues/6816))
- `[Datagrid]` Fix on dirty indicator not updating on drag columns. ([#6867](https://github.com/infor-design/enterprise/issues/6867))
- `[Editor]` Fixed a bug in editor where block quote is not continued in the next line. ([#6794](https://github.com/infor-design/enterprise/issues/6794))
- `[Editor]` Fixed a bug in editor where breaking space doesn't render dirty indicator properly. ([NG#1363](https://github.com/infor-design/enterprise-ng/issues/1363))
- `[Searchfield]` Visual fixes on go button in searchfield toolbar. ([#6686](https://github.com/infor-design/enterprise/issues/6686))
- `[Searchfield]` Added null check in xButton. ([#6858](https://github.com/infor-design/enterprise/issues/6858))
- `[Textarea]` Fixed a bug in textarea where validation breaks after enabling/disabling. ([#6773](https://github.com/infor-design/enterprise/issues/6773))
- `[Typography]` Updated text link color in dark theme. ([#6807](https://github.com/infor-design/enterprise/issues/6807))
- `[Lookup]` Fixed where field stays disabled when enable API is called ([#6145](https://github.com/infor-design/enterprise/issues/6145))

(28 Issues Solved This Release, Backlog Enterprise 274, Backlog Ng 51, 1105 Functional Tests, 1303 e2e Tests, 561 Puppeteer Tests)

## v4.67.0

## v4.67.0 Important Notes

- `[CDN]` The former CDN `cdn.hookandloop.infor.com` can no longer be maintained by IT and needs to be discontinued. It will exist for approximately one year more (TBD), so please remove direct use from any production code. ([#6754](https://github.com/infor-design/enterprise/issues/6754))
- `[Datepicker]` The functionality to enter today with a `t` is now under a setting `todayWithKeyboard-false`, it is false because you cant type days like September in a full picker. ([#6653](https://github.com/infor-design/enterprise/issues/6653))
- `[Datepicker]` The functionality to increase the day with a `+/-` it defaults to false because it conflicts with many other internal shortcut keys. ([#6632](https://github.com/infor-design/enterprise/issues/6632))

## v4.67.0 Markup Changes

- `[AppMenu]` As a design change the `Infor` logo is no longer to be shown on the app menu and has been removed. This reduces visual clutter, and is more inline with Koch global brand to leave it out. ([#6726](https://github.com/infor-design/enterprise/issues/6726))

## v4.67.0 Features

- `[Calendar]` Add a setting for calendar to show and hide the legend. ([#6533](https://github.com/infor-design/enterprise/issues/6533))
- `[Datagrid]` Added puppeteer script for header icon with tooltip. ([#6738](https://github.com/infor-design/enterprise/issues/6738))
- `[Icons]` Added new icons for `interaction` and `interaction-reply`. ([#6721](https://github.com/infor-design/enterprise/issues/6721))
- `[Monthview]` Added puppeteer script for monthview legend visibility when month changes ([#6382](https://github.com/infor-design/enterprise/issues/6382))
- `[Searchfield]` Added puppeteer script for filter and sort icon. ([#6007](https://github.com/infor-design/enterprise/issues/6007))
- `[Searchfield]` Added puppeteer script for custom icon. ([#6723](https://github.com/infor-design/enterprise/issues/6723))

## v4.67.0 Fixes

- `[Accordion]` Added a safety check in accordion. ([#6789](https://github.com/infor-design/enterprise/issues/6789))
- `[Badge/Tag/Icon]` Fixed info color in dark mode. ([#6763](https://github.com/infor-design/enterprise/issues/6763))
- `[Button]` Added notification badges for buttons with labels. ([NG#1347](https://github.com/infor-design/enterprise-ng/issues/1347))
- `[Button]` Added dark theme button colors. ([#6512](https://github.com/infor-design/enterprise/issues/6512))
- `[Calendar]` Fixed a bug in calendar where bottom border is not properly rendering. ([#6668](https://github.com/infor-design/enterprise/issues/6668))
- `[Color Palette]` Added status color CSS classes for color and border-color properties. ([#6711](https://github.com/infor-design/enterprise/issues/6711))
- `[Datagrid]` Fixed a bug in datagrid inside a modal where the column is rendering wider than normal. ([#6782](https://github.com/infor-design/enterprise/issues/6782))
- `[Datagrid]` Fixed a bug in datagrid where when changing rowHeight as a setting and re-rendering it doesn't apply. ([#6783](https://github.com/infor-design/enterprise/issues/6783))
- `[Datagrid]` Fixed a bug in datagrid where isEditable is not returning row correctly. ([#6746](https://github.com/infor-design/enterprise/issues/6746))
- `[Datagrid]` Updated datagrid header CSS height. ([#6697](https://github.com/infor-design/enterprise/issues/6697))
- `[Datagrid]` Fixed on datagrid column width. ([#6725](https://github.com/infor-design/enterprise/issues/6725))
- `[Datagrid]` Fixed an error editing in datagrid with grouped headers. ([#6759](https://github.com/infor-design/enterprise/issues/6759))
- `[Datagrid]` Updated space key checks for expand button. ([#6756](https://github.com/infor-design/enterprise/issues/6756))
- `[Datagrid]` Fixed an error when hovering cells with tooltips setup and using grouped headers. ([#6753](https://github.com/infor-design/enterprise/issues/6753))
- `[Editor]` Fixed bug in editor where background color is not rendering properly. ([#6685](https://github.com/infor-design/enterprise/issues/6685))
- `[Listview]` Fixed a bug where listview is not rendering properly when dataset has zero integer value. ([#6640](https://github.com/infor-design/enterprise/issues/6640))
- `[Popupmenu]` Fixed a bug in popupmenu where getSelected() is not working on multiselect. ([NG#1349](https://github.com/infor-design/enterprise/issues-ng/1349))
- `[Toolbar-Flex]` Removed deprecated message by using `beforeMoreMenuOpen` setting. ([#NG1352](https://github.com/infor-design/enterprise-ng/issues/1352))
- `[Trackdirty]` Added optional chaining for safety check of trackdirty element. ([#6696](https://github.com/infor-design/enterprise/issues/6696))
- `[WeekView]` Added Day View and Week View Shading. ([#6568](https://github.com/infor-design/enterprise/issues/6568))

(30 Issues Solved This Release, Backlog Enterprise 252, Backlog Ng 49, 1104 Functional Tests, 1342 e2e Tests, 506 Puppeteer Tests)

## v4.66.0

## v4.66.0 Features

- `[Busyindicator]` Converted protractor tests to puppeteer. ([#6623](https://github.com/infor-design/enterprise/issues/6623))
- `[Calendar]` Converted protractor tests to puppeteer. ([#6524](https://github.com/infor-design/enterprise/issues/6524))
- `[Datagrid]` Added puppeteer script for render only one row. ([#6645](https://github.com/infor-design/enterprise/issues/6645))
- `[Datagrid]` Added test scripts for add row. ([#6644](https://github.com/infor-design/enterprise/issues/6644))
- `[Datepicker]` Added setting for adjusting day using +/- in datepicker. ([#6632](https://github.com/infor-design/enterprise/issues/6632))
- `[Targeted-Achievement]` Add puppeteer test for show tooltip on targeted achievement. ([#6550](https://github.com/infor-design/enterprise/issues/6550))
- `[Icons]` Added new icons for `interaction` and `interaction-reply`. ([#6666](https://github.com/infor-design/enterprise/issues/6629))
- `[Searchfield]` Added option to add custom icon button. ([#6453](https://github.com/infor-design/enterprise/issues/6453))
- `[Targeted-Achievement]` Added puppeteer test for show tooltip on targeted achievement. ([#6550](https://github.com/infor-design/enterprise/issues/6550))
- `[Textarea]` Converted protractor tests to puppeteer. ([#6629](https://github.com/infor-design/enterprise/issues/6629))

## v4.66.0 Fixes

- `[Datagrid]` Fixed trigger icon background color on hover when row is activated. ([#6679](https://github.com/infor-design/enterprise/issues/6679))
- `[Datagrid]` Fixed the datagrid alert icon was not visible and the trigger cell moves when hovering over when editor has trigger icon. ([#6663](https://github.com/infor-design/enterprise/issues/6663))
- `[Datagrid]` Fixed redundant `aria-describedby` attributes at cells. ([#6530](https://github.com/infor-design/enterprise/issues/6530))
- `[Datagrid]` Fixed on edit outline in textarea not filling the entire cell. ([#6588](https://github.com/infor-design/enterprise/issues/6588))
- `[Datagrid]` Updated filter phrases for datepicker. ([#6587](https://github.com/infor-design/enterprise/issues/6587))
- `[Datagrid]` Fixed the overflowing of the multiselect dropdown on the page and pushes the container near the screen's edge. ([#6580](https://github.com/infor-design/enterprise/issues/6580))
- `[Datagrid]` Fixed unselectRow on `treegrid` sending rowData incorrectly. ([#6548](https://github.com/infor-design/enterprise/issues/6548))
- `[Datagrid]` Fixed incorrect rowData for grouping tooltip callback. ([NG#1298](https://github.com/infor-design/enterprise-ng/issues/1298))
- `[Datagrid]` Fixed a bug in `treegrid` where data are duplicated when row height is changed. ([#4979](https://github.com/infor-design/enterprise/issues/4979))
- `[Datagrid]` Fix bug on where changing `groupable` and dataset does not update datagrid. ([NG#1332](https://github.com/infor-design/enterprise-ng/issues/1332))
- `[Datepicker]` Fixed missing `monthrendered` event on initial calendar open. ([NG#1345](https://github.com/infor-design/enterprise-ng/issues/1345))
- `[Editor]` Fixed a bug where paste function is not working on editor when copied from Windows Adobe Reader. ([#6521](https://github.com/infor-design/enterprise/issues/6521))
- `[Editor]` Fixed a bug where editor has dark screen after inserting an image. ([NG#1323](https://github.com/infor-design/enterprise-ng/issues/1323))
- `[Editor]` Fixed a bug where reset dirty is not working on special characters in Edge browser. ([#6584](https://github.com/infor-design/enterprise/issues/6584))
- `[Fileupload Advanced]` Fixed on max fileupload limit. ([#6625](https://github.com/infor-design/enterprise/issues/6625))
- `[Monthview]` Fixed missing legend data on visible previous / next month with using loadLegend API. ([#6665](https://github.com/infor-design/enterprise/issues/6665))
- `[Notification]` Updated css of notification to fix alignment in RTL mode. ([#6555](https://github.com/infor-design/enterprise/issues/6555))
- `[Searchfield]` Fixed a bug on Mac OS Safari where x button can't clear the contents of the searchfield. ([#6631](https://github.com/infor-design/enterprise/issues/6631))
- `[Popdown]` Fixed `popdown` not closing when clicking outside in NG. ([NG#1304](https://github.com/infor-design/enterprise-ng/issues/1304))
- `[Tabs]` Fixed on close button not showing in Firefox. ([#6610](https://github.com/infor-design/enterprise/issues/6610))
- `[Tabs]` Remove target panel element on remove event. ([#6621](https://github.com/infor-design/enterprise/issues/6621))
- `[Tabs Module]` Fixed category border when focusing the searchfield. ([#6618](https://github.com/infor-design/enterprise/issues/6618))
- `[Toolbar Searchfield]` Fixed searchfield toolbar in alternate style. ([#6615](https://github.com/infor-design/enterprise/issues/6615))
- `[Tooltip]` Fixed tooltip event handlers created on show not cleaning up properly on hide. ([#6613](https://github.com/infor-design/enterprise/issues/6613))

(39 Issues Solved This Release, Backlog Enterprise 230, Backlog Ng 42, 1102 Functional Tests, 1380 e2e Tests, 462 Puppeteer Tests)

## v4.65.0

## v4.65.0 Features

- `[Bar]` Enhanced the VPAT accessibility in bar chart. ([#6074](https://github.com/infor-design/enterprise/issues/6074))
- `[Bar]` Added puppeteer script for axis labels test. ([#6551](https://github.com/infor-design/enterprise/issues/6551))
- `[Bubble]` Converted protractor tests to puppeteer. ([#6527](https://github.com/infor-design/enterprise/issues/6527))
- `[Bullet]` Converted protractor tests to puppeteer. ([#6622](https://github.com/infor-design/enterprise/issues/6622))
- `[Cards]` Added puppeteer script for cards test. ([#6525](https://github.com/infor-design/enterprise/issues/6525))
- `[Datagrid]` Added tooltipOption settings for columns. ([#6361](https://github.com/infor-design/enterprise/issues/6361))
- `[Datagrid]` Added add multiple rows option. ([#6404](https://github.com/infor-design/enterprise/issues/6404))
- `[Datagrid]` Added puppeteer script for refresh column. ([#6212](https://github.com/infor-design/enterprise/issues/6212))
- `[Datagrid]` Added puppeteer script for cell editing test. ([#6552](https://github.com/infor-design/enterprise/issues/6552))
- `[Modal]` Added icon puppeteer test for modal component. ([#6549](https://github.com/infor-design/enterprise/issues/6549))
- `[Tabs]` Added puppeteer script for new searchfield design ([#6282](https://github.com/infor-design/enterprise/issues/6282))
- `[Tag]` Converted protractor tests to puppeteer. ([#6617](https://github.com/infor-design/enterprise/issues/6617))
- `[Targeted Achievement]` Converted protractor tests to puppeteer. ([#6627](https://github.com/infor-design/enterprise/issues/6627))

## v4.65.0 Fixes

- `[Accordion]` Fixed the bottom border of the completely disabled accordion in dark mode. ([#6406](https://github.com/infor-design/enterprise/issues/6406))
- `[AppMenu]` Fixed a bug where events are added to the wrong elements for filtering. Also fixed an issue where if no accordion is added the app menu will error. ([#6592](https://github.com/infor-design/enterprise/issues/6592))
- `[Chart]` Removed automatic legend bottom placement when reaching a minimum width. ([#6474](https://github.com/infor-design/enterprise/issues/6474))
- `[Chart]` Fixed the result logged in console to be same as the Soho Interfaces. ([NG#1296](https://github.com/infor-design/enterprise-ng/issues/1296))
- `[ContextualActionPanel]` Fixed a bug where the toolbar searchfield with close icon looks off on mobile viewport. ([#6448](https://github.com/infor-design/enterprise/issues/6448))
- `[Datagrid]` Fixed a bug in datagrid where focus is not behaving properly when inlineEditor is set to true. ([NG#1300](https://github.com/infor-design/enterprise-ng/issues/1300))
- `[Datagrid]` Fixed a bug where `treegrid` doesn't expand a row via keyboard when editable is set to true. ([#6434](https://github.com/infor-design/enterprise/issues/6434))
- `[Datagrid]` Fixed a bug where the search icon and x icon are misaligned across datagrid and removed extra margin space in modal in Firefox. ([#6418](https://github.com/infor-design/enterprise/issues/6418))
- `[Datagrid]` Fixed a bug where page changed to one on removing a row in datagrid. ([#6475](https://github.com/infor-design/enterprise/issues/6475))
- `[Datagrid]` Header is rerendered when calling updated method, also added paging info settings. ([#6476](https://github.com/infor-design/enterprise/issues/6476))
- `[Datagrid]` Fixed a bug where column widths were not changing in settings. ([#5227](https://github.com/infor-design/enterprise/issues/5227))
- `[Datagrid]` Fixed a bug where it renders all rows in the datagrid when adding one row. ([#6491](https://github.com/infor-design/enterprise/issues/6491))
- `[Datagrid]` Fixed a bug where using shift-click to multiselect on datagrid with treeGrid setting = true selects from the first row until bottom row. ([NG#1274](https://github.com/infor-design/enterprise-ng/issues/1274))
- `[Datepicker]` Fixed a bug where the datepicker is displaying NaN when using french format. ([NG#1273](https://github.com/infor-design/enterprise-ng/issues/1273))
- `[Datepicker]` Added listener for calendar `monthrendered` event and pass along. ([NG#1324](https://github.com/infor-design/enterprise-ng/issues/1324))
- `[Input]` Fixed a bug where the password does not show or hide in Firefox. ([#6481](https://github.com/infor-design/enterprise/issues/6481))
- `[Listview]` Fixed disabled font color not showing in listview. ([#6391](https://github.com/infor-design/enterprise/issues/6391))
- `[Listview]` Changed toolbar-flex to contextual-toolbar for multiselect listview. ([#6591](https://github.com/infor-design/enterprise/issues/6591))
- `[Locale]` Added monthly translations. ([#6556](https://github.com/infor-design/enterprise/issues/6556))
- `[Lookup]` Fixed a bug where search-list icon, launch icon, and ellipses is misaligned and the table and title overlaps in responsive view. ([#6487](https://github.com/infor-design/enterprise/issues/6487))
- `[Modal]` Fixed an issue on some monitors where the overlay is too dim. ([#6566](https://github.com/infor-design/enterprise/issues/6566))
- `[Page-Patterns]` Fixed a bug where the header disappears when the the last item in the list is clicked and the browser is smaller in Chrome and Edge. ([#6328](https://github.com/infor-design/enterprise/issues/6328))
- `[Tabs Module]` Fixed multiple UI issues in tabs module with searchfield. ([#6526](https://github.com/infor-design/enterprise/issues/6526))
- `[ToolbarFlex]` Fixed a bug where the teardown might error on situations. ([#1327](https://github.com/infor-design/enterprise/issues/1327))
- `[Tabs]` Fixed a bug where tabs focus indicator is not fixed on Classic Theme. ([#6464](https://github.com/infor-design/enterprise/issues/6464))
- `[Validation]` Fixed a bug where the tooltip would show on the header when the message has actually been removed. ([#6547](https://github.com/infor-design/enterprise/issues/6547)

(45 Issues Solved This Release, Backlog Enterprise 233, Backlog Ng 42, 1102 Functional Tests, 1420 e2e Tests, 486 Puppeteer Tests)
