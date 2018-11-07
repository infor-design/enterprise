---
title: File Upload Advanced
description: null
demo:
  embedded:
  - name: Advanced File Upload Example
    slug: example-index
  pages:
  - name: Default File Upload Example
    slug: example-index
---

The advanced file upload control just needs a `<div>` with the class `fileupload-advanced` in which to draw its contents.

```html
<div id="fileupload-advanced" class="fileupload-advanced">
</div>
```

This is done by using an HTML5 drag and drop feature, so is only supported well on modern browsers, including Internet Explorer 11 or later.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- Not keyboard friendly at this time. Will need a browse button.

## States and Variations

- Error
- Success / Fail

## Responsive Guidelines

- The `<div>` will size to parent but recommend default size.
