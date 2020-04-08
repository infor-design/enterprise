---
title: Tag Component
description: null
demo:
  embedded:
  - name: Simple Tag Examples
    slug: example-index
  - name: Dismissible and Linkable
    slug: example-dismissible-and-clickable
  - name: Linkable
    slug: example-linkable
---
## Code Example

Tags are simple span elements with the class `tag`. They can be mixed in to other elements like lists, grids and multiselect. You can optionally add a few classes to add color or status such as `error` for red, `good` to be green and `alert` for yellow. Since you should not use color alone to indicate state, this should be either supplemented with off-screen labels or visual labels near the element explaining the state.
Tags may also have a close button to remove them or contain a link.

```html
<div class="tag-list">
    <span class="tag hide-focus"><span class="tag-content">#Tagged 1</span></span>
    <span class="tag hide-focus"><span class="tag-content">#Tagged 2</span></span>
    <span class="tag hide-focus"><span class="tag-content">#Tagged 3</span></span>
</div>
```

## Accessibility

- Since you should not use color alone to indicate states, this should be either supplemented with offscreen or visual labels near the element explaining the state

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus the tag.
- <kbd>Backspace / Alt+Del</kbd>: If the tag is dismissible then this will remove the tag.
- <kbd>Enter</kbd>: If the tag is clickable then this will follow the tag link.

## States and Variations

- Dismissible
- Linkable / Clickable
- Static

## Responsive Guidelines

- Takes fits within the width of the parent container

## Upgrading from 3.X

- In 3.x badges and tags were used interchangeably. These now have separated usages that should be reconsidered
