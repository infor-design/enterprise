
# 4.0.7 - Minor QA Release
Release Date: TBD

## Breaking Changes

* 2015-12-07 - Dropdown/Menu Button - Changed the size of the view box n the svg element. That needs to be updated when updating the css or dropdown arrows look too small.
* 2015-12-07 - Dropdown/Multiselect, Tabs, Vertical Tabs, Wizard - changed the name of the "activate" event to "activated", to prevent conflicts with the built-in "activate" event in Windows browsers (IE/Edge).  This issue is documented in HFC-3221.
* 2015-12-04 - Contextual Action Panel - The order in which the close/destroy methods previously worked has been changed to flow a bit more nicely.  The order was changed to accomodate HFC-3212, where a bug was discovered that caused Contextual Action Panels to leave behind markup and events from a Modal control.

## Ui Changes
* 2015-11-20 We did some fine tuning to the color pallette. The following colors have changed: azure05, azure07, amber03, amber06, amber07, amber08, amber09, amber10, emerald09, turquoise04, amethyst01, amethyst04, amethyst05, amethyst06, amethyst07, amethyst08, amethyst09, slate10, alert-orange
* 2015-12-09 - Datepicker - Style changes to date picker

[Jira Release Notes](http://jira.infor.com/secure/ReleaseNote.jspa?version=24737&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX|dd7803af39297f33274f5a7b7cd17c27e235d9d2|lin)

# 4.0.6
Release Date: 2015-11-16

Minor QA Release

## Breaking Changes
* 2015-11-16 All events are now lower case for consistency. For example some events were called beforeOpen this is now beforeopen. Ect.. Try to search your project for any events fx .on('beforeOpen') and rename. Such beforeopen, animateopen , afterstart, animateclosedcomplete, afterreset, animateclosedcomplete, afteropen, afterpaste, beforeclose, animateopencomplete, beforeactivate
* bar-progress type chart was renamed to completion-chart
* List detail has new markup

## Ui Changes
* In the High Contrast themes all colors changed from slate to the graphite spectrum
* List detail has style changes

[Jira Release Notes](http://jira.infor.com/secure/ReleaseNote.jspa?version=24229&styleName=Html&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX|dd7803af39297f33274f5a7b7cd17c27e235d9d2|lin)


# 4.0.5

Minor QA Release.

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


# 4.0.4 - Minor QA Release
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
