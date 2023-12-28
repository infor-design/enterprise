---
title: Vertical Tabs
description: null
demo:
  embedded:
  - name: Independent Column Scrolling
    slug: example-independent-scrolling
  pages:
  - name: Vertical Tabs as outbound links
    slug: example-outbound-links-page1
  - name: Responsive Setting (changes to header tabs)
    slug: example-index
---

All tabs components use the same API.  For details on this component's API, please read the [tabs component API](./tabs).

## Testability

The same rules for custom attributes and automation id's for the [Tabs Component API]('./tabs') apply to the Module Tabs component.

If using the `.tab-list-info` element with extra content above or underneath the tab list, ensure that any content like buttons or hyperlinks are manually labelled with necessary custom attributes or automation id's:

```html
<div id="tabs-vertical" class="vertical tab-container" data-options='{ "verticalResponsive": true }'>
  <div class="tab-list-container">
    <ul class="tab-list">
      <!-- ... --->
    </ul>
    <div class="tab-list-info">
      <button type="button" id="action-run" data-automation-id="tabs-action-run-btn" class="btn-primary">
        <span>Run</span>
      </button>
    </div>
  </div>
</div>
```
