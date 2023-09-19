---
title: Module Nav
description: Helps users navigate within an application.
demo:
  embedded:
  - name: Example
    slug: example-index
---

## Basics

### Anatomy

- Header
  - Module switcher
  - Dropdown
  - Searchfield
- Accordion
- Footer

### Options

Modes

- Default: Collapsed menu shows icons on hover.
- Expanded: Menu opens to show icon labels, dropdown, an optional searchfield, and expandable accordions.
- Hidden

## Guidelines

### When to use

- Use to help people navigate within different areas and change their application settings.

### Usability guidance

- Combine with the [header](./header) to provide the ability for users to expand and collapse the menu.
- Display only the most important navigation within the menu.
- Avoid nesting several items within the menu, as only the top-level items are available from the collapsed menu.
  - If use cases warrant a more complex menu hierarchy, an optional searchfield can help users reveal nested links.
- When applicable, pin the menu header and footer to keep them visible in the menu.
- On mobile, tapping on page content collapses an expanded menu.

### UX writing

- Keep navigation labels concise, aiming for a max of 30 characters to avoid truncation.
- Consider how translations may increase string length.

### Related

- [App menu](./applicationmenu)
- [Header](./header)
- [Accordion](./accordion)
- [Searchfield](./searchfield)

## Code
  
### Settings

| Name | Description |
| ----------- | ----------- |
| `displayMode` | Determines how to display the menu. Can be `"collapsed"`, `"expanded"`, or `false`. |
| `filterable` | Enables an optional searchfield to filter navigation items. |
| `pinSections` | Pins the header and footer areas, allowing only the navigation items to scroll. |
| `showDetailView` | Enables a secondary pane for more content, if needed. |

### Implementation

The layout system is created with a `.module-nav-container` CSS class. This structure provides full functionality:

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
