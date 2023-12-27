---
title: Module Nav
description:
demo:
  embedded:
  - name: Example
    slug: example-index
---
  
## Settings

| Name | Description |
| ----------- | ----------- |
| `displayMode` | Determines how to display the menu. Can be `"collapsed"`, `"expanded"`, or `false`. |
| `filterable` | Enables an optional searchfield to filter navigation items. |
| `pinSections` | Pins the header and footer areas, allowing only the navigation items to scroll. |
| `showDetailView` | Enables a secondary pane for more content, if needed. |

## Implementation

The layout system is created with a `.module-nav-container` CSS class, which provides full functionality:

```html
<section class="module-nav-container">
  <aside id="nav" class="module-nav">
    <div class="module-nav-bar">
        <div class="module-nav-accordion" data-options="{'allowOnePane': false}">
            <div class="module-nav-header accordion-section">
                <div class="module-nav-switcher"></div>
            </div>
            <!--  optional searchfield  --->
            <div class="module-nav-search-container accordion-section">
                <input id="module-nav-searchfield" class="module-nav-search searchfield"/>
            </div>
            <div class="module-nav-main accordion-section">
                <!-- accordion headers go here -->
            </div>
            <div class="module-nav-footer">
                <!-- accordion headers go here -->
            <div>
            <div class="module-nav-settings">
                <div class="module-nav-settings-btn accordion-header" id="module-nav-settings-btn"></div>
            </div>
        </div>
    </div>
    <div class="module-nav-detail">
        <!-- optional detail pane content goes here -->
    </div>
  </aside>
  <div class="page-container">
    <!-- application content goes here -->
  </div>
</section>
```
