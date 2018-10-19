---
title: Empty Message
description: This page describes Empty Message .
demo:
  embedded:
  - name: Simple Empty Message
    slug: example-index
  pages:
  - name: All Types of Empty Messages in a Card/Widget
    slug: example-widgets
---

## Code Example

### Invoking as a JS Component

Use an empty message when no data is present in a list or container and there is no other context to provide the user information about what to do. On smaller breakpoints, the empty message will be centered in the container.

```javascript
$('.empty-message').emptymessage({
  title: 'No Records Available',
  icon: 'icon-empty-no-data'
});
```

### Invoking with Html/Css in a Card/Widget

You can invoke a empty message manually by showing it on a widget container. This is shown in the [example page for widgets](https://design.infor.com/code/ids-enterprise/latest/demo/emptymessage/example-widgets?font=source-sans). The following structure and classes may be used.

```html
<div class="card-content">
  <div class="card-empty-icon">
    <svg class="icon-empty-state" focusable="false" aria-hidden="true" role="presentation">
      <use xlink:href="#icon-empty-new-project"></use>
    </svg>
  </div>
  <div class="card-empty-title">
    Add a New Project
  </div>
  <div class="card-empty-info">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do siusmod temp.
  </div>
  <div class="card-empty-actions">
    <button type="button" class="btn-primary">
      <span>Start</span>
    </button>
  </div>
</div>
```

## Accessibility

- Do not use only an icon. There should be text as well as the icon for screen reader users.

## Code Tips

- Submit a new example showing your usage, we would like to refactor these to be used on lists, pages ect.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- None

## Upgrading from 3.X

- This is a new concept
