---
title: Module Nav
description: Left-side, fly-out navigation menu
demo:
  embedded:
  - name: Example
    slug: example-index
---

## Code Example

### Settings

The Module Nav can initialize using the following attributes:

- `displayMode` - Determines how to show the menu.  Can be `false`, `"collapsed"`, or `"expanded"`.
- `filterable` - Enables filtering via an optional searchfield component
- `pinSections` - Pins the header/search/footer areas of the component so they don't scroll with the main area
- `showDetailView` - Shows an optional detail view that can be populated with menu-related content

### Structure

The Module Nav's layout system is created from an element with a CSS class `.module-nav-container`.  Some basic structure is required to get full functionality from the component:

```html
<section class="module-nav-container">
  <aside id="nav" class="module-nav">
    <div class="module-nav-bar">
        <div class="module-nav-accordion" data-options="{'allowOnePane': false}">
            <div class="module-nav-header accordion-section">
                <div class="module-nav-switcher"></div>
            </div>
            <!--  search element is optional --->
            <div class="module-nav-search-container accordion-section">
                <input id="module-nav-searchfield" class="module-nav-search searchfield"/>
            </div>
            <div class="module-nav-main accordion-section">
                <!-- Accordion headers go here -->
            </div>
            <div class="module-nav-footer">
                <!-- Accordion headers go here -->
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
