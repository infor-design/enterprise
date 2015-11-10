# 4.0.6

Minor QA Release

## Breaking Changes
* All events are now lower case for consistency. For example some events were called beforeOpen this is now beforeopen. Ect.. Try to search your project for any events fx .on('beforeOpen') and rename. Such beforeopen, animateopen , afterstart, animateclosedcomplete, afterreset, animateclosedcomplete, afteropen, afterpaste, beforeclose, animateopencomplete, beforeactivate
* bar-progress type chart was renamed to completion-chart

## Ui Changes
* In the High Contrast themes all colors changed from slate to the graphite spectrum

[Jira Release Notes](http://jira.infor.com/secure/ReleaseNote.jspa?version=23807&styleName=&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX%7Cd4fa9776810ba8b865710d777c0a664cc99196a2%7Clin)

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

# 4.0.4

Minor QA Release

## New Features
*
*

## Breaking Changes
*
*

## Ui Changes
*
*


[Jira Release Notes](http://jira.infor.com/secure/ReleaseNote.jspa?version=23807&styleName=&projectId=10980&Create=Create&atl_token=ATP9-LKKS-XFKU-5RYX%7Cd4fa9776810ba8b865710d777c0a664cc99196a2%7Clin)
