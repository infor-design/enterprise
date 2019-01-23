---
title: Zoom Component
description: Used to manage zoom on mobile devices.
---

## Code Example

The zoom component is used internally to enable and disable zooming on mobile devices in touch situations such as the dropdown to prevent the browser from unnecessarily zooming when you press down on an element. You can enable or disable zoom once the plugin is activated by triggering `disable-zoom` or `enable-zoom`. The zoom plugin is always active on your page if you are using the initializer.

```javascript
// If not using initialize must invoke on the document head
$('head').zoom();

// At some point disable zooming
$('head').triggerHandler('enable-zoom');
// When done and can zoom again
$('head').triggerHandler('disable-zoom');
```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
