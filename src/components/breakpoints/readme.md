---
title: Breakpoints
description: null
demo:
  embedded:
  - name: Breakpoint Event Change Detection
    slug: example-change-detection
---

## Code Example

An event gets triggered on a Soho application's body tag whenever the Soho CSS determines that a breakpoint change should be made.  In any application that implements Soho UX, there will be an `::after` pseudo-element appended to the body tag with a content property that describes the current breakpoint.

There is also a small utility, `Soho.breakpoints` that has a few convenience functions for working with the breakpoint

In the example test, causing this page to have an orientation change or resize event that results in a new breakpoint change will cause a toast message to appear containing the custom event's data.

```javascript
$('body').on('breakpoint-change', function(e, breakpointState) {
  $(this).toast({
    title: 'Breakpoint Change',
    message: '<b>Current: </b>' + breakpointState.current + '<br /><b>Previous: </b>' + breakpointState.previous
  });
});

```
