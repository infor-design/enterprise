---
title: Process Indicator
description: null
demo:
  embedded:
  - name: Main Process Indicator Example
    slug: example-index
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

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
