---
title: Process Indicator
description: null
demo:
  embedded:
  - name: Main Process Indicator Example
    slug: example-index
  pages:
  - name: Example showing labels and content areas
    slug: example-labels
---

## Code Example

Here is an example of a compact process indicator. There are several classes in the structure that control the output and status settings.

```html
<div class="process-indicator compact">
  <div class="display">
    <span class="indicator lightest"></span>
    <span class="separator lightest"></span>
    <span class="indicator current more-info"></span>
    <span class="separator"></span>
    <span class="indicator"></span>
    <span class="separator"></span>
    <span class="indicator"></span>
  </div>
  <div class="heading">
    Rejected - More Information Required
  </div>
  <div class="sub-heading">
    Today
  </div>
</div>
```

## Testability

If automation id's or other attributes are needed for the Process Indicator component, simply add them directly to the markup:

```html
<div class="process-indicator compact" id="pi1" data-automation-id="automation-pi1">
 <div class="display">
   <span class="indicator lightest" id="pi1-i0" data-automation-id="automation-pi1-i0"></span>
   <span class="separator lightest" id="pi1-s0" data-automation-id="automation-pi1-s0"></span>
   <span class="indicator current more-info" id="pi1-i1" data-automation-id="automation-pi1-i1"></span>
   <span class="separator" id="pi1-s1" data-automation-id="automation-pi1-s1"></span>
   <span class="indicator" id="pi1-i2" data-automation-id="automation-pi1-i2"></span>
   <span class="separator" id="pi1-s2" data-automation-id="automation-pi1-s2"></span>
   <span class="indicator" id="pi1-i3" data-automation-id="automation-pi1-i3"></span>
 </div>
 <div class="heading">
   Rejected - More Information Required
 </div>
 <div class="sub-heading">
   Today
 </div>
</div>
```

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
