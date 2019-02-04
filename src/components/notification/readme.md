---
title: Notification
description: The notification banner is a non-dismissible banner that sits at the top of the page. It has alert colors, an optional link, and a dismiss button.
demo:
  embedded:
  - name: Showing a notification
    slug: example-index
  - name: No link
    slug: example-no-link
---

## Code Example

The notification component is a component that inserts a banner at the top of the page for showing user-dismissible alerts and messages. Its contents will be removed when the banner is closed. You have control over the message contents including the option for a link. The message is triggered by selecting the parent content (usually `<body>`) and executing the `notification()` function with various options to create the notification banner.

```javascript
  $('body').notification({
    type: 'info',
    message: 'DTO rejcted by your manager for Sept 30, 2018.',
    link: '#',
    linkText: 'Click to view'
  });
```

## Accessibility

- TODO: We should add aria-alerts similar to the way toast works.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

- This component is comparable to the inforSlideInDialog in 3.X
