---
title: Empty Message
description: This page describes Empty Message .
demo:
  embedded:
  - name: Simple Empty Message
    slug: example-index
  pages:
  - name: Widget Examples
    slug: example-widgets
---

Use an empty message when no data is present in a list or container and there is no other context to provide the user information about what to do. On smaller breakpoints, the empty message will be centered in the container.

```javascript
$('.empty-message').emptymessage({
  title: 'No Records Available',
  icon: 'icon-empty-no-data'
});

```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
