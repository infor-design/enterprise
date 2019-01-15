---
title: Zoom Component
description: Used to manage zoom on mobile devices.
---

## Code Example

The zoom component is a component that is used internally to enable and disable zooming on mobile devices. It is used in touch situations such as the dropdown to prevent the browser from unnecessarily zooming. You can enable or disable zoom once the plugin is activated by calling `disableZoom` or `enableZoom`. To invoke zoom on an element use the standard plugin invocation.

```javascript
$('head').zoom();
$('head').data('zoom').disableZoom();
```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
